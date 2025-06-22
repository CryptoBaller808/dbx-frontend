import React, { useState, useEffect } from "react";
import { HorzontalMenuIcon, RoundCrossIcon, HeartIcon, HeartFillIcon } from "../Icons";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import Completecheckout from "./Completecheckout";
import { ToastContainer, toast } from "react-toastify";
import PlaceBid from "./PlaceBid";
const Card = ({ item, tab }) => {
  console.log(tab);
  console.log("item id", item.item_detail?.id);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const { user } = useSelector(state => state.generalReducers);
  const navigate = useNavigate();
  const addtoWishlist = async item_id => {
    if (!user) {
      return;
    }
    setwishlistcount(wishlistcount + 1);
    sethighlightstar(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/profiles/addWishlist`, {
        user_id: user?.id,
        item_id,
      });
      console.log("hotbid_res", res);
      toast.success("Added to Favorites successfully");
    } catch (error) {
      console.log("error", error);
      console.log("error", error?.response);
      if (error?.response?.data) {
        toast.success(`${error?.response?.data}`);
      }
    }
  };
  console.log("Carditem", item);
  const [hightlightstar, sethighlightstar] = useState(false);
  const [wishlistcount, setwishlistcount] = useState(0);
  useEffect(() => {
    if (item?.item_detail?.wishlist_count?.rows?.find(item => item?.user_id == user?.id)) {
      sethighlightstar(true);
    }
    setwishlistcount(item?.item_detail?.wishlist_count?.count);
  }, []);
  const removewishlist = async id => {
    if (!user) {
      return;
    }
    console.log("removing", id);
    setwishlistcount(wishlistcount - 1);
    await axios.post(`${process.env.REACT_APP_API_URL}/profiles/removeWishlist`, {
      user_id: user.id,
      item_id: id,
    });
    //getfavouriteByUserId()
    sethighlightstar(false);
  };

  // handle click on sale
  const handleClickOnSale = () => {
    navigate(`/nft-detail/resale/${item?.item_detail?.id}`);
  };
  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Completecheckout open={open} setOpen={setOpen} id={item.id} iteminfo={item} />
      </Modal>
      <Modal open={open2} onClose={() => setOpen2(false)}>
        <PlaceBid open={open2} setOpen={setOpen2} selecteditem={{ ...item, ...item?.item_sale_info }} />
      </Modal>
      <div className="card flex flex-col">
        <Link to={`/nft-detail?id=${item?.item_detail?.id}`} className="nft-img">
          <img src={item?.item_detail?.image_uri} className="img" />
        </Link>
        <div className="meta flex flex-col">
          <div className="nft-name flex aic">
            <div className="lbl">{item?.item_detail?.title}</div>
            <div className="icon">
              <HorzontalMenuIcon />
            </div>
          </div>
          <div className="nft-numb">{item?.item_detail?.item_collection?.name}</div>
          <div className="nft-rating flex">
            <div className="r-num flex aic">
              <div className="lbl">{item?.price}</div>
              <div className="ico">
                <RoundCrossIcon />
              </div>
            </div>
            <div className="r-like flex aic">
              {hightlightstar ? (
                <div onClick={() => removewishlist(item?.item_detail?.id)} className="ico">
                  <HeartFillIcon />
                </div>
              ) : (
                <div onClick={() => addtoWishlist(item?.item_detail?.id)} className="ico">
                  <HeartIcon />
                </div>
              )}
              <div className="lbl">{wishlistcount}</div>
            </div>
          </div>
          {!tab ? (
            <>
              {item?.sale_type == 1 && (
                <div onClick={e => setOpen(true)} className="btn button cleanbtn">
                  Buy Now
                </div>
              )}
              {item?.sale_type == 2 && (
                <div onClick={e => setOpen2(true)} className="btn button cleanbtn">
                  Place a bid
                </div>
              )}
            </>
          ) : (
            <>
              {tab === "resale" && (
                <div className="btn button cleanbtn" onClick={handleClickOnSale}>
                  Resale
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
