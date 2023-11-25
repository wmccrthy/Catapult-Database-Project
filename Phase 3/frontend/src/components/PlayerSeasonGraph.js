
import { useState, useEffect } from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts';


const PlayerSeasonGraph = (props) => {
    const graphW = props.width;
    const [data, setData] = useState(props.data);
    console.log(data);
    const dataKey1 = props.dataKeys[0]
    const dataKey2 = props.dataKeys[1]
    var units1 = null;
    var units2 = null;
    if (dataKey1 == "distance") {
        units1 = "meters"
        units2 = "meters"
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
                    <BarChart className="w-full mt-1 text-md text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-400" width={graphW} height={400} data={data}>
                        <XAxis dataKey="date" fontSize={8} angle={-10} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis label={<Label angle={-90} dx={25}>{`${dataKey2} (${units2})`}</Label>} yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length*1.5} fill="blue" />
                        <Bar dataKey={dataKey2} yAxisId={"right"} barSize={graphW/data.length*1.5} fill="rgb(150, 150, 200)" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>
            </div>)
    } else {
        return (
            <div className="w-full flex flex-col justify-center items-center content-center bg-gray-50 dark:bg-gray-800  dark:text-gray-400 mb-5">
                    <BarChart className="w-full mt-1 text-md text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-400" width={graphW} height={400} data={data}>
                        <XAxis dataKey="date" fontSize={8} angle={-10} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-10}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length} fill="blue" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>
            </div>)
    }
    
}

export default PlayerSeasonGraph;