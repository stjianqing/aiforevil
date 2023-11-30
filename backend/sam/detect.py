'''
Using Segment Anything Model to detect the edge of the image.

Model checkpoint download: https://github.com/facebookresearch/segment-anything#model-checkpoints
Recommend to use vit_l

Input:
    sam_checkpoint: the checkpoint of the model
    model_type: the type of the model
    img_path: the path of the image
    size: the size of the image, reduce if cannot process (default: (1024x1024))
    segment: whether to get the segmentated image (default: True)

Output:
    overlay.png: the overlay of the segmentated image on the original image
    output.shp.zip: the shapefile of the segmentated image if it is a TIF file
'''
import numpy as np
import torch
import cv2
import os
import rasterio
from shapely.geometry import Polygon, MultiPolygon, mapping
import fiona

import sys
sys.path.append("..")
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor

class EdgeDetector():
    def __init__(self, checkpoint, model_type, img_path=None, size=(1024, 1024), segment=True):
        self.checkpoint = checkpoint
        self.model_type = model_type
        self.img_path = img_path
        self.TIF = self.img_path.endswith('.tif') if self.img_path is not None else False
        self.size = size
        self.segment = segment
        self.schema = {
                'geometry': 'Polygon',
                'properties': {'id': 'int'},
            }

        self.img_size = None
        if torch.cuda.is_available():
            self.device = "cuda"
        else:
            self.device = "cpu"

        sam = sam_model_registry[self.model_type](checkpoint=self.checkpoint)
        sam.to(device=self.device)

        # self.mask_generator = SamAutomaticMaskGenerator(sam, stability_score_thresh=0.95, box_nms_thresh=0.5)
        # self.mask_generator = SamAutomaticMaskGenerator(sam, stability_score_thresh=0.7)
        self.predictor = SamPredictor(sam)

    def _preprocess(self):
        """
        Preprocesses the image before performing any operations.

        This function reads the image from the specified image path using OpenCV.
        If the image is not found, it raises a ValueError.
        The image is then converted from BGR to RGB color format.
        The original image is stored as a copy for reference.
        The size of the image is determined and compared to the specified size.
        If the image is larger, it is resized to the specified size.
        The image is passed to the predictor for further processing.

        Parameters:
            None

        Returns:
            None
        """
        # enable opencv to read jp2 files
        os.environ["OPENCV_IO_ENABLE_JASPER"] = "true"
        self.img = cv2.imread(self.img_path)
        if self.img is None:
            raise ValueError("Image not found.")
        self.img = cv2.cvtColor(self.img, cv2.COLOR_BGR2RGB)
        self.original_img = self.img.copy()
        self.img_size = (self.img.shape[1], self.img.shape[0])

        if self.img.shape > self.size:
            self.img = cv2.resize(self.img, self.size)

        self.predictor.set_image(self.img)

        '''
        The input points contains the middle of the image and the four corners of the image.
        Segmentation will be made on the middle of the image,
        and remove the four corners if any segmentation had been made.
        '''
        self.input_point = np.array([
                                        [self.img_size[0]//2, self.img_size[1]//2],
                                    ])
        self.point_label = np.array([1]) # Labels: 1 is add, 0 is remove

    def _process(self):
        """
        Process the image by applying segmentation and generating an overlay.

        This function takes no arguments and returns no values.

        Steps:
        1. Use the predictor to predict masks for the input point coordinates and labels.
        2. Create an empty segmentation image.
        3. Set the color of the segmentation image for the predicted masks.
        4. Resize the segmentation image to match the size of the input image.
        5. Convert the segmentation image to grayscale.
        6. Apply a threshold to the grayscale image to generate an alpha channel.
        7. Find contours in the grayscale image.
        8. Draw filled contours on the alpha channel.
        9. Convert the original image to RGBA format.
        10. Iterate over each pixel in the alpha channel and set the corresponding pixel in the image to blue.
        11. Save the image as "overlay.png".
        12. If it is a TIF file, generate a shapefile with the coordinates.
        """
        masks, _, _ = self.predictor.predict(
            point_coords=self.input_point,
            point_labels=self.point_label, 
            multimask_output=True,
        )

        segmentation = np.zeros_like(self.img)
        segmentation[masks[1]] = [255, 0, 0]

        segmentation = cv2.resize(segmentation, self.img_size)

        gray = cv2.cvtColor(segmentation, cv2.COLOR_BGR2GRAY)
        _, alpha = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            if len(contour) <= 1000:
                cv2.drawContours(alpha, [contour], -1, (0, 0, 0, 100), thickness=cv2.FILLED)

        image = cv2.cvtColor(self.original_img, cv2.COLOR_BGR2RGBA)
        for col in range(alpha.shape[0]):
            for row in range(alpha.shape[1]):
                if alpha[col][row] == 255:
                    image[col][row] = [0, 0, 255, 255]

        # cv2.imwrite(f"./img/overlay.png", image)
        cv2.imwrite(f"../frontend/public/overlay.png", image)

        if self.TIF:
            self._generate_shapefile(alpha, contours)

    # this function is only being used when we use automated mask
    def max_area(self, masks):
        sorted_masks = sorted(masks, key=lambda x: x['area'], reverse=True)
        # NOTE: there might have chances where the forest is not the largest area of the image
        area = [seg['area'] for seg in masks]
        i = area.index(max(area))
        return sorted_masks[0]['segmentation']

    def _generate_shapefile(self, segment, contours):
        """
        Generates a shapefile based on the given segment value and contours.
        
        Parameters:
            segment (numpy.ndarray): A 2D array representing the segmentation.
            contours (list): A list of contours to generate the shapefile from.
        
        Returns:
            None
        """
        raster = rasterio.open(self.img_path)
        array = raster.read(1)
        height, width = array.shape

        cols, rows = np.meshgrid(np.arange(width), np.arange(height))
        xs, ys = rasterio.transform.xy(raster.transform, rows, cols)

        x_coords = np.array(xs)
        y_coords = np.array(ys)

        longitudes = x_coords * segment / 255.0
        latitudes = y_coords * segment / 255.0

        polygons = []

        for contour in contours:
            if len(contour) >= 1000:
                squeezed = contour.squeeze()
                points = [[longitudes[y][x], latitudes[y][x]] for x, y in squeezed]
                polygon = Polygon(points)
                polygons.append(polygon)

        multipolygon = MultiPolygon(polygons)

        # with fiona.open('./img/output.shp.zip', 'w', 'ESRI Shapefile', self.schema) as c:
        with fiona.open('../frontend/public/output.shp.zip', 'w', 'ESRI Shapefile', self.schema) as c:
            c.write({
                'geometry': mapping(multipolygon),
                'properties': {'id': 0},
            })

    def run(self, img_path):
        if self.img_path is None:
            self.img_path = img_path
            self.TIF = self.img_path.endswith('.tif')
        self._preprocess()
        print('Processing...')
        self._process()
        print('Finished!')

# TODO:need to use parser to pass the arguments, which has not been implemented yet
if __name__ == "__main__":
    sam_checkpoint = "./model/sam_vit_l_0b3195.pth"
    model_type = "vit_l"
    # img_path = "C:/Users/ruiya/Downloads/s2_sr_median_export (12).tif" # cat tien

    img_path = "C:/Users/ruiya/Downloads/s2_sr_median_export (17).tif" # cuc phuong
    edge_detector = EdgeDetector(sam_checkpoint, model_type, img_path)
    edge_detector.run()

