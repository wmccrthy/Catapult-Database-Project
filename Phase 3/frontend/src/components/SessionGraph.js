// Component that will hold: 
//  - header indicating session type and date
//  - input field for filtering displayed graph data by player name 
//  - biaxial or normal bar graph 

// props: 
//  - session (works)
//  - player list (works)
//  - data keys (for bar values) (NEED TO MAKE THIS WORK NOW)


import { useState, useEffect} from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts';
import { motion } from "framer-motion";


const SessionGraph = (props) => {
    const graphW = props.width;
    const [data, setData] = useState(props.data);
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

    var graphDesc = null;
    if (!props.isAvg) {
        if (dataKey1 && dataKey2) {
            graphDesc = `${dataKey1} and ${dataKey2} per player`
        } else {graphDesc = `${dataKey1} per player`} 
    } else {
        if (dataKey1 && dataKey2) {
            graphDesc = `${dataKey1} and ${dataKey2} ${props.date} average VS season average`
        } else {graphDesc = `${dataKey1} ${props.date} average VS season average`} 
    }
    
    
    useEffect (() => {
        if (data !== props.data) {
            setData(props.data);
        }
    }, props.data)

    const [nameFilter, setFilter] = useState("");


    const filterData = async () => {
        // select rows of data where row.email IS IN filteredPLayerList (from getPlayers()) function 
        const filteredData = [];
        const filteredPlayers = await getPlayers();
        const emailList = []
        console.log(filteredPlayers)
        for (let player of filteredPlayers) {
            emailList.push(player.email.replace("@amherst.edu", ""))
        }
        console.log(emailList);
        // console.log(initData)
        for (let row of props.data) {
            console.log(row)
            if (emailList.includes(row.email)) {
                filteredData.push(row);
            }
        }
        console.log(filteredData)
        setData(filteredData);
    }
    
    const getPlayers = async () => {
        try {
            const condTest = `name ILIKE ${nameFilter}`
            var response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=player&field=name, email`);
            if (nameFilter.replace(" ", "").length >= 1) {
                response = await fetch(`http://cosc-257-node11.cs.amherst.edu:4000/select?table=player&field=name, email&condition=${condTest}`);
            } 
            const playerData = await response.json()
            console.log(playerData)
            return playerData;
        } catch(err) {
            console.log(err)
        }
    }

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
    
    if (dataKey2 != null) {
        return (
            <motion.div initial={{opacity: 0}} animate={{opacity:1}} transition={{duration:.65}}  className="w-full flex flex-col justify-center content-center  bg-gray-800  text-gray-400 mb-5">
                    <h3 className="mt-1 text-center text-white font-semibold">{graphDesc}</h3>
                    <input id="filter" className="w-full h-8 text-s text-center  bg-gray-700 text-gray-400 outline-none rounded-md" type="text" placeholder="Name" onKeyUp={function (e) {
                        setFilter(document.querySelector("#filter").value);
                        filterData();
                    }} onChange={function (e) {
                        setFilter(e.target.value)
                        filterData();
                    }}></input>
                    <BarChart className="w-full mt-1  bg-gray-800 text-gray-400" width={graphW} height={400} data={data}>
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
                            <XAxis dataKey="email" fontSize={8} angle={-25} dy={8}/>
                            <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                            <YAxis label={<Label angle={-90} dx={20}>{`${dataKey2} (${units2})`}</Label>} yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                            <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length} fill="url(#col1)" />
                            <Bar dataKey={dataKey2} yAxisId={"right"} barSize={graphW/data.length} fill="url(#col2)" />
                            <Legend wrapperStyle={{bottom: 0}}></Legend>
                            <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>
            </motion.div>)
    } else {
        return (
            <motion.div initial={{opacity: 0}} animate={{opacity:1}} transition={{duration:.65}}  className="w-full flex flex-col justify-center content-center  bg-gray-800  text-gray-400 mb-5">
                    <h3 className="mt-1 text-center text-white font-semibold">{graphDesc}</h3>
                    <input id="filter" className="w-full h-8 text-s text-center bg-gray-700 text-gray-400 outline-none rounded-md" type="text" placeholder="Name" onKeyUp={function (e) {
                        setFilter(document.querySelector("#filter").value);
                        filterData();
                    }} onChange={function (e) {
                        setFilter(e.target.value)
                        filterData();
                    }}></input>
                    <BarChart className="w-full mt-1 bg-gray-800 text-gray-400" width={graphW} height={400} data={data}>
                        <defs>
                            <linearGradient id="col1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                            <XAxis dataKey="email" fontSize={8} angle={-25} dy={8}/>
                            <YAxis label={<Label angle={-90} dx={-30}>{`${dataKey1} (${units1})`}</Label>} yAxisId="left" orientation="left" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                            <YAxis yAxisId="right" orientation="right" stroke="grey" axisLine={false} tickLine={false}></YAxis> 
                            <Bar dataKey={dataKey1} yAxisId={"left"} barSize={graphW/data.length} fill="url(#col1)" />
                            <Legend wrapperStyle={{bottom: 0}}></Legend>
                            <Tooltip content={<CustomTooltip></CustomTooltip>} cursor={{fill:"darkgrey", fillOpacity:.25}}></Tooltip>
                    </BarChart>
            </motion.div>)
    }
    
}

export default SessionGraph;
