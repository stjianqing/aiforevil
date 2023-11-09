from flask import Flask, request, jsonify
from flask_cors import CORS

import cv2

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/send", methods=['POST', 'GET'])
def receive():

    #if request post, take lat/long values and jsonify dictionary
    if request.method == 'POST':
        lat = request.json.get('latitude')
        long = request.json.get('longitude')
        print('reponse:', lat, long)
        res = {'latitude': lat, 'longitude':long}
        return jsonify(res)
    elif request.method == 'GET':
        lat = request.args.get('lat')
        long = request.args.get('long')
        print(lat)
        # msg = {'latitude': lat, 'longitude': long}
        msg = {'url': 'https://storage.googleapis.com/aiforevil/s2_sr_median_export.tif'}
        return jsonify(msg)
    


if __name__ == '__main__':
    app.run(debug=True, port=5000)