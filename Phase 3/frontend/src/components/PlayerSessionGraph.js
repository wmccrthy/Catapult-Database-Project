// Component that will hold: 
//  - header indicating session type and date
//  - input field for filtering displayed graph data by player name 
//  - biaxial or normal bar graph 

// props: 
//  - session (works)
//  - player list (works)
//  - data keys (for bar values) (NEED TO MAKE THIS WORK NOW)


import { useState, useEffect } from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Area, AreaChart, Rectangle} from 'recharts';


const PlayerSessionGraph = (props) => {
    const session = props.session;
    const [data, setData] = useState(props.data);
    const dataKey1 = props.dataKeys[0]
    const dataKey2 = props.dataKeys[1]
    var units1 = null;
    var units2 = null;
    if (dataKey1 == "distance") {
        units1 = "meters"
    } else if (dataKey1 == "energy") {
        units1 = "calories"
        units2 = "work"
    } else {
        units1 = "mph"
    }
    
    useEffect (() => {
        if (data !== props.data) {
            setData(props.data);
        }
    }, props.data)

    // TOOLTIP CUSTOMIZING 
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            if (payload.length > 1) {
                return (
                    <div className="custom-tooltip text-center text-sm rounded-md bg-gray-700 opacity-80 px-1 py-3 shadow-neutral-400 shadow-sm">
                    <p className="label">{`${label}`}</p>
                    {/* <p className="intro">{getIntroOfPage(label)}</p> */}
                    <div className="desc">
                        <p>{payload[0].name}: {payload[0].value}</p>
                        <p>{payload[1].name}: {payload[1].value}</p>
                    </div>
                    </div>
                );
                }
            else {
                return (
                    <div className="custom-tooltip text-center text-sm rounded-md bg-gray-700 opacity-80 px-1 py-3 shadow-neutral-400 shadow-sm">
                    <p className="label">{`${label}`}</p>
                    {/* <p className="intro">{getIntroOfPage(label)}</p> */}
                    <p className="desc">
                        <p>{payload[0].name}: {payload[0].value}</p>
                    </p>
                    </div>
                );
        }}
        return null;
      };
    
    if (props.multiStat) {
        return (
            <div className="w-full flex flex-col justify-center items-center content-center bg-gray-50 dark:bg-gray-800  dark:text-gray-400 mb-5">
                    <BarChart className="w-full mt-1 text-md text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-400" width={visualViewport.width/2} height={450} data={data}>
                        <XAxis dataKey="email" fontSize={8} angle={-25} dy={8}/>
                        <YAxis yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={(visualViewport.width/2)/data.length} fill="blue" />
                        <Bar dataKey={dataKey2} yAxisId={"right"} barSize={(visualViewport.width/2)/data.length} fill="rgb(150, 150, 200)" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>
            </div>)
    } else {
        return (
            <div className="w-full flex flex-col justify-center items-center content-center bg-gray-50 dark:bg-gray-800  dark:text-gray-400 mb-5">
                    <BarChart className="w-full mt-1 text-md text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-400" width={visualViewport.width/2} height={450} data={data}>
                        <XAxis dataKey="email" fontSize={8} angle={-25} dy={8}/>
                        <YAxis yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={(visualViewport.width/2)/data.length} fill="blue" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>
            </div>)
    }
    
}

export default PlayerSessionGraph;
