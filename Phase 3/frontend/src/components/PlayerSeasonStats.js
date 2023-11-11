// this component will display a graph of one player's stats per metric across all sessions !!!

import { useState, useEffect } from "react";
import React from "react";
import PlayerSessionGraph from "./PlayerSessionGraph";
import PlayerSeasonGraph from "./PlayerSeasonGraph";

const PlayerSeasonStats = (props) => {
    const playerStats = props.stats;
    const playerName = props.name;
    const date = props.date;
    console.log(playerStats);

    return (
        <div className="flex flex-col content-center justify-center items-center gap-5 w-full">
             <h3 className="mt-3 mb-3 text-center text-white font-bold">{playerName} Data Across Season</h3>
             <PlayerSeasonGraph name={playerName} data={playerStats} session={props.date} dataKeys={["distance", 'sprintdistance']} multiStat={true}></PlayerSeasonGraph>
             <PlayerSeasonGraph name={playerName} data={playerStats} session={props.date} dataKeys={['energy', 'playerload']} multiStat={true}></PlayerSeasonGraph>
             <PlayerSeasonGraph name={playerName} data={playerStats} session={props.date} dataKeys={['topspeed']} multiStat={false}></PlayerSeasonGraph>
        </div>
        ) 
    }

    


export default PlayerSeasonStats;
