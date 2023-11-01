import psycopg2 as pg
# PURPOSE OF THIS FILE IS USE CSVs created by parseData.py TO POPULATE THE POSTGRES SQL
# EACH CREATED CSV CORRESPONDS (DIRECTLY) TO A RELATIONAL TABLE, SO USE CORRESPONDING CSVS TO DIRECTLY FILL ROWS/TUPLES OF DB TABLE 

# CONNECT TO POSTGRES DB SO WE CAN POPULATE TABLES 
db_params = {
    'dbname': 'project',
    'user': 'postgres',
    'password': 'ams2022',
    'host': 'cosc-257-node11.cs.amherst.edu',  # Change to your database server host if needed
    'port': '5432'        # Change to your database server port if needed
}

DB = pg.connect(** db_params)

cur = DB.cursor()

# CUR.EXECUTE(SQL) -> PERFORMS GIVEN SQL QUERY/OPERATION
# CUR.FETCHALL() -> RETURNS ALL QUERIED DATA (AS ARRAY OF TUPLES (ROWS))

# example:
# cur.execute("UPDATE team SET headcoach = 'Wyatt McCarthy' WHERE teamid='MSOC';")
# cur.execute('SELECT * FROM team;')
# rows = cur.fetchall()
# for row in rows:
#     print(row)
# cur.execute("UPDATE team SET headcoach = 'Justin Serpone' WHERE teamid='MSOC';")

# GIVEN A COLUMN(VARIABLE), TABLE AND OPTIONAL CONDITION, PERFORMS SELECT FROM QUERY 
def selectFrom(var, table, condition=None):
    query = f'SELECT {var} FROM {table};'
    if (condition):
        query = f'SELECT {var} FROM {table} WHERE {condition};'
    cur.execute(query)
    return cur.fetchall()

# UPDATES A GIVEN COLUMN (VARIABLE) OF A TABLE TO newVal, WHERE THE ROW UPDATED IS DEFINED BY GIVEN CONDITION 
def update(var, newVal, table, condition):
    query = f'UPDATE {table} SET {var}={newVal} WHERE {condition};'
    cur.execute(query);
    return 