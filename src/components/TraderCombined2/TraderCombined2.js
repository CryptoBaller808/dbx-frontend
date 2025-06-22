import React from "react";
import "./style.css";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "Price(USDT)",
    cell: (row) => {
      return (
        <div>
          {row.title > 0 ? (
            <p className="colorisred">{row.title}</p>
          ) : (
            <p className="colorisred">{row.title}</p>
          )}
        </div>
      );
    },
    center: true,
  },
  {
    name: "Amount(XRP)",
    selector: (row) => row.year,
    center: true,
  },
  {
    name: "Vol",
    selector: (row) => row.stat,
    center: true,
  },
];

const data = [
  {
    id: 1,
    title: "0.74110",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 2,
    title: "0.74100",
    year: "12,873.5",
    stat: "-9,281.65085",
  },
  {
    id: 3,
    title: "0.74090",
    year: "873.5",
    stat: "1,598.65085",
  },
  {
    id: 4,
    title: "0.74080",
    year: "11,873.5",
    stat: "2,678.65085",
  },
  {
    id: 5,
    title: "0.74070",
    year: "2873.5",
    stat: "81.65085",
  },
  {
    id: 6,
    title: "0.74060",
    year: "5873.5",
    stat: "6,381.65085",
  },
  {
    id: 7,
    title: "0.74050",
    year: "33,873.5",
    stat: "6,281.65085",
  },
  {
    id: 8,
    title: "0.74040",
    year: "3,873.5",
    stat: "5,381.65085",
  },
  {
    id: 9,
    title: "0.74030",
    year: "873.5",
    stat: "5,281.65085",
  },
  {
    id: 10,
    title: "0.74020",
    year: "6,73.5",
    stat: "10,281.65085",
  },
  {
    id: 11,
    title: "0.74010",
    year: "4,873.5",
    stat: "281.65085",
  },
  {
    id: 12,
    title: "0.74000",
    year: "6,873.5",
    stat: "1.65085",
  },
  {
    id: 13,
    title: "0.73990",
    year: "7,873.5",
    stat: "20,81.65085",
  },
  {
    id: 14,
    title: "0.73990",
    year: "7,873.5",
    stat: "20,81.65085",
  },
  {
    id: 15,
    title: "0.73990",
    year: "7,873.5",
    stat: "20,81.65085",
  },
  {
    id: 16,
    title: "0.73990",
    year: "7,873.5",
    stat: "20,81.65085",
  },
  {
    id: 17,
    title: "0.73990",
    year: "7,873.5",
    stat: "20,81.65085",
  },
  {
    id: 18,
    title: "0.73990",
    year: "7,873.5",
    stat: "20,81.65085",
  },
  {
    id: 19,
    title: "0.73990",
    year: "7,873.5",
    stat: "20,81.65085",
  },
  {
    id: 20,
    title: "0.73990",
    year: "7,873.5",
    stat: "20,81.65085",
  },
];

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);
function TraderCombined2() {
  return (
    <div className="tradercompofirstDivoftradesexchange22">
      <div className="displayflexoftradercomponent">
        <img className="menupic22" src={"menu1.png"} />
        <img className="menupic22" src={"menu2.png"} />
        <img className="menupic22" src={"menu2.png"} />
        <h1 style={{ fontSize: "1.4rem" }} className="greycolormilja22">
          {" "}
          Combined
        </h1>
        <Dropdown
          overlay={menu}
          placement="bottomCenter"
          className="decimal1122"
        >
          <Button className="decimal22">
            5 Decimal <DownOutlined />
          </Button>
        </Dropdown>
      </div>
      <hr className="linediveoo121222" />

      <DataTable
        fixedHeader
        fixedHeaderScrollHeight="5  00px"
        columns={columns}
        data={data}
      />
    </div>
  );
}

export default TraderCombined2;
