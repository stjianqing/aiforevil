from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/location-coord", methods=['POST'])
def send_location_coordinates():
    #if request post, take lat/long values and jsonify dictionary
    lat = request.json.get('latitude')
    long = request.json.get('longitude')
    date = request.json.get('date')
    res = {'latitude': lat, 'longitude': long, 'date': date}
    # store image to gcp
    print(res)
    return jsonify(res)

@app.route("/api/get-img", methods=['GET'])
def get_image():
    #TODO: update the url
    msg = {'url': 'https://storage.googleapis.com/aiforevil/test.jpg'}
    return jsonify(msg)

@app.route("/api/cropped-coord", methods=['POST'])
def send_cropped_coordinates():
    x1 = request.json.get('x1')
    x2 = request.json.get('x2')
    y1 = request.json.get('y1')
    y2 = request.json.get('y2')
    res = {'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2}
    return jsonify(res)

@app.route('/api/get-segment', methods=['GET'])
def get_segment():
    #TODO: update the url
    msg = {'url': 'https://storage.googleapis.com/aiforevil/test.jpg'}
    return jsonify(msg)

if __name__ == '__main__':
    app.run(debug=True, port=5000)