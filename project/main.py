from data.csv_reader import CSVReader
from data.database import Database
from api.routes import app


if __name__ == '__main__':
    # url = 'https://www.nrcan.gc.ca/sites/nrcan/files/oee/files/csv/MY2012-2023%20Battery%20Electric%20Vehicles.csv'
    #
    # reader = CSVReader(url)
    # data = reader.parse_data(reader.fetch_data())
    #
    # db = Database()
    # db.create_table()
    # db.insert_data(data)

    app.run()
