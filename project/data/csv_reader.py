import csv
import requests


class CSVReader:
    def __init__(self, url):
        self.url = url

    def fetch_data(self):
        response = requests.get(self.url)
        return response.text

    def parse_data(self, data):
        new_data = data.replace('Model', 'Model Year', 1).\
            replace("Consumption,,","Consumption city,Consumption Highway,").replace("Smog","Smog Rating").\
            replace("Recharge","Recharge Time")
        print(new_data)
        rows = csv.DictReader(new_data.splitlines())
        return [dict(row) for row in rows]
