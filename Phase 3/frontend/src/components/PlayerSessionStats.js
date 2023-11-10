
// TABLE WINDOW PROMPTED BY SELECTING VIEW STATS FROM THE "QUERYPLAYER" COMPONENT 

import { useState, useEffect } from "react";
import React from "react";

const playerSessionStats = (props) => {
    const stats = props.stats[0];
    const playerName = props.name;
    const date = props.date;
    console.log(stats);
    if (stats == null) {
        return (
            <div className="text-gray-500">{playerName} Has No Data for This Session</div>
        )
    }

    // APPLIES FILTRATION TO PLAYER LIST BASED ON NAME INPUT
    const filterList = () => {
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{stats.distance}</td>
                <td className="px-6 py-4">{stats.sprintdistance}</td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{stats.energy}</th>
                <td className="px-6 py-4">{stats.topspeed}</td>
                <td className="px-6 py-4">{stats.playerload}</td>
        </tr>
    }


    return (
        <div className="flex flex-col content-center items-center gap-5 w-full">
            <div className="h-64 w-full mb-10">
                <table className="w-full text-xs text-center text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Player
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Distance
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Sprint Distance
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Energy
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Top Speed
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Player Load
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{playerName}</td>
                                <td className="px-6 py-4">{date}</td>
                                <td className="px-6 py-4">{stats.distance}</td>
                                <td className="px-6 py-4">{stats.sprintdistance}</td>
                                <td className="px-6 py-4">{stats.energy}</td>
                                <td className="px-6 py-4">{stats.topspeed}</td>
                                <td className="px-6 py-4">{stats.playerload}</td>
                            </tr>
                    </tbody>
            </table>
            </div>
        </div>
        ) 
    }

    


export default playerSessionStats;