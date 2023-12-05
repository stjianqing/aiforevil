from flask import Flask, request, jsonify
from flask_cors import CORS
from earthengineapi import GoogleApi
from datetime import datetime, timedelta
from sam.detect import *

app = Flask(__name__)
CORS(app)

# sam_checkpoint = "./sam/model/sam_vit_l_0b3195.pth"
# model_type = "vit_l"

# model = EdgeDetector(sam_checkpoint, model_type)

# '''Takes in front-end posted date and uploads image to Google Cloud Storage'''

start_date=None
end_date=None
img_size = (0,0)


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
    g = GoogleApi(start_date, end_date, lat_long)
    g.upload_ee_to_gcp()  #defaults to full image
    g.tiff_to_jpg() 
    res = {'latitude': lat, 'longitude': long, 'start_date': start_date, 'end_date': end_date}
    print(res)
    return jsonify(res)

@app.route("/api/get-img", methods=['GET'])
def get_image():
    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/full_image.jpg'})
    return responses

@app.route("/api/cropped-coord", methods=['POST'])
def send_cropped_coordinates():
    x1 = request.json.get('x1')*400
    x2 = request.json.get('x2')*400
    y1 = request.json.get('y1')*400
    y2 = request.json.get('y2')*400
    res = {'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2}
    latlong = (x1, y1, x2, y2)
    g = GoogleApi(start_date, end_date, latlong)
    g.upload_ee_to_gcp(crop=True)
    print(res)
    return jsonify(res)

@app.route('/api/get-segment', methods=['GET'])
def get_segment():
    model.run('./img/cropped_image.tif')
    g=GoogleApi()
    g.upload_to_gcp(local_path='./img/output.shp.zip', gcp_file_name='output.shp.zip')
    g.upload_to_gcp(local_path='./img/overlay.png', gcp_file_name='overlay.png')
    #TODO: save the segmented image & shapefile to GCS, return the url for image
    #TODO: update the url to the segment image in GCS
    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/overlay.png'})
    return responses

@app.route('/api/get-difference', methods=['GET'])
def get_difference():
    segment, multipolygon = model.run('./img/cropped_image.tif')
    model.run('./img/cropped_image.tif', segment, multipolygon)
    #TODO: save the segmented image & shapefile to GCS, return the url for image
    #TODO: update the url to the comparison for segmented image in GCS
    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/test.jpg'})
    return responses

@app.route('/api/get-shapefile', methods=['GET'])
def download_shapefile():
    #TODO: update the url to the shapefile in GCS
    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/output.shp.zip'})
    return responses

if __name__ == '__main__':
    app.run(debug=True, port=5000)