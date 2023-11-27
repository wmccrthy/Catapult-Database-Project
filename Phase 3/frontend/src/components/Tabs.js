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

const Tabs = () => {
    const [active, setActive] = useState(<div></div>)
    const [toggle, setToggle] = useState(null)
    const [hovText, setHovText] = useState("")

    const handleClick = (element, bt) => {
        // set active tab to clicked button's associated window 
        setActive(element)
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
        <div className="flex items-center w-full min-h-full justify-evenly">
            {/* <div id="nav" className="mb-10 overflow-hidden flex align-center justify-between w-7/12 h-16 bg-gray-50 border border-t-0 border-gray-300 text-gray-900 text-sm font-bold rounded-b-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white relative">
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
            <div id="nav" className="fixed top-0 left-0 flex flex-col align-center justify-evenly w-20 h-full  bg-gray-50 border-r  border-gray-300 text-gray-900 text-sm font-bold dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                {/* <div id="indicator" className="w-10 h-1/6 opacity-0 absolute top-0 left-0  bg-white indic"></div> */}
                <button className="h-fit w-full flex items-center justify-center" onClick={(e) => {
                    handleClick(<QueryPlayerAll/>, e)
                }}>
                    <div className="group flex items-center align-center overflow-visible">
                        <IoIosMan size="60" className="hover:rounded-md hover:bg-gray-600 rounded-3xl p-3 transition-all duration-500 bg-gray-900" onMouseOver={() => { handleMouseOver("Players")}}></IoIosMan>
                        <span className="group-hover:scale-100 w-20 flex items-center justify-center h-7 absolute left-20  scale-0 transition duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm font-light rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">{hovText}</span>
                    </div>
                </button>
                <button className="h-fit w-full flex items-center justify-center" onClick={(e) => {
                    handleClick(<QuerySession/>, e)
                }}>
                    <div className="group flex items-center align-center overflow-visible">
                        <IoCalendarSharp size="60" className="hover:rounded-md hover:bg-gray-600 rounded-3xl p-3 transition-all duration-500 bg-gray-900" onMouseOver={() => { handleMouseOver("Sessions")}}></IoCalendarSharp>
                        <span className="group-hover:scale-100 w-20 flex items-center justify-center h-7 absolute left-20  scale-0 transition duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm font-light rounded-lg  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">{hovText}</span>
                    </div>
                </button>
                <button className="w-full h-fit flex items-center justify-center"onClick={(e) => {
                    handleClick(<Leaderboards/>, e)
                }}>
                    <div className="group flex items-center align-center overflow-visible">
                        <FaTrophy size="60" className="hover:rounded-md hover:bg-gray-600 rounded-3xl p-3 transition-all duration-500 bg-gray-900" onMouseOver={() => { handleMouseOver("Leaderboards")}}></FaTrophy>
                        <span className="group-hover:scale-100 w-24 flex items-center justify-center h-7 absolute left-20  scale-0 transition duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-xs font-light rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">{hovText}</span>
                    </div>
                </button>
                <button className="h-fit w-full flex items-center justify-center" onClick={(e) => {
                    handleClick(<DataKey/>, e)
                }}>
                    <div className="group flex items-center align-center overflow-visible">
                        <FaPlus size="60" className="hover:rounded-md hover:bg-gray-600 rounded-3xl p-3 transition-all duration-500 bg-gray-900" onMouseOver={() => { handleMouseOver("Add Data")}}></FaPlus>
                        <span className="group-hover:scale-100 w-20 flex items-center justify-center h-7 absolute left-20  scale-0 transition duration-300 bg-gray-50 border border-gray-300 text-gray-900 text-sm font-light rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">{hovText}</span>
                    </div>
                </button>
            </div>
            <div className="w-9/12 flex items-center align-center justify-center">
                {active}
            </div>
        </div>
    )
}

export default Tabs;