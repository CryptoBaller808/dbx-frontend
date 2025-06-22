import React, { useEffect, useState } from "react";
import Banxa from "../Images/banxa.png";
import Topper from "../Images/topper.png";
import { Link } from "react-router-dom";
import { getBanners } from "../api/executers/Banner";
import initializeAnalytics from "../helper/analytics/analytics";
import handleGoogleAnalytics from "../helper/analytics/analytics";

const BuySell = () => {
  const [banner, setbanner] = useState(null)
  // handle on click buy
  const handleOnBuy = option => {
    if (option === "banxa") {
    } else if (option === "topper") {
    }
  };

  const handleGetBanner = async type => {
    try {
      const resp = await getBanners(type);
      if (resp.success) {
        setbanner(resp.data.url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetBanner("buy");
  }, [handleGetBanner]);

  useEffect(() => {
    initializeAnalytics(); // Initialize Google Analytics
    handleGoogleAnalytics("G-Y7JFCH1TE5")
  }, []);
  return (
    <div className="buy-sell flex flex-col">
      {/* <div className="buy-sell-hero-sec"></div> */}
      <div>
      {banner ? (
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
            <div>Loading...</div> // Show loading state while banner is being fetched
          )}
      </div>
      <div className="wrap wrapWidth flex aic flex-col">
        <div className="buy-sell-card-block">
          <div className="card flex flex-col aic">
            <img src="./banxa.png" className="img" />
            <div className="meta flex flex-col">
              <div className="card-tag">Banxa OnRamp</div>
              <div className="card-desc text-center pt-7">Upfront fees: FREE to 1.99% for ACH or Card payments.</div>
              <div className="card-desc text-center mb-7">Credit/Debit Card, Apple Pay, Google Pay or ACH accepted!</div>
              <div className="payment-method-logos flex items-center justify-center gap-3">
                <img src="./images/visa1.png" className="pm-logo" />
                <img src="./images/MastercardLogo1.png" className="pm-logo" />
                <img src="./images/apple-pay1.png" className="pm-logo" />
              </div>
            </div>
            <Link to="https://xumm.app/detect/xapp:banxa.onofframp" target="_blank" className="btn button">Buy/Sell</Link>
          </div>
          <div className="card flex flex-col aic">
            <img src="./topper.png" className="img" />
            <div className="meta flex flex-col">
              <div className="card-tag">Topper OnRamp</div>
              <div className="card-desc text-center pt-7">Upfront fees: $1 to 3.9%</div>
              <div className="card-desc text-center pt-7 mb-7">Use your Credit or Debit Card!</div>
              <div className="payment-method-logos flex items-center justify-center gap-3">
                <img src="./images/visa1.png" className="pm-logo" />
                <img src="./images/MastercardLogo1.png" className="pm-logo" />
              </div>
            </div>
            <Link to="https://xumm.app/detect/xapp:uphold.topper" target="_blank" className="btn button">Buy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySell;
