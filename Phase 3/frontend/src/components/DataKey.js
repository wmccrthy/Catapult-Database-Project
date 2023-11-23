import DataEntry from "./DataEntry";
import React, {useState} from "react"


const DataKey = () => {
    const [display, setDisplay] = useState(<div></div>)
    const adminPassword = "ams2023db257"

    const handleInput = (e) => {
        if (e.key == "Enter") {
            if (document.querySelector("#pass").value == adminPassword) {
                setDisplay(<DataEntry></DataEntry>)
                document.querySelector("#pass").style.display = "none";
            } else {
                setDisplay(<div className="text-white mt-2 font-bold text-center">Incorrect Password</div>)
        }}
    }
    return (
        <div className="flex flex-col align-center justify-center">
            <input type="text" id="pass" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Admin Password" onKeyDown={handleInput}></input>
            {display}
        </div>
    )
}

export default DataKey;