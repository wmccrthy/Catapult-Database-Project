// ESSENTIALLY A TABLE MIRRORING THE PLAYER RELATION IN OUR DB (HAS INPUT FOR FILTERING BY NAME)
// SELECTING A PLAYER PROMPTS A WINDOW WITH MORE IN DEPTH LOOK AT THAT PLAYER'S STATS -> OUTPUTS recordsStatsOn relation data where email == selectedPlayer.email 
// FOR SELECTED SESSION OF IN QUERYSESSION COMPONENT

import React from "react";
import { useState, useEffect } from "react";
import PlayerSessionStats from "./PlayerSessionStats";
import { motion } from "framer-motion";

const QueryPlayer = (props) => {
    const teamID = props.team;
    const [nameFilter, setFilter] = useState("");
    const [playerList, setPlayerList] = useState([]);
    const [display, setDisplay] = useState(props.defData);
    const seshType = props.type;
    const session = props.session;
    const sessionDate = props.date;
    const radarRange = [-0.5, 0.0]

    const getPlayers = async (allPlayers = false) => {
        try {
            var query = `SELECT name, email FROM player WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
            if (allPlayers) {
                // var condition = `email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
                var query = `SELECT name, email FROM player WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
            } else {
                // if (nameFilter.length >= 1) {
                //     var query = `SELECT name, email FROM player WHERE name ILIKE ${nameFilter} AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
                //     // var condition = `name ILIKE ${nameFilter} AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
                // } 
            }
            // console.log(query)
            // var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=player&field=name, email&condition=${condition}`);
            console.log(query)
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${query}`);
            const playerData = await response.json()
            console.log(playerData)
            setPlayerList(playerData);
            return playerData;
        } catch(err) {
            console.log(err)
        }
    }

    const getSessionAverages = async () => {
        const averagesQuery = `SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson WHERE sessionid = '${session}' AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}');`
        try {
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${averagesQuery}`);
            const averageData = await response.json();
            averageData[0].email = `${sessionDate} average`;
            console.log(averageData)
            return averageData[0];
        } catch(err) {
            console.error(err)
        }
    }
    
    // get players average stats for given session type (game or training)
    const getPlayerAverages = async (playerEmail, playerName, sessionType) => {
        sessionType = sessionType.replace(" ", "").replace("\n", "")
        const relevantSessions = `SELECT sessionid FROM session WHERE type = '${sessionType}'`;
        const averagesQuery = `SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson WHERE email = '${playerEmail}' AND sessionid IN (${relevantSessions}) AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}');`
        try {
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${averagesQuery}`);
            // var testres = await fetch(`http://localhost:4000/custom?query=${relevantSessions}`);
            // const testD = await testres.json();
            // console.log(testres)
            const averageData = await response.json();
            averageData[0].email = `${playerName} ${sessionType} avg`;
            // console.log(averageData)
            return averageData[0];
        } catch(err) {
            console.error(err)
        }
    }

    // CALLED GETPLAYERS UPON INITIAL RENDERING SUCH THAT PLAYERLIST IS POPULATED ON SCREEN
    useEffect (() => {
        getPlayers();
    }, [])


    // GET PLAYER STATS FUNCTION THAT QUERIES RECORDSSTATSON RELATION ACCORDING TO SESSION PROP AND (PLAYER EMAIL)
    const getPlayerStats = async (playerEmail, session) => {
        try {
            // console.log("working")
            const condTest = `email = '${playerEmail}' AND sessionid = '${session}'`
            // console.log(condTest)
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=recordsstatson&field=distance, sprintdistance, energy, topspeed, playerload&condition=${condTest}`);
            const playerData = await response.json();
            // console.log(playerData);
            return playerData;
            // setPlayerList(playerData)
        } catch(err) {
            console.log(err)
        }
    }

    // APPLIES FILTRATION TO PLAYER LIST BASED ON NAME INPUT
    const filterList = () => {
        playerList.map(player => (
            <tr className="border-b bg-gray-900 border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">{player.name}</th>
                <td className="px-6 py-4">{player.email}</td>
                <td className="px-6 py-4 flex"><button  onClick={async function () {
                                    var statArr = await getPlayerStats(player.email, session);
                                    var avgStatArr = await getSessionAverages();
                                    var playerAvgArr = await getPlayerAverages(player.email, player.name);
                                    setDisplay(<PlayerSessionStats stats={statArr} averages={avgStatArr} pAverages={playerAvgArr} name={player.name} date={sessionDate}></PlayerSessionStats>);
                                    console.log(display)
                                    // need to render new table displaying stats (new component)
                }}>View Stats</button></td>
            </tr>
        ))
        setDisplay(<div></div>);
    }

    // FIX THESE 
    const getPlayerOverview = async (playerEmail, playerName) => {
        console.log('test')
        const teamQuery = `SELECT ((SUM(mp)/50.0)/(SELECT COUNT(DISTINCT(email)) FROM participatesin WHERE teamid = '${teamID}' AND sessionid = '${session}')) as minutesPlayed, (SUM(distance)/(SUM(mp)*50.0)) as distancePerMP,  ((SUM(sh)*1.0)/(SELECT COUNT(DISTINCT(email)) FROM participatesin WHERE teamid = '${teamID}' AND sessionid = '${session}')) as shots, ((SUM(sog)*1.0)/SUM(sh)) as accuracy FROM recordsstatson WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') AND sessionid = '${session}' AND mp IS NOT NULL AND mp > 35`
        const playerQuery = `SELECT (mp/50.0) as minutesPlayed, ((distance/mp)/50.0) as distancePerMP, ((sog*1.0)/(NULLIF(sh, 0))) as accuracy, (sh) as shots FROM recordsstatson WHERE email = '${playerEmail}' AND sessionid = '${session}'`
        try {
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${teamQuery}`);
            const averageData = await response.json();
            averageData[0].name = "team average performance"
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${playerQuery}`);
            const playerData = await response.json();
            playerData[0].name = `${playerName} performance`
            // console.log(averageData);
            // console.log(playerData);
            // create new array with 
            var reformatted = []
            let i = 0;
            for (var prop in averageData[0]) {
                console.log(prop)
                if (prop != "name") {
                    reformatted.push({})
                    reformatted[i].stat = prop
                    reformatted[i].teamValue = averageData[0][prop]
                    reformatted[i].playerValue = playerData[0][prop] == null ? 0 : playerData[0][prop];
                    radarRange[0] = Math.min(radarRange[0], reformatted[i].playerValue)
                    radarRange[1] = Math.max(radarRange[1], reformatted[i].teamValue, reformatted[i].playerValue)
                    i += 1
                }
            }
            console.log(radarRange)
            console.log(reformatted)
            return reformatted
            // return Array.prototype.concat(averageData, playerData);
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <motion.div className="flex flex-col content-center items-center w-full">
            {/* <input id="playerInp" className="w-full h-8 text-s text-center bg-gray-700 text-gray-400 outline-none" type="text" placeholder="Enter Player Name" onChange={function (e) {
                setFilter(e.target.value);
                console.log(e);
                console.log(nameFilter)
                getPlayers();
                filterList();
            }} onKeyUp={function () {
                setFilter(document.querySelector("#playerInp"));
                getPlayers();
                filterList();
            } } /> */}
    
            <div className="max-h-64 w-full overflow-y-auto">
                <table className="w-full text-sm text-left  text-gray-400">
                    <thead className="text-xs  uppercase  bg-gray-700 text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {sessionDate} Stats
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerList.map(player => (
                            <tr className="border-b bg-gray-900 border-gray-700">
                                <th scope="row" className="py-1 sm:px-6 sm:py-4  font-medium  whitespace-nowrap text-white">{player.name}</th>
                                <td className="py-1 sm:px-6 sm:py-4 ">{player.email}</td>
                                <td className="py-1 sm:px-6 sm:py-4 flex"><button  onClick={async function () {
                                    var statArr = await getPlayerStats(player.email, session);
                                    var avgStatArr = await getSessionAverages();
                                    var playerAvgArr = await getPlayerAverages(player.email, player.name, seshType);
                                    var seshOverview = await getPlayerOverview(player.email, player.name);
                                    setDisplay(<PlayerSessionStats type={seshType} overview={seshOverview} range={radarRange} stats={statArr} averages={avgStatArr} pAverages={playerAvgArr} name={player.name} date={sessionDate}></PlayerSessionStats>);
                                    console.log(display)
                                    // need to render new table displaying stats (new component)
                                }}>View Stats</button></td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            </div>
            <div className="w-full flex content-center justify-center">
                {display}
            </div>
        </motion.div>
        ) 
    }

    


export default QueryPlayer;