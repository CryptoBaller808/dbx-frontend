import React from "react";
import "./style.css";
import { Menu, Dropdown, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table } from "antd";

const columns = [
  {
    title: "Price(USDT)",
    render: (_, record) => (
      <>
        <p style={{ fontSize: "12px", fontWeight: "normal" }}>
          {record?.title}
        </p>
      </>
    ),
  },
  {
    title: "Amount(XRP)",
    render: (_, record) => (
      <>
        <p style={{ fontSize: "12px", fontWeight: "normal" }}>
          {record?.title}
        </p>
      </>
    ),
  },
  {
    title: "Vol",
    render: (_, record) => (
      <>
        <p style={{ fontSize: "12px", fontWeight: "normal" }}>
          {record?.title}
        </p>
      </>
    ),
  },
];

const data = [
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
  },
  {
    id: 1,
    title: "0.7",
    year: "13,873.5",
    stat: "10,281.65085",
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
function TraderCombinedComponent() {
  return (
    <div className="tradercompofirstDivoftradesexchange">
      <div className="displayflexoftradercomponent">
        <img className="menupic" src={"menu1.png"} />
        <img className="menupic" src={"menu2.png"} />
        <img className="menupic" src={"menu2.png"} />
        <h1 style={{ fontSize: "1.2rem" }} className="greycolormilja">
          {" "}
          Combined
        </h1>
        <Dropdown overlay={menu} placement="bottomCenter" className="decimal11">
          <Button className="decimal">
            <p className="decetext">
              5 Decimal
              <DownOutlined />
            </p>
          </Button>
        </Dropdown>
      </div>
      <hr className="linediveoo1212" />
      <div style={{ width: "100%" }}>
        <Table columns={columns} dataSource={data} size={"small"} />
      </div>
    </div>
  );
}

export default TraderCombinedComponent;
