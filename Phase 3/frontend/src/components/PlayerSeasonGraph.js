
import { useState, useEffect } from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label, Line, LineChart, AreaChart, Area} from 'recharts';


const PlayerSeasonGraph = (props) => {
    const playerEmail = props.email;
    const graphW = props.width;
    const initData = props.data;
    const [data, setData] = useState(props.data);
    console.log(data);
    const dataKey1 = props.dataKeys[0]
    const dataKey2 = props.dataKeys[1]
    var units1 = null;
    var units2 = null;
    if (dataKey1 == "distance") {
        units1 = "yards"
        units2 = "yards"
    } else if (dataKey1 == "energy") {
        units1 = "calories"
        units2 = "work"
    } else {
        units1 = "mph"
    }

    const getFilteredData = async (sessionType) => {
        const query = `SELECT session.date, distance, sprintdistance, topspeed, energy, playerload FROM recordsstatson JOIN session ON recordsstatson.sessionid = session.sessionid WHERE email = '${playerEmail}' AND session.type = '${sessionType}';`
        try {
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/custom?query=${query}`);
            const seasonData = await response.json();
            console.log(seasonData)
            return seasonData;
        } catch(err) {
            console.error(err)
        }
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
                        <p>{payload[0].name}: {Number(payload[0].value).toFixed(2)} {units1}</p>
                        <p>{payload[1].name}: {Number(payload[1].value).toFixed(2)} {units2}</p>
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
                        <p>{payload[0].name}: {Number(payload[0].value).toFixed(2)} {units1}</p>
                    </p>
                    </div>
                );
        }}
        return null;
      };
    
    //   include select option like in leaderboards where players can filter data by "all", "games", or "training" s.t trends by session type are clearer 

    if (props.multiStat) {
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
                    <select className=" border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  px-1 py-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" value={null} id="sel" onChange={async function (e) {
                        var typeFilter = e.target.value
                        if (typeFilter == "All") {
                            setData(initData);
                            return;}
                        var updatedData = await getFilteredData(typeFilter);
                        setData(updatedData);
                    }}>
                        <option value={null}>All</option>
                        <option value="training">Training</option>
                        <option value="game">Game</option>
                    </select>
                    <AreaChart className="w-full mt-1 text-md bg-gray-900 text-gray-400" width={graphW} height={400} data={data}>
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
                        <XAxis dataKey="date" fontSize={8} angle={-10} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis label={<Label angle={-90} dx={25}>{`${dataKey2} (${units2})`}</Label>} yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Area dataKey={dataKey1} yAxisId={"left"}  fill="url(#col1)" stroke="#8884d8"/>
                        <Area dataKey={dataKey2} yAxisId={"right"} fill="url(#col2)" stroke="#82ca9d"/>
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </AreaChart>


            </div>)
    } else {
        return (
            <div className="w-full flex flex-col justify-center items-center content-center  bg-gray-900  text-gray-400 mb-5">
                    {/* <BarChart className="w-full mt-1 text-md  bg-gray-900 text-gray-400" width={graphW} height={400} data={data}>
                        <XAxis dataKey="date" fontSize={8} angle={-10} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-10}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length} fill="blue" />
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart> */}
                    <select className=" border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  px-1 py-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" value={null} id="sel" onChange={async function (e) {
                        var typeFilter = e.target.value
                        if (typeFilter == "All") {
                            setData(initData);
                            return;}
                        var updatedData = await getFilteredData(typeFilter);
                        setData(updatedData);
                    }}>
                        <option value={null}>All</option>
                        <option value="training">Training</option>
                        <option value="game">Game</option>
                    </select>
                    <AreaChart className="w-full mt-1 text-md  bg-gray-900 text-gray-400" width={graphW} height={400} data={data}>
                        <defs>
                            <linearGradient id="col1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" fontSize={8} angle={-10} dy={8}/>
                        <YAxis label={<Label angle={-90} dx={-10}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <YAxis yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                        <Area dataKey={dataKey1} yAxisId={"left"} fill="url(#col1)"/>
                        <Legend wrapperStyle={{bottom: 0}}></Legend>
                        <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </AreaChart>
            </div>)
    }
    
}

export default PlayerSeasonGraph;