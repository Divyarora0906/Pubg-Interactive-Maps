import React from "react";
import "../../pages/landing/Landing.css";
import { Link } from "react-router-dom";
const Cards = ({ CheckOpen, src, Name }) => {
  let Stringss = "";
  if (Name == "Erangel") {
    Stringss = "./Erangel";
  }
  else if(Name == "Miramar"){
    Stringss = "./Miramar";
  }
  else {
    Stringss= "/CS";
  }
  return (
    <Link to={Stringss}>
      <div className="Card" id={CheckOpen ? "" : "CloseCard"}>
        <div className="img_MAP">
          <img className="imgMap" src={src} alt="" />
        </div>
        <h2>{Name}</h2>
      </div>
    </Link>
  );
};

export default Cards;
