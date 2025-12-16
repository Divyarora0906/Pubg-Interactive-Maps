import React from 'react'
import '../../pages/landing/Landing.css'
const Cards = ({CheckOpen, src, Name}) => {
  return (
    <div className='Card' id={CheckOpen ? "" : "CloseCard"}>
        <div className='img_MAP'>
             <img className="imgMap" src={src} alt="" />
        </div>
        <h2>{Name}</h2>
    </div>
  )
}

export default Cards