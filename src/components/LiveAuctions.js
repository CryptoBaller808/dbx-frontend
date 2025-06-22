import React, { useState, useEffect } from "react";

import { HorzontalMenuIcon, FireIcon } from "../Icons";
import axios from "axios";
import Modal from "./Modal";
import PlaceBid from "./PlaceBid";
import moment from "moment";
import { Link, NavLink } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Keyboard, Pagination, Navigation } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LiveAuctions = () => {
  const [open2, setOpen2] = useState(false);
  //const [hotbids,sethotbids] = useState([])
  const getAuctionItemsOnSale = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/sale/getAuctionItemsOnSale`);
      console.log("getAuctionItemsOnSale_res", res);
      if (res?.data) {
        setNumbs(res?.data?.rows);
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
    getAuctionItemsOnSale();
  }, []);

  const [numbs, setNumbs] = useState("");
  const [selecteditem, setselecteditem] = useState("");

  const Cardinfo = ({ index, item }) => {
    const [time, settime] = useState([]);
    function getRemaining(date, type) {
      // let splitt = `${date}`.split(" ")
      // let splitt2 = `${splitt[0]}`.split("/")
      //console.log('splitt2',splitt2)
      //console.log("the_date",`${splitt2[1]}/${splitt2[0]}/${splitt2[2]} ${splitt[1]} ${splitt[2]}`)
      var eventdate = moment(date);
      var todaysdate = moment();
      return eventdate.diff(todaysdate, type);
    }
    useEffect(() => {
      setInterval(() => {
        settime(
          `${getRemaining(item.auction_end_date, "days")}:${getRemaining(item.auction_end_date, "hours")}:${getRemaining(
            item.auction_end_date,
            "seconds",
          )}`,
        );
        //:${getRemaining(item.expire,'miliseconds')}
      }, 1000);
    }, []);
    return (
      <div key={index}>
        <div className="card flex flex-col">
          <div className="nft-img rel flex jc ">
            <Link to={`/nft-detail?id=${item?.item_detail?.id}`} className="nft-img">
              <img src={item?.item_detail?.image_uri} className="img" />
            </Link>
            <div className="time-box abs flex aic jc">
              <p className="lbl">{time} left</p>
              <div className="ico">
                <FireIcon />
              </div>
            </div>
          </div>
          <div className="meta flex flex-col">
            <div className="nft-name flex aic">
              <div className="lbl">{item?.item_detail?.title}</div>
              <div className="icon">
                <HorzontalMenuIcon />
              </div>
            </div>
            <div className="nft-rating flex">
              <div className="r-num flex aic">
                <div className="lbl">Top Bid: </div>
              </div>
              <div className="r-like flex aic">
                <div className="lbl">{item.top_bid ? `${item.top_bid} XRP` : "0.00 XRP"}</div>
              </div>
            </div>
            <div
              className="btn button cleanbtn"
              onClick={e => {
                setOpen2(true);
                setselecteditem(item);
              }}>
              Place a bid
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="live-autions flex aic">
      <div className="wrapWidth wraps flex flex-col">
        <div className="p-hdr flex">Live Auctions</div>
        <div className="live-autions-nft  flex ">
          <div className="blk wrapper flex aic">
            {numbs.length > 0 ? (
              <Swiper
                slidesPerView={4}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  440: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  540: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  820: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                  1200: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                  },
                }}
                spaceBetween={20}
                keyboard={{
                  enabled: true,
                }}
                navigation={true}
                modules={[Keyboard, Navigation]}
                className="mySwiper">
                {numbs?.map((item, index) => (
                  <SwiperSlide>
                    <Cardinfo index={index} item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="lbl">Not Items found</div>
            )}
            {/* <Slider {...settings}>
              {numbs && (
                <>
                  {numbs?.length > 0 ? (
                    numbs.map((item, index) => (
                      <Cardinfo index={index} item={item} />
                    ))
                  ) : (
                    <div className="lbl">Not Items found</div>
                  )}
                </>
              )}
            </Slider> */}
          </div>
        </div>
      </div>
      <Modal open={open2} onClose={() => setOpen2(false)}>
        <PlaceBid open={open2} setOpen={setOpen2} selecteditem={selecteditem} />
      </Modal>
    </div>
  );
};

export default LiveAuctions;
