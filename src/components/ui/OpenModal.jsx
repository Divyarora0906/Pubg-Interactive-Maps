import React from 'react'
import "../../pages/landing/Landing.css"
import Cards from './Cards';
const OpenModal = (CheckOpen) => {
    console.log(CheckOpen.CheckOpen);
    const id = CheckOpen.CheckOpen ? "" : "Close";
  return (
    <>
     <div className='Modal' id={id}>
        <Cards Name={"Erangel"} CheckOpen = {CheckOpen.CheckOpen} src={"https://d1nglqw9e0mrau.cloudfront.net/assets/images/thumbs/erangel-ee673d73.jpg"}/>
        <Cards Name={"Miramar"} CheckOpen = {CheckOpen.CheckOpen} src={"https://d1nglqw9e0mrau.cloudfront.net/assets/images/thumbs/miramar-b0ea3b5b.jpg"}/>
        <Cards Name={"Shanhok"} CheckOpen = {CheckOpen.CheckOpen} src={"https://d1nglqw9e0mrau.cloudfront.net/assets/images/thumbs/savage-95704938.jpg"}/>
        <Cards Name={"Vikendi"} CheckOpen = {CheckOpen.CheckOpen} src={"https://d1nglqw9e0mrau.cloudfront.net/assets/images/thumbs/vikendi-ce67a32e.jpg"}/>

     </div>
    </>
  )
}

export default OpenModal