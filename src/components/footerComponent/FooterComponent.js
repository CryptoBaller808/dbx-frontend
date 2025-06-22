import { Col, Row } from "antd";
import React from "react";
import "./style.css";
import DB from "../../Images/DB.png";
import Telegram from "../../Images/telegram.png";
import Twi from "../../Images/twi.png";

function FooterComponent() {
  return (
    <div className="MainFooter">
      <div>
        <Row justify="space-between" style={{ width: "70vw" }}>
          <Col xs={24} md={10} lg={4} className="footercoll1">
            <div>
              <div>
                <img className="footerlogo" src={DB} alt="" />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginTop: "2.5rem",
                }}
              >
                <div>
                <a href="https://t.me/DigitalBlockEx" target="_blank"><img style={{ width: "3rem" }} src={Telegram} alt="" /></a>
                </div>
                <div>
                <a href="https://twitter.com/DigitalBlockEx" target="_blank"><img style={{ width: "3rem" }} src={Twi} alt="" /></a>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={10} lg={4}>
            {/*<div className="footercoll1">
              <p className="footertext">Useful Link</p>
              <p className="footertext1">About Us</p>
              <p className="footertext1">Help Center</p>
              <p className="footertext1">White Paper</p>
              <p className="footertext1">Tokenomics</p>
            </div>*/}
          </Col>
          <Col xs={24} md={10} lg={4}>
            <div className="footercoll1">
              <p className="footertext">Legal</p>
              <p className="footertext1">Privacy Policy</p>
              <p className="footertext1">Terms of Service</p>
            </div>
          </Col>
          <Col xs={24} md={10} lg={4}>
            {/*<div className="footercoll1">
              <p className="footertext">Trading</p>
              <p className="footertext1">Fees</p>
            </div>*/}
          </Col>
          <Col xs={24} md={10} lg={4}>
          <div className="footercoll1">
              <p className="footertext">Contact Us</p>
              <p className="footertext1">FAQ</p>
              <p className="footertext1">Listing Application</p>
            </div>
          {{/*
              <p className="footertext">Contact Us</p>
              <p className="footertext1">Submit a request</p>
              <p className="footertext1">Locate a Lost Deposit</p>
              <p className="footertext1">Telegram</p>
            */}}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default FooterComponent;
