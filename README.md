TENTATIVE DEMO: https://www.youtube.com/watch?v=_mZWCqqsEX4


QUERY OVERVIEW: 
API Query Support (see /Backend/server.js)

The backend server has endpoints that support basic, straightforward SELECT, INSERT, and UPDATE queries.

SELECT format: `SELECT ${field} FROM ${table} WHERE ${condition};`;
INSERT format: `INSERT INTO ${table} ${field} VALUES ${values} WHERE ${condition};`;
UPDATE format: `UPDATE ${table} SET ${field}=${values} WHERE ${condition};`;
Subject to change given various request parameters as indicated in string literal above 

It also has an endpoint that supports more complex queries; this endpoint is called with a full custom query given as a request parameter. 



Session Specific Queries 

SELECT date, sessionid, type FROM session;

SELECT date, sessionid, type FROM session WHERE date ILIKE '%_Month_Day_Year%';

SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson WHERE sessionid = `_sessionid`;


const relevantSessions = `SELECT sessionid FROM session WHERE type = '${sessionType}'`;

const averagesQuery = `SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson WHERE email = '${playerEmail}' AND sessionid IN (${relevantSessions});`



Player Specific Queries 

SELECT name, email FROM player;

SELECT name, email FROM player WHERE name ILIKE '%_name%';

SELECT distance, sprintdistance, energy, topspeed, playerload FROM recordsstatson WHERE email = 'nameClass@amherst.edu' AND sessionid = 'xxxxx';

`SELECT session.date, distance, sprintdistance, topspeed, energy, playerload FROM recordsstatson JOIN session ON recordsstatson.sessionid = session.sessionid WHERE email = '${playerEmail}';` 

The player and session specific queries are used throughout the app to compile comprehensive player data on a per-session and per-season basis; that data is then further filtered (according to user input, if any) using queries that retrieve the relevant players/sessions. 



Leaderboard Queries  

For a given stat: 

SELECT R.email, R.stat FROM recordsstatson R WHERE R.stat = (SELECT MAX(stat) FROM recordsstatson WHERE email = R.email) ORDER BY R.stat DESC;

Queried for each relevant stat (distance, sprintdistance, energy, playerload, topspeed, distanceperminute)

`SELECT R.email, AVG(R.${stat}) AS ${stat} FROM recordsstatson R WHERE (SELECT S.type FROM session S WHERE S.sessionid = R.sessionid) = '${filter}' GROUP BY R.email ORDER BY ${stat} DESC;`



Insert Queries 

As user-inputs are parsed, our app performs basic insert queries populating the relevant relations

In the instance of a CSV input with session data: 

INSERT INTO session (sessionid, type, date) VALUES (${s},${session[`${s}`][1]}, ${session[`${s}`][0]});

INSERT INTO holds (teamid, sessionid) VALUES (${teamid}, ${s});

INSERT INTO participatesin (email, sessionid, teamid) VALUES (${p.email}, ${s}, ${teamid});

INSERT INTO recordsstatson (deviceid, email, sessionid, teamid, distance, sprintdistance, energy, playerload, topspeed, distancepermin) 
VALUES (${p.deviceid}, ${p.email}, ${s}, ${teamid}, ${p.distance*1000*metersToYards}, ${p.sprintdistance*metersToYards}, ${p.energy}, ${p.playerload},${p.topspeed*mpsTOmph}, ${p.distancepermin*metersToYards});












