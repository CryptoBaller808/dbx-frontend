import React, { useState, useEffect } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import Card from "./Card";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Keyboard, Pagination, Navigation } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HotBids = () => {
  const [hotbids, sethotbids] = useState("");
  const { user } = useSelector(state => state.generalReducers);
  const getFixedItemsOnSale = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/sale/getFixedItemsOnSale`);

      if (res?.data) {
        sethotbids(res?.data?.rows);
      }
    } catch (error) {
      console.log("error", error);
      console.log("error", error?.response);
      if (error?.response?.data == "No items found") {
        sethotbids([]);
      }
    }
  };

  useEffect(() => {
    getFixedItemsOnSale();
  }, []);

  return (
    <div className="hot-bids flex aic">
      <div className="wrapWidth wraps flex flex-col">
        <div className="p-hdr flex">Hot bids</div>
        <div className="hot-bids-nft  flex ">
          <div className="blk wrapper flex aic">
            {hotbids.length > 0 ? (
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
                {hotbids?.map((item, index) => (
                  <SwiperSlide>
                    <Card item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="lbl">Not Items found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotBids;
