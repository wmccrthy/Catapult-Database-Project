import React, {useEffect, useState, Fragment} from "react";

import Leaderboards from "./components/Leaderboards";
import QuerySession from "./components/QuerySession";
import QueryPlayerAll from "./components/QueryPlayerAll";
import DataEntry from "./components/DataEntry";
import Tabs from "./components/Tabs"

const App = () => {

  return (
    <>
    <div className="flex flex-col align-baseline justify-center items-center w-screen min-h-screen overflow-y-scroll bg-gray-800 pb-10 pt-10">
      {/* <div className=" w-11/12 flex gap-5">
        <div className="w-full">
          <QuerySession/>
        </div>
        <div className="w-full">
          <QueryPlayerAll/>
        </div>
      </div>
      <Leaderboards/>
      <DataEntry/> */}
      <Tabs/>
      

      
    </div>
    </>
    
  )
}

export default App;