import React, { useState } from "react";
import "./Landing.css";
import { useRef } from "react";
import OpenModal from "../../components/ui/OpenModal";

const HeroSection = () => {
  const [Open, SetOpen] = useState(false);
  const bgref = useRef(null);
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    bgref.current.style.transform = `translate(${x}px, ${y}px) scale(1.12)`;
  };
  const HandleOpenWindow = () => {
    if (!Open) {
      SetOpen(true);
    } else {
      SetOpen(false);
    }
  };
  return (
    <>
      <div className="Hero_Container" onMouseMove={handleMouseMove}>
        <h3>Every Zone. Every Angle. Battle-Ready Maps.</h3>
        <p>
          Practice drop zones, rotations, and strategies using interactive maps
          designed for competitive gameplay.
        </p>
        <div className="bg-video" id="bfOver" ref={bgref}></div>
        <OpenModal />
        <button className="BtnGo">Let's Practice</button>
      </div>
    </>
  );
};

export default HeroSection;
