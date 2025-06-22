import React, { useCallback, useState } from "react";
import { DropDownIcon } from "../Icons";

const dropDownList = {
  xlm: { lbl: "XLM Network", value: "xlm", icon: "./images/XMLicon.png" },
  xrp: { lbl: "XRP Ledger", value: "xrp", icon: "./images/Invest1.png" },
};

const TokenListDropDown = ({ setSelectedValue, network }) => {
  const [hide, setHide] = useState(false);

  const onMenuItemClick = useCallback(
    item => {
      setHide(pre => !pre);
      setSelectedValue(item);
    },
    [setSelectedValue],
  );

  return (
    <div className="dropDown token-drop-down flex items-center justify-center flex-col relative">
      <div className="category flex items-center">
        <div
          className="cbox cleanbtn flex items-center relative pointer gap-3"
          onClick={e => {
            e.stopPropagation();
            setHide(!hide);
          }}>
          <div className="slt flex items-center gap-1">
            <div className="icon flex items-center justify-center h-5 w-5">
              <img alt="" src={dropDownList[network].icon} className="h-full w-full object-contain" />
            </div>
            <div className="unit-name flex items-center font s14 b4">
              <span className="unit-eng flex items-center font s14 b4" placeholder="Ethereum Network">
                {dropDownList[network].lbl}
              </span>
            </div>
          </div>

          <div className="arrow-icon flex items-center justify-center h-5 w-5">
            <DropDownIcon />
          </div>
        </div>
      </div>
      <div className={`block items-center absolute ${hide ? "show" : ""}`}>
        <div className="manue flex items-center flex-col anim gap-1">
          {Object.keys(dropDownList).map((key, index) => (
            <div key={index} className="slt flex items-center gap-2" onClick={onMenuItemClick.bind(this, dropDownList[key])}>
              <div className="icon flex items-center justify-center h-5 w-5">
                <img alt="" src={dropDownList[key].icon} className="h-full w-full object-contain" />
              </div>
              <div className="unit-name flex aic font s14 b4">
                <span className="unit-eng flex aic font s14 b4">{dropDownList[key].lbl}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenListDropDown;
