import React, { useState, useEffect, useMemo } from "react";
import _ from "loadsh";
import Loader from "../Loader";

import Select from "react-select";
import { MenuIcon2 } from "../../Icons";
import { useSelector, useDispatch } from "react-redux";
import { getBookOffers } from "../../helper/ws";
import * as bookOfferAction from "../../redux/bookOffers/action";
import { useSocket } from "../../context/socket";

const BookOffersTable = ({ tokenTabSelected, currencyData, dropVal, setDropVal }) => {
  const [selectedCombined, setSelectedCombined] = useState({ value: 7, label: "7 Decimals", user: "decimal7" });
  const [loading, setLoading] = useState(true);

  const [CombinedData, setCombinedData] = useState([
    { value: 3, label: "3 Decimals", user: "decimal3" },
    { value: 5, label: "5 Decimals", user: "decimal5" },
    { value: 7, label: "7 Decimals", user: "decimal7" },
  ]);

  //new update
  // const [dropVal, setDropVal] = useState(0);

  const currentCurrency = currencyData?.info?.curA;

  const baseCurrency = currencyData?.info?.curB === "SOLO" ? "534F4C4F00000000000000000000000000000000" : currencyData?.info?.curB;

  const currentIssuer = currencyData?.info?.issuerA;
  const baseIssuer = currencyData?.info?.issuerB;

  const [decimalVal, setDecimalVal] = useState(7);
  const columns = [
    {
      name: `Price(${currentCurrency})`,
      cell: row => {
        return <div>{row.price > 0 ? <p className="colorisred">{row.price}</p> : <p className="colorisred">{row.price}</p>}</div>;
      },
      center: true,
    },
    {
      name: `Amount(${baseCurrency})`,
      selector: row => row.amount,
      center: true,
    },
    {
      name: "Vol",
      selector: row => row.vol,
      center: true,
    },
  ];

  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);

  const balanceData = useSelector(state => state.signInData?.balance);
  const userAccount = balanceData?.account;

  const dispatch = useDispatch();
  const bookOffer = useSelector(state => state.bookOffers?.bookOffer);
  const bookOfferProcessing = useSelector(state => state.bookOffers?.processing);

  const [bookOfferData, setBookOfferData] = useState(bookOffer);

  const socket = useSocket();

  useEffect(() => {
    socket.on("drops-val", args => {
      const drops = Number(args);
      setDropVal(drops);
    });
    setBookOfferData(bookOffer);
  }, [bookOffer]);
  // console.log("dropVal", dropVal);

  const dataSource = useMemo(() => {
    return bookOfferData.map((obj, indx) => {
      const price = currentCurrency === "XRP" ? dropVal * Number(obj.quality) : Number(obj.price);
      const amount = currentCurrency === "XRP" ? Number(obj?.TakerPays?.value) : Number(obj?.amount);
      const volume = price * amount.toFixed(decimalVal);

      return {
        id: indx + 1,
        amount: amount.toFixed(decimalVal),
        price: price?.toFixed(decimalVal),
        vol: volume.toFixed(decimalVal),
      };
    });
  }, [bookOfferData, currentCurrency, decimalVal, dropVal]);

  const submitBookOfferData = {
    currentCurrency,
    baseCurrency,
    currentIssuer,
    baseIssuer,
  };

  useEffect(() => {
    getBookOffers(submitBookOfferData, userAccount)
      .then(res => {
        if (res.status === "success" && res.result?.offers.length) {
          // const offerResult = _.orderBy(
          //   res.result.offers,
          //   ["Sequence"],
          //   ["desc"]
          // );
          // const offerResult = res.result.offers.reverse();
          // console.log("bookOffers", res.result.offers);
          // console.log("reverse offerResult", offerResult);
          dispatch(bookOfferAction.setBookOffersProcessing());
          dispatch(bookOfferAction.setBookOffers(res.result.offers));
          dispatch(bookOfferAction.setStopBookOffersProcessing());
        } else {
          dispatch(bookOfferAction.setBookOffersProcessing());
          dispatch(bookOfferAction.setBookOffers([]));

          dispatch(bookOfferAction.setStopBookOffersProcessing());
        }
      })
      .catch(err => console.log("book error", err));
  }, [currencyData, isWalletConnected]);

  useEffect(() => {
    if (bookOfferProcessing) {
      setLoading(true);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [bookOfferProcessing]);

  return (
    <div className="right flex flex-col">
      <div className="right-sec-filter flex">
        <div className="h-left flex items-center">
          <div className="icon cursor-pointer">
            <MenuIcon2 />
          </div>
          <div className="icon cursor-pointer">
            <MenuIcon2 />
          </div>
          <div className="icon cursor-pointer">
            <MenuIcon2 />
          </div>
        </div>
        <div className="h-right flex items-center">
          <div className="filter flex items-center">
            <div className="lbl">Combined</div>{" "}
            <Select
              defaultValue={selectedCombined}
              onChange={e => {
                // console.log("EEEE", e);
                setSelectedCombined(e);
                setDecimalVal(e.value);
              }}
              options={CombinedData}
              className="select"
              placeholder="Select Combined"
            />
          </div>
        </div>
      </div>
      <div className="token-table flex">
        <div className="table-block flex flex-col w-full">
          <div className="tbl-row flex">
            {/* {columns.map((obj)=>)} */}
            <div className="row-item">Price(${currentCurrency})</div>
            <div className="row-item">Amount(${baseCurrency === "534F4C4F00000000000000000000000000000000" ? "SOLO" : baseCurrency})</div>
            <div className="row-item flex items-center justify-end">Vol</div>
          </div>

          {!loading ? (
            dataSource.length > 0 ? (
              dataSource.map((item, i) => (
                <div className="tbl-row flex" key={i}>
                  <div className={`row-item flex items-center justify-start ${parseInt(item.price) > 0 ? "red" : "green"}`}>
                    {parseFloat(item.price).toFixed(4)}
                  </div>
                  <div className="row-item flex items-center">{parseFloat(item.amount).toFixed(4)}</div>
                  <div className="row-item flex items-center justify-end">{parseFloat(item.vol).toFixed(4)}</div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center no-result">No result found</div>
            )
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookOffersTable;
