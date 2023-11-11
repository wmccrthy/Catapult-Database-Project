// ESSENTIALLY A TABLE MIRRORING THE PLAYER RELATION IN OUR DB (HAS INPUT FOR FILTERING BY NAME)
// SELECTING A PLAYER PROMPTS A WINDOW WITH MORE IN DEPTH LOOK AT THAT PLAYER'S STATS -> OUTPUTS recordsStatsOn relation data where email == selectedPlayer.email 
// FOR SELECTED SESSION OF IN QUERYSESSION COMPONENT

import { useState, useEffect } from "react";
import React from "react";
import PlayerSessionStats from "./PlayerSessionStats";

const QueryPlayer = (props) => {
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
            setPlayerList(playerData)
            return playerData;
        } catch(err) {
            console.log(err)
        }
    }

    const getSessionAverages = async () => {
        const players = await getPlayers(true);
        var divisor = 0;
        const sessionAvgs = {email:"session average", distance:0, sprintdistance:0, energy:0, playerload: 0, topspeed:0}
        for (let p of players) {
            // console.log(p)
            var pStats = await getPlayerStats(p.email.replace("'", ""), session.replace("'", ""));
            if (pStats.length != 0) {
                pStats = pStats[0]
                sessionAvgs.distance += pStats.distance;
                sessionAvgs.sprintdistance += pStats.sprintdistance;
                sessionAvgs.energy += pStats.energy;
                sessionAvgs.playerload += pStats.playerload;
                sessionAvgs.topspeed += pStats.topspeed;
                divisor += 1;
            }
        }
        sessionAvgs.distance /= divisor;
        sessionAvgs.sprintdistance /= divisor;
        sessionAvgs.energy /= divisor;
        sessionAvgs.playerload /= divisor;
        sessionAvgs.topspeed /= divisor;
        return sessionAvgs;
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
                                setDisplay(<PlayerSessionStats stats={statArr} averages={avgStatArr}  name={player.name} date={sessionDate}></PlayerSessionStats>);
                                console.log(display);
                                    // need to render new table displaying stats (new component)
                }}>View Stats</button></td>
            </tr>
        ))
        setDisplay(<div></div>);
    }



    return (
        <div className="flex flex-col content-center items-center w-full">
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
    
            <div className="max-h-64 w-full overflow-y-scroll">
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
                                    setDisplay(<PlayerSessionStats stats={statArr} averages={avgStatArr} name={player.name} date={sessionDate}></PlayerSessionStats>);
                                    console.log(display)
                                    // need to render new table displaying stats (new component)
                                }}>View Stats</button></td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            </div>
            <div className="w-full max-h-32 flex content-center justify-center mb-10">
                {display}
            </div>
        </div>
        ) 
    }

    


export default QueryPlayer;