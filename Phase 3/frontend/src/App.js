import React, {useEffect, useState, Fragment} from "react";

import Leaderboards from "./components/Leaderboards";
import QuerySession from "./components/QuerySession";
import QueryPlayerAll from "./components/QueryPlayerAll";
import DataEntry from "./components/DataEntry";

const App = () => {

  return (
    <>
    <div className="flex flex-col items-center w-{95%} h-screen overflow-scroll bg-gray-800 py-10 gap-5">
      
      <div className=" w-11/12 flex  gap-5">
        <div className="w-full">
          <QuerySession/>
        </div>
        <div className="w-full">
          <QueryPlayerAll/>
        </div>
      </div>
      <Leaderboards/>
      <DataEntry/>
      

      
    </div>
    </>
    
  )
}

export default App;