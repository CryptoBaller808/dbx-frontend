import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TelegramIcon, TwitterIcon } from "../Icons";
import Logo from "../assets/Logo-f.svg";
import LogoHorizontal from "../assets/DBXhorizontal-logo.svg";
const Footer = () => {
  return (
    <div className="footer-pg flex">
      <div className="wrapWidth wrap flex items-center gap-3">
        <div className="left flex flex-col">
          <img src={Logo} className="logo-img" />
          <div className="social flex aic">
            <div className="icon flex aic jc">
              <TelegramIcon />
            </div>
            <div className="icon flex aic jc">
              <a href="https://twitter.com/DigitalBlockEx" target="_blank">
                <img src="/xIcon.svg" className="" />
              </a>
            </div>
          </div>
        </div>
        <div className="right flex">
          {/*<div className="items flex flex-col">
          <div className="tag">Useful Link</div>
          <a href="/" className="lbl">
            About Us
          </a>
          <a href="/" className="lbl">
            Help Center
          </a>
          <a href="/" className="lbl">
            White Paper
          </a>

            {/*<a href="/" className="lbl">
              Tokenomics
            </a>
          </div>*/}
          {/* <div className="items flex flex-col">
            <div className="tag">Legal</div>
            <a href="/" className="lbl">
              Privacy Policy
            </a>
            <a href="/" className="lbl">
              Terms of Service{" "}
            </a>
          </div> */}
          {/*<div className="items flex flex-col">
            <div className="tag">Trading</div>
            <a href="/" className="lbl">
              Fees
            </a>
          </div>*/}
          <div className="items flex flex-col gap-3">
            <div className="tag">Contact Us</div>
            {/* <a href="/" className="lbl">
              Submit a request
            </a>
            <a href="/" className="lbl">
              Locate a Lost Deposit
            </a>*/}
            <Link to="/listing-application" className="lbl">
              Listing Application
            </Link>
            <Link to="/contactUs" className="lbl">
              Contact Us
            </Link>
            <Link to="/privacy-policy" className="lbl">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
