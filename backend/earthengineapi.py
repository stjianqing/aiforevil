from google.oauth2 import service_account
import ee
from google.cloud import storage
import time
from PIL import Image
import requests
from pathlib import Path
from wand.image import Image as WandImage
from wand.exceptions import WandException
# import tifffile

class GoogleApi:
    def __init__(self, START_DATE='2020-06-01', END_DATE='2020-09-01', latlong=None):
        self.SERVICE_ACCOUNT_FILE = r'./spatial-design-studio-401610-968f22789eb6.json'
        self.service_account_email = "spatial-design-studio-401610@appspot.gserviceaccount.com"
        self.credentials = ee.ServiceAccountCredentials(self.service_account_email, self.SERVICE_ACCOUNT_FILE)
        self.full_image_url_tiff= 'https://storage.googleapis.com/aiforevil/full_image.tif'
        self.full_image_url_jpg= 'https://storage.googleapis.com/aiforevil/full_image.jpg'
        self.cropped_image_url='https://storage.googleapis.com/aiforevil/cropped_image.tif'
        self.cropped_image_url='https://storage.googleapis.com/aiforevil/cropped_image.jpg'
        self.local_full_image_path= './img/full_image.jpg'
        self.local_cropped_image_path= './img/cropped_image.jpg'
        ee.Initialize(self.credentials)
        self.START_DATE = START_DATE
        self.END_DATE = END_DATE
        self.latlong = latlong
        # self.temp_aoi=ee.Geometry.BBox(self.latlong[1], self.latlong[0], self.latlong[1]+0.1, self.latlong[0]+0.1)
        if latlong is not None:
            if len(latlong)>2:
                self.AOI=ee.Geometry.BBox(*latlong)
            else:
                self.temp_aoi=ee.Geometry.BBox(self.latlong[1], self.latlong[0], self.latlong[1]+0.1, self.latlong[0]+0.1)
                self.AOI=self.full_tile_bbox()
            self.longlat=(latlong[1], latlong[0])
        self.START_DATE=START_DATE
        self.END_DATE = END_DATE
        self.CLOUD_FILTER = 60
        self.CLD_PRB_THRESH = 40
        self.NIR_DRK_THRESH = 0.15
        self.CLD_PRJ_DIST = 2
        self.BUFFER = 100

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
    
    def tiff_to_jpg(self, full_image=True):
        file_name = 'full_image' if full_image else 'cropped_image'
        input_tiff_path = f'./img/{file_name}.tif'
        output_jpg_path = f'./img/{file_name}.jpg'
        try:
            with WandImage(filename=input_tiff_path) as img:
                img.format = 'jpeg'
                img.save(filename=output_jpg_path)
            storage_client = storage.Client.from_service_account_json(self.SERVICE_ACCOUNT_FILE)
            bucket = storage_client.bucket("aiforevil")
            blob = bucket.blob(f"{file_name}.jpg")
            blob.upload_from_filename(output_jpg_path)

        except WandException as e:
            print(f"Error: {e}")
    
    def full_tile_bbox(self):
        image=ee.ImageCollection('COPERNICUS/S2_SR').filterBounds(self.temp_aoi).filterDate(self.START_DATE, self.END_DATE).first()
        s2_sr_median = image.select("B4")
        s2_sr_median=s2_sr_median.reproject(crs='EPSG:4326')
        latlon=s2_sr_median.pixelLonLat()
        image=s2_sr_median.addBands(latlon.select(["longitude", "latitude"]))
        full_tile_coordinates=image.geometry().bounds().coordinates().getInfo()
        first_coordinates=full_tile_coordinates[0][0]
        third_coordinates=full_tile_coordinates[0][2]
        full_tile_bbox=(*first_coordinates, *third_coordinates)
        formatted_bbox = tuple(float("{:.2f}".format(value)[:-1])-.1 for value in full_tile_bbox)
        formatted_bbox=ee.Geometry.BBox(*formatted_bbox)
        return formatted_bbox

    def upload_to_gcp(self, local_path=None, gcp_file_name=None):
        client=storage.Client.from_service_account_json("./spatial-design-studio-401610-968f22789eb6.json")
        bucket = client.get_bucket("aiforevil")
        blob = bucket.blob(gcp_file_name)
        blob.upload_from_filename(local_path)

    def download_from_gcp(self, local_path=None, gcp_file_name=None):
        client=storage.Client.from_service_account_json("./spatial-design-studio-401610-968f22789eb6.json")
        bucket = client.get_bucket("aiforevil")
        blob = bucket.blob(gcp_file_name)
        blob.download_to_filename(local_path)

    def upload_ee_to_gcp(self, crop=False, compare=False): 
        bucket_name = "aiforevil"
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

        if crop:
            file_name = 'cropped_image_compare' if compare else 'cropped_image'
            export_params = {
                'image': self.image,
                'description': file_name,  # Export name
                'bucket': bucket_name,  # Google Cloud Storage bucket name 
                'scale': 10,  # Resolution in meters per pixel
                'region': self.AOI,  # Convert the region geometry to coordinates
                'fileFormat': 'GeoTIFF',  # Export format
            }
            task = ee.batch.Export.image.toCloudStorage(**export_params)

            task.start()
            while task.active():
                print("Exporting... (task ID: {})".format(task.id))
                time.sleep(60) 
            if task.status()['state'] == 'COMPLETED':
                self.download_from_gcp(local_path=f'./img/{file_name}.tif', gcp_file_name=f'{file_name}.tif')
                print("Export completed. The image is in your Google Cloud Storage bucket.")
            else:
                print("Export failed. Check the task status for more details.")

        else:
            export_params = {
                'image': self.image,
                'description': 'full_image',  # Export name
                'bucket': bucket_name,  # Google Cloud Storage bucket name 
                'scale': 10,  # Resolution in meters per pixel
                'region': self.AOI,  # Convert the region geometry to coordinates
                'fileFormat': 'GeoTIFF',  # Export format
                'maxPixels': 1e13
            }
            task = ee.batch.Export.image.toCloudStorage(**export_params)
            task.start()
            while task.active():
                print("Exporting... (task ID: {})".format(task.id))
                time.sleep(60) 
            if task.status()['state'] == 'COMPLETED':
                self.download_from_gcp(local_path='./img/full_image.tif', gcp_file_name='full_image.tif')
                print("Export completed. The image is in your Google Cloud Storage bucket and in local directory.")
            else:
                print("Export failed. Check the task status for more details.")


if __name__ == '__main__':
    g = GoogleApi(latlong=(20.23,105.50))
    # g.upload()
    # g.tiff_to_jpg()
