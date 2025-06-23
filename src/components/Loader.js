import React from "react";
import "../App.css";
import Spinner from "react-svg-spinner";

const Loader = () => {
  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="">
        <div className="block mb-6">
          <Spinner color="white" size="100px" thickness={2} />
        </div>
        <div style={{ fontFamily: "inherit", color: "white", textAlign: "center" }}>
          Now Loading...
        </div>
      </div>
    </div>
  );
};

export default Loader;
