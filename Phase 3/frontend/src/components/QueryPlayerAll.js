// ESSENTIALLY A TABLE MIRRORING THE PLAYER RELATION IN OUR DB (HAS INPUT FOR FILTERING BY NAME)
// SELECTING A PLAYER PROMPTS A WINDOW WITH MORE IN DEPTH LOOK AT THAT PLAYER'S STATS -> OUTPUTS recordsStatsOn relation data where email == selectedPlayer.email 
// FOR ALL SESSIONS THROUGHOUT A SEASON
// 
import { useState, useEffect } from "react";
import React from "react";
// import PlayerSessionStats from "./PlayerSessionStats";
import PlayerSeasonStats from "./PlayerSeasonStats";
import { motion } from "framer-motion";

const QueryPlayerAll = (props) => {
    const teamID = props.team 
    var radarRange = [-0.5,0.0]
    // const season = props.season
    
    // going to need this to be custom queries bc player's dont have a team attribute; instead grab name and email of all players who have partcipated in a session
    // with the given teamID 
    // just use select framework with longer condition bc of aids with ILIKE ^ 

    const [nameFilter, setFilter] = useState("");
    const [playerList, setPlayerList] = useState([]);
    const [display, setDisplay] = useState(props.defData);


    const getPlayers = async (allPlayers = false) => {
        try {
            var query = `SELECT name, email FROM player WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
            if (allPlayers) {
                // var condition = `email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
                var query = `SELECT name, email FROM player WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
            } else {
                // if (nameFilter.length >= 1) {
                //     var query = `SELECT name, email FROM player WHERE name ILIKE ${nameFilter} AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
                //     // var condition = `name ILIKE ${nameFilter} AND email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}')`
                // } 
            }
            // console.log(query)
            // var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=player&field=name, email&condition=${condition}`);
            console.log(query)
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${query}`);
            const playerData = await response.json()
            console.log(playerData)
            setPlayerList(playerData);
            return playerData;
        } catch(err) {
            console.log(err)
        }
    }

    const getSeasonStats = async (playerEmail) => {
        const query = `SELECT session.date, distance, sprintdistance, topspeed, energy, playerload FROM recordsstatson JOIN session ON recordsstatson.sessionid = session.sessionid WHERE email = '${playerEmail}' AND teamid = '${teamID}' ORDER BY session.sessionid;`
        try {
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${query}`);
            const seasonData = await response.json();
            console.log(seasonData)
            return seasonData;
        } catch(err) {
            console.error(err)
        }
    }

 // get players average stats for given session type (game or training)
    const getPlayerAverages = async (playerEmail, playerName, sessionType) => {
        sessionType = sessionType.replace(" ", "").replace("\n", "")
        const relevantSessions = `SELECT sessionid FROM session WHERE type = '${sessionType}'`;
        const averagesQuery = `SELECT AVG(distance) as distance, AVG(sprintdistance) as sprintdistance, AVG(topspeed) as topspeed, AVG(energy) as energy, AVG(playerload) as playerload FROM recordsstatson WHERE email = '${playerEmail}' AND sessionid IN (${relevantSessions}) AND teamid = '${teamID}';`
        try {
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${averagesQuery}`);
            const averageData = await response.json();
            averageData[0].date = `${playerName} ${sessionType} avg`;
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

    // compare players session averages with team averages 
    // stats to comp: distance / minutesPlayed, goals, assists, gc, shotAcc, gc per game 
    const getPlayerOverview = async (playerEmail, playerName) => {
        const teamQuery = `SELECT (SUM(mp)/(250.0*(SELECT COUNT(DISTINCT(email)) FROM participatesin WHERE teamid = '${teamID}'))) as minutesPlayed, ((SUM(g)*1.0)/(SELECT COUNT(DISTINCT(email)) FROM participatesin WHERE teamid = '${teamID}')) as goals, ((SUM(a)*1.0)/(SELECT COUNT(DISTINCT(email)) FROM participatesin WHERE teamid = '${teamID}')) as assists, (((SUM(sh)*1.0)/(SELECT COUNT(DISTINCT(email)) FROM participatesin WHERE teamid = '${teamID}'))/5) as shots, ((((SUM(sog)*1.0))/SUM(sh))) as accuracy FROM recordsstatson WHERE email in (SELECT P.email FROM participatesin P WHERE P.teamid = '${teamID}') AND mp IS NOT NULL`
        const playerQuery = `SELECT (SUM(mp)/250.0) as minutesPlayed, SUM(g) as goals, SUM(a) as assists, ((SUM(sog)*1.0)/(NULLIF(SUM(sh), 0))) as accuracy, (SUM(sh)/5) as shots FROM recordsstatson WHERE email = '${playerEmail}' AND mp IS NOT NULL`
        try {
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${teamQuery}`);
            const averageData = await response.json();
            averageData[0].name = "team averages"
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${playerQuery}`);
            const playerData = await response.json();
            playerData[0].name = `${playerName} averages`
            // console.log(averageData);
            // console.log(playerData);
            // create new array with 
            var reformatted = []
            let i = 0;
            for (var prop in averageData[0]) {
                console.log(prop)
                if (prop != "name") {
                    reformatted.push({})
                    reformatted[i].stat = prop
                    reformatted[i].teamValue = averageData[0][prop]
                    reformatted[i].playerValue = playerData[0][prop] == null ? 0 : playerData[0][prop];
                    radarRange[0] = Math.min(radarRange[0], reformatted[i].playerValue)
                    radarRange[1] = Math.max(radarRange[1], reformatted[i].teamValue, reformatted[i].playerValue)
                    i += 1
                }
            }
            console.log(radarRange)
            console.log(reformatted)
            return reformatted
            // return Array.prototype.concat(averageData, playerData);
        } catch(err) {
            console.error(err);
        }
    }

    

    // APPLIES FILTRATION TO PLAYER LIST BASED ON NAME INPUT
    const filterList = () => {
        playerList.map(player => (
            <tr className="border-b bg-gray-900 border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap text-white">{player.name}</th>
                <td className="px-6 py-4">{player.email}</td>
                <td className="px-6 py-4 flex"><button  onClick={async function () {
                                var trainingAvg = await getPlayerAverages(player.email, player.name, "training");
                                var gameAvg = await getPlayerAverages(player.email, player.name, "game");
                                var avgData = []
                                avgData.push(gameAvg)
                                avgData.push(trainingAvg)
                                var seasonStatArr = await getSeasonStats(player.email)
                                var overview = await getPlayerOverview(player.email, player.name)
                                console.log(overview)
                                console.log("workkkkk")
                                console.log(radarRange)
                                console.log(overview)
                                // console.log(seasonStatArr)
                                setDisplay(<PlayerSeasonStats averages={avgData} stats={seasonStatArr} name={player.name} radarRange={radarRange}></PlayerSeasonStats>);
                                // need to render new table displaying stats (new component)
                }}>View Stats</button></td>
            </tr>
        ))
        setDisplay(<div></div>);
    }



    return (
        <motion.div initial={{opacity: 0, scale:.95}} animate={{opacity:1, scale:1}}  transition={{duration:.5, delay: 0.1}} id="cont" className="flex flex-col content-center items-center w-full border border-gray-700 rounded-md min-h-96">
            <h3 className="w-full text-center p-1 bg-gray-900 text-white font-bold text-lg rounded-t-md">Player Season Data</h3>
            {/* <input id="playerInp" className="w-full h-8 text-s text-center bg-gray-700 text-gray-400 outline-none" type="text" placeholder="Enter Player Name" onChange={function (e) {
                setFilter(e.target.value);
                console.log(e);
                console.log(nameFilter)
                getPlayers();
                filterList();
            }} onKeyUp={function () {
                setFilter(document.querySelector("#playerInp"));
                getPlayers();
                filterList();
            } } /> */}
    
            <div className="max-h-96 w-full overflow-y-auto">
                <table className="w-full text-sm text-left  text-gray-400">
                    <thead className="text-xs  uppercase bg-gray-700 text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-1 py-1 sm:px-6 sm:py-3">
                                Name
                            </th>
                            <th scope="col" className="px-1 py-1 sm:px-6 sm:py-3">
                                Email
                            </th>
                            <th scope="col" className="px-1 py-1 sm:px-6 sm:py-3">
                                Season Stats
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerList.map(player => (
                            <tr className="border-b bg-gray-900 border-gray-700">
                                <th scope="row" className="py-1 sm:px-6 sm:py-4 font-medium whitespace-nowrap text-white">{player.name}</th>
                                <td className="py-1 sm:px-6 sm:py-4">{player.email}</td>
                                <td className="py-1 sm:px-6 sm:py-4"><button  onClick={async function () {
                                    var trainingAvg = await getPlayerAverages(player.email, player.name, "training");
                                    var gameAvg = await getPlayerAverages(player.email, player.name, "game");
                                    var avgData = []
                                    avgData.push(gameAvg)
                                    avgData.push(trainingAvg)
                                    var seasonStatArr = await getSeasonStats(player.email)
                                    var overview = await getPlayerOverview(player.email, player.name)
                                    setDisplay(<PlayerSeasonStats radarRange={radarRange} averages={avgData} overview={overview} stats={seasonStatArr} name={player.name} email={player.email}></PlayerSeasonStats>);
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
        </motion.div>
        ) 
    }

export default QueryPlayerAll;