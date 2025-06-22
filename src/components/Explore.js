import React, { useState, useEffect } from "react";
import { HorzontalMenuIcon, RoundCrossIcon, HeartIcon } from "../Icons";
import axios from "axios";
import { Link, NavLink } from "react-router-dom";
import Card from "./Card";
const Explore = () => {
  const [page_number, setpage_number] = useState(1);
  const [page_size, setpage_size] = useState(8);
  const [totalitems, settotalitems] = useState();
  const [numbs, setNumbs] = useState([]);

  const getAllitemsOnSale = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/sale/getAllitemsOnSale?page_number=${page_number}&page_size=${page_size}`,
      );

      if (res?.data) {
        setNumbs([...numbs, ...res?.data?.rows]);
        settotalitems(res?.data?.count);
      }
    } catch (error) {
      console.log("error", error);
      console.log("error", error?.response);
      if (error?.response?.data == "No items found") {
        setNumbs([]);
      }
    }
  };
  useEffect(() => {
    getAllitemsOnSale();
  }, [page_number]);
  return (
    <div className="explore-sec flex aic">
      <div className="wrapWidth wraps flex flex-col">
        <div className="p-hdr flex">Explore</div>
        <div className="explore-sec-nft">
          {numbs && (
            <>{numbs?.length > 0 ? numbs.map((item, index) => <Card item={item} />) : <div className="lbl">Not Items found</div>}</>
          )}
        </div>
        <div
          onClick={() => {
            setpage_number(page_number + 1);
          }}
          className="action flex aic jc ">
          {totalitems > numbs.length && <div className="btn button">See more</div>}
        </div>
      </div>
    </div>
  );
};

export default Explore;
