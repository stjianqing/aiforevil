from flask import Flask, request, jsonify
from flask_cors import CORS
# from earthengineapi import GoogleApi

app = Flask(__name__)
CORS(app)

@app.route("/api/location-coord", methods=['POST'])
def send_location_coordinates():
    #if request post, take lat/long values and jsonify dictionary
    lat = request.json.get('latitude')
    long = request.json.get('longitude')
    date1 = request.json.get('date1')
    date2 = request.json.get('date2')
    period = request.json.get('period')
    # g = GoogleApi(lat, long, date)
    # g.upload()
    res = {'latitude': lat, 'longitude': long, 'date1': date1, 'date2': date2, 'preiod':period}
    print(res)
    return jsonify(res)

@app.route("/api/get-img", methods=['GET'])
def get_image():
    # res= send_location_coordinates() #takes in the lat/long values
    # g = GoogleApi(Lat, Long, Date)
    # g.upload()
    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/test.jpg'})
    return responses

@app.route("/api/cropped-coord", methods=['POST'])
def send_cropped_coordinates():
    x1 = request.json.get('x1')*400
    x2 = request.json.get('x2')*400
    y1 = request.json.get('y1')*400
    y2 = request.json.get('y2')*400
    res = {'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2}
    print(res)
    return jsonify(res)

@app.route('/api/get-segment', methods=['GET'])
def get_segment():
    #TODO: update the url
    responses = jsonify({'url': 'https://storage.googleapis.com/aiforevil/test.jpg'})
    return responses

if __name__ == '__main__':
    app.run(debug=True, port=5000)