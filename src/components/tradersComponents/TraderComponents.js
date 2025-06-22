import React from "react";
import "./style.css";
import { Table } from "antd";

const columns = [
  {
    title: "Pair",
    dataIndex: "title",
    sortable: true,
  },
  {
    title: "Price",
    dataIndex: "year",
  },
  {
    title: "24h Chg",
    dataIndex: "stat",

    sortable: true,
  },
];

const data = [
  {
    id: 1,
    title: "0.7396",
    year: "408.6",
    stat: "18:19:02",
  },
  {
    id: 2,
    title: "0.7396",
    year: "28.9",
    stat: "18:19:02",
  },
];

function TraderComponents() {
  return (
    <div className="firstDivoftradesexchange">
      <div>
        <h3 className="trade">Trades</h3>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default TraderComponents;
