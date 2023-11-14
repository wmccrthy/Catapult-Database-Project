import React, {useEffect, useState, Fragment} from "react";

import Leaderboards from "./components/Leaderboards";
import QueryPlayer from "./components/QueryPlayer";
import QuerySession from "./components/QuerySession";
import QueryPlayerAll from "./components/QueryPlayerAll";

const App = () => {

  return (
    <>
    <div className="flex flex-col items-center w-{95%} h-screen overflow-scroll bg-gray-800 py-10 gap-5">
      {/* <div className="mb-5 font-bold">Amherst Athletics GPS Database</div> */}
      {/* <QueryPlayer /> */}
      
      <QuerySession/>
      <QueryPlayerAll/>
      <Leaderboards/>
      
    </div>
    </>
    
  )
}

export default App;