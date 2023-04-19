import csv
import io
import requests
import pyodbc


class Database:
    def __init__(self):
        server = 'localhost'
        database = 'IES'
        username = 'root'
        password = 'root'
        driver = '{ODBC Driver 17 for SQL Server}'
        connection_string = f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}"
        self.conn = pyodbc.connect(connection_string)
        self.create_table()

    def create_table(self):
        self.conn.execute("""
        IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID('dbo.vehicle') AND type in (N'U'))
        BEGIN
            CREATE TABLE dbo.vehicle(
                id int NOT NULL,
                year int NOT NULL,
                make varchar(50) NOT NULL,
                model varchar(50) NOT NULL,
                vehicle_class varchar(50) NOT NULL,
                motor_size int NOT NULL,
                city_consumption varchar(50) NOT NULL,
                highway_consumption varchar(50) NOT NULL,
                range int NOT NULL,
                emissions int NOT NULL,
                carbon_rating int NOT NULL,
                smog_rating int NOT NULL,
                recharge_time int NOT NULL,
                PRIMARY KEY (id)
            )
            END
        """)

    def insert_data(self, rows):
        counter = 0
        for row in rows:
            if(counter == 0):
                counter += 1
                continue
            if(counter == 412):
                break
            self.conn.execute("""
                INSERT INTO dbo.vehicle (id, year, make, model, vehicle_class, motor_size, city_consumption, 
                highway_consumption, range, emissions, carbon_rating, smog_rating, recharge_time)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                int(counter),
                int(row['Model Year']),
                row['Make'],
                row['Model'],
                row['Vehicle Class'],
                int(row['Motor']),
                row['Consumption city'],
                row['Consumption Highway'],
                int(row['Range']),
                int(11),
                int(11),
                int(11),
                int(float(row['Recharge Time']))
            ))
            counter +=1
        self.conn.commit()

    def get_data_filtered(self, make_filter, vehicle_class_filter):
        query = 'SELECT * FROM vehicle WHERE '
        if (make_filter is None and vehicle_class_filter is None):
            raise ValueError("Please provide either Make or the Vehicle Class.")
        if(make_filter is not None):
            query += 'make = ' + '\'' + make_filter + '\''
        if (make_filter is not None and vehicle_class_filter is not None):
            query += ' and vehicle_class = ' + '\'' + vehicle_class_filter + '\''
        if (make_filter is None and vehicle_class_filter is not None):
            query += ' vehicle_class = ' + '\'' + vehicle_class_filter + '\''
        cursor = self.conn.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in rows]

    def get_data(self):

        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM dbo.vehicle")
        rows = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in rows]

