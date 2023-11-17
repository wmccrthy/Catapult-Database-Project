import React from "react";
import {useState, useEffect, ReactDOM} from "react";
import PlayerSessionGraph from "./PlayerSessionGraph";


// query for each stat perhaps? 
const leaderQuery = async (stat) => {
    var query = `SELECT R.email, R.${stat} FROM recordsstatson R
    WHERE R.${stat} = (SELECT MAX(${stat}) FROM recordsstatson WHERE email = R.email) ORDER BY R.${stat} DESC;
    `
    try {
        var response = await fetch(`http://localhost:4000/custom?query=${query}`)
        var leaderBoardData = await response.json();
        console.log(leaderBoardData);
        return leaderBoardData;
    } catch (err) {
        console.error(err);
    }
    
}



const Leaderboards = () => {

    const [sessionList, setSessionList] = useState([]);
    const [display, setDisplay] = useState(<div></div>)
    const [active, setActive] = useState(null)
    // const distanceLeaders = getLeaderBoard("distance");
    // const sprintLeaders = getLeaderBoard("sprintdistance");
    // const speedLeaders = getLeaderBoard("topspeed");
    
    // UPDATES Session list variable to match user input filtering 
    const getSessions = async () => {
        try {
            var response = await fetch(`http://localhost:4000/select?table=session&field=date, sessionid, type`);
            const sessionData = await response.json()
            console.log(sessionData)
            setSessionList(sessionData)
        } catch(err) {
            console.log(err)
        }
    }

    const getLeaderBoard = async (stat) => {
        var l = await leaderQuery(stat);
        var formattedToArr = []
        for (let player of l) {
            player.email = player.email.replace("@amherst.edu", "");
            formattedToArr.push(player);
        }
        // console.log(formattedToArr)
        return formattedToArr;
    }


    // CALLED GETPLAYERS UPON INITIAL RENDERING SUCH THAT PLAYERLIST IS POPULATED ON SCREEN
    useEffect (() => {
        getSessions();
        
    }, [])

    const toggleButton = (el) => {
        if (active != null) {active.classList.toggle("leaderSelected")}
        setActive(el)
        el.classList.toggle("leaderSelected")
    }

    return (
    <div className="flex flex-col content-center items-center w-3/5 border border-gray-700">
        <h3 className="w-full text-center p-1 bg-gray-50 dark:bg-gray-800 text-white font-bold text-lg rounded-t-md">Leaderboards</h3>
        <div id="cont" className="max-h-156 w-full overflow-scroll flex flex-col content-center justify-evenly">
            <div className="w-full flex items-center content-center justify-center text-center gap-10 mb-5 mt-3"> 
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("distance");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth} data={data} dataKeys={["distance"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Distance</button>
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("sprintdistance");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth} data={data} dataKeys={["sprintdistance"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Sprint Distance</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("distancepermin");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth} data={data} dataKeys={["distancepermin"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Distance/Min</button>
                <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("topspeed");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth} data={data} dataKeys={["topspeed"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Speed</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("energy");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth} data={data} dataKeys={["energy"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Energy</button>
                 <button className="leaderButton text-[1vw] text-gray-700 uppercase  dark:text-gray-400" onClick={async function(e) {
                    var data = await getLeaderBoard("playerload");
                    setDisplay(<PlayerSessionGraph width={document.querySelector("#cont").offsetWidth}  data={data} dataKeys={["playerload"]}></PlayerSessionGraph>)
                    toggleButton(e.target)
                }}>Player Load</button>
            </div>
            {display}
        </div>
    </div>
    )
}

export default Leaderboards;