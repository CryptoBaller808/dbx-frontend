import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowBackIcon, DropDownIcon, UnlimitedIcon, TimeIcon, FixedPriceIcon, RoundCrossIcon } from "../Icons";
import Toggle from "./Toggle";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const CreateNewItem = () => {
  const [tab, setTab] = useState("fixed");
  const [showDate, setShowDate] = useState(false);
  const { user } = useSelector(state => state.generalReducers);
  const [img, setImg] = useState();
  const [nftData, setNFTData] = useState();
  const [hide, setHide] = useState(false);
  const [hide2, setHide2] = useState(false);
  const [hide3, setHide3] = useState(false);
  const [hide4, setHide4] = useState(false);
  const [statusData, setStatusData] = useState([
    { id: 1, title: "XRP" },
    // { id: 2, title: "2 XRP" },
    // { id: 3, title: "3 XRP" },
  ]);
  const [selectedcompany, setselectedcompany] = useState();
  const [selectedcompany2, setselectedcompany2] = useState();
  const [starttime, setstarttime] = useState();
  const [endtime, setendtime] = useState();
  let navigate = useNavigate();
  const [put_on_marketplace, setput_on_marketplace] = useState(true);
  const [fixedprice, setfixedprice] = useState(0);
  const[usdRate, setUsdRate] = useState(0);
  const [convertedPrice, setConvertedPrice] = useState(0);
  const [platformaFee, setPlatformFee] = useState(0);
  const [recieveXrp, setRecieveXrp] = useState(0);
  const [minimumbid, setminimumbid] = useState();
  const [reserve_price, setreserve_price] = useState();
  const query = new URLSearchParams(window.location.search);
  const [loading, setloading] = useState(false);
  const item_id = query.get("item_id");


  function convertToUTC(dateString) {
    const utcDateTime =  moment(dateString).utc().format('YYYY-MM-DD HH:mm:ss');
    return utcDateTime;
  }

  // console.log("item_id", item_id);
  const sellNFT = async () => {
    if (tab == "time" && (!minimumbid || !reserve_price || !starttime || !endtime)) {
      return toast.error("Please fill all fields");
    } else if (tab == "fixed" && !fixedprice) {
      return toast.error("Please fill all fields");
    } else if (tab == "unlimited" && (!minimumbid || !reserve_price || !starttime)) {
      return toast.error("Please fill all fields");
    }
    let sale_type = 0;
    if (tab == "time") {
      sale_type = 2;
    } else if (tab == "fixed") {
      sale_type = 1;
    } else if (tab == "unlimited") {
      sale_type = 3;
    }

    let convertedStartTime = convertToUTC(starttime);
    let convertedEndTime = convertToUTC(endtime);
    try {
      // console.log("obj", {
      //   item_id: item_id,
      //   user_id: user?.id,
      //   sale_type: sale_type,
      //   fix_price: Number(fixedprice),
      //   put_on_marketplace: put_on_marketplace,
      //   t_auction_start_date: convertedStartTime,
      //   t_auction_end_date: convertedEndTime,
      //   t_auction_minimum_bid: Number(minimumbid),
      //   t_auction_reserve_price: Number(reserve_price),
      // });
      toast.info("Please accept request from your app");
      console.log("Start Date", starttime);

      console.log('End Date', endtime);
      setloading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/sale/sell/sellNFT`, {
        item_id: item_id,
        user_id: user?.id,
        sale_type: sale_type,
        resale_status: Number(0),
        fix_price: Number(recieveXrp),
        put_on_marketplace: put_on_marketplace,
        t_auction_start_date: convertedStartTime,
        t_auction_end_date: convertedEndTime,
        t_auction_minimum_bid: Number(minimumbid),
        t_auction_reserve_price: Number(reserve_price),
      });
      console.log("resp1", res);
      if (res?.data) {
        //setStatusData(res?.data)
        toast.success(res?.data);
        setloading(false);
        navigate(`/nft`);
      }
    } catch (error) {
      console.log("error", error?.response);
      console.log("error", error);
      if (error?.response?.data) {
        toast.error(error?.response?.data);
        setloading(false);
      }
    }
  };

  console.log("NFT Data", nftData)

  // convert xrp to usd 
  const getUsdValue = async () => {

    try {
      const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=XRP&tsyms=USD');
      const data = res.data;
      setUsdRate(data?.USD);
    }catch(e){
      console.log(e);
    }
  }

  // get platform fee
  const getPlatformFee = async () => {
    try {
      const res = await axios.get('https://api.digitalblock.exchange/collection/getplatformfee');
      const data = res.data;
      setPlatformFee(data?.platform_fee);
    }catch(e) {
      console.log(e);
    }
  }


  const getNFTDetail = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}//mint/getNftById/${item_id}`);
      console.log("resp created nft", res?.data);
      if (res?.data) {
        setImg(res?.data?.image_uri);
        setNFTData(res?.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // handle fixed price
  const handleFixedPrice = (e) => {
    setfixedprice(e.target.value);
    let ifValue = Number(e.target.value) || 0;
    let recieveAmount = ifValue - (ifValue/100 * platformaFee);
    let newConverted = (ifValue) ? (Number(recieveAmount) * parseFloat(usdRate)).toFixed(2) :  0;
    setRecieveXrp(recieveAmount);
    setConvertedPrice(newConverted);
  }

  useEffect(() => {
    document.addEventListener("click", () => {
      setHide(false);
    });
    getNFTDetail();
    getUsdValue();
    getPlatformFee();
  }, []);
  return (
    <div className="create-new-item flex">
      <div className="wrapWidth wrap flex flex-col aic">
        <div className="pg-hdr flex">
          <Link to="/single-create" className="back-btn flex aic">
            <ArrowBackIcon />
            <div className="lbl">Go Back</div>
          </Link>
        </div>
        <div className="meta flex flex-col">
          <div className="pg-tag">{nftData ? nftData?.title : "-"}</div>
          <div className="meta flex flex-col">
            <div className="nft-img flex aic jc">
              <img src={img ? img : ""} className="img" />
            </div>
            <div className="req-nft-info flex aic">
              <div className="left flex">
                <div className="left-box flex flex-col">
                  <div className="left-tag">Select your sell method</div>
                  <div className="boxs">
                    <div
                      className={`le-card flex flex-col ${tab === "fixed" ? "active" : ""}`}
                      onClick={e => {
                        setTab("fixed");
                      }}>
                      <div className="icon flex aic jc">
                        <FixedPriceIcon />
                      </div>
                      <div className="card-lbl">
                        Fixed
                        <br /> Price
                      </div>
                    </div>
                    <div
                      className={`le-card flex flex-col ${tab === "time" ? "active" : ""}`}
                      onClick={e => {
                        setTab("time");
                      }}>
                      <div className="icon flex aic jc">
                        <TimeIcon />
                      </div>
                      <div className="card-lbl">
                        Timed <br />
                        Auction
                      </div>
                    </div>
                    <div
                      className={`le-card flex flex-col ${tab === "unlimited" ? "active" : ""}`}
                      onClick={e => {
                        setTab("unlimited");
                      }}>
                      <div className="icon flex aic jc">
                        <UnlimitedIcon />
                      </div>
                      <div className="card-lbl">
                        Unlimited
                        <br />
                        Auction
                      </div>
                    </div>
                  </div>
                  {tab === "time" && (
                    <><div className="row-left1">
                      <div className="starting-date flex flex-col">
                        <div className="lbl1">Starting Date</div>
                        <input
                          className="date-time"
                          type="datetime-local"
                          id="meeting-time"
                          name="meeting-time"
                          onChange={e => {
                            console.log("e", e.target.value);
                            setstarttime(e.target.value);
                          }}
                          //   value="2018-06-12T19:30"
                          //min="2018-06-07T00:00"
                          //max="3018-06-14T00:00"
                        />
                      </div>
                      <div className="starting-date flex flex-col">
                        <div className="lbl1">Expiration Date</div>
                        <input
                          className="date-time"
                          type="datetime-local"
                          id="meeting-time"
                          name="meeting-time"
                          onChange={e => {
                            console.log("e", e.value);
                            setendtime(e.target.value);
                          }}
                          //   value="2018-06-12T19:30"
                          //min="2018-06-07T00:00"
                          //max="3018-06-14T00:00"
                        />
                      </div>
                    </div>
                    <p className="note">Enter in your time zone - entry will be converted to UTC. Final bid will be according to UTC time.</p></>
                  )}
                  {tab === "unlimited" && (
                    <><div className="row-left2">
                      <div className="starting-date flex flex-col">
                        <div className="lbl1">Starting Date</div>
                        <input
                          className="date-time"
                          type="datetime-local"
                          id="meeting-time"
                          name="meeting-time"
                          //   value="2018-06-12T19:30"
                          // min="2018-06-07T00:00"
                          // max="3018-06-14T00:00"
                          onChange={e => {
                            console.log("e", e.target.value);
                            setstarttime(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <p className="note">Enter in your time zone - entry will be converted to UTC. Final bid will be according to UTC time.</p></>
                  )}
                </div>
              </div>
              <div className="right flex">
                {tab === "fixed" && (
                  <div className="right-block flex flex-col">
                    
                    
                    {/*<div className="row flex aic">
                      <div className="row-left flex flex-col">
                        <div className="lbl1">Schedule for future time</div>
                        <div className="lbl2">You can schedule this listing to start at a future date.</div>
                      </div>
                      <div className="row-right flex aic jc">
                        <Toggle setShowDate={setShowDate} />
                      </div>
                    </div>
                    {showDate && (
                      <div className="row flex flex-col text-start">
                        <div className="lbl1 text-start">Starting Date</div>
                        <input
                          className="date-time"
                          type="datetime-local"
                          id="meeting-time"
                          name="meeting-time"
                          //   value="2018-06-12T19:30"
                          onChange={e => {
                            console.log("e", e.target.value);
                            setstarttime(e.target.value);
                          }}
                        />
                      </div>
                    )}
                    <div className="row flex aic">
                      <div className="row-left flex flex-col">
                        <div className="lbl1">Put on marketplace</div>
                        <div className="lbl2">Allow users to instantly purchase your NFT</div>
                      </div>
                      <div className="row-right flex aic jc">
                        <Toggle setToggle={setput_on_marketplace} initial_value={put_on_marketplace} />
                      </div>
                    </div>*/}
                    <div className="row flex aic">
                      <div className="row-left flex flex-col">
                        <div className="lbl1">Fees</div>
                      </div>
                      <div className="row-right flex items-end jc flex-col">
                        <div className="lbl2">To Digital Block Exchange NFT {platformaFee}%</div>
                        <div className="lbl2">Commission to {nftData?.creator?.firstname ? nftData?.creator?.firstname : "Anonymous"} for Resale {nftData?.item_collection?.royalty}%</div>
                      </div>
                    </div>
                    <div className="row flex flex-col text-start">
                      <div className="lbl1 text-start">Price</div>
                      <div className="price-box flex aic">
                        <div className="dropDown flex aic jc flex-col rel">
                          <div className="category flex aic">
                            <div
                              className="cbox cleanbtn flex aic rel"
                              onClick={e => {
                                e.stopPropagation();
                                setHide(!hide);
                              }}>
                              <div className="slt flex aic">
                                <div className="unit-name flex aic font s14 b4">
                                  <span className="icon">
                                    <img src="./images/XRPL_Logo1.svg" />
                                  </span>
                                  <span className="unit-eng flex aic font s14 b4" placeholder="XRP">
                                    {selectedcompany ? selectedcompany.title : "XRP"}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <DropDownIcon />
                              </div>
                            </div>
                          </div>
                          <div className={`block flex aic abs ${hide ? "show" : ""}`}>
                            <div className="manue flex aic col anim">
                              {statusData.map((item, index) => (
                                <div
                                  key={index}
                                  className="slt flex aic"
                                  onClick={e => {
                                    setHide(!hide);
                                    setselectedcompany(item);
                                  }}>
                                  <div className="unit-name flex aic font s14 b4">
                                    <span className="unit-eng flex aic font s14 b4">{item.title}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <input value={fixedprice} onChange={handleFixedPrice} type="text" className="txt cleanbtn" />
                      </div>
                      <div className="desc flex">
                        You will receive <span className="des-numb">{recieveXrp || 0} XRP</span> ${convertedPrice}
                      </div>
                    </div>
                  </div>
                )}
                {(tab === "time" || tab === "unlimited") && (
                  <div className="right-block flex flex-col">
                    <div className="row flex aic">
                      <div className="row-left flex flex-col">
                        <div className="lbl1">Fees</div>
                      </div>
                      <div className="row-right flex items-end jc flex-col">
                        <div className="lbl2">To Digital Block Exchange NFT {platformaFee}%</div>
                        <div className="lbl2">Commission to {nftData?.creator?.firstname ? nftData?.creator?.firstname : "Anonymous"} for Resale {nftData?.item_collection?.royalty}%</div>
                      </div>
                    </div>
                    <div className="row flex flex-col text-start">
                      <div className="lbl1 text-start">Minimum Bid</div>
                      <div className="lbl2 text-start">Set your starting bid price</div>
                      <div className="price-box flex aic">
                        <div className="dropDown flex aic jc flex-col rel">
                          <div className="category flex aic">
                            <div
                              className="cbox cleanbtn flex aic rel"
                              onClick={e => {
                                e.stopPropagation();
                                setHide(!hide);
                              }}>
                              <div className="slt flex aic">
                                <div className="unit-name flex aic font s14 b4">
                                  <span className="icon">
                                    <img src="./images/XRPL_Logo1.svg" />
                                  </span>
                                  <span className="unit-eng flex aic font s14 b4" placeholder="XRP">
                                    {selectedcompany ? selectedcompany.title : "XRP"}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <DropDownIcon />
                              </div>
                            </div>
                          </div>
                          <div className={`block flex aic abs ${hide ? "show" : ""}`}>
                            <div className="manue flex aic col anim">
                              {statusData.map((item, index) => (
                                <div
                                  key={index}
                                  className="slt flex aic"
                                  onClick={e => {
                                    setHide(!hide);
                                    setselectedcompany(item);
                                  }}>
                                  <div className="unit-name flex aic font s14 b4">
                                    <span className="unit-eng flex aic font s14 b4">{item.title}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <input onChange={e => setminimumbid(e.target.value)} value={minimumbid} type="text" className="txt cleanbtn" />
                      </div>
                    </div>
                    <div className="row flex flex-col text-start">
                      <div className="lbl1 text-start">Reserve Price</div>
                      <div className="lbl2 text-start">Create a hidden limit by setting a reserve price</div>
                      <div className="price-box flex aic">
                        <div className="dropDown flex aic jc flex-col rel">
                          <div className="category flex aic">
                            <div
                              className="cbox cleanbtn flex aic rel"
                              onClick={e => {
                                e.stopPropagation();
                                setHide2(!hide2);
                              }}>
                              <div className="slt flex aic">
                                <div className="unit-name flex aic font s14 b4">
                                  <span className="icon">
                                    <img src="./images/XRPL_Logo1.svg" />
                                  </span>
                                  <span className="unit-eng flex aic font s14 b4" placeholder="XRP">
                                    {selectedcompany2 ? selectedcompany2.title : "XRP"}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <DropDownIcon />
                              </div>
                            </div>
                          </div>
                          <div className={`block flex aic abs ${hide2 ? "show" : ""}`}>
                            <div className="manue flex aic col anim">
                              {statusData.map((item, index) => (
                                <div
                                  key={index}
                                  className="slt flex aic"
                                  onClick={e => {
                                    setHide2(!hide2);
                                    setselectedcompany2(item);
                                  }}>
                                  <div className="unit-name flex aic font s14 b4">
                                    <span className="unit-eng flex aic font s14 b4">{item.title}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <input
                          value={reserve_price}
                          onChange={e => setreserve_price(e.target.value)}
                          type="text"
                          className="txt cleanbtn"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div  className="action flex aic jc">
            <div className="btn button" onClick={sellNFT}>{loading ? "Loading..." : "Post your listing"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewItem;
