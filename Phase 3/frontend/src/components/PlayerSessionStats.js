
// TABLE WINDOW PROMPTED BY SELECTING VIEW STATS FROM THE "QUERYPLAYER" COMPONENT 

// RATHER THAN OUTPUTTING TABLE -> OUTPUT BAR GRAPH W PLAYER DATA COMPARED TO SESSION AVERAGE DATA FOR EACH RELEVANT METRIC


import { useState, useEffect } from "react";
import React from "react";
import PlayerSessionGraph from "./PlayerSessionGraph";
import { motion } from "framer-motion";
import PlayerOverviewGraph from "./PlayerOverviewGraph";

const PlayerSessionStats = (props) => {
    const playerStats = props.stats[0];
    const playerName = props.name;
    const type = props.type;
    if (playerStats == null) {
        return (
            <div className="text-gray-500">{playerName} Has No Data for This Session</div>
    )}
    playerStats.email = props.name;
    const averageStats = props.averages;
    const playerAvgStats = props.pAverages;
    const totalData = []
    const range = props.range
    totalData.push(averageStats)
    totalData.push(playerStats)
    totalData.push(playerAvgStats);
    const date = props.date;
    console.log(playerStats);
    console.log(averageStats);

    return (
        
        <motion.div initial={{opacity: 0}} animate={{opacity:1}} transition={{duration:.65}} id="cont" className="flex flex-col content-center items-center justify-center gap-5 w-full">
            <h3 className="mt-1 text-center text-white font-semibold">{props.name} Data from {props.date}</h3>
            <PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100} data={totalData} session={props.date} dataKeys={["distance", 'sprintdistance']} multiStat={true}></PlayerSessionGraph>
            <PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100}  data={totalData} session={props.date} dataKeys={['energy', 'playerload']} multiStat={true}></PlayerSessionGraph>
            <PlayerSessionGraph width={document.querySelector("#cont").offsetWidth-100}  data={totalData} session={props.date} dataKeys={['topspeed']} multiStat={false}></PlayerSessionGraph>
            {/* add radar graph for visualizing player shot acc, conversion rate, distance per MP, mp vs team average */}
            {type == "game" && <PlayerOverviewGraph range={range} width={document.querySelector("#cont").offsetWidth-100} showPlayerAvg={true} name={playerName} data={props.overview}></PlayerOverviewGraph>}
        </motion.div>
        ) 
    }

    


export default PlayerSessionStats;