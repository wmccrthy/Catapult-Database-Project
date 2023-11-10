import React, {useEffect, useState, Fragment} from "react";

import QueryPlayer from "./components/QueryPlayer";
import QuerySession from "./components/QuerySession";

const App = () => {

  return (
    <>
    <div className="flex flex-col items-center w-{95%} h-screen overflow-scroll bg-gray-800">
      {/* <div className="mb-5 font-bold">Amherst Athletics GPS Database</div> */}
      {/* <QueryPlayer /> */}
      
      <QuerySession />
    
      
    </div>
    </>
    
  )
}

export default App;