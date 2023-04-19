from flask import Flask, jsonify, request
from project.data.database import Database
from project.data.csv_reader import CSVReader
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/data',  methods=['GET','POST'])
def get_data():
    if request.method == 'POST':
        # retrieve the filter parameter from the request body
        make_filter = request.json.get('make')
        vehicle_class_filter = request.json.get('vehicleClass')
        # query the database with the filter parameter
        db = Database()
        data = db.get_data_filtered(make_filter, vehicle_class_filter)
        return jsonify(data)
    else:
        db = Database()
        data = db.get_data()
        return jsonify(data)


@app.route('/createData', methods= ['GET'])
def create_data():
    url = 'https://www.nrcan.gc.ca/sites/nrcan/files/oee/files/csv/MY2012-2023%20Battery%20Electric%20Vehicles.csv'
    reader = CSVReader(url)
    data = reader.parse_data(reader.fetch_data())
    db = Database()
    db.create_table()
    db.insert_data(data)
    return '', 204