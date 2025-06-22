import { Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

function TradingComponent() {
  return (
    <div className="Maintrading">
      <div>
        <h3 className="tradetext">One-Stop Trading Platfrom</h3>
        <h4 className="tradetext1">
          Digital Block Exchange uses blockchain and new technologies to allow all users
          <br /> to access fair financial services
        </h4>
      </div>
      <div>
        <Row justify="space-between" style={{ marginTop: "4rem" }}>
          <Col xs={12} md={10} lg={5} className="collll">
            <Link to="/exchange">
              {" "}
              <div className="mainexchangediv">
                <div className="exchangediv">
                  <img className="imglogo" src="exchange.png" alt="" />
                </div>
                <p className="exchangetext">Exchange</p>
              </div>
            </Link>
          </Col>
          <Col xs={12} md={10} lg={5} className="collll">
            <Link to="/swap">
              <div className="cryptodiv">
                <div className="exchangediv">
                  <img className="imglogo" src="swap 1.png" alt="" />
                </div>
                <p className="exchangetext">Swap</p>
              </div>
            </Link>
          </Col>
          <Col xs={12} md={10} lg={5} className="collll">
            <Link to="/buysell">
              <div className="leveragediv">
                <div className="exchangediv">
                  <img className="imglogo" src="crypto.png" alt="" />
                </div>
                <p className="exchangetext">Buy Crypto</p>
              </div>
            </Link>
          </Col>
          <Col xs={12} md={10} lg={5} className="collll">
            <Link to="/nft">
              <div className="aboutdiv">
                <div className="exchangediv">
                  <img className="imglogo" src="marketplace 1.png" alt="" />
                </div>
                <p className="exchangetext">Buy & Sell NFTs</p>
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default TradingComponent;
