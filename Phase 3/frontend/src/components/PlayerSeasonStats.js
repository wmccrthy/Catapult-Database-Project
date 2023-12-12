// this component will display a graph of one player's stats per metric across all sessions !!!

import { useState, useEffect } from "react";
import React from "react";
import PlayerSessionGraph from "./PlayerSessionGraph";
import PlayerSeasonGraph from "./PlayerSeasonGraph";
import { motion } from "framer-motion";

const PlayerSeasonStats = (props) => {
    const playerStats = props.stats;
    const averageData = props.averages;
    const playerName = props.name;
    console.log(playerStats);

    return (
        <motion.div initial={{opacity: 0}} animate={{opacity:1}} transition={{duration:.65}}  id="cont" className="flex flex-col content-center justify-center items-center gap-5 w-full">
             <h3 className="mt-3 mb-3 text-center text-white font-bold">{playerName} Data Across Season</h3>
             <PlayerSeasonGraph  width={document.querySelector("#cont").offsetWidth-100}  name={playerName} data={playerStats} dataKeys={["distance", 'sprintdistance']} multiStat={true}></PlayerSeasonGraph>
             <PlayerSeasonGraph  width={document.querySelector("#cont").offsetWidth-100}  name={playerName} data={playerStats}  dataKeys={['energy', 'playerload']} multiStat={true}></PlayerSeasonGraph>
             <PlayerSeasonGraph  width={document.querySelector("#cont").offsetWidth-100}  name={playerName} data={playerStats} dataKeys={['topspeed']} multiStat={false}></PlayerSeasonGraph>
             {/* add graphs for displaying averages */}
             <h3 className="mt-3 mb-3 text-center text-white font-bold">{playerName} Average Data Per Session Type</h3>
             <PlayerSessionGraph  width={document.querySelector("#cont").offsetWidth-100}  name={playerName} data={averageData}  dataKeys={["distance", 'sprintdistance']} multiStat={true}></PlayerSessionGraph>
             <PlayerSessionGraph  width={document.querySelector("#cont").offsetWidth-100}  name={playerName} data={averageData} dataKeys={['energy', 'playerload']} multiStat={true}></PlayerSessionGraph>
             <PlayerSessionGraph  width={document.querySelector("#cont").offsetWidth-100}  name={playerName} data={averageData} dataKeys={['topspeed']} multiStat={false}></PlayerSessionGraph>
        </motion.div>
        ) 
    }

    


export default PlayerSeasonStats;

