import React from "react";
import { Container } from "react-bootstrap";
import { Row, Col, Tag, Input, Slider, Switch } from "antd";

import Graph from "../../Images/Group 2082.png";

import "./style.css";
import Tabview22 from "../tabview/Index";
function GraphComponent() {
  return (
    <div>
      <div className="headofgraphcomponent">
        <Container>
          <div className="spacofgraphheadcompoennt">
            <div className="displayflexofgraph">
              <div>
                <h5
                  style={{
                    color: "#14192D",
                    fontWeight: "bold",
                    marginTop: ".5rem",
                  }}
                >
                  XRP/USDT
                </h5>
              </div>
              <div>
                <h5 className="greycolormilja">Price</h5>
                <h5 className="redcolormilja">0.75950</h5>
              </div>
              <div>
                <h5 className="greycolormilja">24h Chg</h5>
                <h5 className="redcolormilja">-1%</h5>
              </div>
              <div>
                <h5 className="greycolormilja">24h High</h5>
                <h5 style={{ color: "#14192D" }}>0.75950</h5>
              </div>
              <div>
                <h5 className="greycolormilja">24h Vol(XRP)</h5>
                <h5 style={{ color: "#14192D" }}>0.74950</h5>
              </div>
              <div>
                <h5 className="greycolormilja">24h Vol(USDT)</h5>
                <h5 style={{ color: "#14192D" }}>69,292,098.28</h5>
              </div>
            </div>
            <div className="carbon">
              <img src={"carbon_light.png"} />
            </div>
          </div>
        </Container>
      </div>

      {/* mobile view of header graph */}

      <div className="mobviewofheadergraph">
        <Container>
          <Container>
            <Row className="bottomgapmobview" justify="space-between">
              <Col>
                <h3>XRP/USDT</h3>
              </Col>
              <Col>
                <img className="carbonimgmobview" src={"carbon_light.png"} />
              </Col>
            </Row>
            <Row className="bottomgapmobview" justify="space-between">
              <Col>
                <h3 className="greycolormilja">Price</h3>
              </Col>
              <Col>
                <h3 className="redcolormilja">0.73950</h3>
              </Col>
            </Row>
            <Row className="bottomgapmobview" justify="space-between">
              <Col>
                <h3 className="greycolormilja">24h Chg</h3>
              </Col>
              <Col>
                <h3 className="redcolormilja">0.73950</h3>
              </Col>
            </Row>
            <Row className="bottomgapmobview" justify="space-between">
              <Col>
                <h3 className="greycolormilja">24h High</h3>
              </Col>
              <Col>
                <h3>0.73950</h3>
              </Col>
            </Row>
            <Row className="bottomgapmobview" justify="space-between">
              <Col>
                <h3 className="greycolormilja">24h Vol(XRP)</h3>{" "}
              </Col>
              <Col>
                <h3>0.73950</h3>
              </Col>
            </Row>
            <Row className="bottomgapmobview" justify="space-between">
              <Col>
                <h3 className="greycolormilja">24h Vol(USDT)</h3>{" "}
              </Col>
              <Col>
                <h3>0.73950</h3>
              </Col>
            </Row>
          </Container>
        </Container>
      </div>

      {/* end of mobile view of header */}

      <div className="chartsplace">
        <div className="aligintoright">
          <button className="kbutton">K line</button>
          <button className="dpethbutton">Depthg</button>
        </div>
        <div className="displayflexofimages">
          <img className="imgofgraph" src={Graph} />
          {/* <img className="imgofgraph" src={Graph} /> */}
          <div className="lineeeeee">
            <p className="lineheightofdiv">121212</p>
            <p className="lineheightofdiv">121212</p>
            <p className="lineheightofdiv">121212</p>
            <p className="lineheightofdiv">121212</p>
            <p className="lineheightofdiv">121212</p>
          </div>
        </div>
        <div className="displaflexsss">
          <p className="greycolormilja">0.000721</p>
          <p className="greycolormilja">7.0021</p>
          <p className="greycolormilja">72.001</p>
          <p className="greycolormilja">72.1111</p>
          <p className="greycolormilja">72.221</p>
          <p className="greycolormilja">72331</p>
          <p className="greycolormilja">72441</p>
          <p className="greycolormilja">72551</p>
        </div>
      </div>

      <div className="bottomRowofgraphs">
        <Tabview22 />
      </div>
    </div>
  );
}

export default GraphComponent;
