import React from "react";
import { Table } from "antd";
import "./style.css";

const dataSource = [
  {
    key: "1",
    Time: "2022-05-18  18:34:12",
    Pair: "XRPDBX",
    Type: "Limit",
    Side: "Sell",
    Price: "0.7395",
    Amount: "4,789.5432 XRP",
    Filled: "2,394.7716",
    Filled2: "50.00%",
    Total: "1,770.9335 USD",
    Triggerrule: "-",
    Status: "Cancel",
  },
  {
    key: "2",
    Time: "2022-05-18  18:34:12",
    Pair: "SOLODBX",
    Type: "Take Profit Market",
    Side: "buy",
    Price: "0.0959",
    Amount: "71,899.1234 SOLO",
    Amount: "4,789.5432 XRP",
    Filled: "64,709.2116",
    Filled2: "90.00%",
    Total: "6,895.1259 USD",
    Triggerrule: "MarkPrice<=0.0959",
    Status: "Cancel",
  },
  {
    key: "2",
    Time: "2022-05-18  18:34:12",
    Pair: "DBXXRDOGE",
    Type: "Market",
    Side: "Sell",
    Price: "27,211.87",
    Amount: "0.056789 DBX",
    Amount: "4,789.5432 XRP",
    Filled: "-",
    Filled2: "0.00%",
    Total: "-",
    Triggerrule: "-",
    Status: "Canceled",
  },
];

const columns = [
  {
    title: "Time",
    dataIndex: "Time",
    key: "Date",
  },
  {
    title: "Pair",
    dataIndex: "Pair",
    key: "age",
  },
  {
    title: "Type",
    dataIndex: "Type",
    key: "age",
  },
  {
    title: "Side",
    dataIndex: "Side",
    key: "address",
  },
  {
    title: "Price",
    dataIndex: "Price",
    key: "address",
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    key: "address",
  },
  {
    title: "Filled",
    dataIndex: "Filled",
    key: "address",
  },
  {
    title: "Filled%",
    dataIndex: "Filled2",
    key: "address",
  },
  {
    title: "Total",
    dataIndex: "Total",
    key: "address",
  },
  {
    title: "Trigger rule",
    dataIndex: "Triggerrule",
    key: "address",
  },
  {
    title: "Status",
    dataIndex: "Status",
    key: "address",
  },
];
function ExchangeTale2() {
  return (
    <div className="displayflexoftable22">
      <div className="mainexchangetable22">
        <div className="horizontallineoftable22" />
        <div>
          <Table
            className="tablescrollofgraph22"
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
}

export default ExchangeTale2;
