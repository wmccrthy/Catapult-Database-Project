import psycopg2 as pg
import csv 
# TAKE IN TJ EXCEL:

# CREATE DICT WITH: (PLAYERNAME, holds participated in) KEY-VALUE PAIRS 

# PLAYERNAME IS IN COL INDEX 2 
# RELEVANT STATS ARE IN INDICES: 
#   - DISTANCE INDEX 8 
#   - SPRINT DISTANCE INDEX 9
#   - ENERGY INDEX 11 
#   - PLAYER LOAD INDEX 15
#   - TOP SPEED INDEX 17
#   - DISTANCE / MIN INDEX 18 

# CREATE DICT WITH: (SESSION, dictionary of player stats in that session)
# SESSION ID IS IN COL INDEX 0:
# RELEVANT STATS FOR SESSION: 
#  - TAG INDEX 4 

# CAN LIKELY MIMIC PARTICIPATES IN RELATION THROUGH SESSION AND 
# PLAYER INFO EXTRACTED FROM SHEET 

# this method creates sessions.csv (Session relation data), holds.csv (Holds relation data), players.csv (Player relation data), 

def createSessionPlayerRelations(statFilePath, devicePath, teamID, season):
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

        def playerLoad(self, session=None):
            if session:
                return holds[session][self.name][3]
            else:
                return [holds[sesh][self.name][3] for sesh in players[self.name]]

        def topSpeed(self, session=None):
            if session:
                return holds[session][self.name][4]
            else:
                return [holds[sesh][self.name][4] for sesh in players[self.name]]
                
        def distancePerMin(self, session=None):
            if session: 
                return holds[session][self.name][5]
            else:
                return [holds[sesh][self.name][5] for sesh in players[self.name]]
        
        def totalDistance(self):
            return sum([float(i) for i in self.distance()])

    devices = {}
    # devices holds deviceID: (email, name, season) pairs 

    players = {}
    # players holds playerName: (email, list of sessions they participated) in pairs 

    holds = {}
    # dict to represent "Holds" relation holds (session id, date, tag):dictionary pairs 
    # inner dictionary holds playerName:stats in that session pairs 

    # -------------------------------
    # GO THROUGH STATS CSV TO COMPILE SESSIONS, HOLDS, RELATION 
    statRows = []
    with open(statFilePath) as statSheet: 
        statRows = statSheet.readlines()
    statRows.pop(0)
    for row in range(len(statRows)):
        statRows[row] = statRows[row].split(",")

    for row in statRows:
        # session id, date, tag tuple  
        sesh = (row[0], row[1], row[4])
        if sesh not in holds: holds[sesh] = {}
        playerName = row[2]

    #   - DISTANCE at INDEX 8 
    #   - SPRINT DISTANCE at INDEX 9
    #   - ENERGY(kcals) at INDEX 11 
    #   - PLAYER LOAD AT INDEX 15
    #   - TOP SPEED at INDEX 17
    #   - DISTANCE / MIN at INDEX 18 
        releventStats = (row[8], row[9], row[11], row[15], row[17], row[18])

        if playerName not in holds[sesh]: holds[sesh][playerName] = releventStats

        if playerName not in players: 
            players[playerName] = [None, []]
        
        players[playerName][1].append(sesh)
        # updateStats(playerName, row)

    with open(devicePath) as devicePairs:
        deviceRows = devicePairs.readlines()
    deviceRows.pop(0)
    for r in range(len(deviceRows)):
        deviceRows[r] = deviceRows[r].split(',')
    for row in deviceRows:
        deviceID, playerName, playerEmail = row[0], row[1], row[2]
        playerEmail = playerEmail.replace("\n", '')
        if deviceID not in devices:
            devices[deviceID] = (playerEmail, playerName, season)
        if playerName in players: players[playerName][0] = playerEmail
    
    print(f"Session and Player Data for {teamID} in {season}")

    for s in holds:
        print("Session " + str(s))

    for p in players:
        print(p)
        for sesh in players[p][1]:
            print(sesh)
            print(holds[sesh][p])
        print('')

    print(f'Device Data for {teamID} in {season}')
    for d in devices:
        print(f'{d} tracks {devices[d]}')
    print('')
    
    def select(playerName):
        return Player(playerName)
  # use select to grab player object s.t you can query specific stats 


# METHODS TO CREATE CSV FILES THAT ALIGN DIRECTLY WITH THE OUR RELATIONS; SHOULD BE REALLY EASY TO USE THESE CSVs TO POPULATE POSTGRES DATABASE
    def createPlayers():
        with open("players.csv", mode='w') as toWrite:
            fields = ['name', 'email', 'class']
            writer = csv.DictWriter(toWrite, fieldnames=fields)
            writer.writeheader()
            for p in players:
                data = players[p]
                writer.writerow({'name':p, 'email':data[0], 'class':data[0][len(data[0])-14:len(data[0])-12]})
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
            fields = ['email', 'date', 'teamID']
            writer = csv.DictWriter(toWrite, fieldnames=fields)
            writer.writeheader()
            for p in players:
                seen = {}
                for s in players[p][1]:
                    if s[0] not in seen:
                        seen[s[0]] = 1
                        writer.writerow({'email':players[p][0],'date':s[0], 'teamID':teamID})

    def createTracks():
        with open("tracks.csv", mode='w') as toWrite:
            fields = ['deviceID', 'email', 'season']
            writer = csv.DictWriter(toWrite, fieldnames=fields)
            writer.writeheader()
            for d in devices:
                curData = devices[d]
                writer.writerow({'deviceID': d, 'email': curData[0], 'season':curData[2]})

    def createRecordsStatsOn():
        with open("recordsStatsOn.csv", mode='w') as toWrite:
            fields = ['deviceID', 'email', 'date', 'teamID', 'distance', 'sprintDistance', 'energy', 'playerLoad', 'topSpeed', 'distancePerMin']
            writer = csv.DictWriter(toWrite, fieldnames=fields)
            writer.writeheader()
            for d in devices:
                curPlayerName, curPlayerEmail = devices[d][1], devices[d][0]
                seen = {}
                for s in players[curPlayerName][1]:
                    if s[0] not in seen:
                        seen[s[0]] = 1
                        if curPlayerName in holds[s]:
                            distance, sprintDistance, energy, playerLoad, topSpeed, distancePerMin = holds[s][curPlayerName]
                            writer.writerow({'deviceID':d, 'email':curPlayerEmail, 'date':s[0], 'teamID':teamID, 'distance':distance, 'sprintDistance':sprintDistance, 'energy':energy, 'playerLoad':playerLoad, 'topSpeed':topSpeed, 'distancePerMin':distancePerMin})
        
            # stats per player, per session (where each player has identifying deviceID and email, each session has identifying date and teamID)
    def createDevices():
        with open("devices.csv", mode='w') as toWrite:
            fields = ['deviceID']
            writer = csv.DictWriter(toWrite, fieldnames=fields)
            writer.writeheader()
            for d in devices:
                writer.writerow({'deviceID': d})
    


    createPlayers()
    createSessions()
    createHolds()                
    createParticipatesIn()
    createTracks()
    createRecordsStatsOn()
    createDevices()

createSessionPlayerRelations("TEST STATS.csv", "Pod Pairing.csv", "MSOC", "Fall23")





