import React, { useState, useEffect } from "react";

import { CrossIcon, RoundCrossIcon } from "../Icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { covertXrpToUsd } from "../helper/api/convertToUsd";

const Completecheckout = ({ setOpen, id, iteminfo, setIsBought, getNftById }) => {
  const [data, setdata] = useState()
  const { user } = useSelector((state) => state.generalReducers)
  const [loading, setloading] = useState(false);
  const [convertedRate, setConvertedRate] = useState(0);



  const buyFixPriceItem = async () => {
    console.log('data...', {
      iteminfo,
      item_id: id,
      user_id: user.id,
      sale_type: iteminfo?.sale_type,
      bid_price: iteminfo?.price
    })
    try {
      setloading(true)
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/sale/buyNFT`, {
        item_id: id,
        user_id: user.id,
        sale_type: iteminfo?.sale_type,
        bid_price: iteminfo?.price
      })

      console.log('buyFixPriceItem', res)
      toast.success("Item bought successfully")
      setIsBought(true);
      setloading(false)
      setOpen(false)
      getNftById(id);
    } catch (error) {
      console.log("error", error?.response)
      if (error?.response?.data) {
        toast.success(`${error?.response?.data}`)
      }
      else {
        toast.success("Error! Please try again.")
      }
      setloading(false)
      getNftById(id);

    }

  }

  // convert xrp to usd
  const convertToUsd = async () => {
    let xrpRate = Number(iteminfo?.item_sale_info?.price);
    let convertedRate = await covertXrpToUsd(xrpRate);
    setConvertedRate(convertedRate);
  }

  useEffect(() => {
    convertToUsd();
  }, [])


  console.log('Completecheckout', id, iteminfo)
  return (
    <div className="complete-checkout flex flex-col">
      <div className="wrap flex flex-col">
        <div className="checkout-hdr flex flex-col">
          <div className="icon flex aic justify-end">
            <div
              className="svg-icon cursor-pointer"
              onClick={(e) => setOpen(false)}
            >
              <CrossIcon />
            </div>
          </div>
          <div className="checkout-tag flex aic jc">
            <p className="lbl text-center">Complete checkout</p>
          </div>
        </div>
        <div className="meta flex flex-col">
          <div className="min-tag">Item</div>
          <div className="about-nft flex">
            <div className="left flex aic">
              <div className="left-side flex">
                <div className="img-s flex aic jc">
                  <img src={iteminfo?.item_detail?.image_uri} className="img" />
                </div>
              </div>
              <div className="right-side flex flex-col">
                <div className="type">{iteminfo?.item_collection?.category_details?.category_name}</div>
                <div className="name">{iteminfo?.title}</div>
                <div className="fee">Creator Fees: {iteminfo?.item_collection?.royalty || 0}%</div>
              </div>
            </div>
            <div className="right flex flex-col jc">
              <div className="xrp flex">
                <span className="icon">
                  <RoundCrossIcon />
                </span>
                <div className="xrp-tag">{iteminfo?.item_sale_info?.price} XRP</div>
              </div>
              <div className="price">${convertedRate || 0}</div>
            </div>
          </div>
          <div className="t-price flex aic justify-between">
            <div className="lbl">Total</div>
            <div className="lbl">{iteminfo?.item_sale_info?.price} XRP</div>
          </div>
          <div
            onClick={buyFixPriceItem}
            className="action flex aic jc">
            <div className="btn button">{loading ? "Waiting for response..." : "Checkout"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completecheckout;
