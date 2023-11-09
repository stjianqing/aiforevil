from typing import Any
from google.oauth2 import service_account
import ee
from google.cloud import storage
import time
from datetime import datetime, timedelta

SERVICE_ACCOUNT_FILE = r'C:\Users\stjia\Desktop\Coding\Work\aiforevil\S2cloudless\service_account.json'
service_account_email = 'ry-handsome-chap@spatial-design-studio-401610.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account_email, SERVICE_ACCOUNT_FILE)
ee.Initialize(credentials)


class AntiCloudProgram:
    
    def __init__(self, START_DATE, END_DATE, AOI=None):


        self.SERVICE_ACCOUNT_FILE = r'C:\Users\stjia\Desktop\Coding\Work\aiforevil\S2cloudless\service_account.json'
        self.service_account_email = 'ry-handsome-chap@spatial-design-studio-401610.iam.gserviceaccount.com'



        self.START_DATE = START_DATE
        self.END_DATE = END_DATE
        self.AOI = AOI if AOI is not None else ee.Geometry.BBox(105.508134, 20.235990, 105.738847, 20.398259)  #cuc phuong forest bounding box
        self.CLOUD_FILTER = 50
        self.CLD_PRB_THRESH = 40
        self.NIR_DRK_THRESH = 0.15
        self.CLD_PRJ_DIST = 2
        self.BUFFER = 100

        self.s2_sr_median=None

    def getattribute(self, __name: str):
        print(super().__getattribute__(__name))


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



    def export_to_cloud_storage(self):
        s2_sr_cld_col = self.get_s2_sr_cld_col()
        s2_sr_median = (s2_sr_cld_col.map(self.add_cld_shdw_mask)
                                     .map(self.apply_cld_shdw_mask)
                                     .median())
        
        print(s2_sr_median.getInfo())

        export_params = {
            'image': s2_sr_median,
            'description': 's2_sr_median_export',  # Export name
            'bucket': 'aiforevil',
            'scale': 10,  # Resolution in meters per pixel
            'region': self.AOI.getInfo()['coordinates'],  # Convert the region geometry to coordinates
            'fileFormat': 'GeoTIFF',  # Export format
        }

        task = ee.batch.Export.image.toCloudStorage(**export_params)
        task.start()
        

        while task.active():
            print("Exporting... (task ID: {})".format(task.id))
            time.sleep(30)
        if task.status()['state'] == 'COMPLETED':
            print("Export completed. The image is in your Google Cloud Storage bucket.")
        else:
            print("Export failed")
          

if __name__ == '__main__':
    service_account_file = r'C:\Users\stjia\Desktop\Coding\Work\aiforevil\S2cloudless\service_account.json'
    bucket_name = "aiforevil"
    aoi = ee.Geometry.BBox(105.508134, 20.235990, 105.738847, 20.398259)
    start_date = '2023-07-01'
    end_date = '2020-10-01'

    
    exporter = AntiCloudProgram(start_date, end_date, aoi)
    exporter.export_to_cloud_storage()