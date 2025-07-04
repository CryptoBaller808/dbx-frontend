import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Keyboard, Pagination, Navigation } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  MenuIcon,
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
import { CopyIcon, RoundCrossIcon, SearchIcon, HorzontalMenuIcon, HeartIcon, HeartFillIcon } from "../Icons";

import HotBids from "../components/HotBids";
import LiveAuctions from "../components/LiveAuctions";
import Explore from "../components/Explore";
import CategoryItem from "../components/CategoryItems";
import ExplorePage from "../components/ExplorePage";
import NftDetail from "../components/NftDetail";
import Filters from "../components/Filters";
import axios from "axios";
import Card from "../components/Card";
import { getBanners } from "../api/executers/Banner";

const Main = ({ mintHandler }) => {
  const [tab, setTab] = useState("home");
  const api_getcatogories = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getCategories`);
    console.log("getCategories", res);
    let categories = [];
    // res data doe'nst have images , so adding data front-endly
    setNftTabs(res?.data);
  };
  const [activecategory, setactivecategory] = useState("");
  const [categoryitems, setcategoryitems] = useState([]);
  const [categoryloading, setcategoryloading] = useState([]);
  const [search, setsearch] = useState("");
  const [searchitems, setsearchitems] = useState("");
  const [showsearchitems, setshowsearchitems] = useState(false);
  const [searchloader, setsearchloader] = useState(false);
  const [banner, setbanner] = useState(null)
  const searchbackend = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/sale/search`, {
        //user_id: 113,
        string: search,
      });
      console.log("searchbackend", res);
      if (res?.data) {
        setsearchitems(res?.data?.rows);
        //setsearchitems(res?.data[0]);
        setsearchloader(false);
      }
    } catch (error) {
      console.log("error", error);
      console.log("error", error.response);
      setsearchloader(false);
      setsearchitems([]);
    }
  };
  useEffect(() => {
    if (search == "") {
      setshowsearchitems(false);
    } else {
      setshowsearchitems(true);
      setsearchloader(true);
      searchbackend();
    }
  }, [search]);
  const [pagenumber, setpagenumber] = useState(1);
  const [pagesize, setpagesize] = useState(8);
  const [totalcount, settotalcount] = useState(0);
  const api_getItemsByCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/category/getItemsByCategories/?id=${activecategory.id}&page_number=${pagenumber}&page_size=${pagesize}`,
      );
      console.log("getItemsByCategories_res", res);
      if (res?.data) {
        settotalcount(res.data.count);
        setcategoryitems([...categoryitems, ...res.data?.rows]);
      }
      setcategoryloading(false);
    } catch (error) {
      console.log("error", error);
      setcategoryloading(false);
    }
  };
  useEffect(() => {
    api_getcatogories();
  }, []);
  useEffect(() => {
    if (pagenumber > 1) {
      api_getItemsByCategories();
    }
  }, [pagenumber]);
  useEffect(() => {
    if (activecategory != "") {
      settotalcount(0);
      setpagenumber(1);
      api_getItemsByCategories();
    }
  }, [activecategory]);
  const [nftTabs, setNftTabs] = useState([
    { lbl: "All NFTs", ico: "./images/NFT All 1.svg", id: 0 },
    { lbl: "Art", ico: "./images/NFT Art 1.svg", id: 1 },
    { lbl: "Music", ico: "./images/NFT Music 1.svg", id: 2 },
    { lbl: "Motion", ico: "./images/NFT Motion 1.svg", id: 3 },
    { lbl: "Sports", ico: "./images/NFT Sports 1.svg", id: 4 },
    { lbl: "Trading Cards", ico: "./images/NFT Cards 1.svg", id: 5 },
    { lbl: "Collectibles", ico: "./images/NFT Collectibles 1.svg", id: 6 },
    { lbl: "Others", ico: "./images/NFT Others 1.svg", id: 7 },
  ]);

const handleGetBanner = async (type) => {
  try {
    const bannerData = await getBanners(type);
    if (bannerData?.imageUrl) {
      setbanner(bannerData.imageUrl);
    }
  } catch (error) {
    console.error("Failed to load banner:", error);
    // Set a default banner or hide banner section when API fails
    setbanner(null); // This will hide the loading state
  }
};

  useEffect(() => {
    handleGetBanner("nft");
  }, [handleGetBanner]);
  return (
    <div className="home-p flex flex-col">
      {/* {tab == "home" ? (
        <div className="home-sec flex jc">
          <video className="mainVideo" autoPlay loop muted>
            <source src="../../images/header-nft-final-client-new.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <></>
      )} */}
      <div>          {banner ? (
            banner.endsWith("mp4") ? (
              <div>
                <video
                  src={banner}
                  autoPlay
                  loop
                  muted
                  className="w-full"
                /> 
              </div>
            ) : (
              <img src={banner} alt="Banner" className="h-[430px] w-full" />
            )
          ) : (
            // Hide banner section when API fails or no banner available
            <div className="h-[200px] bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-3xl font-bold mb-2">Welcome to DBX NFT Marketplace</h2>
                <p className="text-lg">Discover, collect, and trade unique digital assets</p>
              </div>
            </div>
          )}
      </div>
      <div className="container flex">
        <div className="wrapWidth wrap flex flex-col">
          <Filters setsearch={setsearch} />
          {!showsearchitems && (
            <div className="filter-tabs flex aic">
              {nftTabs?.map((item, i) => (
                <div
                  onClick={() => {
                    console.log("clicckcced");
                    setcategoryitems([]);
                    setcategoryloading(true);
                    setactivecategory(item);
                  }}
                  key={i}
                  className="tab-item flex aic">
                  <img src={item.ico} className="icon" />
                  <div className="tag">{item.lbl}</div>
                </div>
              ))}
            </div>
          )}

          {activecategory != "" && (
            <CategoryItem
              activecategory={activecategory}
              Items={categoryitems}
              categoryloading={categoryloading}
              totalcount={totalcount}
              setpagenumber={setpagenumber}
              pagenumber={pagenumber}
            />
          )}
          {tab === "explore" ? (
            <ExplorePage setTab={setTab} />
          ) : tab === "nft-detail" ? (
            <NftDetail />
          ) : tab === "profile" ? (
            <></>
          ) : (
            <>
              {showsearchitems
                ? searchloader
                  ? "Loading"
                  : searchitems?.length < 1
                    ? "No item found"
                    : searchitems.map((item, index) => <Card item={item} />)
                : ""}
              {activecategory == "" && !showsearchitems && (
                <>
                  <HotBids />
                  <LiveAuctions />
                  <Explore />
                </>
              )}
            </>
          )}
        </div>
      </div>
      {tab === "home" && (
        <div className="our-app flex flex-col">
          <div className="wrapWidth wrap flex flex-col">
            <div className="pg-hdr">Download the Digital Block Exchange app to explore NFTs</div>
            <div className="meta flex aic jc">
              <div className="left flex aic jc">
                <img src="./images/pc-shap.png" className="img" />
              </div>
              <div className="right flex">
                <div className="meta flex  flex-col">
                  <div className="desc">Digital Block Exchange website & app provides you with simple & fast trading options!</div>
                  <div className="apps-link flex aic jc flex-col">
                    <div className="btn button flex aic">
                      <div className="logo flex aic jc">
                        <img src="./images/apple_logo.svg" className="logo-img" />
                      </div>
                      <div className="txt flex flex-col">
                        <div className="lbl">Download on the</div>
                        <div className="name">App Store</div>
                      </div>
                    </div>
                    <div className="btn button flex aic">
                      <div className="logo flex aic jc">
                        <img src="./images/google_store_logo.svg" className="logo-img" />
                      </div>
                      <div className="txt flex flex-col">
                        <div className="lbl">GET IT ON</div>
                        <div className="name">Google Play</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
