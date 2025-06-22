import React, { useState, useEffect } from "react";
import ExchangeGraph from "../components/ExchangeGraph";
import Select from "react-select";
import { SearchIcon, ExchangeIcon, SunIcon, MenuIcon2 } from "../Icons/";
import ExchangeRatesComponent from "../components/exchangeRatesComponent/ExchangeRatesComponent";
import { useSocket } from "../context/socket";
import { useSelector, useDispatch } from "react-redux";
import { getUserCurrencies } from "../helper/ws";
import * as balanceAction from "../redux/xummBalance/action";
import GraphHeadComponent from "../components/graphHeadComponent/GraphHeadComponent";
import ExchangeWallet from "../components/exchangeWallet/ExchangeWallet";
import AccountOffersTable from "../components/accountOfferTable/AccountOffersTable";
import BookOffersTable from "../components/bookOfferTable/BookOffersTable";
import Chart from "../components/charts";

const Exchange = ({ isDarkMode }) => {
  const network = useSelector(state => state.networkReducers.token);

  const [tokenTabSelected, setTokenTabSelected] = useState(network ? network.toUpperCase() : "XRP");

  //from our client code
  const [currencyData, setCurrencyData] = useState(null);
  const dispatch = useDispatch();
  const [dropVal, setDropVal] = useState(0);

  const connectModalVisible = useSelector(state => state.authReducer.isModalOpen);

  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);

  const accountInfo = useSelector(state => state?.signInData?.balance);

  const accountNumber = accountInfo?.account;

  const socket = useSocket();

  useEffect(() => {
    if (isWalletConnected) {
      getUserCurrencies(accountNumber)
        .then(res => {
          if (res.status === "success") {
            // console.log("accountInfo", accountInfo);
            dispatch(
              balanceAction.setBalance({
                ...accountInfo,
                currencies: res.result.lines,
              }),
            );
          } else {
            dispatch(balanceAction.setBalance(accountInfo));
          }
        })
        .catch(err => console.log("err", err));
    } else {
      dispatch(balanceAction.setBalanceEmpty());
    }
  }, [isWalletConnected]);

  if (connectModalVisible) {
    const socketConnect = socket.on("connect", () => {
      // console.log("socket.id", socket.id);
    });
    const socketClose = socket.on("disconnect", () => {
      // console.log("disconnect", socket.id);
    });
  }

  const getData = data => {
    setCurrencyData({
      ...currencyData,
      info: data,
    });
  };
  socket.on("drops-val", args => {
    const drops = Number(args);
    // console.log("dropssssssss :: ", drops);
    setDropVal(drops);
    // console.log("drops", drops);
  });
  return (
    <>
      {/* <SocketContext.Provider value={socket}> */}
      <div className="exchange-page flex">
        <div className="wrap flex flex-col w-full">
          {/* TOP PANNEL START */}
          <div className="content-block flex">
            {/* LEFT START */}
            <ExchangeRatesComponent getData={getData} currencyData2={currencyData} dropVal={dropVal} setDropVal={setDropVal} />

            {/* LEFT END */}

            {/* CENTER START */}
            <div className="center flex flex-col w-full">
              {/* Top center start */}
              <GraphHeadComponent currencyData2={currencyData} />

              {/* Top center end */}
              {/* graph center start */}

              <div className="graph-sec flex flex-col w-full">
                <Chart currencyData={currencyData} isDarkMode={isDarkMode} />
              </div>
              {/* graph center end */}

              {/* buy sell- connect wallet start */}
              <ExchangeWallet currencyData={currencyData} />
              {/* buy sell- connect wallet end */}
            </div>
            {/* CENTER END */}

            {/* RIGHT START */}
            <BookOffersTable tokenTabSelected={tokenTabSelected} currencyData={currencyData} dropVal={dropVal} setDropVal={setDropVal} />
            {/* RIGHT END */}
          </div>
          {/* TOP PANNEL END */}

          {/* BOTTOM TABLE START */}
          <AccountOffersTable currencyData2={currencyData} dropVal={dropVal} setDropVal={setDropVal} />
          {/* BOTTOM TABLE END */}

          <div className="font-normal text-black text-center text-base">
            Digital Block Exchanges uses the charting solution provided by{" "}
            <a href="https://www.tradingview.com/" rel="noreferrer" target="_blank" className=" underline text-black">
              TradingView
            </a>
            , a platform for traders and investors with versatile analytical tools. It lets you track particular symbols,{" "}
            <a href="https://www.tradingview.com/symbols/XRPUSD/" rel="noreferrer" target="_blank" className=" underline text-black">
              e.g. XRP USD,
            </a>{" "}
            as well as dive into a more advanced market analysis with sophisticated data like crypto market cap.
          </div>
        </div>
      </div>
      {/* </SocketContext.Provider> */}
    </>
  );
};

export default Exchange;
