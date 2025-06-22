import React from "react";
import { Table } from "antd";
import "./style.css";
const dataSource = [];

const columns = [
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
  },
  {
    title: "Pair",
    dataIndex: "Pair",
    key: "age",
  },
  {
    title: "Type",
    dataIndex: "Pair",
    key: "age",
  },
  {
    title: "Side",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Price",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Amount",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Filled",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Filled%",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Total",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Trigger rule",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Action",
    dataIndex: "address",
    key: "address",
  },
];
function ExchangeTale() {
  return (
    <div className="displayflexoftable">
      <div className="mainexchangetable">
        <div className="horizontallineoftable" />
        <div>
          <Table
            className="tablescrollofgraph"
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
}

export default ExchangeTale;
