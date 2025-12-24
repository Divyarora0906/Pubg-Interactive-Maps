import React, { useState } from "react";
import Map from "../Map";
import "../css/IGL.css";
import logo from "../../assets/images/logo.png";

// 🎯 icons
import { MdGpsFixed } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";

const IGL = () => {
  const [activePhase, setActivePhase] = useState(1);
  const [gameSeed, setGameSeed] = useState(0);

  return (
    <div className="igl-container">
      <aside className="igl-sidebar">
        <img src={logo} alt="logo" id="logo" />

        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <button
            key={num}
            className={`igl-btn ${activePhase === num ? "active" : ""}`}
            onClick={() => setActivePhase(num)}
          >
            <MdGpsFixed
              size={16}
              style={{ marginRight: "8px", opacity: 0.9 }}
            />
            Circle {num}
          </button>
        ))}

        <div className="igl-divider" />

        <button
          className="igl-btn new-game"
          onClick={() => {
            setActivePhase(1);
            setGameSeed((p) => p + 1);
          }}
        >
          <FiRefreshCcw
            size={16}
            style={{ marginRight: "8px" }}
          />
          New Game
        </button>
      </aside>

      <main className="igl-map">
        <Map activePhase={activePhase} gameSeed={gameSeed} />
      </main>
    </div>
  );
};

export default IGL;
