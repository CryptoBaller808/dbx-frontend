/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Web3 from "web3";
import axios from "axios";

import "./App.css";
import "./css/App.scss";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Main from "./Pages/Main";
import Exchange from "./Pages/Exchange";
import BuySell from "./Pages/BuySell";
import Swap from "./Pages/Swap";
import CreateNft from "./Pages/CreateNft";
import SingleNft from "./Pages/SingleNft";
import CreatedNFT from "./Pages/CreatedNFT";
import CollectionNft from "./Pages/CollectionNft";
import ExplorePage from "./components/ExplorePage";
import Profile from "./Pages/Profile";
import MyNftDetail from "./Pages/MyNftDetail";
import CreateNewItem from "./components/CreateNewItem";
import EditProfile from "./Pages/EditProfile";
import ContactUs from "./Pages/ContactUs";
import ListingApplication from "./Pages/ListingApplication";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
// New Pages
import LandingPage from "./Pages/landingPage/LandingPage";
// import BuySell from "./Pages/buySell/BuySell";
// import Swap from "./Pages/swap/Swap";
// import Earn from "./Pages/earn/Earn";
// import EarnOne from "./Pages/earnone/EarnOne";
// import StakeBtr from "./Pages/stakeBtr/StakeBtr";
// import StakeBtrOne from "./Pages/stakeBtrOne/StakeBtrOne";
// import NftHome from "./Pages/nftHome/nftHome";
import Orders from "./Pages/orders/Orders";
// import Assets from "./Pages/assets/Assets";
// import ExchangeNew from "./Pages/exchange/Exchange";
// import Navbar1Component from "./components/navbar1Component/Nabra1Component";
// import Navbar2Component from "../components/navbar2Component/Navbar2Component";
// import Navbar3Component from "./components/navbar3Component/Navbar3Component";
// import Navbar4Component from "./components/navbar4Component/Navbar4Component";
// import FooterComponent from "./components/footerComponent/FooterComponent";
// import { useSelector } from "react-redux";
// import ExchangeModel from "../exchangeModel/ExchangeModel";

import Sidebar from "./components/Sidebar";
import NftDetail from "./components/NftDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useDispatch, useSelector } from "react-redux";
import Resale from "./Pages/Resale";
// import ThemeSwitch from "./components/theme-switch"; 
import { useSocket } from "./context/socket";
import * as balanceAction from "./redux/xummBalance/action";
import * as QRCodeAction from "./redux/xummQRCode/action";
import * as accountOfferAction from "./redux/accountOffers/action";
import * as historyOfferAction from "./redux/historyOffers/action";
import { connectWallet, logoutUser } from "./redux/actions";
import { setNetwork } from "./redux/network/action";
// import ThemeSwitch from "./components/theme-switch";
import XLMSwap from "./Pages/xlm-swap";
import ThemeSwitch from "./components/theme-switch";
// import initializeAnalytics from "./helper/analytics/analytics";  
import handleGoogleAnalytics from "./helper/analytics/analytics";

let timeout = null;

function App() {
  const [openSidebar, setOpenSidebar] = useState(false);
  // const { analyticsData, isLoading, error } = useGoogleAnalytics();
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector(state => state.themeReducer);
  const balanceData = useSelector(state => state.signInData?.balance);
  const userToken = useMemo(() => balanceData?.userToken ?? "", [balanceData]);
  const socket = useSocket();
  const network = useSelector(state => state.networkReducers.token);

  const gettokenlocalstorage = async () => {
    let data = JSON.parse(localStorage.getItem("nft_login"));
    if (!data) return;
    console.log("login_cred", data);
    const res2 = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/getuserProfile/${data?.id}`);
    console.log("res22", res2);
    if (res2?.data) {
      dispatch({
        type: "GET_USER",
        payload: { ...data, ...res2?.data },
      });
    }
  };

  // Effect to set the class on the body based on the current mode
  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    gettokenlocalstorage();
  }, []);

  const walletSync = useCallback(async () => {
    socket.emit("xlm-fetch-wallet", userToken);
    socket.on("wallet-updated", args => {
      dispatch(balanceAction.setBalance(args));
    });
  }, [dispatch, socket, userToken]);

  useEffect(() => {
    timeout = setTimeout(() => walletSync(), 5000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [dispatch, walletSync]);

  const disconnectWallet = useCallback(() => {
    dispatch(balanceAction.setBalanceEmpty());
    dispatch(QRCodeAction.setQRCodeDisconnect());
    dispatch(connectWallet(false));
    //clear acc offers content

    dispatch(accountOfferAction.setAccountOffersProcessing(true));
    dispatch(accountOfferAction.setAccountOffers([]));
    dispatch(accountOfferAction.setAccountOffersProcessing(false));
    //clear history content
    dispatch(historyOfferAction.setHistoryOffersProcessing());
    dispatch(historyOfferAction.setHistoryOffers([]));
    dispatch(historyOfferAction.setStopHistoryOffersProcessing());
    localStorage.removeItem("nft_login");
    dispatch(logoutUser());
  }, [dispatch]);

  const handleMenuClick = useCallback(
    selected => {
      disconnectWallet();
      dispatch(setNetwork(selected.value));
      setOpenSidebar(false);
    },
    [disconnectWallet, dispatch],
  );
   
  useEffect(() => {
    // initializeAnalytics(); // Initialize Google Analytics   
    handleGoogleAnalytics("G-Y7JFCH1TE5")
  }, []);
  
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} setSelectedToken={handleMenuClick} />
        <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <Routes>
          <Route path="/" element={<LandingPage />} exact />
          <Route path="/buysell" element={<BuySell />} exact />
          <Route path="/orders/*" element={<Orders />} exact />
          <Route path="/nft" element={<Main />} exact />
          <Route path="/swap" element={network === "xlm" ? <XLMSwap /> : <Swap />} exact />
          <Route path="/exchange" element={<Exchange isDarkMode={isDarkMode} />} exact />
          <Route path="/profile-edit" element={<EditProfile />} exact />
          <Route path="/nft-detail" element={<NftDetail />} exact />
          <Route path="/nft-create" element={<CreateNft />} exact />
          <Route path="/single-create" element={<SingleNft />} exact />
          <Route path="/creatednft/:id" element={<CreatedNFT />} exact />
          <Route path="/collection-create" element={<CollectionNft />} exact />
          <Route path="/nft-explore" element={<ExplorePage />} exact />
          <Route path="/profile" element={<Profile />} exact />
          <Route path="/nft-detail/:name" element={<MyNftDetail />} exact />
          <Route path="/create-item" element={<CreateNewItem />} exact />
          <Route path="nft-detail/resale/:id" element={<Resale />} exact />
          <Route path="/collection/:name" element={<MyNftDetail />} exact />
          <Route path="/contactUs" element={<ContactUs />} exact />
          <Route path="/listing-application" element={<ListingApplication />} exact />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} exact />
        </Routes>
        <Footer />
      </BrowserRouter>

      <div className="color-toggle">
        <ThemeSwitch />
      </div>
    </div>
  );
}

export default App;
