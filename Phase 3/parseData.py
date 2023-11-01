import psycopg2 as pg
import csv 
# TAKE IN TJ EXCEL:

# CREATE DICT WITH: (PLAYERNAME, holds participated in) KEY-VALUE PAIRS 

# PLAYERNAME IS IN COL INDEX 2 
# RELEVANT STATS ARE IN INDICES: 
#   - DISTANCE INDEX 8 
#   - SPRINT DISTANCE INDEX 9
#   - ENERGY INDEX 11 
#   - TOP SPEED INDEX 17
#   - DISTANCE / MIN INDEX 18 

# CREATE DICT WITH: (SESSION, dictionary of player stats in that session)
# SESSION ID IS IN COL INDEX 0:
# RELEVANT STATS FOR SESSION: 
#  - TAG INDEX 4 

# CAN LIKELY MIMIC PARTICIPATES IN RELATION THROUGH SESSION AND 
# PLAYER INFO EXTRACTED FROM SHEET 

# this method creates sessions.csv (Session relation data), holds.csv (Holds relation data), players.csv (Player relation data), 

def createSessionPlayerRelations(csvFilePath, teamID):
    class Player:
        def __init__(self, name) -> None:
            self.name = name

        # if session not given return list of desired stat 
        def distance(self, session=None):
            if session:
                return holds[session][self.name][0]
            else:
                return [holds[sesh][self.name][0] for sesh in players[self.name]] 
        def sprintDist(self, session=None):
            if session:
                return holds[session][self.name][1]
            else:
                return [holds[sesh][self.name][1] for sesh in players[self.name]]
        def energy(self, session=None):
            if session:
                return holds[session][self.name][2]
            else:
                return [holds[sesh][self.name][2] for sesh in players[self.name]]
        def topSpeed(self, session=None):
            if session:
                return holds[session][self.name][3]
            else:
                return [holds[sesh][self.name][3] for sesh in players[self.name]]
        def distancePerMin(self, session=None):
            if session: 
                return holds[session][self.name][4]
            else:
                return [holds[sesh][self.name][4] for sesh in players[self.name]]


    statRows = []
    with open(csvFilePath) as statSheet: 
        statRows = statSheet.readlines()
    statRows.pop(0)
    for row in range(len(statRows)):
        statRows[row] = statRows[row].split(",")

    players = {}
    # players holds playerName: list of holds they participated in pairs 

    holds = {}
    # dict to represent "Holds" relation holds (session id, date, tag):dictionary pairs 
    # inner dictionary holds playerName:stats in that session pairs 

    for row in statRows:
        # session id, date, tag tuple  
        sesh = (row[0], row[1], row[4])
        if sesh not in holds: holds[sesh] = {}
        playerName = row[2]

    #   - DISTANCE at INDEX 8 
    #   - SPRINT DISTANCE at INDEX 9
    #   - ENERGY(kcals) at INDEX 11 
    #   - TOP SPEED at INDEX 17
    #   - DISTANCE / MIN at INDEX 18 
        releventStats = (row[8], row[9], row[11], row[17], row[18])

        if playerName not in holds[sesh]: holds[sesh][playerName] = releventStats

        if playerName not in players: 
            players[playerName] = []
        
        players[playerName].append(sesh)
        # updateStats(playerName, row)

    print(f"Session and Player Data for {teamID}")

    for s in holds:
        print("Session " + str(s))

    for p in players:
        print(p)
        for sesh in players[p]:
            print(sesh)
            print(holds[sesh][p])
        print('')
    
    def select(playerName):
        return Player(playerName)
  # use select to grab player object s.t you can query specific stats 

    # def createPlayers():
    #     with open("sessions.csv", mode='w') as toWrite:
    #         fields = ['name', 'email', ]
    #         writer = csv.DictWriter(toWrite, fieldnames=fields)
    #         writer.writeheader()
    #         for s in holds:
    #             writer.writerow({'date': s[0], 'type': s[2]})

    def createSessions():
        with open("sessions.csv", mode='w') as toWrite:
            fields = ['date', 'type']
            writer = csv.DictWriter(toWrite, fieldnames=fields)
            writer.writeheader()
            seen = {}
            for s in holds:
                if s[0] not in seen:
                    seen[s[0]] = 1
                    writer.writerow({'date': s[0], 'type': s[2]})
    
    def createHolds():
        with open("holds.csv", mode='w') as toWrite:
            fields = ['teamID', 'date']
            writer = csv.DictWriter(toWrite, fieldnames=fields)
            writer.writeheader()
            seen = {}
            for s in holds:
                if s[0] not in seen:
                    seen[s[0]] = 1
                    writer.writerow({'teamID': teamID, 'date': s[0]})
    
    def createParticipatesIn():
        with open("participatesIn.csv", mode='w') as toWrite:
            fields = ['name', 'date', 'teamID']
            writer = csv.DictWriter(toWrite, fieldnames=fields)
            writer.writeheader()
            for p in players:
                for s in players[p]:
                    writer.writerow({'name':p,'date':s[0], 'teamID':teamID})

    createSessions()
    createHolds()                
    createParticipatesIn()

createSessionPlayerRelations("TEST STATS.csv", "MSOC")


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

# CUR.EXECUTE(SQL) -> PERFORMS GIVEN SQL QUERY 
# CUR.FETCHALL() -> RETURNS ALL QUERIED DATA (AS ARRAY OF TUPLES (ROWS))


cur.execute("UPDATE team SET headcoach = 'Wyatt McCarthy' WHERE teamid='MSOC';")

cur.execute('SELECT * FROM team;')
rows = cur.fetchall()
for row in rows:
    print(row)
print()

cur.execute("UPDATE team SET headcoach = 'Justin Serpone' WHERE teamid='MSOC';")
cur.execute('SELECT * FROM team;')
rows = cur.fetchall()
for row in rows:
    print(row)

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




