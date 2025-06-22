import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Filters from "../components/Filters";
import { CopyIcon, RoundCrossIcon, SearchIcon, HorzontalMenuIcon, HeartIcon, HeartFillIcon, EditIcon } from "../Icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Card from "../components/Card";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("On Sale");
  const { user } = useSelector(state => state.generalReducers);
  console.log("user", user);

  let dottedStr = user?.wallet_address?.substr(0, 5) + "..." + user?.wallet_address?.substr(user?.wallet_address?.length - 4);
  const [selectedItems, setselectedItems] = useState([]);
  const [collectedItems, setcollectedItems] = useState([]);
  const [favouriteItems, setfavouriteItems] = useState([]);
  const [createdCollections, setcreatedCollections] = useState([]);
  const [CreatedItems, setCreatedItems] = useState([]);
  const [OnSaleItems, setOnSaleItems] = useState([]);
  const [activities, setactivities] = useState([]);
  const [activecategory, setactivecategory] = useState("");
  const [loading, setloading] = useState(true);
  const [categorycollecteditems, setcategorycollecteditems] = useState("");
  const [categorycreateditems, setcategorycreateditems] = useState("");
  const [onsalecategoryitems, setonsalecategoryitems] = useState("");
  console.log("selectedItems", selectedItems);
  const get_profiles_getCollectedItemsByUserIdAndCategoryId = async () => {
    setsearchitemwithuseridorbycategoryloading(true);
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/profiles/getCollectedItemsByUserIdAndCategoryId/?user_id=${user.id}&cat_id=${activecategory?.id}`,
    );
    console.log("getCollectedItemsByUserIdAndCategoryId ", res);
    if (res?.data) {
      setsearchitemwithuseridorcategoryitems(res.data?.rows);
      setsearchitemwithuseridorbycategoryloading(false);
    }
  };
  const get_profiles_getCreatedItemsByUserIdAndCategoryId = async () => {
    setsearchitemwithuseridorbycategoryloading(true);
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/profiles/getCreatedItemsByUserIdAndCategoryId?user_id=${user.id}&cat_id=${activecategory?.id}`,
    );
    console.log("getCreatedItemsByUserIdAndCategoryId", res);
    if (res?.data) {
      setsearchitemwithuseridorcategoryitems(res.data?.rows);
      setsearchitemwithuseridorbycategoryloading(false);
    }
  };
  const post_profiles_getItemsOnSaleByUserIdAndCategoryId = async () => {
    setsearchitemwithuseridorbycategoryloading(true);
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/profiles/getItemsOnSaleByUserIdAndCategoryId?user_id=${user.id}&cat_id=${activecategory?.id}`,
    );
    console.log("getItemsOnSaleByUserIdAndCategoryId", res);
    if (res?.data) {
      setsearchitemwithuseridorcategoryitems(res.data?.rows);
      setsearchitemwithuseridorbycategoryloading(false);
    }
  };
  useEffect(() => {
    if (activecategory != "") {
      setshowsearchitemswithuseridorbycategory(true);
      if (activeTab == "On Sale") {
        post_profiles_getItemsOnSaleByUserIdAndCategoryId();
      } else if (activeTab == "Collected") {
        get_profiles_getCollectedItemsByUserIdAndCategoryId();
      } else if (activeTab == "Created") {
        get_profiles_getCreatedItemsByUserIdAndCategoryId();
      }
    }
  }, [activecategory]);
  useEffect(() => { }, [activeTab]);
  const getCollectedItemsByUserId = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/getCollectedItemsByUserId/?id=${user.id}`);
    console.log("getCollectedItemsByUserId", res);
    if (res?.data) {
      setcollectedItems(res.data?.rows);
    }
  };
  console.log("activities", activities);
  const getActivityByUserId = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/getActivityByUserId/?id=${user.id}`);
    console.log("getActivityByUserId", res);
    if (res?.data) {
      setactivities(res.data?.rows);
    }
  };
  const getCreatedItemsByUserId = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/getCreatedItemsByUserId/?id=${user.id}`);
    console.log("getCreatedItemsByUserId_resp1", res);
    if (res?.data) {
      setCreatedItems(res.data?.rows);
    }
  };
  const getAllItemsOnSaleByUserId = async () => {
    try {
      setloading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/getAllItemsOnSaleByUserId/?id=${user.id}`);
      console.log("getAllItemsOnSaleByUserId", res);
      if (res?.data) {
        setOnSaleItems(res.data?.rows);
        setselectedItems(res.data?.rows);
        setloading(false);
      }
    } catch (error) {
      console.log(error.response);
      setloading(false);
    }
  };
  const getfavouriteByUserId = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/profiles/getFavoriteItemsByUserId?id=${user.id}&page_number=${1}&page_size=${100}`,
    );
    console.log("getFavoriteItemsByUserId", res);
    if (res?.data) {
      setfavouriteItems(res.data?.rows);
    }
  };
  useEffect(() => {
    if (activeTab == "Favorites") {
      getfavouriteByUserId();
    }
  }, [activeTab]);
  const getcreatedCollectionsByUserId = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/collection/getCollectionbyUserId/${user.id}`);
    console.log("getCollectionbyUserId", res);
    if (res?.data) {
      setcreatedCollections(res.data);
    }
  };
  useEffect(() => {
    getCollectedItemsByUserId();
    getCreatedItemsByUserId();
    getAllItemsOnSaleByUserId();
    getfavouriteByUserId();
    getcreatedCollectionsByUserId();
    getActivityByUserId();
  }, [user]);
  const tabList = [
    { lbl: "On Sale", id: "#" },
    { lbl: "Collected", id: "#collect" },
    { lbl: "Created", id: "#create" },
    { lbl: "Activity", id: "#activity" },
    { lbl: "Favorites", id: "#favorit" },
  ];
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
  const [search, setsearch] = useState("");
  const [searchitemwithuserid, setsearchitemwithuserid] = useState("");
  const [searchitemwithuseridorcategoryitems, setsearchitemwithuseridorcategoryitems] = useState("");
  const [searchitemwithuseridorbycategoryloading, setsearchitemwithuseridorbycategoryloading] = useState("");
  const [showsearchitemswithuseridorbycategory, setshowsearchitemswithuseridorbycategory] = useState(false);
  const [searchitems, setsearchitems] = useState([]);
  const [showsearchitems, setshowsearchitems] = useState(false);
  const [searchloader, setsearchloader] = useState(false);
  const searchbackend = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/sale/search`, {
        //user_id: 113,
        string: search,
      });
      console.log("searchbackend", res);
      if (res?.data) {
        setsearchitems(res?.data?.rows);
        setsearchloader(false);
      }
    } catch (error) {
      console.log("error", error);
      console.log("error", error.response);
      setsearchloader(false);
      setsearchitems([]);
    }
  };
  const searchbackendwithuserid = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/profiles/searchForUserId`, {
        user_id: user.id,
        search_string: searchitemwithuserid,
      });
      console.log("searchbackend", res);
      if (res?.data) {
        setsearchitemwithuseridorcategoryitems(res?.data?.rows);
        setsearchitemwithuseridorbycategoryloading(false);
      }
    } catch (error) {
      console.log("error", error);
      console.log("error", error.response);
      setsearchitemwithuseridorbycategoryloading(false);
      setsearchitemwithuseridorcategoryitems([]);
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
  useEffect(() => {
    if (searchitemwithuserid == "") {
      setshowsearchitemswithuseridorbycategory(false);
    } else {
      setshowsearchitemswithuseridorbycategory(true);
      setsearchitemwithuseridorbycategoryloading(true);
      searchbackendwithuserid();
    }
  }, [searchitemwithuserid]);
  return (
    <>
      <div className="profile-page flex flex-col">
        <div className="profile-page-filter flex aic flex-col">
          <Filters setsearch={setsearch} />
        </div>
        {showsearchitems ? (
          <div className="profile-page-nft">
            {searchloader ? (
              "Loading"
            ) : searchitems?.length < 1 ? (
              "No item found"
            ) : (
              <div className="wrapWidth wrap flex flex-col">
                <div className="user-info flex flex-col">
                  <div className="nfts-blk flex flex-col">
                    {searchitems.map((item, index) => (
                      <Card item={item} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="wrapWidth wrap flex flex-col">
            <div className="user-info flex flex-col">
              <img
                // src="unknow.jpeg"
                //src={`${user?.cover_image}`}
                src={`${user?.cover_image ? user?.cover_image : "unknow.jpeg"}`}
                className="banner-img"
              />
              <div className="user-p flex flex-col aic jc">
                <div className="user-img-sec flex rel">
                  <img src={`${user?.profile_image ? user?.profile_image : "unkdownload.jpeg"}`} className="user-img" />
                  <Link to="/profile-edit">
                    <div className="edit-icon flex aic jc abs">
                      <EditIcon />
                    </div>
                  </Link>
                </div>
                <div className="user-name">{`${user?.firstname ? user?.firstname : "Unknown user"}`}</div>
                <div className="user-token flex aic">
                  <div className="icon-token ">
                    <RoundCrossIcon />
                  </div>
                  <div className="lbl">{dottedStr ? dottedStr : ""}</div>
                  <CopyToClipboard text={user?.wallet_address}>
                    <div className="icon-copy cursor-pointer">
                      <CopyIcon />
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
            <div className="profile-tabs flex aic">
              <div className={`tab-item flex`}>
                <p
                  className={`lbl ${activeTab === "On Sale" ? "active" : ""}`}
                  onClick={e => {
                    setActiveTab("On Sale");
                    setshowsearchitemswithuseridorbycategory(false);
                    setselectedItems(OnSaleItems);
                  }}>
                  On Sale
                </p>
              </div>
              <div className={`tab-item flex`}>
                <p
                  className={`lbl ${activeTab === "Collected" ? "active" : ""}`}
                  onClick={e => {
                    setActiveTab("Collected");
                    setshowsearchitemswithuseridorbycategory(false);
                    setselectedItems(collectedItems);
                  }}>
                  Collected
                </p>
              </div>
              <div className={`tab-item flex`}>
                <p
                  className={`lbl ${activeTab === "Created" ? "active" : ""}`}
                  onClick={e => {
                    setActiveTab("Created");
                    setshowsearchitemswithuseridorbycategory(false);
                    setselectedItems(CreatedItems);
                  }}>
                  Created
                </p>
              </div>
              <div className={`tab-item flex`}>
                <p className={`lbl ${activeTab === "Collections" ? "active" : ""}`} onClick={e => setActiveTab("Collections")}>
                  Created Collecions
                </p>
              </div>
              <div className={`tab-item flex`}>
                <p className={`lbl ${activeTab === "Activity" ? "active" : ""}`} onClick={e => setActiveTab("Activity")}>
                  Activity
                </p>
              </div>

              <div className={`tab-item flex`}>
                <p
                  className={`lbl ${activeTab === "Favorites" ? "active" : ""}`}
                  onClick={e => {
                    setActiveTab("Favorites");
                    setselectedItems(favouriteItems);
                  }}>
                  Favorites
                </p>
              </div>

              {/* {tabList.map((item, i) => (
            <div
              className={`tab-item flex ${
                activeTab === "On Sale" ? "active" : ""
              }`}
            >
              {item.lbl}
            </div>
          ))} */}
            </div>
            <div className="search-box flex">
              <div className="ico">
                <SearchIcon />
              </div>
              <input
                onChange={e => {
                  setsearchitemwithuserid(e.target.value);
                }}
                value={searchitemwithuserid}
                type="text"
                className="txt cleanbtn"
                placeholder="Search"
              />
            </div>
            {activeTab === "Activity" ? (
              <div className="u-a flex">
                <div className="user-activity flex  flex-col">
                  <div className="tbl flex flex-col">
                    {/* <div className="row flex aic">
                      <div className="row-item flex"></div>
                      <div className="row-item flex">Type</div>
                      <div className="row-item flex">Item</div>
                      <div className="row-item flex">Price</div>
                      <div className="row-item flex">From</div>
                      <div className="row-item flex">To</div>
                      <div className="row-item flex">Time</div>
                    </div>
                    {activities.map((item, index) => (
                      <div className="row flex aic">
                        <div className="row-item"></div>
                        <div className="row-item">
                          {item?.type === 1 && "Sale"}
                          {item?.type === 2 && "Sale"}
                          {item?.type === 3 && "Sale"}
                          {item?.type === 4 && "Sale"}
                          {item?.type === 5 && "Sale"}
                          {item?.type === 6 && "Sale"}
                        </div>
                        {/* <div className="row-item flex">{item?.tag}</div> */}
                    {/* <div className="row-item flex aic">
                          <img src={item?.item_detail?.image_uri} className="img" />
                          <div className="nft-names flex flex-col">
                            <div className="lbl1">{item?.item_detail?.title}</div>
                            <div className="lbl2">{item?.lbl2}</div>
                          </div>
                        </div>
                        <div className="row-item flex">{Number(item?.price).toFixed(2)}</div>
                        <div className="row-item flex">
                          {item?.seller_details?.firstname} {item?.seller_details?.lastname}
                        </div>
                        <div className="row-item flex">
                          {item?.buyer_details?.firstname} {item?.buyer_details?.lastname}
                        </div>
                        <div className="row-item flex">{moment(item?.entry_date).format("MMMM Do YYYY, h:mm:ss")}</div>
                      </div>
                    ))} */}

                    <table className="activities-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities?.map(item => {
                          return (
                            <tr>
                              <td>
                                {item?.type === 1 && "Transaction"}
                                {item?.type === 2 && "Sale Offer"}
                                {item?.type === 3 && "Buy Offer"}
                                {item?.type === 4 && "Sale Cancel"}
                                {item?.type === 5 && "Buy Cancel"}
                                {item?.type === 6 && "Nft Minted"}
                              </td>
                              <td className="activity-td-item">
                                <div className="flex">
                                  <img src={item?.item_detail?.image_uri} className="img activity-img" />
                                  <div className="nft-names flex flex-col">
                                    <div className="lbl1">{item?.item_detail?.title}</div>
                                    <div className="lbl2">{item?.lbl2}</div>
                                  </div>
                                </div>

                              </td>
                              <td>{item?.price}</td>
                              <td>{item?.qty}</td>
                              <td>{item?.seller_details?.firstname} {item?.seller_details?.lastname}</td>
                              <td>{item?.buyer_details?.firstname} {item?.buyer_details?.lastname}</td>
                              <td>{moment(item?.entry_date).format("MMMM Do YYYY, h:mm:ss")}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>

                  </div>
                </div>
              </div>
            ) : activeTab === "Collections" ? (
              <div className="u-a flex">
                <div className="user-activity flex  flex-col">
                  <div className="tbl flex flex-col">
                    <div className="row flex aic">
                      <div className="row-item flex">Id</div>

                      <div className="row-item flex">Image</div>
                      <div className="row-item flex">Collection Id</div>
                      <div className="row-item flex">URL</div>
                      <div className="row-item flex">Description</div>
                      {/* <div className="row-item flex">To</div>
                  <div className="row-item flex">Time</div> */}
                    </div>
                    {createdCollections.map((item, index) => (
                      <Link to={`/nft-detail/${item.name}?id=${item.id}`} className="card flex flex-col pointer">
                        <div style={{ cursor: "pointer" }} className="row flex aic">
                          <div className="row-item flex">{item.id}</div>
                          <div className="row-item flex aic">
                            <img src={item.profile_image} className="img" />
                            <div className="nft-names flex flex-col">
                              <div className="lbl1">{item.name}</div>
                            </div>
                          </div>
                          <div className="row-item flex">{item.category_id}</div>
                          <div className="row-item flex">{item.fb_url}</div>
                          <div className="row-item flex">{item.from}</div>
                          {/* <div className="row-item flex">{item.to}</div>
                    <div className="row-item flex">{item.time}</div> */}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="nfts-blk flex flex-col">
                <div className="filter-tabs flex aic">
                  {activeTab != "Favorites" &&
                    nftTabs.map((item, i) => (
                      <div onClick={() => setactivecategory(item)} key={i} className="tab-item flex aic">
                        <img src={item.ico} className="icon" />
                        <div className="tag">{item.lbl}</div>
                      </div>
                    ))}
                </div>
                <div className="profile-page-nft">
                  {showsearchitemswithuseridorbycategory
                    ? searchitemwithuseridorbycategoryloading
                      ? "Loading"
                      : searchitemwithuseridorcategoryitems?.length < 1
                        ? "No items found"
                        : searchitemwithuseridorcategoryitems.map((item, index) => <Card item={item} tab="onsale" />)
                    : !loading
                      // ? selectedItems.map((item, index) => {
                      //   if(item?.item_detail?.item_sale_info?.is_completed === 1){
                      //     return <Card item={item} />
                      //   }
                      // })
                      ?
                      <>
                        {activeTab === "On Sale" && selectedItems?.map(item => <Card item={item} tab="onsale" />)}
                        {activeTab === "Collected" && selectedItems?.map(item => {
                            if(item?.item_detail?.item_sale_info?.is_completed === 1){
                              return <Card item={item} tab="resale" />
                            }
                        })}
                      </>
                      : "Loading..."}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
