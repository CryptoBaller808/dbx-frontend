import React from "react";
import "./style.css";
import ExchangeRatesComponent from "../../components/exchangeRatesComponent1/ExchangeRatesComponent";
import GraphComponent from "../../components/graphComponent/GraphComponent";
import TraderComponents from "../../components/tradersComponents/TraderComponents";
import TraderCombinedComponent from "../../components/traderCombinedComponent/TraderCombinedComponent";
import ExchangeTale from "../../components/exchangeTable/ExchangeTale";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";
import TabviewTable from "../../components/tabviewtable/Index";
import TabviewTable1 from "../../components/tabviewTabale1/Index";

function Exchange() {
  const isWalletConnected = useSelector(
    (state) => state.authReducer.isWalletConnected
  );

  return (
    <div>
      <div className="wholediveofratesexchange">
        <Row className="rowcenterantd" justify="space-between" gutter={10}>
          <Col lg={5} xs={20} md={20}>
            <ExchangeRatesComponent />
            <TraderComponents />
          </Col>
          <Col className="graphresponsive" lg={14} xs={20} md={20}>
            <GraphComponent />
          </Col>
          <Col className="graphresponsive" lg={5} xs={20} md={20}>
            <TraderCombinedComponent />
          </Col>
        </Row>

        {isWalletConnected ? <TabviewTable /> : <TabviewTable1 />}
      </div>
    </div>
  );
}

export default Exchange;
