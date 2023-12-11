import React from "react";
import {useState} from "react";
import PlayerSessionGraph from "./PlayerSessionGraph";
import { motion } from "framer-motion";


// query for each stat perhaps? 
const leaderQuery = async (stat) => {
    var query = `SELECT R.email, R.${stat} FROM recordsstatson R
    WHERE R.${stat} = (SELECT MAX(${stat}) FROM recordsstatson WHERE email = R.email) ORDER BY R.${stat} DESC;`
    
    try {
        var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${query}`)
        var leaderBoardData = await response.json();
        console.log(leaderBoardData);
        return leaderBoardData;
    } catch (err) {
        console.error(err);
    }
}

// 
const leaderAvgQuery = async (stat, filter = null) => {
    var query = `SELECT email, AVG(${stat}) AS ${stat} FROM recordsstatson GROUP BY email ORDER BY ${stat} DESC;`
    console.log(query)
    if (filter != null) {
        query = `SELECT R.email, AVG(R.${stat}) AS ${stat} FROM recordsstatson R WHERE (SELECT S.type FROM session S WHERE S.sessionid = R.sessionid) = '${filter}' GROUP BY R.email ORDER BY ${stat} DESC;`
    }
    try { 
        var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${query}`)
        var leaderBoardData = await response.json();
        console.log("hmmmm")
        console.log(leaderBoardData);
        return leaderBoardData;
    } catch (err) {
        console.error(err);
    }
}



const Leaderboards = () => {
    const [display, setDisplay] = useState(<div></div>)
    const [display2, setDisplay2] = useState(<div></div>)
    const [active, setActive] = useState(null)
    const [active2, setActive2] = useState(null)


    const getLeaderBoard = async (stat) => {
        var l = await leaderQuery(stat);
        var formattedToArr = []
        for (let player of l) {
            player.email = player.email.replace("@amherst.edu", "");
            formattedToArr.push(player);
        }
        return formattedToArr;
    }
    const getAverageBoard = async (stat, filter = null) => {
        var l = await leaderAvgQuery(stat);
        if (filter != null) { l = await leaderAvgQuery(stat, filter)}
        var formattedToArr = []
        for (let player of l) {
            player.email = player.email.replace("@amherst.edu", "");
            formattedToArr.push(player);
        }
        return formattedToArr;
    }

    const toggleButton = (el) => {
        if (active != null) {active.classList.toggle("leaderSelected")}
        setActive(el)
        el.classList.toggle("leaderSelected")
    }
    const toggleButton2 = (el) => {
        if (active2 != null) {active2.classList.toggle("leaderSelected")}
        setActive2(el)
        el.classList.toggle("leaderSelected")
    }

    return (
    <motion.div initial={{opacity: 0,  scale:.95}} animate={{opacity:1, scale:1}}   transition={{duration:0.65}} className="flex flex-col content-center items-center align-center w-11/12 border border-gray-700 rounded-t-md">
        <h3 className="w-full text-center p-1 bg-gray-50 dark:bg-gray-800 text-white font-bold text-lg rounded-t-md">Leaderboards</h3>
        <div id="cont" className="max-h-156 w-full flex flex-col content-center items-center justify-evenly">
            <h4 className="w-full text-center p-1 bg-gray-50 dark:bg-gray-800 text-gray-400 font-bold text-lg rounded-t-md m-1">Highest Recorded Stats</h4>
            <div className="w-full flex items-center content-center justify-center text-center gap-10 mb-5 mt-3"> 
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("distance");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["distance"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Distance</button>
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("sprintdistance");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["sprintdistance"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Sprint Distance</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("distancepermin");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["distancepermin"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Distance/Min</button>
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("topspeed");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["topspeed"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Top Speed</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("energy");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["energy"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Energy</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("playerload");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100}  data={data} dataKeys={["playerload"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Player Load</button>
            </div>
            {display}
        </div>

        {/* have input that allows user to pick whether ranked average data is from game, training, or either */}
        <div id="cont" className="max-h-156 w-full flex flex-col content-center items-center justify-evenly">
            <h4 className="w-full text-center p-1 bg-gray-50 dark:bg-gray-800 text-gray-400 font-bold text-lg rounded-t-md m-1">Average Recorded Stats</h4>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={null} id="sel" onChange={async function (e) {
                var typeFilter = e.target.value
                if (active2 != null) {
                    var curMetric = active2.innerHTML.replaceAll(" ", "").toLowerCase()
                    if (typeFilter == "All") {typeFilter = null;}
                    var updatedData = await getAverageBoard(curMetric, typeFilter)
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={updatedData} dataKeys={[curMetric]}></PlayerSessionGraph>)
                }}}>
                <option value={null}>All</option>
                <option value="training">Training</option>
                <option value="game">Game</option>
            </select>
            <div className="w-full flex items-center content-center justify-center text-center gap-10 mb-5 mt-3"> 
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("distance", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["distance"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Distance</button>
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("sprintdistance", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["sprintdistance"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Sprint Distance</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("distancepermin", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["distancepermin"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Distance Per Min</button>
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("topspeed", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["topspeed"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Top Speed</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("energy", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["energy"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Energy</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("playerload", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100}  data={data} dataKeys={["playerload"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Player Load</button>
            </div>
            {display2}
        </div>
    </motion.div>
    )
}

export default Leaderboards;