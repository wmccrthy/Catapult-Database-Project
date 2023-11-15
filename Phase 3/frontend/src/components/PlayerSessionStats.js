
// TABLE WINDOW PROMPTED BY SELECTING VIEW STATS FROM THE "QUERYPLAYER" COMPONENT 

// RATHER THAN OUTPUTTING TABLE -> OUTPUT BAR GRAPH W PLAYER DATA COMPARED TO SESSION AVERAGE DATA FOR EACH RELEVANT METRIC


import { useState, useEffect } from "react";
import React from "react";
import PlayerSessionGraph from "./PlayerSessionGraph";

const PlayerSessionStats = (props) => {
    const playerStats = props.stats[0];
    const playerName = props.name;
    if (playerStats == null) {
        return (
            <div className="text-gray-500">{playerName} Has No Data for This Session</div>
    )}
    playerStats.email = props.name;
    const averageStats = props.averages;
    const totalData = []
    totalData.push(averageStats)
    totalData.push(playerStats)
    const date = props.date;
    console.log(playerStats);
    console.log(averageStats);

    return (
        <div className="flex flex-col content-center items-center justify-center gap-5 w-full">
             <h3 className="mt-1 text-center text-white font-semibold">{props.name} Data from {props.date}</h3>
             <PlayerSessionGraph data={totalData} session={props.date} dataKeys={["distance", 'sprintdistance']} multiStat={true}></PlayerSessionGraph>
            <PlayerSessionGraph data={totalData} session={props.date} dataKeys={['energy', 'playerload']} multiStat={true}></PlayerSessionGraph>
            <PlayerSessionGraph data={totalData} session={props.date} dataKeys={['topspeed']} multiStat={false}></PlayerSessionGraph>
        </div>
        ) 
    }

    


export default PlayerSessionStats;