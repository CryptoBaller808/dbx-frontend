import React, { useState } from "react";

const Toggle = ({ setToggle,initial_value }) => {
  const [toggleOn, setToggleOn] = useState(initial_value ? initial_value : true);

  return (
    <div className="toggle-btn flex aic jc">
      <button
        onClick={() => {
          setToggleOn(!toggleOn);
          setToggle(toggleOn);
        }}
        className={`btn button cleanbtn flex aic jc rel anim ${
          toggleOn ? "" : "on"
        }`}
      >
        <div className="circle flex aic jc abs anim"></div>
      </button>
    </div>
  );
};
export default Toggle;
