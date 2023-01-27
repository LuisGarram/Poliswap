import React from "react";
import Logo from "../assets/Logo.png";
import Poliswap from "../assets/Poliswap.png";
import "./Home.css";

const Home = () => {
  return (
    <div className="body html">
      <div className="div-img">
        <img className="image" src={Poliswap} />
      </div>
      <h1 className="h1">
        A platform to exchanges services using Filecoin as payment.
      </h1>
    </div>
  );
};

export default Home;
