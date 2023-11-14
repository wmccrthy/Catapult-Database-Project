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
                var toAdd = {} 
                toAdd.date = session.date;
                toAdd.distance = seshData[0].distance;
                toAdd.sprintdistance = seshData[0].sprintdistance;
                toAdd.energy = seshData[0].energy;
                toAdd.playerload = seshData[0].playerload;
                toAdd.topspeed = seshData[0].topspeed;
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
    
    // get all sessions 
    const getSessions = async () => {
        try {
            var response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type`);
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
                                setDisplay(<PlayerSeasonStats stats={seasonStatArr} name={player.name} date={sessionDate}></PlayerSeasonStats>);
                                // need to render new table displaying stats (new component)
                }}>View Stats</button></td>
            </tr>
        ))
        setDisplay(<div></div>);
    }



    return (
        <div className="flex flex-col content-center items-center w-3/5 border border-gray-700">
            <h3 className="w-full text-center p-1 bg-gray-50 dark:bg-gray-800 text-white font-bold text-lg rounded-t-md border border- border-gray-700">Player Season Data</h3>
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
                                    setDisplay(<PlayerSeasonStats stats={seasonStatArr} name={player.name} date={sessionDate}></PlayerSeasonStats>);
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