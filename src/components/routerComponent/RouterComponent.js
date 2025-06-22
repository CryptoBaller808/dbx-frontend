import React from "react";
import { Routes, Route } from "react-router-dom";
import LandindPage from "../../screens/landingPage/LandingPage";
import Swap from "../../screens/swap/Swap";
import BuySell from "../../screens/buySell/BuySell";
import Earn from "../../screens/earn/Earn";
import EarnOne from "../../screens/earnone/EarnOne";
import StakeBtr from "../../screens/stakeBtr/StakeBtr";
import StakeBtrOne from "../../screens/stakeBtrOne/StakeBtrOne";
import NftHome from "../../screens/nftHome/nftHome";
import Orders from "../../screens/orders/Orders";
import Assets from "../../screens/assets/Assets";
import Exchange from "../../screens/exchange/Exchange";
import Navbar1Component from "../navbar1Component/Nabra1Component";
import Navbar2Component from "../navbar2Component/Navbar2Component";
import Navbar3Component from "../navbar3Component/Navbar3Component";
import Navbar4Component from "../navbar4Component/Navbar4Component";
import FooterComponent from "../footerComponent/FooterComponent";
import { useSelector } from "react-redux";
import ExchangeModel from "../exchangeModel/ExchangeModel";

function RouterComponent() {
  const isWalletConnected = useSelector(
    (state) => state.authReducer.isWalletConnected
  );
  return (
    <div>
      {/* {isWalletConnected ? (
        <Navbar2Component />
      ) : (
        <Navbar1Component />
      )} */}
      <Routes>
        <Route
          path="/"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <LandindPage />
            </React.Fragment>
          }
        />
        <Route
          path="/buysell"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <BuySell />
            </React.Fragment>
          }
        />
        <Route
          path="/swap"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <Swap />
            </React.Fragment>
          }
        />
        <Route
          path="/earn"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <Earn />
            </React.Fragment>
          }
        />
        <Route
          path="/cryto"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <EarnOne />
            </React.Fragment>
          }
        />
        <Route
          path="/stakebtr"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <StakeBtr />
            </React.Fragment>
          }
        />
        <Route
          path="/stakebtrone"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <StakeBtrOne />
            </React.Fragment>
          }
        />
        <Route
          path="/nft"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <NftHome />
            </React.Fragment>
          }
        />
        <Route
          path="/exchange"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar4Component /> : <Navbar3Component />}
              <Exchange />
            </React.Fragment>
          }
        />
        {/*    <Route path="/exchangemodel" element={<ExchangeModel />} />*/}
        <Route
          path="/orders/*"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <Orders />
            </React.Fragment>
          }
        />
        <Route
          path="/assets/*"
          element={
            <React.Fragment>
              {isWalletConnected ? <Navbar2Component /> : <Navbar1Component />}
              <Assets />
            </React.Fragment>
          }
        />
      </Routes>
      <FooterComponent />
    </div>
  );
}

export default RouterComponent;
