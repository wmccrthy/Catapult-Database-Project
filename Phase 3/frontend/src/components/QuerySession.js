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
import { motion, AnimatePresence} from "framer-motion";
import { MdElectricCar, MdOutlineArrowDropDownCircle } from "react-icons/md";
import SessionSeasonGraph from "./SessionSeasonGraph";

const QuerySession = (props) => {
    const [sessionFilter, setFilter] = useState("");
    const [sessionList, setSessionList] = useState([]);
    const [display, setDisplay] = useState(<span></span>)
    const [seasonalDisplay, setSeasDisplay] = useState(<span className="font-extralight opacity-70 text-white"></span>)
    const teamID = props.team;

    // for all player stats in a session the goal is to get all session data from given session, organized by player email, realistically, all I need is session id
    const moreEfficientSessionData = async (session) => {
        // SELECT email, 
        try {
            // console.log("working")
            const condTest = `sessionid = '${session}' AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
            // console.log(condTest)
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=recordsstatson&field=email, distance, sprintdistance, energy, topspeed, playerload&condition=${condTest}`);
            const playerData = await response.json();
            for (let row of playerData) {
                console.log(row)
                row.email = row.email.replace("@amherst.edu", "")
            }
            // console.log(playerData);
            return playerData;
        } catch(err) {
            console.log(err)
        }
    }

    const averageThisSession = async (session, date) => {
        const averagesQuery = `SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson WHERE sessionid = '${session}' AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}');`
            try {
                var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${averagesQuery}`);
                const averageData = await response.json();
                averageData[0].date = `${date} avg`;
                averageData[0].email = `${date} avg`;
                // console.log(averageData)
                return averageData[0];
            } catch(err) {
                console.error(err)
            }
    }

    const getSeasonalAvgs = async () => {
        const averagesQuery = `SELECT session.date, AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson JOIN session on recordsstatson.sessionid = session.sessionid WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') GROUP BY session.date, session.sessionid ORDER BY session.sessionid;`
            try {
                var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${averagesQuery}`);
                const averageData = await response.json();
                // console.log(averageData)
                return averageData;
            } catch(err) {
                console.error(err)
            }
    }

    // APPLIES FILTRATION TO PLAYER LIST BASED ON NAME INPUT
    const filterList = () => {
        sessionList.map(session => (
                            <tr className="border-b bg-gray-900 border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">{session.type}</th>
                                <td className="px-6 py-4">{session.sessionid}</td>
                                <td className="px-6 py-4">{session.date}</td>
                                <td className="px-6 py-4"><button onClick={function () {
                                    // QueryPlayer
                                    setDisplay(<QueryPlayer team={teamID} session={session.sessionid} date={session.date} defData={<div></div>}></QueryPlayer>);
                                }}>View Player Stats</button></td>
                            </tr>
        ))
        setDisplay(<div></div>)
    }

    // UPDATES Session list variable to match user input filtering 
    const getSessions = async () => {
        try {
            // const condTest = `date ILIKE ${sessionFilter} ORDER BY sessionid`
            const query = `SELECT date, sessionid, type FROM session WHERE sessionid in (SELECT h.sessionid FROM holds h WHERE h.teamid = '${teamID}') ORDER BY sessionid;`
            // var response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type`);
            // if (sessionFilter.replace(" ", "").length >= 1) {
            //     response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type&condition=${condTest}`);
            // } 
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${query}`)
            // var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=session&field=date, sessionid, type&condition=${condTest}`);
            const sessionData = await response.json()
            console.log(sessionData)
            setSessionList(sessionData)
        } catch(err) {
            console.log(err)
        }
    }

    // CALLED GETPLAYERS UPON INITIAL RENDERING SUCH THAT PLAYERLIST IS POPULATED ON SCREEN
    const setInitialDisp = async () => {
        document.querySelector("#icon").classList.toggle("rotated")
        var graphW = document.querySelector("#cont").offsetWidth-100;
        const seasonAvgs = await getSeasonalAvgs();
        if (seasonalDisplay.type === "span") {
        console.log(seasonalDisplay)
        setSeasDisplay(
            <motion.div initial={{opacity: 0, y:200}} animate={{opacity:1, y:0}} transition={{duration:.85}}  className="max-h-[30rem] w-full overflow-y-auto">
                <SessionSeasonGraph team={teamID} multiStat={true} width={graphW} data={seasonAvgs} dataKeys={["distance", 'sprintdistance']}></SessionSeasonGraph>
                <SessionSeasonGraph team={teamID} multiStat={true} width={graphW} data={seasonAvgs} dataKeys={['energy', 'playerload']}></SessionSeasonGraph>
                <SessionSeasonGraph team={teamID}  width={graphW} data={seasonAvgs} dataKeys={['topspeed']}></SessionSeasonGraph>
            </motion.div>);
    }}

    useEffect (() => {
        getSessions();
        setInitialDisp();
        // document.querySelector("h3").click()
        // console.log(e.target.querySelector("svg"))   
    }, [])

    const averageAllSession = async (sessionType) => {
        const averagesQuery = `SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson JOIN session ON recordsstatson.sessionid = session.sessionid WHERE session.type = '${sessionType}' AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}');`
            try {
                var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${averagesQuery}`);
                const averageData = await response.json();
                averageData[0].date = `${sessionType} seasonal avg`;
                averageData[0].email = `${sessionType} seasonal avg`;
                // console.log(averageData)
                return averageData[0];
            } catch(err) {
                console.error(err)
            }
    }

    return (
        <motion.div  initial={{opacity: 0, scale:.95}} animate={{opacity:1, scale:1}} transition={{duration:.65, delay: 0.1}} id="cont" className="flex flex-col content-center items-center w-full">
            <div id="cnt" className="w-full flex flex-col content-center justify-center items-center bg-gray-900 rounded-md transition-all duration-300 hover:h-[29rem] h-10 border border-gray-600 border-b-0 rounded-t-md" onMouseEnter={(e) => {
                    document.querySelector("#icon").classList.toggle("rotated")
            }} onMouseLeave={(e) => {
                document.querySelector("#icon").classList.toggle("rotated")
            }}>
                {/* have data for session averages accross season */}
                <h3 className="w-full flex items-center justify-center  text-center p-1 bg-gray-900 text-white font-bold text-lg rounded-t-md cursor-pointer hover:opacity-60 transition-all duration-300 border-b border-gray-700">Toggle Seasonal Session Data Display <MdOutlineArrowDropDownCircle id="icon" className="ml-3 transition-all duration-300"></MdOutlineArrowDropDownCircle> </h3>
                {seasonalDisplay}
            </div>
            {/* <input id="sessionInp" className="w-full h-8 text-s text-center bg-gray-700 text-gray-400 outline-none " type="text" placeholder="Month Day Year" onChange={function (e) {
                setFilter(e.target.value);
                console.log(e);
                console.log(sessionFilter);
                getSessions();
                filterList();
            }} onKeyUp={function () {
                setFilter(document.querySelector("#sessionInp"));
                getSessions();
                filterList();
            } } /> */}
            <div className="max-h-96 w-full overflow-y-auto z-10 border border-gray-600 rounded-b-md">
                <table className="w-full text-sm text-left text-gray-400">
                    <caption className="sticky top-0 h-auto w-full bg-gray-900 text-white text-lg">Individual Session Data</caption>
                    <thead className="w-full text-xs uppercase bg-gray-700 text-gray-400 sticky top-7">
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
                                <tr className="border-b bg-gray-900 border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">{session.type}</th>
                                    <td className="px-6 py-4">{session.sessionid}</td>
                                    <td className="px-6 py-4">{session.date}</td>
                                    <td className="px-6 py-4"><button onClick={function () {
                                        // QueryPlayer
                                        setDisplay(<QueryPlayer team={teamID} type={session.type} session={session.sessionid} date={session.date} defData={<div></div>}></QueryPlayer>)
                                        console.log(display)
                                    }}>View Player Stats</button></td>
                                    <td className="px-6 py-4">
                                        <button onClick={async function () {
                                            // QueryPlayers
                                            var formatList = await moreEfficientSessionData(session.sessionid)
                                            console.log(formatList)
                                            var graphW = document.querySelector("#cont").offsetWidth-100;
                                            var averageToday = await averageThisSession(session.sessionid, session.date);
                                            var averageAll = await averageAllSession(session.type);
                                            console.log(averageAll)
                                            var totalData = []
                                            totalData.push(averageToday)
                                            totalData.push(averageAll)
                                            setDisplay(
                                                <div className="flex flex-col justify-center content-center">
                                                    <h3 className="mt-3 mb-3 text-center text-white font-bold">{session.type.toUpperCase()} from {session.date}</h3>
                                                    <SessionGraph width={graphW} data={formatList} session={session} dataKeys={["distance", 'sprintdistance']}></SessionGraph>
                                                    <SessionGraph  width={graphW} data={formatList} session={session} dataKeys={['energy', 'playerload']}></SessionGraph>
                                                    <SessionGraph  width={graphW} data={formatList} session={session} dataKeys={['topspeed']}></SessionGraph>
                                                    {/* add 3 more graphs for session average data; compare how this session avg stats, compare with cumulative session avg stats */}
                                                    <SessionGraph width={graphW} data={totalData} session={session} dataKeys={["distance", 'sprintdistance']} date={session.date} isAvg={true}></SessionGraph>
                                                    <SessionGraph  width={graphW} data={totalData} session={session} dataKeys={['energy', 'playerload']} date={session.date} isAvg={true}></SessionGraph>
                                                    <SessionGraph  width={graphW} data={totalData} session={session} dataKeys={['topspeed']} date={session.date} isAvg={true}></SessionGraph>
                                                </div>)
                                            console.log(display)
                                        }}>View All Stats</button>
                                    </td>

                                </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="w-full flex flex-col content-center justify-center items-center bg-gray-900 rounded-b-md"> {display}</div>
        
        </motion.div>
        
    ) 
}

export default QuerySession;
