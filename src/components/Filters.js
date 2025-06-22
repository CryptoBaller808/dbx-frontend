import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  SearchIcon,
  AllNftIcon,
  ArtNftIcon,
  MusicNftIcon,
  MotionNftIcon,
  SportIcon,
  CardsIcon,
  CollectiblesIcon,
  OthersIcon,
  DropDownIcon,
  ArrowDownIcon,
} from "../Icons";
import { useDispatch, useSelector } from "react-redux";
const Filters = ({setsearch}) => {
  const [tab, setTab] = useState("");
  const {user,isAuthenticated} = useSelector((state) => state.generalReducers)
  return (
    <div className={`filter-sec flex aic}`}>
      <div className="left-search flex">
        <div className="search-box flex">
          <div className="ico">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="txt cleanbtn"
            placeholder="Collection, item or user"
            onChange={(e) => {
              setsearch(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="right-tab flex aic jc">
        <div className="tabs flex aic">
          <NavLink
            to="/nft-explore"
            className="tab-item flex aic jc"
            onClick={(e) => setTab("explore")}
          >
            <p className={`lbl ${tab === "explore" ? "" : ""}`}>Explore</p>
          </NavLink>
          {
            isAuthenticated 
            &&
            <>
              <NavLink
              to="/profile"
              className="tab-item flex aic jc"
              onClick={(e) => setTab("profile")}
              >
              <p className={`lbl flex aic ${tab === "profile" ? "" : ""}`}>
                Profile <ArrowDownIcon />
              </p>
              </NavLink>
              <div className="tab-item flex aic jc">
                <Link to="/nft-create" className="btn button">
                  Create
                </Link>
              </div>
            </>
          }

      
        </div>
      </div>
    </div>
  );
};

export default Filters;
