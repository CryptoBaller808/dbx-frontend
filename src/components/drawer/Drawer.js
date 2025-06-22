import React, { useState } from "react";
import { Button, Drawer } from "antd";
import "./style.css";
import Drawarlogo from "../../Images/trading 1.png";
import Drawarlogo1 from "../../Images/exchange (4) 1.png";
import Drawarlogo2 from "../../Images/swap (1) 1.png";
import Drawarlogo3 from "../../Images/nft 1.png";
import Drawarlogo4 from "../../Images/online-order 1.png";
import Drawarlogo5 from "../../Images/user 1.png";

function Drawer22() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <Drawer placement="right" onClose={onClose} visible={visible}>
        <div className="divddlog">
          <img src={Drawarlogo} alt="" />
          <p className="butext">Buy / Sell</p>
        </div>
        <div className="divddlog">
          <img src={Drawarlogo1} alt="" />
          <p className="butext">Exchange</p>
        </div>
        <div className="divddlog">
          <img src={Drawarlogo2} alt="" />
          <p className="butext">Swap</p>
        </div>
        <div className="divddlog">
          <img src={Drawarlogo3} alt="" />
          <p className="butext">NFT</p>
        </div>
        <div className="divddlog">
          <img src={Drawarlogo4} alt="" />
          <p className="butext">Orders</p>
        </div>
        <div className="divddlog">
          <img src={Drawarlogo1} alt="" />
          <p className="butext">DBX Coin </p>
        </div>
        <div className="divddlog">
          <img src={Drawarlogo5} alt="" />
          <p className="butext">DBX Card</p>
        </div>
      </Drawer>
    </div>
  );
}

export default Drawer22;
