from flask import Flask, request, jsonify
from flask_cors import CORS
from earthengineapi import GoogleApi
from datetime import datetime, timedelta
from sam.detect import *
import math

app = Flask(__name__)
CORS(app)

sam_checkpoint = "./sam/model/sam_vit_l_0b3195.pth"
model_type = "vit_l"

model = EdgeDetector(sam_checkpoint, model_type)

'''Takes in front-end posted date and uploads image to Google Cloud Storage'''

start_date=None
end_date=None
img_size = (0,0)

def _process(x1, y1, x2, y2):
    # convert to raster coordinates
    raster = rasterio.open('./img/full_image.tif')
    array = raster.read(1)
    height, width = array.shape

    cols, rows = np.meshgrid(np.arange(width), np.arange(height))
    xs, ys = rasterio.transform.xy(raster.transform, rows, cols)

    x_coords = np.array(xs)
    y_coords = np.array(ys)

    long1 = x_coords[x1][y1].round(2)
    long2 = x_coords[x2][y2].round(2)
    lat1 = y_coords[x1][y1].round(2)
    lat2 = y_coords[x2][y2].round(2)
    return (long1, lat2, long2, lat1)

@app.route("/api/location-coord", methods=['POST'])
def send_location_coordinates():
    #if request post, take lat/long values and jsonify dictionary
    lat = request.json.get('latitude')
    long = request.json.get('longitude')
    date = request.json.get('date')
    end_date = datetime.strptime(date, '%Y-%m-%d')
    start_date = end_date - timedelta(days=3 * 30)
    lat_long = (float(lat), float(long))
    print(lat_long)
    # g = GoogleApi(start_date, end_date, lat_long)
    # g.upload_ee_to_gcp()  #defaults to full image
    # g.tiff_to_jpg() 
    res = {'latitude': lat, 'longitude': long, 'start_date': start_date, 'end_date': end_date}
    print(res)
    return jsonify(res)

@app.route("/api/get-img", methods=['GET'])
def get_image():
    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/full_image.jpg'})
    return responses

@app.route("/api/cropped-coord", methods=['POST'])
def send_cropped_coordinates():
    x1 = math.floor(request.json.get('x1') * 11133)
    x2 = math.ceil(request.json.get('x2') * 11133)
    y1 = math.floor(request.json.get('y1') * 11133)
    y2 = math.ceil(request.json.get('y2') * 11133)
    date1 = request.json.get('date1')
    date2 = request.json.get('date2')
    if date2 is None:
        end_date = datetime.strptime(date1, '%Y-%m-%d')
        start_date = end_date - timedelta(days=3 * 30)
    else:
        start_date = date1
        end_date = date2

    long1, long2, lat1, lat2 = _process(x1, y1, x2, y2)
    res = {'x1': long1, 'x2': long2, 'y1': lat1, 'y2': lat2}
    latlong = _process(x1, y1, x2, y2)

    # g = GoogleApi(start_date, end_date, latlong)
    # g.upload_ee_to_gcp(crop=True)
    # print(res)
    return jsonify(res)

@app.route('/api/get-segment', methods=['GET'])
def get_segment():
    model.run('./img/cropped_image.tif')
    g=GoogleApi()
    # g.upload_to_gcp(local_path='./img/output.shp.zip', gcp_file_name='output.shp.zip')
    g.upload_to_gcp(local_path='./img/overlay.png', gcp_file_name='overlay.png')
    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/overlay.png'})
    return responses

@app.route('/api/get-difference', methods=['GET'])
def get_difference():
    segment, multipolygon = model.run('./img/cropped_image.tif')
    model.run('./img/cropped_image.tif', segment, multipolygon)
    g = GoogleApi()
    g.upload_to_gcp(local_path='./img/comparison_output.shp.zip', gcp_file_name='output.shp.zip')
    g.upload_to_gcp(local_path='./img/overlay_comparison.png', gcp_file_name='overlay.png')

    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/overlay.jpg'})
    return responses

@app.route('/api/get-shapefile', methods=['GET'])
def download_shapefile():

    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/output.shp.zip'})
    return responses

if __name__ == '__main__':
    app.run(debug=True, port=5000)