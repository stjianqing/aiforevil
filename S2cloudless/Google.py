from google.oauth2 import service_account
import ee
from google.cloud import storage
import time

SERVICE_ACCOUNT_FILE = r'C:/Users/stjia/Desktop/Coding/aiforevil/S2cloudless/service_account.json'
service_account_email = 'ry-handsome-chap@spatial-design-studio-401610.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account_email, SERVICE_ACCOUNT_FILE)
ee.Initialize(credentials)

image = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_044034_20210508').select(['SR_B.'])


region = ee.Geometry.BBox(-122.24, 37.13, -122.11, 37.20)

export_params = {
  "image": image,
  "description": 'image_export',
  "bucket": 'aiforevil',
  "fileNamePrefix": 'image_export',
  "region": region,
  "scale": 30,
  "crs": 'EPSG:5070'
}

task = ee.batch.Export.image.toCloudStorage(**export_params)
task.start()

while task.active():
    print("Exporting... (task ID: {})".format(task.config))
    time.sleep(30) 


if task.status()['state'] == 'COMPLETED':
    print("Export completed. The image is in your Google Cloud Storage bucket.")
else:
    print("Export failed. Check the task status for more details.")
