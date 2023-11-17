import React from "react"
import { useState } from "react" 
import Papa from "papaparse";

// - input file field to upload csv 

// - use csv-parser to parse inputted csv

// - from parsed csv, grab relevant fields (player name, distance, sprint distance, energy, playerload, top speed, distance/min)
//      - how do we get email? deviceid pairing? 
//      - 


const DataEntry = (props) => {
    const [data, setData] = useState([])
    const [teamid, setTeamid] = useState('')
    const [sessionRelation, setSessionRelation] = useState()
    const [holdsRelation, setHoldsRelation] = useState()
    const [participatesRelation, setParticipatesRelation] = useState()
    const [recordsStatsRelation, setRecordsStatsRelation] = useState()

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
        setTeamid(document.querySelector("#teamID").value)
    };

    const parseData = async (data) => {
        // parse given data into proper format 
        // 1. extract relevant info 
        //      - fortunately, data is passed as JSON so we can simply retrieve relevant attributes 
        //      - relevant attributes: (attributeInJson, attributeInDB)
        //              - Date: sessionid, Session Title: date, Player Name: name, Distance (km): distance, Distance Per Min (m/min): distancepermin 
        //              - Energy (kcal): energy, Player Load: playerload, Sprint Distance (m): sprintdistance, Tags: type, Top Speed (m/s): topspeed
        // 2. convert units 
        //      - assuming passed data is directly from catapult csv export, distance will be in KM, sprint distance in meters, and top speed in m/s
        //      - we want to convert the following: distance/sprintdistance (yards), top speed (mph)
        //      - formulas: 
        
        // have dictionary for:
        //      - sessions (sessionid: date ,type, list of players who participated)
        //      - players (name: stats)

        const session = {}
        //first fill session relation, then holds relation, then participatesIn, then recordsstatson
    
        for (let row of data) {
            var sessionid = row.Date
            if (sessionid.length == 0) { continue }
            var type = row.Tags.replace(" ","").replace("\n", "")
            var date = row["Session Title"]
            if (session[`${sessionid}`] == null) {
                session[`${sessionid}`]= [date, type, []]
            }
            if (row["Split Name"] == 'all') {
                var player = {}
                player.name = row["Player Name"]
                try {
                    var fetchEmail = await fetch(`http://localhost:4000/select?table=player&field=email&condition=name = '${player.name}'`)
                    var getEmail = await fetchEmail.json();
                    player.email = getEmail[0].email;
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


            // for session: 
            //      - add sessions w session[0] (date), session[1] (type) 
            // for holds:
            //      - add sessions in session object w teamID hook var as teamid 
            // for participates in:
            //      - add player email (retrieve email via SELECT email FROM player WHERE name = player.name), sessionid, teamid for each session and each player in that
            // for records stats on:
            //      - add player email (retrieve email via SELECT email FROM player WHERE name = player.name), device id (retrieve by SELECT deviceid FROM tracks WHERE email = player email), all stats, sessionid 
            
        }
        console.log(session)    

    }

    return (
        <div className="flex p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <input type="file" accept=".csv" onInput={async function (e) {
                handleFileUpload(e)
                console.log(data)
                parseData(data)
            }} className="w-1/8  text-s  text-gray-700  dark:text-gray-400 outline-none"></input>
            <input id="teamID" type="text" placeholder="TeamID (ex. MSOC, WSOC, ...)" className="w-3/5 p-2 text-xs  text-gray-70 dark:text-gray-400 outline-none rounded-md"></input>
        </div>
        
    )
}

export default DataEntry;