// ESSENTIALLY A TABLE MIRRORING THE PLAYER RELATION IN OUR DB (HAS INPUT FOR FILTERING BY NAME)
// SELECTING A PLAYER PROMPTS A WINDOW WITH MORE IN DEPTH LOOK AT THAT PLAYER'S STATS -> OUTPUTS recordsStatsOn relation data where email == selectedPlayer.email 
// FOR ALL SESSIONS THROUGHOUT A SEASON
// 
import { useState, useEffect } from "react";
import React from "react";
// import PlayerSessionStats from "./PlayerSessionStats";
import PlayerSeasonStats from "./PlayerSeasonStats";

const QueryPlayerAll = (props) => {
    const [nameFilter, setFilter] = useState("");
    const [playerList, setPlayerList] = useState([]);
    const [display, setDisplay] = useState(props.defData);
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
            setPlayerList(playerData);
            return playerData;
        } catch(err) {
            console.log(err)
        }
    }

    // create array of player stats across all sessions 
    const getSeasonStats = async (playerEmail, sessionList) => {
        var seasonStats = []
        for (let session of sessionList) {
            var seshData = await getPlayerStats(playerEmail.replace("'", ""), session.sessionid.replace("'", ""));
            console.log(seshData)
            if (seshData.length > 0) {
                var toAdd = seshData[0];
                toAdd.date = session.date;
                seasonStats.push(toAdd);
            }   
        }
        return seasonStats;
    }
    
    // get player stats from one session
    const getPlayerStats = async (playerEmail, session) => {
        try {
            const condTest = `email = '${playerEmail}' AND sessionid = '${session}'`
            var response = await fetch(`http://localhost:4000/select?table=recordsstatson&field=distance, sprintdistance, energy, topspeed, playerload&condition=${condTest}`);
            const playerData = await response.json();
            return playerData;
        } catch(err) {
            console.log(err)
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
            averageData[0].date = `${playerName} ${sessionType} avg`;
            // console.log(averageData)
            return averageData[0];
        } catch(err) {
            console.error(err)
        }
    }
    
    // get all sessions 
    const getSessions = async () => {
        try {
            const condTest = `date ILIKE ${''} ORDER BY sessionid`
            // var response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type`);
            // if (sessionFilter.replace(" ", "").length >= 1) {
            //     response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type&condition=${condTest}`);
            // } 
            var response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type&condition=${condTest}`);
            const sessionData = await response.json()
            console.log(sessionData)
            return sessionData;
        } catch(err) {
            console.log(err)
        }
    }
    
    // CALLED GETPLAYERS UPON INITIAL RENDERING SUCH THAT PLAYERLIST IS POPULATED ON SCREEN
    useEffect (() => {
        getPlayers();
    }, [])


    

    // APPLIES FILTRATION TO PLAYER LIST BASED ON NAME INPUT
    const filterList = () => {
        playerList.map(player => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{player.name}</th>
                <td className="px-6 py-4">{player.email}</td>
                <td className="px-6 py-4 flex"><button  onClick={async function () {
                                // var statArr = await getPlayerStats(player.email, session);
                                var sessionArr = await getSessions();
                                var seasonStatArr = await getSeasonStats(player.email, sessionArr);
                                var trainingAvg = await getPlayerAverages(player.email, player.name, "training")
                                var gameAvg = await getPlayerAverages(player.email, player.name, "game");
                                var avgData = []
                                avgData.push(gameAvg)
                                avgData.push(trainingAvg)
                                setDisplay(<PlayerSeasonStats averages={avgData} stats={seasonStatArr} name={player.name} date={sessionDate}></PlayerSeasonStats>);
                                // need to render new table displaying stats (new component)
                }}>View Stats</button></td>
            </tr>
        ))
        setDisplay(<div></div>);
    }



    return (
        <div id="cont" className="flex flex-col content-center items-center w-full border border-gray-700 rounded-md">
            <h3 className="w-full text-center p-1 bg-gray-50 dark:bg-gray-800 text-white font-bold text-lg rounded-t-md">Player Season Data</h3>
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
    
            <div className="max-h-96 w-full overflow-y-scroll">
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
                                Season Stats
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerList.map(player => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{player.name}</th>
                                <td className="px-6 py-4">{player.email}</td>
                                <td className="px-6 py-4 flex"><button  onClick={async function () {
                                    // var statArr = await getPlayerStats(player.email, session);
                                    var sessionArr = await getSessions();
                                    var seasonStatArr = await getSeasonStats(player.email, sessionArr);
                                    var trainingAvg = await getPlayerAverages(player.email, player.name, "training");
                                    var gameAvg = await getPlayerAverages(player.email, player.name, "game");
                                    var avgData = []
                                    avgData.push(gameAvg)
                                    avgData.push(trainingAvg)
                                    setDisplay(<PlayerSeasonStats averages={avgData} stats={seasonStatArr} name={player.name} date={sessionDate}></PlayerSeasonStats>);
                                    // need to render new table displaying stats (new component)
                                }}>View Stats</button></td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            </div>
            <div className="w-full flex content-center justify-center ">
                {display}
            </div>
        </div>
        ) 
    }

    

export default QueryPlayerAll;