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
'''
import numpy as np
import torch
import cv2

import sys
sys.path.append("..")
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator

class EdgeDetector():
    def __init__(self, checkpoint, model_type, img_path, size=(1024, 1024), edge=True, segment=True, get_max=True):
        self.checkpoint = checkpoint
        self.model_type = model_type
        self.img_path = img_path
        self.size = size
        self.edge = edge
        self.segment = segment
        self.get_max = get_max

        self.img_size = None
        if torch.cuda.is_available():
            self.device = "cuda"
        else:
            self.device = "cpu"

        sam = sam_model_registry[self.model_type](checkpoint=self.checkpoint)
        sam.to(device=self.device)

        self.mask_generator = SamAutomaticMaskGenerator(sam)

    def _preprocess(self):
        self.img = cv2.imread(self.img_path)
        if self.img is None:
            raise ValueError("Image not found.")
        self.img_size = (self.img.shape[1], self.img.shape[0])

        if self.img.shape > self.size:
            self.img = cv2.resize(self.img, self.size)

    def _process(self):
        masks = self.mask_generator.generate(self.img)
        # only getting the max area
        if self.get_max:
            masks = self.max_area(masks)
        segmentation = self.img.copy()
        for col in range(self.img.shape[1]):
            for row in range(self.img.shape[0]):
                if masks[col][row] == True:
                    segmentation[col][row] = [255, 0, 0]
                else:
                    segmentation[col][row] = [0, 0, 0]
        # get segmentated image
        if self.segment:
            tmp = cv2.cvtColor(segmentation, cv2.COLOR_RGB2GRAY)
            _,alpha = cv2.threshold(tmp, 0, 128, cv2.THRESH_BINARY)
            b, g, r = cv2.split(segmentation)
            rgba = [r, g, b, alpha]
            segment = cv2.merge(rgba, 4)
            segment = cv2.resize(segment, self.img_size)
            cv2.imwrite("segmentation.png", segment)
            self.overlay(segment, 'segment')
        # from the mask, get the edge
        if self.edge:
            edge = cv2.Canny(segmentation, 0, 1)
            _,alpha = cv2.threshold(edge,0,255,cv2.THRESH_BINARY)
            rgba = [edge, edge, edge, alpha]
            edge = cv2.merge(rgba,4)
            edge = cv2.resize(edge, self.img_size)
            cv2.imwrite("edge.png", edge)
            self.overlay(edge, 'edge')

    def max_area(self, masks):
        # NOTE: there might have chances where the forest is not the largest area of the image
        area = [seg['area'] for seg in masks]
        i = area.index(max(area))
        return masks[i]['segmentation']

    def overlay(self, overlay, type):
        image = self.img.copy()
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
        image = cv2.resize(image, self.img_size)
        cv2.addWeighted(overlay, 1, image, 1, 0, image)
        image = cv2.resize(image, self.img_size)
        cv2.imwrite(f"overlay_{type}.png", image)

    def run(self):
        self._preprocess()
        print('Processing...')
        self._process()
        print('Finished!')

# TODO:need to use parser to pass the arguments, which has not been implemented yet
if __name__ == "__main__":
    sam_checkpoint = "./model/sam_vit_l_0b3195.pth"
    model_type = "vit_l"
    img_path = "./test_imgs/example.png"
    edge_detector = EdgeDetector(sam_checkpoint, model_type, img_path)
    edge_detector.run()

