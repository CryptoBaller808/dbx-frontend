import React, { useState, useEffect, useCallback } from "react";
import { SearchIcon, ExchangeIcon, SortIcon } from "../../Icons";
//new updateimport getExchangeRate from "../../helper/api/exchangeRate";
import currency from "../../helper/currencies";
import getExchangeRate from "../../helper/api/exchangeRate";
import Loader from "../../components/Loader";
import { getTradesData } from "../../helper";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../../context/socket";
//redux
import * as tradesAction from "../../redux/tradesData/action";
import moment from "moment";
import clsx from "clsx";
import Fuse from "fuse.js";
import XRPLogo from "../../Images/XRPLLogo.png"
import XLMLogo from "../../Images/xlm-logo.png"

// const dateFormat = "YYYY/MM/DD";
const DECIMALVAL = 7;

let timeout = null;

const ExchangeRatesComponent = ({ getData, currencyData2, dropVal, setDropVal }) => {
  const network = useSelector(state => state.networkReducers.token);
  const [tokenTabSelected, setTokenTabSelected] = useState(network ? network.toUpperCase() : "XRP");
  const [currencyData, setCurrencyData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [currencyDataLoaded, setCurrencyDataLoaded] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchedPairs, setSearchedPairs] = useState([]);

  const dispatch = useDispatch();

  const tradesData = useSelector(state => state.trades?.trades);
  const tradesDataProcessing = useSelector(state => state.trades?.processing);

  const [tradeLoading, setTradeLoading] = useState(true);
  const [tradesList, setTradeList] = useState(tradesData);
  const socket = useSocket();

  //get all currency data list
  const getAllCurrencyData = async () => {
    try {
      const filteredCurrencies = currency.filter(val => tokenTabSelected == val.currency);

      if (tokenTabSelected === "XLM") {
        const prices = await getExchangeRate({ mainToken: tokenTabSelected });
        return prices;
      } else {
        const selectedCurrency = currency.find(obj => obj.currency === tokenTabSelected);

        const currencyDataPromise = filteredCurrencies.map(obj => {
          const exchangeData = {
            curA: tokenTabSelected,
            issuerA: selectedCurrency.issuer,
            curB: obj.currency,
            issuerB: obj.issuer,
          };
          return getExchangeRate(exchangeData);
        });
        const prices = await Promise.all(currencyDataPromise);

        // let titleData = filteredCurrencies.map((obj, indx) => { 
        //   const data = {
        //     id: indx,
        //     title: `${tokenTabSelected}/${obj.currency}`,
        //     stat: "-22.45",
        //     curA: tokenTabSelected,
        //     issuerA: selectedCurrency.issuer,
        //     curB: obj.currency,
        //     issuerB: obj.issuer,
        //   };
        //   return data;
        // });

        // prices.map((price, indx) => {
        //   titleData[indx].price = price;
        // }); 
        // return titleData;

        return prices[0];
      }
    } catch (error) {
      console.error("errorrrr", error);
      return [];
    }
  };

  //set all currency data as select the currency
  useEffect(() => {
    if (currencyData.length) {
      setRowData(currencyData[0]);
      getData(currencyData[0]);
      setLoadingData(false);
      setCurrencyDataLoaded(true);
    }
  }, [currencyData]);

  useEffect(() => {
    setLoadingData(true);
    getAllCurrencyData().then(val => {
      // console.log("currency data", val);
      setCurrencyData(val);
    });
    setLoadingData(false);
  }, [tokenTabSelected]);

  const handleRow = useCallback(
    data => {
      setRowData(data);
      getData(data);
    },
    [getData],
  );

  //FOR TRADES DATA
  useEffect(() => {
    socket.on("drops-val", args => {
      const drops = Number(args);
      setDropVal(drops);
    });
    setTradeList(tradesData);
  }, [tradesData]);

  const dataSource = (Array.isArray(tradesData) ? tradesData : []).map((obj, indx) => {
    const price = parseFloat(obj.price).toFixed(DECIMALVAL);
    const date = obj.time;
    const volume = price * parseFloat(obj.amount).toFixed(DECIMALVAL);

    return {
      id: indx + 1,
      time: formatRelativeDate(date),
      price: price,
      vol: volume.toFixed(DECIMALVAL),
      color: obj?.color,
    };
  });

  useEffect(() => {
    async function fetchData() {
      if (currencyData2?.info) {
        const acc = {
          curA: currencyData2?.info?.curA,
          curB: currencyData2?.info?.curB === "SOLO" ? "534F4C4F00000000000000000000000000000000" : currencyData2?.info?.curB,
          issuerB: currencyData2?.info?.issuerB,
        };
        await getTradesData(acc)
          .then(res => {
            if (res.data.success) {
              // console.log("FROM SERVER CHART DATA ----------->", res.data.data);
              // setTradeLoading(true);
              dispatch(tradesAction.setTradesProcessing());
              dispatch(tradesAction.setTrades(res.data.data));

              dispatch(tradesAction.setStopTradesProcessing());
              // setTradeLoading(false);
            } else {
              dispatch(tradesAction.setTradesProcessing());
              dispatch(tradesAction.setTrades([]));
              dispatch(tradesAction.setStopTradesProcessing());
            }
          })
          .catch(err => console.error("CHART DATA", err));
      }
    }
    fetchData();
  }, [currencyData2, tokenTabSelected]);

  //TRADES DATA LOADER
  useEffect(() => {
    if (tradesDataProcessing) {
      setTradeLoading(true);
    } else {
      setTimeout(() => {
        setTradeLoading(false);
      }, 2000);
    }
  }, [tradesDataProcessing]);

  const onTokenSelect = useCallback(selected => {
    setTokenTabSelected(selected);
  }, []);

  const onSearch = useCallback(
    e => {
      const query = e?.target?.value;
      setSearching(!!query);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const fuse = new Fuse(currencyData, {
          keys: ["title"],
          threshold: 0.1,
        }).search(query);
        setSearchedPairs(fuse.map(item => item.item));
      }, 1000);
    },
    [currencyData],
  );

  const fixed4 = number => {
    return number?.toFixed(4);
  };
  return (
    <div className="left flex flex-col  h-full ">
      {/* Left price bar start */}
      <div className="le-top flex flex-col">
        <div className="search-box flex items-center justify-between">
          <div className="icon">
            <SearchIcon />
          </div>
          <input type="text" className="txt cleanbtn w-full" placeholder="Search" onChange={onSearch} />
        </div>
        <div className="token_tabs flex">
          <div className={clsx("item", { active: tokenTabSelected === "XRP" })} onClick={onTokenSelect.bind(this, "XRP")}>
            XRP
          </div>
          <div className={clsx("item", { active: tokenTabSelected === "XLM" })} onClick={onTokenSelect.bind(this, "XLM")}>
            XLM
          </div>
        </div>

        <div className="token-table flex">
          <div className="table-block flex flex-col w-full">
            {/* <Table
              className="text-xs p-0"
              columns={[
                { dataIndex: "1", key: "1", title: "Pair" },
                { dataIndex: "2", key: "2", title: "Price" },
                {
                  dataIndex: "3",
                  key: "3",
                  title: (
                    <span>
                      24h Chg <ExchangeIcon />
                    </span>
                  ),
                },
              ]}
            /> */}
            <div className="tbl-row flex text-xs ">
              <div className="row-item flex items-center">
                Pair <SortIcon />
              </div>
              <div className="row-item text-center flex items-center">Price</div>
              <div className="row-item flex items-center">
                24h Chg
                <ExchangeIcon />
              </div>
            </div>
            {loadingData ? (
              <Loader />
            ) : (
              (searching ? searchedPairs : currencyData).map((item, i) => (
                <div
                  className={clsx("tbl-row flex rounded-sm", {
                    "bg-grey-50": item.title === rowData?.title,
                  })}
                  key={i}
                  onClick={handleRow.bind(this, item)}>
                  <div className="row-item flex items-center gap-3 ps-1 relative">
                    {item?.icon_url &&  <img src={tokenTabSelected==="XRP" ? XRPLogo : XLMLogo} alt="" className="w-4 h-4 "/>}  
                    {item?.icon_url &&  <img src={item?.icon_url} alt="" className="w-4 h-4 absolute top-0 left-4"/>} 
                    <span className="name1">{item.title}</span>
                  </div>
                  {/* <div className="row-item text-center">{isNaN(item.price) ? "-" : parseFloat(item.price).toFixed(3)}</div> */}
                  <div className="row-item text-center">{isNaN(item.price) ? "-" : parseFloat(item.price)}</div>

                  <div
                    className={clsx("row-item flex items-center justify-end", {
                      red: item.stat < 0,
                      green: item.stat >= 0,
                    })}>  
                    {isNaN(item.stat) ? "-" : parseFloat(item.stat).toFixed(3) + "%"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Left price bar end */}

      {/* Left Trades bar start */}
      <div className="le-btm flex flex-col">
        <div className="sec-tag">Trades</div>
        <div className="token-table flex">
          <div className="table-block flex flex-col w-full">
            <div className="tbl-row flex">
              <div className="row-item">Price ({tokenTabSelected})</div>
              <div className="row-item">Vol ({currencyData2?.info?.curB})</div>
              <div className="row-item flex items-center justify-end">Time</div>
            </div>
            {tradeLoading ? (
              <Loader />
            ) : dataSource.length > 0 ? (
              dataSource.map((item, i) => {
                return (
                  <div className="tbl-row flex" key={i}>
                    <div
                      className={clsx("row-item flex items-center", {
                        red: item.color === "red",
                        green: item.color === "green",
                      })}>
                      {parseFloat(item.price).toFixed(4)}
                    </div>
                    <div className="row-item">{parseFloat(item.vol).toFixed(4)}</div>
                    {/* ${item.type === "red" ? "red" : "green"} */}
                    <div className={`row-item flex items-center justify-end `}>{item.time}</div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center no-result">No result found</div>
            )}
          </div>
        </div>
      </div>
      {/* Left Trades bar end */}
    </div>
  );
};

export default ExchangeRatesComponent;

function formatRelativeDate(inputDate) {
  const parsedDate = moment(inputDate);
  const durationInMinutes = moment().diff(parsedDate, "minutes");
  const durationInHours = moment().diff(parsedDate, "hours");
  const durationInDays = moment().diff(parsedDate, "days");

  if (durationInMinutes < 60) {
    return `${durationInMinutes}m ago`;
  } else if (durationInHours < 24) {
    return `${durationInHours}h ago`;
  } else if (durationInDays === 1) {
    return "1d ago";
  } else {
    return `${durationInDays}d ago`;
  }
}
