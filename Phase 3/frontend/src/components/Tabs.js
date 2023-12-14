// tab interface for switching between:
//  - players 
//  - sessions 
//  - leaderboards 
//  - data entry 

import React, {useState} from "react";
import Leaderboards from "./Leaderboards";
import QuerySession from "./QuerySession";
import QueryPlayerAll from "./QueryPlayerAll";
import DataKey from "./DataKey"
import { IoIosMan } from "react-icons/io";
import { IoCalendarSharp } from "react-icons/io5";
import { FaTrophy } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import {motion} from "framer-motion";

const Tabs = () => {
    const [active, setActive] = useState(<div></div>)
    const [toggle, setToggle] = useState(null)
    const [hovText, setHovText] = useState("")
    const [curTeam, setCurTeam] = useState('MSOC')

    const handleClick = (element, bt) => {
        // set active tab to clicked button's associated window 
        var animatedDiv = <motion.div initial={{opacity: 0}} animate={{opacity:1}} transition={{duration:0.75}}> {element} </motion.div>
        setActive(element);
        console.log(bt)
        // document.querySelector("#indicator").style.left = left;
        bt.currentTarget.querySelector("svg").classList.toggle("indic")
        if (toggle != null) { toggle.classList.toggle("indic") }
        setToggle(bt.currentTarget.querySelector("svg"))

        // console.log(bt.target)
        // console.log(document.querySelector("#indicator"))
        // var xPos = bt.getBoundingClientRect().top - (bt.getBoundingClientRect().bottom - bt.getBoundingClientRect().top)
        // // xPos -= document.querySelector("#nav").getBoundingClientRect().top
        // console.log(document.querySelector("#indicator"))
       
        // document.querySelector("#indicator").style.transform = `translateY(${xPos}px)`
        // document.querySelector("#indicator").style.opacity = `.5`
    }

    const handleMouseOver = (txt) => {
        setHovText(txt);
    }

    return (
        <div className="flex w-full min-h-full h-full justify-evenly">
            {/* <div id="nav" className="mb-10 overflow-hidden flex align-center justify-between w-7/12 h-16 bg-gray-50 border border-t-0 border-gray-300 text-gray-900 text-sm font-bold rounded-b-lg bg-gray-800 border-gray-600 placeholder-gray-400 text-white relative">
                <button className="h-full w-full hover:text-gray-500" onClick={(e) => {
                    handleClick(<QueryPlayerAll/>, e)
                }}>Players</button>
                <button className="h-full w-full hover:text-gray-500" onClick={(e) => {
                    handleClick(<QuerySession/>, e)
                }}>Sessions</button>
                <button className="h-full w-full hover:text-gray-500" onClick={(e) => {
                    handleClick(<Leaderboards/>, e)
                }}>Leaderboards</button>
                <button className="h-full w-full hover:text-gray-500" onClick={(e) => {
                    handleClick(<DataKey/>, e)
                }}>Data Entry</button>
                
            </div> */}
            <div id="nav" className="fixed z-10 top-0 md:left-0 flex md:flex-col md:pl-0 align-center items-center justify-evenly w-full md:w-20 h-28  md:h-full  border-b md:border-r   text-sm font-bold bg-gray-800 border-gray-600 placeholder-gray-400 text-white">
                {/* <div id="indicator" className="w-10 h-1/6 opacity-0 absolute top-0 left-0  bg-white indic"></div> */}
                <button className="h-fit w-full flex items-center justify-center" onClick={(e) => {
                    handleClick(<QueryPlayerAll team={curTeam} />, e)
                }}>
                    <div className="group flex items-center align-center overflow-visible">
                        <IoIosMan size="60" className="hover:rounded-md hover:bg-gray-600 rounded-3xl p-3 transition-all duration-500 bg-gray-900" onMouseOver={() => { handleMouseOver("Players")}}></IoIosMan>
                        <span className="group-hover:scale-100 w-20 flex items-center justify-center h-7 absolute md:left-24 top-10 md:top-auto opacity-90 scale-0 transition duration-300  border text-sm font-light rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">{hovText}</span>
                    </div>
                </button>
                <button className="h-fit w-full flex items-center justify-center" onClick={(e) => {
                    handleClick(<QuerySession team={curTeam} />, e)
                }}>
                    <div className="group flex items-center align-center overflow-visible">
                        <IoCalendarSharp size="60" className="hover:rounded-md hover:bg-gray-600 rounded-3xl p-3 transition-all duration-500 bg-gray-900" onMouseOver={() => { handleMouseOver("Sessions")}}></IoCalendarSharp>
                        <span className="group-hover:scale-100 w-20 flex items-center justify-center h-7 absolute md:left-24 top-10 md:top-auto opacity-90 scale-0 transition duration-300  border text-sm font-light rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">{hovText}</span>  </div>
                </button>
                <button className="w-full h-fit flex items-center justify-center"onClick={(e) => {
                    handleClick(<Leaderboards team={curTeam} />, e)
                }}>
                    <div className="group flex items-center align-center overflow-visible">
                        <FaTrophy size="60" className="hover:rounded-md hover:bg-gray-600 rounded-3xl p-3 transition-all duration-500 bg-gray-900" onMouseOver={() => { handleMouseOver("Leaderboards")}}></FaTrophy>
                        <span className="group-hover:scale-100 w-20 flex items-center justify-center h-7 absolute md:left-24 top-10 md:top-auto opacity-90 scale-0 transition duration-300  border text-xs font-light rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">{hovText}</span> </div>
                </button>
                <button className="h-fit w-full flex items-center justify-center" onClick={(e) => {
                    handleClick(<DataKey team={curTeam} />, e)
                }}>
                    <div className="group flex items-center align-center overflow-visible">
                        <FaPlus size="60" className="hover:rounded-md hover:bg-gray-600 rounded-3xl p-3 transition-all duration-500 bg-gray-900" onMouseOver={() => { handleMouseOver("Add Data")}}></FaPlus>
                        <span className="group-hover:scale-100 w-20 flex items-center justify-center h-7 absolute md:left-24 top-10 md:top-auto opacity-90 scale-0 transition duration-300  border text-xs font-light rounded-lg p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">{hovText}</span> </div>
                </button>
                <select className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-1.5 opacity-70 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"  onChange={async function (e) {
                    var typeFilter = e.target.value
                    setCurTeam(typeFilter)
                    setActive(<div></div>)
                    }}>
                    <option value="MSOC">MSOC</option>
                    <option value="WSOC">WSOC</option>
                    <option value="MLAX">MLAX</option>
                    <option value="WLAX">WLAX</option>
                </select>
            
            </div>
            <div className="md:left-12 relative w-full md:w-9/12 md:top-0 top-20 min-h-full flex justify-center content-center items-center">
                {active}
            </div>
        </div>
    )
}

export default Tabs;