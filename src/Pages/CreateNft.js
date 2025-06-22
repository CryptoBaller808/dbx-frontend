import React from "react";
import { Link } from "react-router-dom";
import { ArrowBackIcon } from "../Icons";
const CreateNft = () => {
  return (
    <div className="create-nft-page flex">
      <div className="wrapWidth wrap flex flex-col">
        <div className="pg-hdr flex">
          <Link to="/" className="back-btn flex aic">
            <ArrowBackIcon />
            <div className="lbl">Go Back</div>
          </Link>
        </div>
        <div className="meta flex aic jc flex-col">
          <div className="pg-tag">Create Your Collection</div>
          <div className="desc">
          Create your “Collection” first to add multiple NFT's to a collection. Choose “Single” to add to your collection or to sell your one of a kind.
          </div>
        </div>
        <div className="boxs">
          <Link
            to="/single-create"
            className="box flex flex-col aic jc cursor-pointer"
          >
            <img src="./images/sing-nft.svg" className="img" />
            <div className="lbl">Single</div>
          </Link>
          <Link
            to="/collection-create"
            className="box flex flex-col aic jc cursor-pointer"
          >
            <img src="./images/collection-nft.svg" className="img" />
            <div className="lbl">Collection</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateNft;
