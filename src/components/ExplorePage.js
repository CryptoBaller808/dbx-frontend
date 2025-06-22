import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { HorzontalMenuIcon, RoundCrossIcon, HeartIcon } from "../Icons";
import Filters from "./Filters";
import Modal from "./Modal";
import Completecheckout from "./Completecheckout";
import axios from "axios";
import CategoryItem from "../components/CategoryItems";
import Card from './Card'
const ExplorePage = ({ setTab }) => {
  const [open, setOpen] = useState(false);
  const [categoryloading,setcategoryloading] = useState([])
  const [categoryitems,setcategoryitems] = useState([])
  const [activecategory,setactivecategory] = useState("")
  const [pagenumber,setpagenumber]= useState(1)
  const [pagesize,setpagesize] = useState(8)
  const [totalcount,settotalcount] = useState(0)
  const getAllitemsOnSale = async ()  => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/sale/getAllitemsOnSale`)
    console.log('explore_res',res)
    if(res?.data){
      setNumbs(res.data?.rows)
    }
  }
  const api_getItemsByCategories = async ()  => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getItemsByCategories/?id=${activecategory?.id}&page_number=${pagenumber}&page_size=${pagesize}`)
      console.log('ItemsByCategories',res)
      if(res?.data){
        settotalcount(res.data.count)
        setcategoryitems([...categoryitems,...res.data?.rows])
      }  
      setcategoryloading(false)
    } catch (error) {
      console.log('error',error)
      setcategoryloading(false)
    }
    
    
  }
  useEffect(() => {
    if(activecategory != ""){
      api_getItemsByCategories()
    }
  },[activecategory])
  useEffect(() => {
    getAllitemsOnSale()
  },[])
  useEffect(() => {
    if(pagenumber > 1){
    api_getItemsByCategories() 
    }
  },[pagenumber])
  const [numbs, setNumbs] = useState([]);
  console.log('numbs',numbs)
  const [search,setsearch] = useState('')
  const [searchitems,setsearchitems] = useState([])
  const [searchitemslength,setsearchitemslength] = useState([])
  const [showsearchitems,setshowsearchitems] = useState(false)
  const [searchloader,setsearchloader] = useState(false)
  const searchbackend = async ()  => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/sale/search`,{
        //user_id: 113,
        string: search
      })
      console.log('searchbackend',res)
      if(res?.data){
        setsearchitems(res?.data?.rows)
        setsearchitemslength(res?.data?.count)
        setsearchloader(false)
      }
    } catch (error) {
      console.log('error',error)
      console.log('error',error.response)
      setsearchloader(false)
      setsearchitems([])
    }      
  }
  useEffect(() => {
    if(search == ""){
      setshowsearchitems(false) 
    }
    else {
      setshowsearchitems(true) 
      setsearchloader(true)
      searchbackend()
    }
  },[search])
  const [nftTabs, setNftTabs] = useState([
    { lbl: "All NFTs", ico: "./images/NFT All 1.svg", id : 0 },
    { lbl: "Art", ico: "./images/NFT Art 1.svg", id : 1 },
    { lbl: "Music", ico: "./images/NFT Music 1.svg", id : 2 },
    { lbl: "Motion", ico: "./images/NFT Motion 1.svg", id : 3 },
    { lbl: "Sports", ico: "./images/NFT Sports 1.svg", id : 4 },
    { lbl: "Trading Cards", ico: "./images/NFT Cards 1.svg", id : 5 },
    { lbl: "Collectibles", ico: "./images/NFT Collectibles 1.svg", id : 6 },
    { lbl: "Others", ico: "./images/NFT Others 1.svg", id : 7 },
  ]);
  return (
    <div className="explore-page flex aic flex-col">
      <div className="explore-filter flex aic flex-col">
        <Filters setsearch={setsearch}/>
        {
            !showsearchitems 
            &&
            <div className="filter-tabs flex aic">
            {nftTabs.map((item, i) => (
              <div 
              onClick={() => {
                console.log("clicckcced")
                setcategoryitems([])
                setcategoryloading(true)
                setactivecategory(item)}
              }
              key={i} className="tab-item flex aic">
                <img src={item.ico} className="icon" />
                <div className="tag">{item.lbl}</div>
              </div>
            ))}
          </div>
          }
           {
            activecategory != "" && !showsearchitems
            &&
            <CategoryItem activecategory={activecategory} Items={categoryitems} categoryloading={categoryloading} totalcount={totalcount} setpagenumber={setpagenumber} pagenumber={pagenumber}/>
          }
      </div>
      <div className="wrapWidth wraps flex flex-col">
        {
            activecategory == "" && !showsearchitems
            &&
            <div className="p-hdr flex w-full text-center aic jc">Explore</div> 
        }
        <div className="explore-page-nft">
          {
            showsearchitems
            ?
              searchloader ?
              "Loading.."
              :
                searchitems?.length > 0 ?
                  searchitems?.map((item, index) => (
                    <Card item={item}/>
                  ))
                  : 
                  <div className="lbl">Not Items found</div>
            :
            activecategory == "" && !showsearchitems
            && 
            numbs.map((item, index) => (
              <Card item={item}/>
            ))
          }
        </div>
        {/* <div className="action flex aic jc ">
          <div className="btn button">See more</div>
        </div> */}
      </div>
    
    </div>
  );
};

export default ExplorePage;
