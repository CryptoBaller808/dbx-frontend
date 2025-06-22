import React, { useState, useEffect } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import Filters from "../components/Filters";
import { CopyIcon, RoundCrossIcon, SearchIcon, HorzontalMenuIcon, HeartIcon } from "../Icons";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import moment from "moment";
const MyNftDetail = ({ location }) => {
  const [activeTab, setActiveTab] = useState("Items");
  const [collectionloading, setCollectionloading] = useState(true);
  const [collectionitemsloading, setCollectionitemsloading] = useState(true);
  const [collection, setCollection] = useState();
  const [collectionitems, setCollectionitems] = useState([]);
  const [customCollectionId, setCustomCollectionId] = useState();
  const [collectionitems_activities, setcollectionitems_activities] = useState([]);
  const [search, setsearch] = useState("");
  const { name } = useParams();

  const searchs = useLocation().search;
  const id = new URLSearchParams(searchs).get("id");
  console.log("query", id);
  console.log("nameee", name);
  const api_getCollection = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/collection/getCollectionbycId?${id ? `id=${id}` : `custom_url=${name}`}`);
      console.log("api_getCollection_res", res);
      console.log(res?.data);
      if (res?.data) {
        setCollection(res.data?.collection);
        setCustomCollectionId(res?.data?.collection?.id);
        setCollectionitems(res.data?.item_list?.rows);
      }
      setCollectionloading(false);
    } catch (error) {
      console.log("error", error);
      //setCollectionloading(false)
    }
  };
  const api_getCollectionitems = async (id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/collection/getAllitemsByCollectionId?id=${id}`);
      console.log("api_getCollectionitems_res", res);
      if (res?.data) {
        setCollectionitems(res.data?.rows);
      }
      setCollectionitemsloading(false);
    } catch (error) {
      console.log("error", error);
      setCollectionitemsloading(false);
    }
  };
  const api_getActivityByCollectionId = async (id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/collection/getActivityByCollectionId?id=${id}`);
      console.log("api_getActivityByCollectionId", res);
      if (res?.data) {
        setcollectionitems_activities(res.data?.rows);
      }
      setCollectionitemsloading(false);
    } catch (error) {
      console.log("error", error);
      setCollectionitemsloading(false);
    }
  };

  useEffect(() => {

    if(customCollectionId){
      console.log("custom url id ",customCollectionId)
      api_getCollectionitems(customCollectionId);
      api_getActivityByCollectionId(customCollectionId);
    }

  }, [customCollectionId])
  useEffect(() => {
    api_getCollection();
  }, []);

  const activitys = [
    {
      tag: "Transfer",
      lbl1: "Voxel Village Official",
      lbl2: "Voxel Village #2",
      price: "---",
      qty: "1",
      from: "CloneX",
      to: "you",
      time: "3 months",
    },
    {
      tag: "Minted",
      lbl1: "ClonerX",
      lbl2: "ClonerX #2118",
      price: "---",
      qty: "1",
      from: "NullAddress",
      to: "Unnamed",
      time: "2 months",
    },
    {
      tag: "Bid",
      lbl1: "Voxel Village Official",
      lbl2: "Voxel Village #2",
      price: "63.20",
      qty: "1",
      from: "you",
      to: "---",
      time: "1 month",
    },
    {
      tag: "Offer",
      lbl1: "New Age soldier ...",
      lbl2: "Tommy #700",
      price: "25.40",
      qty: "1",
      from: "you",
      to: "---",
      time: "3 months",
    },
  ];
  // console.log("collection", collection);
  return (
    <div className="my-nfts-page flex flex-col">
      <div className="profile-page-filter flex aic flex-col">{/* <Filters /> */}</div>
      <div className="wrapWidth wrap flex flex-col">
        {collectionloading ? (
          "Loading..."
        ) : (
          <>
            <div className="nft-info flex flex-col">
              <img src={`${collection?.cover_image ? collection?.cover_image : "./images/banner-img-nft.png"}`} className="banner-img" />
              <div className="user-p flex flex-col aic jc">
                <img src={`${collection?.profile_image ? collection?.profile_image : "unkdownload.jpeg"}`} className="user-img" />

                <div className="user-name">{collection.name}</div>
                <div className="user-token flex aic">
                  <div className="lbl">{/* Created by <span className="tkn">EXPLODED</span> */}</div>
                </div>
              </div>
            </div>
            <div className="report-block flex aic jc">
              <div className="report-grid">
                <div className="report-card flex aic jc flex-col">
                  <div className="_numbs flex aic jc">
                    <div className="numb-lbl">{collection.total_items}</div>
                  </div>
                  <div className="report-lbl">items</div>
                </div>
                <div className="report-card flex aic jc flex-col">
                  <div className="_numbs flex aic jc">
                    <div className="numb-lbl">{collection.owners}</div>
                  </div>
                  <div className="report-lbl">owners</div>
                </div>
                <div className="report-card flex aic jc flex-col">
                  <div className="_numbs flex aic jc">
                    <div className="ico">
                      <RoundCrossIcon />
                    </div>
                    <div className="numb-lbl">{collection.floor_price}</div>
                  </div>
                  <div className="report-lbl">floor price</div>
                </div>
                {/*<div className="report-card flex aic jc flex-col">
                  <div className="_numbs flex aic jc">
                    <div className="ico">
                      <RoundCrossIcon />
                    </div>
                    <div className="numb-lbl">{collection.volume_traded}</div>
                  </div>
                  <div className="report-lbl">volume traded</div>
                </div>*/}
              </div>
            </div>
          </>
        )}
        <div className="profile-tabs flex aic jc">
          <div className={`tab-item flex`}>
            <p className={`lbl ${activeTab === "Items" ? "active" : ""}`} onClick={e => setActiveTab("Items")}>
              Items
            </p>
          </div>
          <div className={`tab-item flex`}>
            <p className={`lbl ${activeTab === "Activity" ? "active" : ""}`} onClick={e => setActiveTab("Activity")}>
              Activity
            </p>
          </div>
        </div>
        <div className="search-box flex">
          <div className="ico">
            <SearchIcon />
          </div>
          <input onChange={e => setsearch(e.target.value)} type="text" className="txt cleanbtn" placeholder="Search" />
        </div>
        {collectionitemsloading ? (
          "Loading..."
        ) : (
          <>
            {activeTab === "Activity" ? (
              <div className="u-a flex">
                <div className="user-activity flex  flex-col">
                  <div className="tbl flex flex-col">
                    <div className="row flex aic">
                      <div className="row-item flex"></div>
                      <div className="row-item flex">Item</div>
                      <div className="row-item flex">Price</div>
                      <div className="row-item flex">Quantity</div>
                      <div className="row-item flex">From</div>
                      <div className="row-item flex">To</div>
                      <div className="row-item flex">Time</div>
                    </div>
                    {collectionitems_activities.map((item, index) => (
                      <div className="row flex aic">
                        <div className="row-item flex">{item.tag}</div>
                        <div className="row-item flex aic">
                          <img src={item.item_detail?.image_uri} className="img" />
                          <div className="nft-names flex flex-col">
                            <div className="lbl1">{item.item_detail?.title}</div>
                            <div className="lbl2">{item.item_detail?.description}</div>
                          </div>
                        </div>
                        <div className="row-item flex">{item.price ? Number(item.price).toFixed(2) : 0}</div>
                        <div className="row-item flex">{item.Quantity ? item.Quantity : 1}</div>
                        <div className="row-item flex">
                          {item.seller_details?.firstname} {item.seller_details?.lastname}
                        </div>
                        <div className="row-item flex">
                          {item.buyer_details?.firstname} {item.buyer_details?.lastname}
                        </div>
                        <div className="row-item flex">{moment(item.entry_date).calendar()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="nfts-blk flex flex-col">
                <div className="profile-page-nft">
                  {collectionitems?.map((item, index) => {
                    if (search) {
                      if (item?.item_detail?.title?.includes(search)) {
                        return <Card item={item} />;
                      }
                    } else {
                      return <Card item={item} />;
                    }
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyNftDetail;
