// PREMISE OF THIS IS THE SAME AS QUERY PLAYER COMPONENT BUT FOR SESSIONS 
// LIST'S ALL SESSIONS -> THEIR TAG -> THEIR SESSION ID (PRETTY MUCH JUST THE SESSION'S RELATION)
// SELECTING A SESSION PROMPTS A WINDOW THAT ALLOWS YOU TO SELECT A PLAYER AND SEE THEIR STATS FOR THAT SESSION (dropdown of players?)
//  - PROMPTS the QueryPlayer component (which takes in session as paramter)
//      - queryPlayer then allows you to select a player from table s.t selecting a player opens little window below row in table with player's stats on that session


import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import React from "react";
import QueryPlayer from "./QueryPlayer";
import SessionGraph from "./SessionGraph"

const getPlayers = async () => {
    try {
        var response = await fetch(`http://localhost:4000/select?table=player&field=name, email`);
        const playerData = await response.json()
        console.log(playerData)
        return playerData;
    } catch(err) {
        console.log(err)
    }
}

// GET PLAYER STATS FUNCTION THAT QUERIES RECORDSSTATSON RELATION ACCORDING TO SESSION PROP AND (PLAYER EMAIL)
const getPlayerStats = async (playerEmail, session) => {
    try {
        // console.log("working")
        const condTest = `email = '${playerEmail}' AND sessionid = '${session}'`
        // console.log(condTest)
        var response = await fetch(`http://localhost:4000/select?table=recordsstatson&field=email, distance, sprintdistance, energy, topspeed, playerload&condition=${condTest}`);
        const playerData = await response.json();
        // console.log(playerData);
        return playerData;
    } catch(err) {
        console.log(err)
    }
}
const allPlayerStats = async (session) => {
    const finalData = []
    const playerList = await getPlayers();
    console.log(playerList);
    for (let player of playerList) {
        finalData.push(await getPlayerStats(player.email, session))
    }
    console.log("Here")
    console.log(finalData)
    return finalData;
}

const QuerySession = () => {
    const [sessionFilter, setFilter] = useState("");
    const [sessionList, setSessionList] = useState([]);
    const [display, setDisplay] = useState(<div></div>)

    // APPLIES FILTRATION TO PLAYER LIST BASED ON NAME INPUT
    const filterList = () => {
        sessionList.map(session => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{session.type}</th>
                                <td className="px-6 py-4">{session.sessionid}</td>
                                <td className="px-6 py-4">{session.date}</td>
                                <td className="px-6 py-4"><button onClick={function () {
                                    // QueryPlayer
                                    setDisplay(<QueryPlayer session={session.sessionid} date={session.date} defData={<div></div>}></QueryPlayer>);
                                }}>View Player Stats</button></td>
                            </tr>
        ))
        setDisplay(<div></div>)
    }

    // UPDATES Session list variable to match user input filtering 
    const getSessions = async () => {
        try {
            const condTest = `date ILIKE ${sessionFilter} ORDER BY sessionid`
            // var response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type`);
            // if (sessionFilter.replace(" ", "").length >= 1) {
            //     response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type&condition=${condTest}`);
            // } 
            var response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type&condition=${condTest}`);
            const sessionData = await response.json()
            console.log(sessionData)
            setSessionList(sessionData)
        } catch(err) {
            console.log(err)
        }
    }

    // CALLED GETPLAYERS UPON INITIAL RENDERING SUCH THAT PLAYERLIST IS POPULATED ON SCREEN
    useEffect (() => {
        getSessions();
    }, [])

    return (
    <div id="cont" className="flex flex-col content-center items-center w-full border  border-gray-700 rounded-md">
        <h3 className="w-full text-center p-1 bg-gray-50 dark:bg-gray-800 text-white font-bold text-lg rounded-t-md">Session Data</h3>
        <input id="sessionInp" className="w-full h-8 text-s text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 outline-none " type="text" placeholder="Month Day Year" onChange={function (e) {
            setFilter(e.target.value);
            console.log(e);
            console.log(sessionFilter);
            getSessions();
            filterList();
        }} onKeyUp={function () {
            setFilter(document.querySelector("#sessionInp"));
            getSessions();
            filterList();
        } } />

        <div className="max-h-96 w-full overflow-y-scroll">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Session_ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Player Stats
                        </th>
                        <th scope="col" className="px-6 py-3">
                            All Stats
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* HAVE TWO BUTTONS WITHIN THE TABLE, ONE PROMPTS SEEING INDIVIDUAL PLAYER STATS
                    //  OTHER PROMPTS SEEING SESSION STATS FOR ALL PLAYERS (IN BAR GRAPH) PER METRIC */}
                    {sessionList.map(session => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{session.type}</th>
                                <td className="px-6 py-4">{session.sessionid}</td>
                                <td className="px-6 py-4">{session.date}</td>
                                <td className="px-6 py-4"><button onClick={function () {
                                    // QueryPlayer
                                    setDisplay(<QueryPlayer type={session.type} session={session.sessionid} date={session.date} defData={<div></div>}></QueryPlayer>)
                                    console.log(display)
                                }}>View Player Stats</button></td>
                                <td className="px-6 py-4">
                                    <button onClick={async function () {
                                        // QueryPlayers
                                        var list = await allPlayerStats(session.sessionid);
                                        console.log(list);
                                        const formatList = [];
                                        for (let row of list) {
                                            console.log(row[0]);
                                            if (row[0] != null) {
                                                formatList.push({
                                                    email: row[0].email.replace("@amherst.edu", ""),
                                                    distance: row[0].distance,
                                                    sprintdistance: row[0].sprintdistance,
                                                    topspeed: row[0].topspeed,
                                                    energy: row[0].energy, 
                                                    playerload: row[0].playerload
                                                })
                                            }
                                        }
                                        console.log(formatList);
                                        var graphW = document.querySelector("#cont").offsetWidth-100;
                                        setDisplay(
                                            <div className="flex flex-col justify-center content-center">
                                                <h3 className="mt-3 mb-3 text-center text-white font-bold">{session.type.toUpperCase()} from {session.date}</h3>
                                                <SessionGraph width={graphW} data={formatList} session={session} dataKeys={["distance", 'sprintdistance']}></SessionGraph>
                                                <SessionGraph  width={graphW} data={formatList} session={session} dataKeys={['energy', 'playerload']}></SessionGraph>
                                                <SessionGraph  width={graphW} data={formatList} session={session} dataKeys={['topspeed']}></SessionGraph>
                                            </div>)
                                        console.log(display)
                                    }}>View All Stats</button>
                                </td>

                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="w-full flex flex-col content-center justify-center items-center dark:bg-gray-800 rounded-b-md"> {display}</div>
       
    </div>
        
    ) 
}

export default QuerySession;
