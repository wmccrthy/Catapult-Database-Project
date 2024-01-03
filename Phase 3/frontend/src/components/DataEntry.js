import React from "react"
import { useState } from "react" 
import Papa from "papaparse";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

// - input file field to upload csv 

// - use csv-parser to parse inputted csv

// - from parsed csv, grab relevant fields (player name, distance, sprint distance, energy, playerload, top speed, distance/min)
//      - how do we get email? deviceid pairing? 
//      - 

// ask for admin password before allowing file upload 


const DataEntry = (props) => {
    const metersToYards = 1.09361;
    const mpsTOmph  = 2.23694;
    const [data, setData] = useState([])
    const [status1, setStatus1] = useState(0);
    const [show1, setShow1] = useState(false);
    const [status2, setStatus2] = useState(0);
    const [show2, setShow2] = useState(false);

    // const [date, setDate] = useState("")
    // const [teamid, setTeamid] = useState('')
    const teamid = `'${props.team}'`

    const handleFileUpload = async (e) => {
        const dataFile = e.target.files[0]
        console.log(dataFile);
        await Papa.parse(dataFile, {
            header: true, 
            complete: (results) => {
                console.log(results.data)
                setData(results.data);
            }
        })
    };


    const parseTechData = async (data) => {
        var curStatus = 0;
        setStatus2(curStatus);
        setShow2(true);
        // parse given data to update recordsstatson relation w technical performance data (goals, assists, shots, sog)
        // use format: 
            // UPDATE table_name
            // SET column1 = value1, column2 = value2, ...
            // WHERE condition;
        // uploaded file should be of format: 
        // Name (sep. by comma), Shots, Shots on goal, goals, assists, minutes played 
        // extract row -> update players recordsstatson entry
        console.log(data) 
        var queries = []
        for (let row of data) {
            // goals, assists, shots, shots on goal, minutes played
            console.log(row)
            var g = row.G
            var a = row.A
            var sh = row.SH
            var sog = row.SOG
            var mp = row.MIN
            var name = row.Player.split(",")
            var tmp = name[0]; name[0] = name[1]; name[1] = tmp;
            var date = row.DATE
            // if (row.Date != null) { setDate(row.Date)}
            name[0] = name[0].replace(" ", "")
            name = name.join(" ")
            console.log(name)
            name = name.replace("'", "")
            // `IF EXISTS (SELECT * FROM recordsstatson WHERE email = (SELECT p.email FROM player p WHERE p.name = '${name}') AND sessionid = (SELECT s.sessionid FROM session s WHERE s.date = '${date}')) BEGIN (update) END ELSE BEGIN (insert) END`
            // need to insert to participates in first
            var insertParticipates = `INSERT INTO participatesin (email, sessionid, teamid) VALUES ((SELECT p.email FROM player p WHERE p.name = '${name}'), (SELECT s.sessionid FROM session s WHERE s.date = '${date}'), ${teamid});`
            var insertRec = `INSERT INTO recordsstatson (deviceid, email, sessionid, teamid, g, a, sh, sog, mp) VALUES ((SELECT t.deviceid FROM tracks t WHERE t.email = (SELECT p.email FROM player p WHERE p.name = '${name}')), (SELECT p.email FROM player p WHERE p.name = '${name}'), (SELECT s.sessionid FROM session s WHERE s.date = '${date}'), ${teamid}, ${g}, ${a}, ${sh}, ${sog}, ${mp})`
            var update = `UPDATE recordsstatson SET g = ${g}, a = ${a}, sh = ${sh}, sog = ${sog}, mp = ${mp} WHERE email = (SELECT p.email FROM player p WHERE p.name = '${name}') AND sessionid = (SELECT s.sessionid FROM session s WHERE s.date = '${date}')`
            var query = [[insertParticipates, insertRec], update]
            queries.push(query)
        }

        for (let pair of queries) {
            try {
                    var participatesQ = pair[0][0]
                    var recQ = pair[0][1]
                    var ins = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/customInsert?query=${participatesQ}`, {
                        method: "POST"
                    })
                    var success = await ins.json()
                    var ins = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/customInsert?query=${recQ}`, {
                        method: "POST"
                    })
                    var success = await ins.json()
                    console.log(success)
                } catch (err) {
                    // if insert fails (indicating that existing record does exist (player did wear GPS on given day, so update record instead))
                    try {
                        var update = pair[1]
                        var ins = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/customInsert?query=${update}`, {
                        method: "POST"
                        })
                        var success = await ins.json()
                    } catch (err) {
                        console.error(err)
                    }
                    console.error(err)
            }
            
            curStatus += 100/queries.length;
            setStatus2(curStatus);
        }
        // all we want to do is update the row in recordsstatson associated with the player on the given date (if player didn't wear gps that day, sorry)
        // UPDATE recordsstatson
        // SET g = ${extractedGoals}, SET a = ${extractedAssists}, SET sh = ${extractedShots}, SET SOG = ${extractedSOG}
        // WHERE (SELECT p.name FROM player p WHERE p.email = email) AND date = ${date}

        // I want status bar to be displayed while this function is still running (data still uploading), terminate that bar's presence here 
        setShow2(false)
    }

    const parseGPSData = async (data) => {
        var curStatus = 0;
        setStatus1(curStatus);
        setShow1(true);
        // parse given data into proper format 
        // 1. extract relevant info 
        //      - fortunately, data is passed as JSON so we can simply retrieve relevant attributes 
        //      - relevant attributes: (attributeInJson, attributeInDB)
        //              - Date: sessionid, Session Title: date, Player Name: name, Distance (km): distance, Distance Per Min (m/min): distancepermin 
        //              - Energy (kcal): energy, Player Load: playerload, Sprint Distance (m): sprintdistance, Tags: type, Top Speed (m/s): topspeed
        
        // have dictionary for:
        //      - sessions (sessionid: date ,type, list of players who participated)
        //      - players (name: stats)

        const session = {}
        //first fill session relation, then holds relation, then participatesIn, then recordsstatson
    
        for (let row of data) {
            var sessionid = `'${row.Date}'`
            if (sessionid.length === 0 | row.Tags === undefined) { continue }
            var type = row.Tags.replace(" ","").replace("\n", "")
            type = `'${type}'`
            var date = `'${row["Session Title"]}'`
            if (session[`${sessionid}`] == null) {
                session[`${sessionid}`]= [date, type, []]
            }
            if (row["Split Name"] === 'all') {
                var player = {}
                player.name = `'${row["Player Name"].replace("'", "")}'`
                try {
                    var fetchEmail = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=player&field=email&condition=name = ${player.name}`)
                    var getEmail = await fetchEmail.json();
                    player.email = `'${getEmail[0].email}'`;
                    var fetchDevice = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=tracks&field=deviceid&condition=email = ${player.email}`)
                    var getDevice = await fetchDevice.json()
                    player.deviceid = `'${getDevice[0].deviceid}'`;
                } catch(err) {
                    console.log(err)
                } 
                player.distance = row["Distance (km)"]
                player.sprintdistance = row["Sprint Distance (m)"]
                player.energy = row["Energy (kcal)"]
                player.distancepermin = row["Distance Per Min (m/min)"]
                player.topspeed = row["Top Speed (m/s)"]
                player.playerload = row["Player Load"]
                session[`${sessionid}`][2].push(player)
            }
        }
        // console.log(session)    
        var sessionQueries = []
        var holdsQueries = []
        var participatesQueries = []
        var recordsQueries = []
        for (var s in session) {
            sessionQueries.push(`INSERT INTO session (sessionid, type, date) VALUES (${s},${session[`${s}`][1]}, ${session[`${s}`][0]});`)
            holdsQueries.push(`INSERT INTO holds (teamid, sessionid) VALUES (${teamid}, ${s});`)
            for (var p of session[`${s}`][2]) {
                participatesQueries.push(`INSERT INTO participatesin (email, sessionid, teamid) VALUES (${p.email}, ${s}, ${teamid});`)
                recordsQueries.push(`INSERT INTO recordsstatson (deviceid, email, sessionid, teamid, distance, sprintdistance, energy, playerload, topspeed, distancepermin) VALUES (${p.deviceid}, ${p.email}, ${s}, ${teamid}, ${p.distance*1000*metersToYards}, ${p.sprintdistance*metersToYards}, ${p.energy}, ${p.playerload},${p.topspeed*mpsTOmph}, ${p.distancepermin*metersToYards});`)
            }
        }
        var div = 100/(sessionQueries.length + holdsQueries.length + participatesQueries.length + recordsQueries.length)

        for (var q of sessionQueries) {
            console.log(q)
            try {
                var ins = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/customInsert?query=${q}`, {
                    method: "POST"
                })
                var success = await ins.json()
                console.log(success)
            } catch (err) {
                console.error(err)
            }
            curStatus += div;
            setStatus1(curStatus)
        }
        for (var q of holdsQueries) {
            try {
                var ins = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/customInsert?query=${q}`, {
                    method: "POST"
                })
                var success = await ins.json()
                console.log(success)
            } catch (err) {
                console.error(err)
            }
            curStatus += div;
            setStatus1(curStatus)
        }
        for (var q of participatesQueries) {
            try {
                var ins = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/customInsert?query=${q}`, {
                    method: "POST"
                })
                var success = await ins.json()
                console.log(success)
            } catch (err) {
                console.error(err)
            }
            curStatus += div;
            setStatus1(curStatus)
        }
        for (var q of recordsQueries) {
            try {
                var ins = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/customInsert?query=${q}`, {
                    method: "POST"
                })
                var success = await ins.json()
                console.log(success)
            } catch (err) {
                console.error(err)
            }
            curStatus += div;
            setStatus1(curStatus)
        }
        // for session: 
        //      - add sessions w session[0] (date), session[1] (type) 
        // for holds:
        //      - add sessions in session object w teamID hook var as teamid 
        // for participates in:
        //      - add player email, sessionid, teamid for each session and each player in that
        // for records stats on:
        //      - add player email, device id, all stats, sessionid 
        // REMEMBER convert units 
        //      - assuming passed data is directly from catapult csv export, distance will be in KM, sprint distance in meters, and top speed in m/s
        //      - we want to convert the following: distance/sprintdistance/distancepermin (yards), top speed (mph)


        // I want status bar to be displayed while this function is still running (data still uploading), terminate that bar's presence here 
        setShow1(false);
    }

    const parsePlayerAddition = async () => {
        const inputs = document.querySelector("#player-inp").querySelectorAll("input")
        var pName = inputs[0].value
        var pEmail = inputs[1].value
        var dID = inputs[2].value 
        var season = inputs[3].value 
        if (pName.replace(" ", "").length == 0 | pEmail.replace(" ", "").length == 0 | dID.replace(" ", "").length == 0 | season.replace(" ", "").length == 0) {
            alert("Cannt add null inputs")
            return;
        }
        var queries = []
        var playerQuery = `INSERT INTO player (email, name) VALUES ('${pEmail}', '${pName}')`; var deviceQuery = `INSERT INTO device (deviceid) VALUES ('${dID}')`; var tracksQuery = `INSERT INTO tracks (deviceid, email, season) VALUES ('${dID}', '${pEmail}', '${season}')`;
        queries.push(playerQuery, deviceQuery, tracksQuery)
        for (var q of queries) {
            try {
                var insert = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/customInsert?query=${q}`, {
                    method: "POST"
                })
                var success = await insert.json()
                console.log(success)
            } catch (err) {
                console.error(err)
            }
        }        
    }

    return (
        <motion.div initial={{opacity: 0.25, scale: .5}} animate={{opacity:1, scale:1}} transition={{duration:0.5}} className="flex p-4 rounded-md flex-col items-center content-center">
            <div className="mb-10 flex flex-col items-center">
                <h5 className="text-white text-center">Upload {teamid.replaceAll("'", "")} Session Data</h5>
                <div className="flex items-center gap-2 text-white font-light">
                    <input type="file" accept=".csv" onInput={async function (e) {
                        await handleFileUpload(e)
                        // console.log(data)
                    }} className="w-1/8  text-s  text-gray-400 outline-none"></input>
                    <button className=" border  text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 hover:brightness-90 transition" onClick={async () => {
                    await parseGPSData(data)
                    }}>Upload</button>
                </div>
               {show1 && <ProgressBar status={status1}></ProgressBar>}

                <h5 className="text-white text-center">Upload {teamid.replaceAll("'", "")} Game Data</h5>
                <div className="flex items-center gap-2 text-white font-light">
                    <input type="file" accept=".csv" onInput={async function (e) {
                        await handleFileUpload(e)
                        // console.log(data)
                    }} className="w-1/8  text-s  text-gray-400 outline-none"></input>
                    <button className="border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 hover:brightness-90 transition" onClick={async () => {
                    await parseTechData(data)
                    }}>Upload</button>
                </div>
                {show2 && <ProgressBar status={status2}></ProgressBar>}
            </div>
            <div id="player-inp" className="flex flex-col items-center gap-2">
                <h6 className="text-center text-white font-light">Add Players</h6>
                <div className="flex items-center gap-2">
                    <input type="text" placeholder="Player Name" className="border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 hover:brightness-90 transition">
                    </input>
                    <input type="text" placeholder="Player Email" className="border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 hover:brightness-90 transition">  
                    </input>
                    <input type="text" placeholder="Paired Device ID" className="border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 hover:brightness-90 transition">
                    </input>
                    <input type="text" placeholder="Season(ex. Fall23)" className="border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 hover:brightness-90 transition">
                    </input>
                </div>
                <button className=" border  text-sm rounded-lg  block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 hover:brightness-90 transition" onClick={async () => {
                    await parsePlayerAddition()
                }}>Add</button>
            </div>
        </motion.div>
        
    )
}

export default DataEntry;