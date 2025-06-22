import React, { useState, useEffect } from "react";
import { CrossIcon, DropDownIcon } from "../Icons";
import axios from "axios";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const PlaceBid = ({ open, setOpen, selecteditem, getNftById }) => {
  console.log(`Selected Item =>`, selecteditem);
  const [hide, setHide] = useState(false);
  const { user } = useSelector(state => state.generalReducers);
  const [statusData, setStatusData] = useState([
    { id: 1, title: "1 day", day: 1 },
    { id: 2, title: "2 days", day: 2 },
    { id: 3, title: "3 days", day: 3 },
  ]);
  const [bid_price, setbid_price] = useState(0);
  const [Open2, setOpen2] = useState(0);
  const [errormessage, seterrormessage] = useState("");
  const [loading, setloading] = useState(false);
  const [platformFee, setPlatformFee] = useState(0);
  const [recievedFee, setRecievedFee] = useState(0);


  const handleClick = message => {
    setOpen2(true);
    seterrormessage(message);
  };
  const handleClose = () => {
    setOpen2(false);
  };

  // get platform fee
  const getPlatformFee = async () => {
    try {
      const res = await axios.get('https://api.digitalblock.exchange/collection/getplatformfee');
      const data = res.data;
      setPlatformFee(data?.platform_fee);
    } catch (e) {
      console.log(e);
    }
  }

  const bidOnNFT = async id => {
    let priceOfBid = Number(Number(bid_price) + recievedFee)
    console.log("id", id);
    if (bid_price < Number(selecteditem?.minimum_bid)) {
      return handleClick(`Bidding amount must be greater than ${selecteditem.minimum_bid}`);
    } else if (!selectedHours) {
      return toast("Please select a day");
    }
    setloading(true);
    console.log("place_bid_data", {
      item_id: selecteditem.item_id,
      //user_id: selecteditem.user_id,
      user_id: user.id,
      sale_type: selecteditem?.sale_type ? selecteditem?.sale_type : selecteditem?.item_sale_info?.sale_type,
      bid_price: priceOfBid,
      bid_expire: moment().add(selectedHours.day, "days").format(),
    });
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/sale/buyNFT`, {
        item_id: selecteditem.item_id,
        //user_id: selecteditem.user_id,
        user_id: user.id,
        sale_type: selecteditem?.sale_type ? selecteditem?.sale_type : selecteditem?.item_sale_info?.sale_type,
        bid_price: priceOfBid,
        bid_expire: moment().add(selectedHours.day, "days").format(),
      });
      toast.success(res?.data)
      getNftById(selecteditem?.item_id);
      console.log("place_bid_res", res);
      if (res?.status == 201) {
        setloading(false);
        setOpen(false);
      }
    } catch (error) {
      console.log("error", error?.response);
      setloading(false);
      getNftById(selecteditem?.item_id);
      return toast(error?.response?.data);
    }
  };

  // handle set bid
  const handleSetBid = (e) => {
    setbid_price(e.target.value);

    let ifValue = Number(e.target.value) || 0;
    let recievedFee = ifValue/100 * platformFee;
    setRecievedFee(recievedFee);
  }

  const [selectedHours, setselectedHours] = useState();
  console.log("selecteditem", selecteditem);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, []);
  useEffect(() => {
    document.addEventListener("click", () => {
      setHide(false);
    });
    getPlatformFee();
  }, []);

  return (
    <div className="place-bid flex flex-col">
      <div className="ico flex aic  pointer justify-end" onClick={e => setOpen(false)}>
        <CrossIcon />
      </div>
      <Snackbar open={Open2} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errormessage}
        </Alert>
      </Snackbar>
      <div className="wrap flex flex-col">
        <div className="hdr flex flex-col">
          <div className="hdr-tag">Place a Bid</div>
          <div className="desc">You are about to place a bid for {selecteditem?.title || selecteditem?.item_detail?.title} by 
          {selecteditem?.item_detail?.creator?.firstname || " Anonymous"} {selecteditem?.item_detail?.creator?.lastname}</div>
          <div className="select-bid flex flex-col">
            <div className="txt-lbl">Your Bid</div>
            <div className="txt-box flex aic">
              <input onChange={handleSetBid} value={bid_price} type="text" className="txt cleanbtn" />
              <div className="lbl">XRP</div>
            </div>
            <div className="txt-desc">Must be at Least {selecteditem.minimum_bid} XRP</div>
          </div>
          <div className="t-fee flex align-center justify-between">
            <div className="lbl">Service fee</div>
            <div className="val">{(recievedFee).toFixed(3) || 0} XRP</div>
          </div>
          <div className="t-bid flex align-center justify-between">
            <div className="lbl">Total bid amount</div>
            <div className="val">{Number(bid_price) + Number(recievedFee)} XRP</div>
          </div>
          <div className="offer-exp flex flex-col">
            <div className="lbl">Offer Expiration</div>
            <div className="actions flex aic">
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
                        <span className="unit-eng flex aic font s14 b4" placeholder="All">
                          {selectedHours ? selectedHours.title : "Select Day"}
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
                          setselectedHours(item);
                        }}>
                        <div className="unit-name flex aic font s14 b4">
                          <span className="unit-eng flex aic font s14 b4">{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* <div className="time-box flex aic">
                <img src="./images/clock.svg" className="img" />
                <div className="time flex aic justify-between">
                  <div className="time-lbl">11:40</div>
                  <div className="time-lbl">AM</div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="btn-bid flex aic jc">
            <div onClick={bidOnNFT} className="btn button">
              {loading ? "Waiting to accept.." : "Place a Bid"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceBid;
