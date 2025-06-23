import React, { useState, useCallback } from "react";
import { DropDownIcon } from "../Icons";

// Enhanced network list with all supported chains
const dropDownList = {
  btc: { lbl: "Bitcoin", value: "btc", icon: "./images/btc-icon.png", color: "#f7931a" },
  eth: { lbl: "Ethereum", value: "eth", icon: "./images/eth-icon.png", color: "#627eea" },
  bnb: { lbl: "BNB Smart Chain", value: "bnb", icon: "./images/bnb-icon.png", color: "#f3ba2f" },
  avax: { lbl: "Avalanche", value: "avax", icon: "./images/avax-icon.png", color: "#e84142" },
  matic: { lbl: "Polygon", value: "matic", icon: "./images/matic-icon.png", color: "#8247e5" },
  sol: { lbl: "Solana", value: "sol", icon: "./images/sol-icon.png", color: "#9945ff" },
  xdc: { lbl: "XDC Network", value: "xdc", icon: "./images/xdc-icon.png", color: "#2a8fbb" },
  xrp: { lbl: "XRP Ledger", value: "xrp", icon: "./images/Invest1.png", color: "#000000" },
  xlm: { lbl: "Stellar", value: "xlm", icon: "./images/XMLicon.png", color: "#14b6e7" },
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

  // Fallback to XRP if network not found
  const currentNetwork = dropDownList[network] || dropDownList.xrp;

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
              {/* Fallback icon if image doesn't exist */}
              <div 
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: currentNetwork.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              >
                {currentNetwork.value.toUpperCase().slice(0, 2)}
              </div>
            </div>
            <div className="unit-name flex items-center font s14 b4">
              <span className="unit-eng flex items-center font s14 b4" placeholder="Select Network">
                {currentNetwork.lbl}
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
                <div 
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: dropDownList[key].color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  {dropDownList[key].value.toUpperCase().slice(0, 2)}
                </div>
              </div>
              <div className="unit-name flex items-center font s14 b4">
                <span className="unit-eng flex items-center font s14 b4">
                  {dropDownList[key].lbl}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenListDropDown;

