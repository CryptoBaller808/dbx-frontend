import React from "react";
import "./style.css";
import { Row, Col, Tabs, Input, Slider } from "antd";
import { Container } from "react-bootstrap";
import { setModalOpen } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Qlogo from "../../Images/ant-design_question-circle-outlined.png";
const { TabPane } = Tabs;

function Tabview22() {
  const dispatch = useDispatch();
  const isWalletConnected = useSelector(
    (state) => state.authReducer.isWalletConnected
  );

  function callback(key) {
    console.log(key);
  }
  return (
    <div>
      <Tabs
        className="tabsofexchangerates"
        defaultActiveKey="1"
        onChange={callback}
        style={{ width: "100%" }}
      >
        <TabPane tab="Limit" key="1">
          <Row justify="center">
            <Col className="firstcoloumofrow" lg={12} md={20}>
              <Container>
                <div className="displayflexspacebetwwen">
                  <h4 className="colorofreen">Buy XRP</h4>
                  <h4 className="greycolormilja">USDT Available:--</h4>
                </div>
                <Input
                  className="marginofinputsss"
                  addonBefore="Price"
                  addonAfter="USDT"
                  placeholder="Enter your Price"
                  size="large"
                />
                <Input
                  className="marginofinputsss"
                  addonBefore="Amount"
                  addonAfter="XRP"
                  placeholder=" "
                  size="large"
                />
                <Slider
                  className="colortrykrtyhuwy"
                  defaultValue={0}
                  dots={true}
                  step={10}
                />

                <h4 className="greycolormilja margintTopiffs ">Value --USDT</h4>
                {isWalletConnected ? (
                  <button className="bottombutton1">Buy XRP</button>
                ) : (
                  <button
                    className="bottombutton1"
                    onClick={() => dispatch(setModalOpen(true))}
                  >
                    Connect Wallet
                  </button>
                )}
              </Container>
            </Col>
            <Col className="firstcoloumofrow" lg={12} md={20}>
              <Container>
                <div className="displayflexspacebetwwen">
                  <h4 className="redcolormilja">Sell XRP</h4>
                  <h4 className="greycolormilja">XRP Avaiable:--</h4>
                </div>
                <Input
                  className="marginofinputsss"
                  addonBefore="Price"
                  addonAfter="USDT"
                  placeholder=" "
                  size="large"
                />
                <Input
                  className="marginofinputsss"
                  addonBefore="Amount"
                  addonAfter="XRP"
                  placeholder=" "
                  size="large"
                />
                <Slider
                  className="colortrykrtyhuwy"
                  defaultValue={0}
                  dots={true}
                  step={10}
                />

                <h4 className="greycolormilja margintTopiffs ">Value --USDT</h4>
                {isWalletConnected ? (
                  <button className="bottombutton12122">Sell XRP</button>
                ) : (
                  <button
                    className="bottombutton1"
                    onClick={() => dispatch(setModalOpen(true))}
                  >
                    Connect Wallet
                  </button>
                )}
              </Container>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              Market
              <img src={Qlogo} alt="" style={{ marginLeft: ".5rem" }} />
            </span>
          }
          key="2"
        >
          <Row justify="center">
            <Col className="firstcoloumofrow" lg={12} md={20}>
              <Container>
                <div className="displayflexspacebetwwen">
                  <h4 className="colorofreen">Buy XRP</h4>
                  <h4 className="greycolormilja">USDT Available:--</h4>
                </div>
                <Input
                  className="marginofinputsss"
                  addonBefore="Price"
                  addonAfter="USDT"
                  placeholder="Market"
                  size="large"
                />
                <Input
                  className="marginofinputsss"
                  addonBefore="Amount"
                  addonAfter="XRP"
                  placeholder=" "
                  size="large"
                />
                <Slider
                  className="colortrykrtyhuwy"
                  defaultValue={0}
                  dots={true}
                  step={10}
                />

                <h4 className="greycolormilja margintTopiffs ">Value --USDT</h4>
                {isWalletConnected ? (
                  <button className="bottombutton2">Buy XRP</button>
                ) : (
                  <button
                    className="bottombutton2"
                    onClick={() => dispatch(setModalOpen(true))}
                  >
                    Connect Wallet
                  </button>
                )}
              </Container>
            </Col>
            <Col className="firstcoloumofrow" lg={12} md={20}>
              <Container>
                <div className="displayflexspacebetwwen">
                  <h4 className="redcolormilja">Sell XRP</h4>
                  <h4 className="greycolormilja">XRP Avaiable:--</h4>
                </div>
                <Input
                  className="marginofinputsss"
                  addonBefore="Price"
                  addonAfter="USDT"
                  placeholder=" "
                  size="large"
                />
                <Input
                  className="marginofinputsss"
                  addonBefore="Amount"
                  addonAfter="XRP"
                  placeholder=" "
                  size="large"
                />
                <Slider
                  className="colortrykrtyhuwy"
                  defaultValue={0}
                  dots={true}
                  step={10}
                />

                <h4 className="greycolormilja margintTopiffs ">Value --USDT</h4>
                {isWalletConnected ? (
                  <button className="bottombutton12122">Sell XRP</button>
                ) : (
                  <button
                    className="bottombutton2"
                    onClick={() => dispatch(setModalOpen(true))}
                  >
                    Connect Wallet
                  </button>
                )}
              </Container>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              Trigger Order
              <img src={Qlogo} alt="" style={{ marginLeft: ".5rem" }} />
            </span>
          }
          key="3"
        >
          <Row justify="center">
            <Col className="firstcoloumofrow" lg={12} md={20}>
              <Container>
                <div className="displayflexspacebetwwen">
                  <h4 className="colorofreen">Buy XRP</h4>
                  <h4 className="greycolormilja">USDT Available:--</h4>
                </div>
                <Input
                  className="marginofinputsss"
                  addonBefore="Trigger"
                  addonAfter="USDT"
                  placeholder="Please enter Trigger price"
                  size="large"
                />
                <Input
                  className="marginofinputsss"
                  addonBefore="Limit"
                  addonAfter="USDT"
                  placeholder="Please enter Limit price"
                  size="large"
                />
                <Input
                  className="marginofinputsss"
                  addonBefore="Amount"
                  addonAfter="XRP"
                  placeholder=" "
                  size="large"
                />
                <Slider
                  className="colortrykrtyhuwy"
                  defaultValue={0}
                  dots={true}
                  step={10}
                />

                <h4 className="greycolormilja margintTopiffs ">Value --USDT</h4>
                {isWalletConnected ? (
                  <button className="bottombutton">Buy XRP</button>
                ) : (
                  <button
                    className="bottombutton"
                    onClick={() => dispatch(setModalOpen(true))}
                  >
                    Connect Wallet
                  </button>
                )}
              </Container>
            </Col>
            <Col className="firstcoloumofrow" lg={12} md={20}>
              <Container>
                <div className="displayflexspacebetwwen">
                  <h4 className="redcolormilja">Sell XRP</h4>
                  <h4 className="greycolormilja">XRP Avaiable:--</h4>
                </div>
                <Input
                  className="marginofinputsss"
                  addonBefore="Trigger"
                  addonAfter="USDT"
                  placeholder="Please enter Trigger price"
                  size="large"
                />
                <Input
                  className="marginofinputsss"
                  addonBefore="Limit"
                  addonAfter="USDT"
                  placeholder="Please enter Limit price"
                  size="large"
                />
                <Input
                  className="marginofinputsss"
                  addonBefore="Amount"
                  addonAfter="XRP"
                  placeholder=" "
                  size="large"
                />
                <Slider
                  className="colortrykrtyhuwy"
                  defaultValue={0}
                  dots={true}
                  step={10}
                />

                <h4 className="greycolormilja margintTopiffs ">Value --USDT</h4>
                {isWalletConnected ? (
                  <button className="bottombutton1212">Sell XRP</button>
                ) : (
                  <button
                    className="bottombutton"
                    onClick={() => dispatch(setModalOpen(true))}
                  >
                    Connect Wallet
                  </button>
                )}
              </Container>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Tabview22;
