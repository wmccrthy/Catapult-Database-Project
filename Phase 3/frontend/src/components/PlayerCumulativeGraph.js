
import { useState, useEffect } from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label, Line, LineChart, AreaChart, Area} from 'recharts';


const PlayerCumulativeGraph = (props) => {
    const playerEmail = props.email;
    const playerName = props.name;
    const graphW = props.width;
    const initData = props.data;
    const [data, setData] = useState(props.data);
    console.log(data);

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
                        <p>{payload[0].name}: {Number(payload[0].value).toFixed(2)}</p>
                        <p>{payload[1].name}: {Number(payload[1].value).toFixed(2)}</p>
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
                        <p>{payload[0].name}: {Number(payload[0].value).toFixed(2)}</p>
                    </p>
                    </div>
                );
        }}
        return null;
      };
    
  
    return (
            <div className="w-full flex flex-col justify-center items-center content-center  bg-gray-900  text-gray-400 mb-5">
                    <h4 className="mt-3 mb-3 text-center text-white text-md">{playerName} Game Cumulative Stats</h4>
                    <BarChart className="w-full mt-1 text-md bg-gray-900 text-gray-400" width={graphW} height={400} data={initData}>
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
                        {/* <YAxis dataKey="stat"></YAxis> */}
                        {/* <XAxis dataKey="value"></XAxis> */}
                        {/* <YAxis yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis>  */}
                        <XAxis dataKey={"stat"}></XAxis>
                        <Bar dataKey="value"  barSize={400/data.length*1.5} fill="url(#col1)"/>
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>

        </div>)
    
}

export default PlayerCumulativeGraph;