import React from "react";
import { Tabs } from "antd";
import ExchangeTale2 from "../exachangeTable2/ExchangeTaleb2";
import ExchangeTale3 from "../exchangeTable3/Index";
const { TabPane } = Tabs;

function TabviewTable() {
  function callback(key) {
    console.log(key);
  }
  return (
    <div>
      <Tabs
        className="tabsofexchangerates"
        defaultActiveKey="1"
        onChange={callback}
        style={{
          width: "100%",
          background: "white",
          borderRadius: "1rem",
          marginTop: "1rem",
          padding: "1rem",
        }}
      >
        <TabPane tab="Open orders" key="1">
          <ExchangeTale2 />
        </TabPane>
        <TabPane tab="24h Order History(Last 50)" key="2">
          <ExchangeTale3 />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default TabviewTable;
