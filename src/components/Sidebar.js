import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { CrossIcon } from "../Icons";

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const navBarItems = [
    { lbl: "Home", icon: "./images/menuIcon0.png", slug: "/" },
    //{ lbl: "Buy / Sell", icon: "./images/menuIcon1.svg", slug: "/buysell" },
    { lbl: "Exchange", icon: "./images/menuIcon2.svg", slug: "/exchange" },
    { lbl: "Swap", icon: "./images/menuIcon3.svg", slug: "/swap" },
    { lbl: "NFT", icon: "./images/menuIcon4.svg", slug: "/nft" },
    //{lbl: "Orders",icon: "./images/menuIcon5.svg",slug: "/orders/openorders",},
    //{ lbl: "DBX Coin", icon: "./images/menuIcon6.svg", slug: "/dbx_coin" },
    //{ lbl: "DBX Card", icon: "./images/menuIcon7.svg", slug: "/dbx_card" },
    {
      lbl: "Explore",
      icon: "./images/menuIcon2.svg",
      slug: "/nft-explore",
    },
    { lbl: "Profile", icon: "./images/menuIcon7.svg", slug: "/profile" },
    { lbl: "Create", icon: "./images/menuIcon4.svg", slug: "/nft-create" },
  ];

  useEffect(() => {
    const fun = async () => {
      document.body.addEventListener("click", () => {
        document.body.style.overflowY = "auto";
        setOpenSidebar(false);
      });
    };

    fun();
  }, [setOpenSidebar]);

  return (
    <div className={`sidebar-s fixed rel anim ${openSidebar ? "show" : "hide"}`}>
      <div
        className={`side-block flex col anim ${openSidebar ? "show" : "hide"}`}
        onClick={e => {
          e.stopPropagation();
        }}>
        <div className="hdr flex">
          <div
            className="icon-close "
            onClick={e => {
              setOpenSidebar(false);
            }}>
            <CrossIcon />
          </div>
        </div>
        <div>
          <div className="items flex aic flex-col">
            {navBarItems.map((item, index) => (
              <NavLink
                key={index}
                exact
                to={`${item.slug}`}
                className={`list-item flex `}
                onClick={e => {
                  setOpenSidebar(false);
                }}>
                <img src={item.icon} className="lbl-icon mr-8" />
                <div className="li cfff font">{item.lbl}</div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
