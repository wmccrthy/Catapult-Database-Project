import React from "react";
import {useState} from "react";
import PlayerSessionGraph from "./PlayerSessionGraph";
import { motion } from "framer-motion";

const Leaderboards = (props) => {
    const [display, setDisplay] = useState(<div></div>)
    const [display2, setDisplay2] = useState(<div></div>)
    const [active, setActive] = useState(null)
    const [active2, setActive2] = useState(null)
    const teamID = props.team;

        // query for each stat perhaps? 
    const leaderQuery = async (stat, filter = null) => {
        var query = `SELECT R.email, R.${stat} FROM recordsstatson R
        WHERE R.${stat} = (SELECT MAX(${stat}) FROM recordsstatson WHERE email = R.email) AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') ORDER BY R.${stat} DESC;`
        if (filter != null) {
            var query = `SELECT R.email, R.${stat} FROM recordsstatson R
            WHERE R.${stat} = (SELECT MAX(${stat}) FROM recordsstatson WHERE email = R.email AND sessionid in (SELECT S.sessionid from session S where S.type = '${filter}')) AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') ORDER BY R.${stat} DESC;`
        }
        try {
            console.log(query)
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${query}`)
            var leaderBoardData = await response.json();
            console.log(leaderBoardData);
            return leaderBoardData;
        } catch (err) {
            console.error(err);
        }
    }

    const gcQuery = async (stat, filter = null) => {
        var query = `SELECT R.email, SUM(R.${stat}) as ${stat} FROM recordsstatson R
        WHERE R.email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') GROUP BY R.email ORDER BY SUM(R.${stat}) DESC;`
        if (filter != null) {
            var query = `SELECT R.email, SUM(R.${stat}) as ${stat} FROM recordsstatson R
            WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') AND sessionid in (SELECT S.sessionid from session S where S.type = '${filter}') GROUP BY R.email ORDER BY SUM(R.${stat}) DESC;`
        }
        try {
            console.log(query)
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
        var query = `SELECT email, AVG(${stat}) AS ${stat} FROM recordsstatson WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') GROUP BY email ORDER BY ${stat} DESC;`
        console.log(query)
        if (filter != null) {
            query = `SELECT R.email, AVG(R.${stat}) AS ${stat} FROM recordsstatson R WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') AND (SELECT S.type FROM session S WHERE S.sessionid = R.sessionid) = '${filter}' GROUP BY R.email ORDER BY ${stat} DESC;`
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

    const getLeaderBoard = async (stat, filter = null, gc = false) => {
        var l = await leaderQuery(stat, filter);
        if (gc) { l = await gcQuery(stat, filter) };
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
    <motion.div initial={{opacity: 0,  scale:.95}} animate={{opacity:1, scale:1}}   transition={{duration:0.65}} className="flex flex-col content-center items-center align-center w-full p-5 border border-gray-700 rounded-t-md">
        <h3 className="w-full text-center p-1  bg-gray-900 text-white font-bold text-lg rounded-t-md">Leaderboards</h3>
        <div id="cont" className="max-h-156 w-full flex flex-col content-center items-center justify-evenly">
            <h4 className="w-full text-center p-1  bg-gray-900 text-gray-400 font-bold text-lg rounded-t-md m-1">Highest Recorded Stats</h4>
            <div className="w-full flex items-center content-center justify-between text-center md:gap-10 mb-5 mt-3"> 

                <button className="leaderButton md:text-[1vw] text-[2vw]   uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel1").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getLeaderBoard("distance", typeFilter);
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["distance"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Distance</button>
                <button className="leaderButton md:text-[1vw] text-[2vw]  uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel1").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getLeaderBoard("sprintdistance", typeFilter);
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["sprintdistance"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Sprint Distance</button>
                 <button className="leaderButton md:text-[1vw] text-[2vw]  uppercase  text-gray-400" onClick={async function(e) {
                     var typeFilter = document.querySelector("#sel1").value;
                     if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getLeaderBoard("distancepermin", typeFilter);
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["distancepermin"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Distance Per Min</button>
                <button className="leaderButton md:text-[1vw] text-[2vw] uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel1").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getLeaderBoard("topspeed", typeFilter);
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["topspeed"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Top Speed</button>
                <button className="leaderButton md:text-[1vw] text-[2vw] uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel1").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getLeaderBoard("g", typeFilter, true);
                    console.log(data)
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["g"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Goals</button>
                <button className="leaderButton md:text-[1vw] text-[2vw] uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel1").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getLeaderBoard("a", typeFilter, true);
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["a"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Assists</button>    
            </div>
            <select className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-1 py-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" value={null} id="sel1" onChange={async function (e) {
                var typeFilter = e.target.value
                if (active != null) {
                    var curMetric = active.innerHTML.replaceAll(" ", "").toLowerCase()
                    var gc = false;
                    if (curMetric == "goals") { 
                        curMetric = 'g'
                        gc = true }; 
                    if (curMetric == "assists") { 
                        curMetric = 'a'
                        gc = true};
                    if (typeFilter == "All") {typeFilter = null;}
                    var updatedData = await getLeaderBoard(curMetric, typeFilter, gc)
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={updatedData} dataKeys={[curMetric]}></PlayerSessionGraph>)
                }}}>
                <option value={null}>All</option>
                <option value="training">Training</option>
                <option value="game">Game</option>
            </select>
            {display}
        </div>

        {/* have input that allows user to pick whether ranked average data is from game, training, or either */}
        <div id="cont" className="max-h-156 w-full flex flex-col content-center items-center justify-evenly">
            <h4 className="w-full text-center p-1 bg-gray-900 text-gray-400 font-bold text-lg rounded-t-md m-1">Average Recorded Stats</h4>
            <div className="w-full flex items-center content-center justify-between text-center md:gap-10 mb-5 mt-3"> 
                <button className="leaderButton md:text-[1vw] text-[2vw] uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("distance", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["distance"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Distance</button>
                <button className="leaderButton md:text-[1vw] text-[2vw]   uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("sprintdistance", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["sprintdistance"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Sprint Distance</button>
                 <button className="leaderButton md:text-[1vw] text-[2vw]  uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("distancepermin", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["distancepermin"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Distance Per Min</button>
                <button className="leaderButton md:text-[1vw] text-[2vw]   uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("topspeed", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["topspeed"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Top Speed</button>
                 <button className="leaderButton md:text-[1vw] text-[2vw]  uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("energy", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={data} dataKeys={["energy"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Energy</button>
                 <button className="leaderButton md:text-[1vw] text-[2vw] uppercase  text-gray-400" onClick={async function(e) {
                    var typeFilter = document.querySelector("#sel").value;
                    if (typeFilter== 'All') {typeFilter = null;}
                    var data = await getAverageBoard("playerload", typeFilter);
                    setDisplay2(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100}  data={data} dataKeys={["playerload"]}></PlayerSessionGraph>)
                    toggleButton2(e.target)
                }}>Player Load</button>
            </div>
            <select className=" border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  px-1 py-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" value={null} id="sel" onChange={async function (e) {
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
            {display2}
        </div>
    </motion.div>
    )
}

export default Leaderboards;