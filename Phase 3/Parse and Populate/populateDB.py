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
    DB.commit()
    return 




def pad(newValues):
    check  = newValues.split(",")
    conv = [i for i in check]
    for i in range(len(check)):
        print(check[i])
        if not str(check[i]).isnumeric(): 
            conv[i] = f"'{check[i]}'"
        if str(check[i]) == '': conv[i] = '0.0'
        # else: conv[i] = float(check[i])
    conv = ",".join(conv)
    return conv

def insertInto(table, fields, newValues):
    query = f'INSERT INTO {table} ({fields}) VALUES ({pad(newValues)});'
    print(query)
    cur.execute(query)
    DB.commit()
    return 

# FILL PLAYERS (FOR MSOC)
def fillTable(tablePath, tableName):
    with open(f'{tablePath}.csv') as players:
        playerRows = players.readlines()
        fields = playerRows.pop(0)
        for row in range(len(playerRows)):
            try: 
                print(tableName + " Executing: ")
                insertInto(tableName, fields, playerRows[row].replace("\n", ''))
            except: 
                print("error | continuing ")

            # # try update 
            # seshID = playerRows[row].split(",")[0]
            # curDate = playerRows[row].replace("\n", "").split(",")[2]
            # update("date", "'" + str(curDate) +"'" , "session", f"sessionid='{seshID}'")

def updateTable(table, var):
    with open(f'{table}.csv') as players:
        playerRows = players.readlines()
        playerRows.pop(0) #get rid of header row 
        newVal, condition = None, None 
        for row in range(len(playerRows)):
            # define newVal and condition according to the current row: playerRows[row].replace("\n","")
            update(var, newVal, table, condition) 


# fillTable("/Users/wyattmccarthy/Desktop/Databases/Catapult-Database-Project/Phase 3/Parse and Populate/session", "session")
# fillTable("device")
# fillTable("/Users/wyattmccarthy/Desktop/Databases/Catapult-Database-Project/Phase 3/Parse and Populate/holds", "holds")
# fillTable("tracks")
# fillTable("/Users/wyattmccarthy/Desktop/Databases/Catapult-Database-Project/Phase 3/Parse and Populate/participatesIn", "participatesIn")
# fillTable("/Users/wyattmccarthy/Desktop/Databases/Catapult-Database-Project/Phase 3/Parse and Populate/recordsStatsOn", "recordsstatson")

# print(selectFrom("distancepermin, sessionid", "recordsStatsOn", "email='wmccarthy24@amherst.edu'"))
# print()
# print(selectFrom("distance, sessionid, email", "recordsstatson", "email='atremante26@amherst.edu'"))

        
