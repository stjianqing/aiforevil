from google.oauth2 import service_account
import ee
from google.cloud import storage
import time



<<<<<<< HEAD
SERVICE_ACCOUNT_FILE = r'C:/Users/stjia/Desktop/Coding/aiforevil/S2cloudless/service_account.json'
=======
SERVICE_ACCOUNT_FILE = r'C:/Users/stjia/Desktop/Term 7/aiforevil/S2cloudless/service_account.json'
>>>>>>> 9915cfb62e632e39ee7c1b7a0f9eb517ade4ed09
service_account_email = 'ry-handsome-chap@spatial-design-studio-401610.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account_email, SERVICE_ACCOUNT_FILE)
ee.Initialize(credentials)




# AOI = ee.Geometry.BBox(105.50, 20.23, 105.74, 20.39) # cuc phong
# AOI = ee.Geometry.BBox(106.94, 11.577, 107.38, 11.126) # cat tien
AOI= ee.Geometry.Point(105.50, 20.23)     
START_DATE = '2020-06-01'
END_DATE = '2020-09-01'
CLOUD_FILTER = 60
CLD_PRB_THRESH = 40
NIR_DRK_THRESH = 0.15
CLD_PRJ_DIST = 2
BUFFER = 100

def get_s2_sr_cld_col(aoi, start_date, end_date):

    s2_sr_col = (ee.ImageCollection('COPERNICUS/S2_SR')
        .filterBounds(aoi)
        .filterDate(start_date, end_date)
        .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', CLOUD_FILTER)))

    s2_cloudless_col = (ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
        .filterBounds(aoi)
        .filterDate(start_date, end_date))


    return ee.ImageCollection(ee.Join.saveFirst('s2cloudless').apply(**{
        'primary': s2_sr_col,
        'secondary': s2_cloudless_col,
        'condition': ee.Filter.equals(**{
            'leftField': 'system:index',
            'rightField': 'system:index'
        })
    }))


s2_sr_cld_col = get_s2_sr_cld_col(AOI, START_DATE, END_DATE)

def apply_cld_shdw_mask(img):
    not_cld_shdw = img.select('cloudmask').Not()
    return img.select('B.*').updateMask(not_cld_shdw)

def add_cloud_bands(img):
    cld_prb = ee.Image(img.get('s2cloudless')).select('probability')

    is_cloud = cld_prb.gt(CLD_PRB_THRESH).rename('clouds')

    return img.addBands(ee.Image([cld_prb, is_cloud]))
def add_shadow_bands(img):

    not_water = img.select('SCL').neq(6)

    SR_BAND_SCALE = 1e4
    dark_pixels = img.select('B8').lt(NIR_DRK_THRESH*SR_BAND_SCALE).multiply(not_water).rename('dark_pixels')

    shadow_azimuth = ee.Number(90).subtract(ee.Number(img.get('MEAN_SOLAR_AZIMUTH_ANGLE')));

    cld_proj = (img.select('clouds').directionalDistanceTransform(shadow_azimuth, CLD_PRJ_DIST*10)
        .reproject(**{'crs': img.select(0).projection(), 'scale': 100})
        .select('distance')
        .mask()
        .rename('cloud_transform'))

    shadows = cld_proj.multiply(dark_pixels).rename('shadows')

    return img.addBands(ee.Image([dark_pixels, cld_proj, shadows]))

def add_cld_shdw_mask(img):

    img_cloud = add_cloud_bands(img)


    img_cloud_shadow = add_shadow_bands(img_cloud)

    is_cld_shdw = img_cloud_shadow.select('clouds').add(img_cloud_shadow.select('shadows')).gt(0)

    is_cld_shdw = (is_cld_shdw.focalMin(2).focalMax(BUFFER*2/20)
        .reproject(**{'crs': img.select([0]).projection(), 'scale': 20})
        .rename('cloudmask'))
    return img_cloud_shadow.addBands(is_cld_shdw)


trueColorVis = {
'bands': ['B4', 'B3', 'B2'],
'min': "0.0",
'max': "3000.0"
}

s2_sr_median = (s2_sr_cld_col.map(add_cld_shdw_mask)
                             .map(apply_cld_shdw_mask)
                             .median()
                            #  .uint8()
                             ._apply_visualization(trueColorVis)
                             )[0]

bucket_name = "aiforevil"

export_params = {
    'image': s2_sr_median,
    'description': 's2_sr_median_export',  # Export name
    'bucket': bucket_name,  # Google Cloud Storage bucket name 
    'scale': 10,  # Resolution in meters per pixel
    'region': AOI,  # Convert the region geometry to coordinates
    'fileFormat': 'GeoTIFF'  # Export format
}


task = ee.batch.Export.image.toCloudStorage(**export_params)
task.start()


while task.active():
    print("Exporting... (task ID: {})".format(task.id))
    time.sleep(30) 


if task.status()['state'] == 'COMPLETED':
    print("Export completed. The image is in your Google Cloud Storage bucket.")
else:
    print("Export failed. Check the task status for more details.")