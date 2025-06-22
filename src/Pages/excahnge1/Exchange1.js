import React from "react";
import "./style.css";
import TraderCombined2 from "../../components/TraderCombined2/TraderCombined2";
import ExchangeTaleb2 from "../../components/exachangeTable2/ExchangeTaleb2";
import { Row, Col } from "antd";
import "./style.css";
import GraphComponent2 from "../../components/graphComponent2/GraphComponent2";
import TraderComponents2 from "../../components/traderComponents2/TraderComponents2";
import ExchangeRatesComponent2 from "../../components/exchangeRatesComponent2/ExchangeRatesComponent2";

function Exchange1() {
  return (
    <div>
      <div className="wholediveofratesexchange22">
        <Row justify="center" gutter={16}>
          <Col lg={7} xs={20} md={20}>
            <ExchangeRatesComponent2 />
            <TraderComponents2 />
          </Col>
          <Col className="graphresponsive22" lg={10} xs={20} md={20}>
            <GraphComponent2 />
          </Col>
          <Col className="graphresponsive22" lg={7} xs={20} md={20}>
            <TraderCombined2 />
          </Col>
        </Row>
        <ExchangeTaleb2 />
      </div>
    </div>
  );
}

export default Exchange1;
