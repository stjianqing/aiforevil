'''
Using Segment Anything Model to detect the edge of the image.

Model checkpoint download: https://github.com/facebookresearch/segment-anything#model-checkpoints

Input:
    sam_checkpoint: the checkpoint of the model
    model_type: the type of the model
    img_path: the path of the image
    size: the size of the image, reduce if cannot process (default: (1024x1024))
    edge: whether to get the edge of the image (default: True)
    segment: whether to get the segmentated image (default: True)
    get_max: whether to get the max area of the image (default: True)

Output:
    edge.png: the edge of the image
    segmentation.png: the segmentated image
    overlay_edge.png: the overlay of the edge on the original image
    overlay_segment.png: the overlay of the segmentated image on the original image
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
    def __init__(self, checkpoint, model_type, img_path, size=(1024, 1024), edge=True, segment=True, get_max=True):
        self.checkpoint = checkpoint
        self.model_type = model_type
        self.img_path = img_path
        self.TIF = self.img_path.endswith('.tif')
        self.size = size
        self.edge = edge
        self.segment = segment
        self.get_max = get_max
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
        # enable opencv to read jp2 files
        os.environ["OPENCV_IO_ENABLE_JASPER"] = "true"
        self.img = cv2.imread(self.img_path)
        if self.img is None:
            raise ValueError("Image not found.")
        self.img = cv2.cvtColor(self.img, cv2.COLOR_BGR2RGB)
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
                                        # [0, 0],
                                        # [self.img_size[0], 0],
                                        # [self.img_size[0], self.img_size[1]],
                                        # [0, self.img_size[1]]
                                    ])

    def _process(self):
        masks, _, _ = self.predictor.predict(
            point_coords=self.input_point,
            # point_labels=np.array([1, 0, 0, 0, 0]), # labels: 1 is add, 0 is remove
            point_labels=np.array([1]), # labels: 1 is add, 0 is remove
            multimask_output=True,
        )
        # masks = self.mask_generator.generate(self.img)
        # # only getting the max area
        # if self.get_max:
        #     masks = self.max_area(masks)
        segmentation = self.img.copy()
        for col in range(self.img.shape[1]):
            for row in range(self.img.shape[0]):
                # NOTE: need to figure out which is the best
                if masks[1][col][row] == True:
                    segmentation[col][row] = [255, 0, 0]
                else:
                    segmentation[col][row] = [0, 0, 0]
        # get segmentated image
        if self.segment:
            tmp = cv2.cvtColor(segmentation, cv2.COLOR_RGB2GRAY)
            _, alpha = cv2.threshold(tmp, 0, 128, cv2.THRESH_BINARY)
            b, g, r = cv2.split(segmentation)
            rgba = [r, g, b, alpha]
            segment = cv2.merge(rgba, 4)
            segment = cv2.resize(segment, self.img_size)
            cv2.imwrite("segmentation.png", segment)
            self.overlay(segment, 'segment')
        # from the mask, get the edge
        if self.edge:
            edge = cv2.Canny(segmentation, 0, 1)
            edge = cv2.resize(edge, self.img_size)
            _, alpha = cv2.threshold(edge, 0, 255, cv2.THRESH_BINARY)
            if self.TIF:
                self._generate_shapefile(alpha)
            rgba = [edge, edge, edge, alpha]
            edge = cv2.merge(rgba,4)
            cv2.imwrite("edge.png", edge)
            self.overlay(edge, 'edge')

    def max_area(self, masks):
        sorted_masks = sorted(masks, key=lambda x: x['area'], reverse=True)
        # NOTE: there might have chances where the forest is not the largest area of the image
        area = [seg['area'] for seg in masks]
        i = area.index(max(area))
        return sorted_masks[0]['segmentation']

    def overlay(self, overlay, type):
        image = self.img.copy()
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGBA)
        image = cv2.resize(image, self.img_size)
        cv2.addWeighted(overlay, 1, image, 1, 0, image)
        image = cv2.resize(image, self.img_size)
        cv2.imwrite(f"overlay_{type}.png", image)

    def _generate_shapefile(self, edge):
        raster = rasterio.open(self.img_path)
        array = raster.read(1)
        height, width = array.shape

        # Create two arrays with the same shape as the input array/raster, where each value is the x or y index of that cell
        cols, rows = np.meshgrid(np.arange(width), np.arange(height))

        # Create two arrays with the same shape as the input array/raster, where each value is the x or y coordinate of that cell
        xs, ys = rasterio.transform.xy(raster.transform, rows, cols)

        # Convert the coordinate lists to arrays
        xcoords = np.array(xs)
        ycoords = np.array(ys)

        # Find contours in the binary image
        contours, _ = cv2.findContours(edge, mode=cv2.RETR_TREE, method=cv2.CHAIN_APPROX_NONE)

        # get the pixel latitude and longitude
        long = xcoords * edge / 255.0
        lat = ycoords * edge / 255.0

        # store all the polygons
        polygons = []

        for _, contour in enumerate(contours):
            c = []
            # Convert contour to polygon
            if len(contour) >= 4:
                squeezed = contour.squeeze()
                # replace the pixel coordinates to latitude and longitude
                for i in range(len(squeezed)):
                    x, y = squeezed[i][0], squeezed[i][1]
                    c.append([long[y][x], lat[y][x]])
                polygon = Polygon(c)
                polygons.append(polygon)

        multipolygon = MultiPolygon(polygons)  # putting it all together in a MultiPolygon

        # save the output shapefile as zip file
        with fiona.open('output_test.shp.zip', 'w', 'ESRI Shapefile', self.schema) as c:
        # with fiona.open('output_test.shp', 'w', 'ESRI Shapefile', self.schema) as c:
            # Write polygon to shapefile
            c.write({
                'geometry': mapping(multipolygon),
                'properties': {'id': 0},
            })

    def run(self):
        self._preprocess()
        print('Processing...')
        self._process()
        print('Finished!')

# TODO:need to use parser to pass the arguments, which has not been implemented yet
if __name__ == "__main__":
    sam_checkpoint = "./model/sam_vit_l_0b3195.pth"
    model_type = "vit_l"

    img_path = "C:/Users/ruiya/Downloads/s2_sr_median_export (17).tif" # cuc phuong
    edge_detector = EdgeDetector(sam_checkpoint, model_type, img_path)
    edge_detector.run()

