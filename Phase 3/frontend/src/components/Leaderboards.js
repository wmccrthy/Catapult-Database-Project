import React from "react";
import {useState, useEffect} from "react";
import PlayerSessionGraph from "./PlayerSessionGraph";


// display ranking of each player's highest score in each stat 

// THINK OF SQL QUERY TO: 
//  GET HIGHEST DISTANCE, SPRINT DISTANCE, ENERGY, PLAYERLOAD, TOP SPEED FOR EACH PLAYER 
//  RETURNS TABLE OF PLAYER NAME-> TOP STATS

// layout:
// HEADER
// then for each (distance, sprintdistance, energy, playerload, topspeed):
    // sub header (stat)
    // playerName - their stat 
    // ....


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

    return (
    <div className="flex flex-col content-center items-center w-3/5  border  border-gray-700">
        <h3 className="w-full text-center p-1 bg-gray-50 dark:bg-gray-800 text-white font-bold text-lg rounded-t-md  borderborder-gray-700">Leaderboards</h3>
        <div className="max-h-156 w-full overflow-scroll flex flex-col content-center justify-evenly">
            <div className="w-full flex justify-center text-center gap-10"> 
                <button className="text-s text-gray-700 uppercase  dark:text-gray-400" onClick={async function() {
                    var data = await getLeaderBoard("distance");
                    setDisplay(<PlayerSessionGraph data={data} dataKeys={["distance"]}></PlayerSessionGraph>)
                }}>Distance</button>
                <button className="text-s text-gray-700 uppercase  dark:text-gray-400" onClick={async function() {
                    var data = await getLeaderBoard("sprintdistance");
                    setDisplay(<PlayerSessionGraph data={data} dataKeys={["sprintdistance"]}></PlayerSessionGraph>)
                }}>Sprint Distance</button>
                <button className="text-s text-gray-700 uppercase  dark:text-gray-400" onClick={async function() {
                    var data = await getLeaderBoard("topspeed");
                    setDisplay(<PlayerSessionGraph data={data} dataKeys={["topspeed"]}></PlayerSessionGraph>)
                }}>Speed</button>
            </div>
            {display}
        </div>
    </div>
    )
}

export default Leaderboards;