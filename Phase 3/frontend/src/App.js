import React, {useEffect, useState, Fragment} from "react";

import Leaderboards from "./components/Leaderboards";
import QueryPlayer from "./components/QueryPlayer";
import QuerySession from "./components/QuerySession";
import QueryPlayerAll from "./components/QueryPlayerAll";

const App = () => {

  return (
    <>
    <div className="flex flex-col items-center w-{95%} h-screen overflow-scroll bg-gray-800 py-10 gap-5">
      
      <div className="w-6/7 flex  gap-5">
        <div className="w-full">
          <QuerySession/>
        </div>
        <div className="w-full">
          <QueryPlayerAll/>
        </div>
      </div>
      <Leaderboards/>

      
    </div>
    </>
    
  )
}

export default App;