
import { useState, useEffect } from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label, Line, LineChart, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';


const SeasonShotAccGraph = (props) => {

    const graphW = props.width;
    const [data, setData] = useState(props.data);
    console.log(data);
    const dataKey1 = props.dataKeys[0]
    const dataKey2 = props.dataKeys[1]
    
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
                            <p>{payload[0].name}: {Number(payload[0].value).toFixed(2)}%</p>
                            <p>{payload[1].name}: {Number(payload[1].value).toFixed(2)}%</p>
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
                        <p>{payload[0].name}: {payload[0].value.toFixed(2)}%</p>
                    </p>
                    </div>
                );
        }}
        return null;
      };
    
    //   include select option like in leaderboards where players can filter data by "all", "games", or "training" s.t trends by session type are clearer 

    return (
            <div className="w-full flex flex-col justify-center items-center content-center  bg-gray-900  text-gray-400 mb-5">
                    {/* <BarChart className="w-full mt-1 text-md bg-gray-900 text-gray-400" width={graphW} height={400} data={data}>
                        <XAxis dataKey="date" fontSize={8} angle={-10} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis label={<Label angle={-90} dx={25}>{`${dataKey2} (${units2})`}</Label>} yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length*1.5} fill="blue" />
                        <Bar dataKey={dataKey2} yAxisId={"right"} barSize={graphW/data.length*1.5} fill="rgb(150, 150, 200)" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart> */}
                    <h4 className="w-full text-center p-1 bg-gray-900 text-white font-light text-lg rounded-t-md">{dataKey1} and {dataKey2}</h4>
                    <RadarChart className="w-full mt-1 text-md bg-gray-900 text-gray-400" width={graphW+100} outerRadius={graphW/5} height={450} data={data}>
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
                        <PolarGrid opacity={.1}></PolarGrid>
                        <PolarAngleAxis dataKey={"date"} fontSize="1vw" opacity={.65}></PolarAngleAxis>
                        <PolarRadiusAxis dataKey={"date"} angle={90} domain={[-25.0, 100.0]} opacity={.1}/>
                        <Radar dataKey={dataKey1} fill="url(#col1)" stroke="url(#col1)"></Radar>
                        <Radar dataKey={dataKey2} fill="url(#col2)" stroke="url(#col2)"></Radar>
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

export default SeasonShotAccGraph;