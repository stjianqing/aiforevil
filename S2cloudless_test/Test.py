from google.oauth2 import service_account
import ee
from google.cloud import storage
import time
from PIL import Image
import requests
from pathlib import Path


SERVICE_ACCOUNT_FILE = r"C:/Users/stjia/Desktop/Coding/aiforevil/S2cloudless_test/spatial-design-studio-401610-968f22789eb6.json"
service_account_email = "spatial-design-studio-401610@appspot.gserviceaccount.com"
credentials = ee.ServiceAccountCredentials(service_account_email, SERVICE_ACCOUNT_FILE)
ee.Initialize(credentials)

# AOI = ee.Geometry.BBox(104.99, 19.8, 106.05, 20.8) #real tile
# AOI = ee.Geometry.BBox(105, 19.8, 106, 20.6) #fake tile
AOI=ee.Geometry.Point(105.50, 20.20)
# AOI = ee.Geometry.BBox(105.50, 20.20, 105.80, 20.42) #bigger cuc phong
# AOI = ee.Geometry.BBox(106.94, 11.577, 107.38, 11.126) # cat tien
START_DATE = '2020-06-01'
END_DATE = '2020-09-01'
CLOUD_FILTER = 80
CLD_PRB_THRESH = 40
NIR_DRK_THRESH = 0.15
CLD_PRJ_DIST = 2
BUFFER = 100

# Returns polygon coordinates in the order (lower left, lower right, upper right, upper left, upper right)
image=ee.ImageCollection('COPERNICUS/S2_SR').filterBounds(AOI).filterDate(START_DATE, END_DATE).first()
s2_sr_median = image.select("B4")
s2_sr_median=s2_sr_median.reproject(crs='EPSG:4326')
latlon=s2_sr_median.pixelLonLat()
image=s2_sr_median.addBands(latlon.select(["longitude", "latitude"]))
full_tile_coordinates=image.geometry().bounds().coordinates().getInfo()
first_coordinates=full_tile_coordinates[0][0]
third_coordinates=full_tile_coordinates[0][2]
full_tile_bbox=(*first_coordinates, *third_coordinates)
print(full_tile_bbox)
formatted_bbox = tuple(float("{:.2f}".format(value)[:-1])-.1 for value in full_tile_bbox)
print(formatted_bbox)


# s2_sr_median.select('B4')
# footprint = s2_sr_median.geometry().bounds().coordinates()
# print(footprint.getInfo())




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

# s2_sr_cld_col = get_s2_sr_cld_col(AOI, START_DATE, END_DATE).first()
# print(s2_sr_cld_col.getInfo())

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
    'region': AOI,  # Region of interest
    'fileFormat': 'GeoTIFF',  # Export format
    'maxPixels': 1e13,
}


task = ee.batch.Export.image.toCloudStorage(**export_params)
task.start()


while task.active():
    print("Exporting... (task ID: {})".format(task.id))
    time.sleep(60) 


if task.status()['state'] == 'COMPLETED':
    print("Export completed. The image is in your Google Cloud Storage bucket.")
else:
    print("Export failed. Check the task status for more details.")

# def tiff_to_jpg():
#     im = Image.open('C:/Users/stjia/Desktop/Term 7/aiforevil/backend/img/s2_sr_median_export(1).tif')
#     jpeg_image = im.convert("RGB")
#     jpeg_image.save("C:/Users/stjia/Desktop/Term 7/aiforevil/backend/img/cropped_image.jpg")
#     storage_client = storage.Client()
#     bucket = storage_client.bucket("aiforevil")
#     blob = bucket.blob("cropped_image.jpg")
#     blob.upload_from_filename("C:/Users/stjia/Desktop/Term 7/aiforevil/backend/img/cropped_image.jpg")
#     print(im.size)
#     return im.size

# tiff_to_jpg()