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
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts';


const PlayerSessionGraph = (props) => {
    const graphW = props.width;
    const [data, setData] = useState(props.data);
    const dataKey1 = props.dataKeys[0]
    const dataKey2 = props.dataKeys[1]
    var units1 = null;
    var units2 = null;
    if (dataKey1 === "distance" | dataKey1 === "sprintdistance") {
        units1 = "yards"
        units2 = "yards"
    } else if (dataKey1 == "energy") {
        units1 = "calories"
        units2 = "work"
    } else if (dataKey1 == "topspeed") {
        units1 = "mph"
    } else if (dataKey1 == "distancepermin") {units1 = "yards/second"}
    
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
                        <p>{payload[0].name}: {payload[0].value} {units1}</p>
                        <p>{payload[1].name}: {payload[1].value} {units2}</p>
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
                        <p>{payload[0].name}: {payload[0].value} {units1}</p>
                    </p>
                    </div>
                );
        }}
        return null;
      };
    
    if (props.multiStat) {
        return (
            <div className="w-full flex flex-col justify-center items-center content-center  bg-gray-900  text-gray-400 mb-5">
                    <BarChart className="w-full mt-1 text-md bg-gray-900 text-gray-400" width={graphW} height={450} data={data}>
                        <defs>
                            <linearGradient id="col1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="col2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="email" fontSize={8} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis label={<Label angle={-90} dx={25}>{`${dataKey2} (${units2})`}</Label>} yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length} fill="url(#col1)" />
                        <Bar dataKey={dataKey2} yAxisId={"right"} barSize={graphW/data.length} fill="url(#col2)" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>
            </div>)
    } else {
        return (
            <div className="w-full flex flex-col justify-center items-center content-center  bg-gray-900  text-gray-400 mb-5">
                    <BarChart className="w-full mt-1 text-md  bg-gray-900 text-gray-400" width={graphW} height={450} data={data}>
                        <defs>
                            <linearGradient id="col1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="email" fontSize={8} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length} fill="url(#col1)" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>
            </div>)
    }
    
}

export default PlayerSessionGraph;
