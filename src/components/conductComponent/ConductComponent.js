import { Col, Row } from "antd";
import React from "react";
import "./style.css";
import Conductimg from "../../Images/Capture.PNG";
import ComingSoon from "../../Images/coming-soon.png";


function ConductComponent() {
  return (
    <div className="Mainconduct">
      <div>
        <h1 className="conducttext">Conduct Transactions Anytime, Anywhere</h1>
      </div>
      <div>
        <Row justify="space-between" style={{ marginTop: "4rem" }}>
          <Col xs={24} md={10} lg={10}>
            <div className="compdiv">
              <img className="compimg" src={ComingSoon} alt="" />
            </div>
          </Col>
          <Col xs={24} md={10} lg={10} className="bitcoll">
            <div className="bitdiv">
              <p className="bittext">
                Digital Block Exchange website & app <br /> provides you with
                simple & fast
                <br /> trading options!
              </p>
              {/* <hr className="hrbit" /> */}
            </div>
            <div className="applediv">
              <div className="downdiv">
                <div>
                  <img
                    style={{ width: "3.5rem", marginTop: "-.5rem" }}
                    src="apple.png"
                    alt=""
                  />
                </div>
                <div>
                  <p className="downtext">Download on the</p>
                  <p className="downtext1">App Store</p>
                </div>
              </div>
            </div>

            <div className="Androiddiv">
              <div className="downdiv">
                <div>
                  <img
                    style={{ width: "4.5rem" }}
                    src="Google Play Store 1.png"
                    alt=""
                  />
                </div>
                <div>
                  <p className="Androidtext">GET IT ON</p>
                  <p className="Androidtext1">Google Play</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ConductComponent;
