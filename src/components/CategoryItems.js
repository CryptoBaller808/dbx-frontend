import React, { useState, useEffect } from "react";
import { HorzontalMenuIcon, RoundCrossIcon, HeartIcon } from "../Icons";
import axios from "axios";
import Card from '../components/Card'
const Explore = ({Items,activecategory,categoryloading,setpagenumber,pagenumber,totalcount}) => {
  console.log("Items",Items)
  return (
    <div className="explore-sec flex aic">
        {
         categoryloading
         ?
         <div className="p-hdr flex">Loading</div>
         :
         <div className="wrapWidth wraps flex flex-col">
        <div className="p-hdr flex">{activecategory.lbl}</div>
        <div className="lbl">{Items.length == 0 && 'No items found'}</div>
        {
          Items ? 
            <div className="explore-sec-nft">
            {Items?.map((item, index) => (
              <Card item={item}/>
            ))}
            </div>
          : ''
        }
        
        {
         Items ?
         Items?.length < totalcount 
         &&
          <div 
          onClick={() => setpagenumber(++pagenumber)}
          className="action flex aic jc ">
            <div className="btn button">See more</div>
          </div>
          :
          ''
        }
      </div>
        }
      
    </div>
  );
};

export default Explore;
