import React from "react"
import { useState } from "react" 
import { motion } from "framer-motion";


const ProgressBar = (props) => {
    const completed = props.status;
   
      const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: "rgb(59, 130, 246)",
        borderRadius: 'inherit',
        textAlign: 'right'
      }
    
      const labelStyles = {
        padding: 5,
        color: 'black',
        fontWeight: 'light',
        textAlign: 'center'
      }

      return (
        <div className="border text-sm rounded-lg block bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 transition mb-10 mt-5 w-full h-5">
          <div style={fillerStyles}>
            <span style={labelStyles}>{`${completed.toFixed(0)}%`}</span>
          </div>
        </div>
      );
}

export default ProgressBar;

