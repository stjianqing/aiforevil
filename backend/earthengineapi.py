from google.oauth2 import service_account
import ee
from google.cloud import storage
import time
from PIL import Image
import requests
from pathlib import Path


# TODO: Have not fully finished
class GoogleApi:
    def __init__(self, START_DATE='2020-06-01', END_DATE='2020-09-01', latlong=None):
        self.SERVICE_ACCOUNT_FILE = r'./service_account.json'
        self.service_account_email = 'ry-handsome-chap@spatial-design-studio-401610.iam.gserviceaccount.com'
        self.credentials = ee.ServiceAccountCredentials(self.service_account_email, self.SERVICE_ACCOUNT_FILE)
        self.full_image_url_tiff= 'https://storage.googleapis.com/aiforevil/full_image.tiff'
        self.full_image_url_jpg= 'https://storage.googleapis.com/aiforevil/full_image.jpg'
        self.cropped_image_url='https://storage.googleapis.com/aiforevil/cropped_image.tiff'
        self.cropped_image_url='https://storage.googleapis.com/aiforevil/cropped_image.jpg'
        self.local_full_image_path= '/your/desired/path/full_image.jpg'
        self.local_cropped_image_path= '/your/desired/path/cropped_image.jpg'
        ee.Initialize(self.credentials)
        # AOI = ee.Geometry.BBox(105.50, 20.23, 105.74, 20.39) # cuc phong
        self.latlong=latlong
        self.AOI = ee.Geometry.BBox(latlong) # cat tien
        self.START_DATE=START_DATE
        self.END_DATE = END_DATE
        self.CLOUD_FILTER = 60
        self.CLD_PRB_THRESH = 40
        self.NIR_DRK_THRESH = 0.15
        self.CLD_PRJ_DIST = 2
        self.BUFFER = 100
        self.s2_sr_cld_col = self.get_s2_sr_cld_col()
        self.trueColorVis = {
                            'bands': ['B4', 'B3', 'B2'],
                            'min': "0.0",
                            'max': "3000.0"
                            }
        self.image = (self.s2_sr_cld_col.map(self.add_cld_shdw_mask)
                             .map(self.apply_cld_shdw_mask)
                             .median()
                             ._apply_visualization(self.trueColorVis)
                             )[0]


    def get_s2_sr_cld_col(self):
            s2_sr_col = (ee.ImageCollection('COPERNICUS/S2_SR')
                .filterBounds(self.AOI)
                .filterDate(self.START_DATE, self.END_DATE)
                .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', self.CLOUD_FILTER)))
            s2_cloudless_col = (ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
                .filterBounds(self.AOI)
                .filterDate(self.START_DATE, self.END_DATE))
            return ee.ImageCollection(ee.Join.saveFirst('s2cloudless').apply(**{
                'primary': s2_sr_col,
                'secondary': s2_cloudless_col,
                'condition': ee.Filter.equals(**{
                    'leftField': 'system:index',
                    'rightField': 'system:index'
                })
            }))

    def apply_cld_shdw_mask(self,img):
        not_cld_shdw = img.select('cloudmask').Not()
        return img.select('B.*').updateMask(not_cld_shdw)

    def add_cloud_bands(self,img):
        cld_prb = ee.Image(img.get('s2cloudless')).select('probability')
        is_cloud = cld_prb.gt(self.CLD_PRB_THRESH).rename('clouds')
        return img.addBands(ee.Image([cld_prb, is_cloud]))

    def add_shadow_bands(self,img):
        not_water = img.select('SCL').neq(6)
        SR_BAND_SCALE = 1e4
        dark_pixels = img.select('B8').lt(self.NIR_DRK_THRESH*SR_BAND_SCALE).multiply(not_water).rename('dark_pixels')
        shadow_azimuth = ee.Number(90).subtract(ee.Number(img.get('MEAN_SOLAR_AZIMUTH_ANGLE')));
        cld_proj = (img.select('clouds').directionalDistanceTransform(shadow_azimuth, self.CLD_PRJ_DIST*10)
            .reproject(**{'crs': img.select(0).projection(), 'scale': 100})
            .select('distance')
            .mask()
            .rename('cloud_transform'))
        shadows = cld_proj.multiply(dark_pixels).rename('shadows')
        return img.addBands(ee.Image([dark_pixels, cld_proj, shadows]))

    def add_cld_shdw_mask(self,img):
        img_cloud = self.add_cloud_bands(img)
        img_cloud_shadow = self.add_shadow_bands(img_cloud)
        is_cld_shdw = img_cloud_shadow.select('clouds').add(img_cloud_shadow.select('shadows')).gt(0)
        is_cld_shdw = (is_cld_shdw.focalMin(2).focalMax(self.BUFFER*2/20)
            .reproject(**{'crs': img.select([0]).projection(), 'scale': 20})
            .rename('cloudmask'))
        return img_cloud_shadow.addBands(is_cld_shdw)
    
    def tiff_to_jpg(self):
        im = Image.open('https://storage.googleapis.com/aiforevil/full_image.tiff')
        jpeg_image = im.convert("RGB")
        jpeg_image.save("full_image.jpg")
        storage_client = storage.Client()
        bucket = storage_client.bucket("AiForEvil")
        blob = bucket.blob("full_image.jpg")
        blob.upload_from_filename(self.local_full_image_path)
        return im.shape
    
    def upload(self, crop=False): 
        bucket_name = "aiforevil"

        if crop==True:
            export_params = {
                'image': self.image,
                'description': 'cropped_image',  # Export name
                'bucket': bucket_name,  # Google Cloud Storage bucket name 
                'scale': 10,  # Resolution in meters per pixel
                'region': self.AOI,  # Convert the region geometry to coordinates
                'fileFormat': 'GeoTIFF',  # Export format
            }
            task = ee.batch.Export.image.toCloudStorage(**export_params)
            task.start()
            while task.active():
                print("Exporting... (task ID: {})".format(task.id))
                time.sleep(30) 
            if task.status()['state'] == 'COMPLETED':
                url = 'https://storage.googleapis.com/aiforevil/cropped_image.tiff'
                r = requests.get(url, allow_redirects=True)
                local_path = '/your/desired/path/cropped_image.tiff'
                Path(local_path).parent.mkdir(parents=True, exist_ok=True)
                open(local_path, 'wb').write(r.content)
                print("Export completed. The image is in your Google Cloud Storage bucket.")
            else:
                print("Export failed. Check the task status for more details.")

        else:
            export_params = {
                'image': self.image,
                'description': 'full_image',  # Export name
                'bucket': bucket_name,  # Google Cloud Storage bucket name 
                'scale': 10,  # Resolution in meters per pixel
                'region': self.point_coordinates,  # Convert the region geometry to coordinates
                'fileFormat': 'GeoTIFF',  # Export format
                'maxPixels': 1e13
            }
            task = ee.batch.Export.image.toCloudStorage(**export_params)
            task.start()
            while task.active():
                print("Exporting... (task ID: {})".format(task.id))
                time.sleep(30) 
            if task.status()['state'] == 'COMPLETED':
                r = requests.get(self.full_image_url_tiff, allow_redirects=True)
                local_path = '/your/desired/path/full_image.tiff'
                Path(local_path).parent.mkdir(parents=True, exist_ok=True)
                open(local_path, 'wb').write(r.content)
                print("Export completed. The image is in your Google Cloud Storage bucket and in local directory.")
            else:
                print("Export failed. Check the task status for more details.")


if __name__ == '__main__':
    g = GoogleApi()
    g.upload()