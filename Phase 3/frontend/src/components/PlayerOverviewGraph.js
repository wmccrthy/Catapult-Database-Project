
import { useState, useEffect } from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label, Line, LineChart, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';


const PlayerOverviewGraph = (props) => {

    const graphW = props.width;
    const [data, setData] = useState(props.data);
    // console.log(data);
    // console.log(props.range)

    
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
                        <p>{payload[0].name}: {payload[0].value.toFixed(2)}</p>
                    </p>
                    </div>
                );
        }}
        return null;
      };
    
    //   include select option like in leaderboards where players can filter data by "all", "games", or "training" s.t trends by session type are clearer 

    return (
            <div className="w-full flex flex-col justify-center items-center content-center  bg-gray-900  text-gray-400 mb-1">
                    {/* <BarChart className="w-full mt-1 text-md bg-gray-900 text-gray-400" width={graphW} height={400} data={data}>
                        <XAxis dataKey="date" fontSize={8} angle={-10} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis label={<Label angle={-90} dx={25}>{`${dataKey2} (${units2})`}</Label>} yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length*1.5} fill="blue" />
                        <Bar dataKey={dataKey2} yAxisId={"right"} barSize={graphW/data.length*1.5} fill="rgb(150, 150, 200)" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart> */}
                    <h5 className="w-full text-center bg-gray-900 text-white font-extralight text-sm rounded-t-md">player/teamAvg Offensive Ratios</h5>
                    <RadarChart className="w-full text-md bg-gray-900 text-gray-400" width={graphW} outerRadius={graphW/4} height={graphW/1.5} data={data}>
                        <defs>
                            <linearGradient id="col1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="col3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(250, 100, 100)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="rgb(250, 0, 100)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <PolarGrid opacity={.1}></PolarGrid>
                        <PolarAngleAxis dataKey={"stat"} fontSize="1vw" opacity={.65}></PolarAngleAxis>
                        <PolarRadiusAxis domain={props.range} opacity={0}></PolarRadiusAxis>
                        <Radar dataKey="teamValue" fill="url(#col1)" stroke="url(#col1)"></Radar>
                        <Radar dataKey="playerValue" fill="url(#col2)" stroke="url(#col2)"></Radar>
                        {/* <XAxis dataKey="date" fontSize={8} angle={-10} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis label={<Label angle={-90} dx={25}>{`${dataKey2} (${units2})`}</Label>} yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Area dataKey={dataKey1} yAxisId={"left"}  fill="url(#col1)" stroke="#8884d8"/>
                        <Area dataKey={dataKey2} yAxisId={"right"} fill="url(#col2)" stroke="#82ca9d"/> */}
                        <Legend></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </RadarChart>
    </div>)
}

export default PlayerOverviewGraph;