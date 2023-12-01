// ESSENTIALLY A TABLE MIRRORING THE PLAYER RELATION IN OUR DB (HAS INPUT FOR FILTERING BY NAME)
// SELECTING A PLAYER PROMPTS A WINDOW WITH MORE IN DEPTH LOOK AT THAT PLAYER'S STATS -> OUTPUTS recordsStatsOn relation data where email == selectedPlayer.email 
// FOR SELECTED SESSION OF IN QUERYSESSION COMPONENT

import { useState, useEffect } from "react";
import React from "react";
import PlayerSessionStats from "./PlayerSessionStats";
import { motion } from "framer-motion";

const QueryPlayer = (props) => {
    const [nameFilter, setFilter] = useState("");
    const [playerList, setPlayerList] = useState([]);
    const [display, setDisplay] = useState(props.defData);
    const seshType = props.type;
    const session = props.session;
    const sessionDate = props.date;

    // UPDATES PLAYER LIST STATE VARIABLE TO REPRESENT THE PLAYER LIST FILTERED BY NAME INPUT (QUERIES THE PLAYER TABLE OF DATABASE)
    const getPlayers = async (allPlayers = false) => {
        try {
            if (allPlayers) {
                var response = await fetch(`http://localhost:4000/select?table=player&field=name, email`);
            } else {
                const condTest = `name ILIKE ${nameFilter}`
                var response = await fetch(`http://localhost:4000/select?table=player&field=name, email`);
                if (nameFilter.replace(" ", "").length >= 1) {
                    response = await fetch(`http://localhost:4000/select?table=player&field=name, email&condition=${condTest}`);
                } 
            }
            const playerData = await response.json()
            console.log(playerData)
            setPlayerList(playerData)
            return playerData;
        } catch(err) {
            console.log(err)
        }
    }

    const getSessionAverages = async () => {
        const averagesQuery = `SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson WHERE sessionid = '${session}';`
        try {
            var response = await fetch(`http://localhost:4000/custom?query=${averagesQuery}`);
            const averageData = await response.json();
            averageData[0].email = "session average";
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
        const averagesQuery = `SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson WHERE email = '${playerEmail}' AND sessionid IN (${relevantSessions});`
        try {
            var response = await fetch(`http://localhost:4000/custom?query=${averagesQuery}`);
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
            var response = await fetch(`http://localhost:4000/select?table=recordsstatson&field=distance, sprintdistance, energy, topspeed, playerload&condition=${condTest}`);
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
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{player.name}</th>
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



    return (
        <motion.div className="flex flex-col content-center items-center w-full">
            <input id="playerInp" className="w-full h-8 text-s text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 outline-none" type="text" placeholder="Enter Player Name" onChange={function (e) {
                setFilter(e.target.value);
                console.log(e);
                console.log(nameFilter)
                getPlayers();
                filterList();
            }} onKeyUp={function () {
                setFilter(document.querySelector("#playerInp"));
                getPlayers();
                filterList();
            } } />
    
            <div className="max-h-64 w-full overflow-y-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
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
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{player.name}</th>
                                <td className="px-6 py-4">{player.email}</td>
                                <td className="px-6 py-4 flex"><button  onClick={async function () {
                                    var statArr = await getPlayerStats(player.email, session);
                                    var avgStatArr = await getSessionAverages();
                                    var playerAvgArr = await getPlayerAverages(player.email, player.name, seshType);
                                    setDisplay(<PlayerSessionStats stats={statArr} averages={avgStatArr} pAverages={playerAvgArr} name={player.name} date={sessionDate}></PlayerSessionStats>);
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