import React from "react";
import "./style.css";
import { Row, Col } from "antd";

function Analytics2() {
  return (
    <div className="MainAnalytics2">
      <Row justify="center">
        <Col xs={24} md={10} lg={5}>
          <div className="center">
            <div className="rowana22">
              <h1 className="newtext">New Listing</h1>
              <h3 className="dbxtext">DBX Coin (DBX)</h3>
              <div className="calen">
                <div>
                  <img src="/assets/images/calendar.png" alt="" />
                </div>
                <div>
                  <h5 className="jantext">Jan 19th 10:00 UTC</h5>
                </div>
              </div>
              <img className="frame" src="/assets/images/Frame.png" alt="" />
              <img className="frame1" src="/assets/images/pro.png" alt="" />
            </div>
          </div>
        </Col>

        <Col xs={24} md={10} lg={5}>
          <div className="center">
            <div className="rowana22">
              <h1 className="newtext">NFTs</h1>
              <h3 className="dbxtext">Coming Soon!</h3>
              <div className="calen">
                <div>
                  <img src="/assets/images/calendar1.png" alt="" />
                </div>
                <div>
                  <h5 className="jantext1">Jan 19th 10:00 UTC</h5>
                </div>
              </div>
              <img className="frame22" src="/assets/images/Frame.png" alt="" />
              <img className="frame1" src="/assets/images/pro1.png" alt="" />
            </div>
          </div>
        </Col>

        <Col xs={24} md={10} lg={5}>
          <div className="center">
            <div className="rowana223">
              <h1 className="newtext">Advertise here!</h1>
              <h3 className="dbxtext">New coin or Airdrop?</h3>
              <div className="calen">
                <div>
                  <img src="/assets/images/calendar2.png" alt="" />
                </div>
                <div>
                  <h5 className="jantext2">Jan 19th 10:00 UTC</h5>
                </div>
              </div>
              <img className="frame" src="/assets/images/Frame.png" alt="" />
              <img className="frame1" src="/assets/images/pro2.png" alt="" />
            </div>
          </div>
        </Col>

        <Col xs={24} md={10} lg={5} className="center">
          <div className="center">
            <div className="rowana223">
              <h1 className="newtext">Advertise here!</h1>
              <h3 className="dbxtext">New coin or Airdrop?</h3>
              <div className="calen">
                <div>
                  <img src="/assets/images/calendar2.png" alt="" />
                </div>
                <div>
                  <h5 className="jantext3">Jan 19th 10:00 UTC</h5>
                </div>
              </div>
              <img className="frame" src="/assets/images/Frame.png" alt="" />
              <img className="frame1" src="/assets/images/pro3.png" alt="" />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Analytics2;
