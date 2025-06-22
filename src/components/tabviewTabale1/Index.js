import React from "react";
import { Tabs } from "antd";
import ExchangeTale from "../exchangeTable/ExchangeTale";
const { TabPane } = Tabs;

function TabviewTable1() {
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
          <ExchangeTale />
        </TabPane>
        <TabPane tab="24h Order History(Last 50)" key="2">
          <ExchangeTale />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default TabviewTable1;
