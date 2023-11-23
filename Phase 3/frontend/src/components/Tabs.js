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

const Tabs = () => {
    const [active, setActive] = useState(<div></div>)
    const [toggle, setToggle] = useState(null)
    const handleClick = (element, e) => {
        // set active tab to clicked button's associated window 
        setActive(element)
        // document.querySelector("#indicator").style.left = left;
        // e.target.classList.toggle("indic")
        // if (toggle != null) { toggle.classList.toggle("indic") }
        setToggle(e.target)
        console.log(document.querySelector("#indicator"))
        var xPos = e.target.getBoundingClientRect().left
        xPos -= document.querySelector("#nav").getBoundingClientRect().left 
        document.querySelector("#indicator").style.transform = `translateX(${xPos}px)`
    }

    return (
        <div className="flex flex-col align-center items-center w-full top-0">
            <div id="nav" className="mb-10 overflow-hidden flex align-center justify-between w-7/12 h-16 box-content bg-gray-50 border-t-0 border border-gray-300 text-gray-900 text-md font-bold rounded-b-xl dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white relative">
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
                <div id="indicator" className="w-1/4 h-2 opacity-50 absolute bottom-0 left-0  bg-white indic"></div>
            </div>
            <div className="w-4/5 flex items-center align-center justify-center">
                {active}
            </div>
        </div>
    )
}

export default Tabs;