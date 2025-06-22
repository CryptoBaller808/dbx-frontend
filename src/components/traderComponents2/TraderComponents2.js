import React from "react";
import "./style.css";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "Price(USDT)",

    cell: (row) => {
      return (
        <div>
          {row.title > 0 ? (
            <p className="colorisgreen">{row.title}</p>
          ) : (
            <p className="colorisred">{row.title}</p>
          )}
        </div>
      );
    },
    sortable: true,
  },
  {
    name: "Vol(XRP)",
    selector: (row) => row.year,
    center: true,
  },
  {
    name: "Time",
    selector: (row) => row.stat,
    center: true,
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
  {
    id: 3,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 1,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 2,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 3,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 1,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 2,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 3,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 1,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 2,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
  {
    id: 3,
    title: "0.7396",
    year: "4915.6",
    stat: "18:20:02",
  },
];

function TraderComponents2() {
  return (
    <div className="firstDivoftradesexchange22">
      <div>
        <h3 className="trade22">Trades</h3>
      </div>
      <DataTable
        fixedHeader
        fixedHeaderScrollHeight="5  00px"
        columns={columns}
        data={data}
      />
    </div>
  );
}

export default TraderComponents2;
