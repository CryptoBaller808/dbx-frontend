import React, { useState, useEffect, useCallback } from "react";
import "./style.css";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setModalOpen } from "../../redux/actions";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import OfferModel from "../offerModel";
import Modal from "../Modal";
import { Slider } from "antd";
import WalletConnect from "../WalletConnect";
import clsx from "clsx";

const ExchangeWallet = ({ currencyData }) => {
  const price = currencyData?.info?.price;
  const baseCurrent = currencyData?.info.curA ?? "XRP";
  const title = currencyData?.info?.title;
  const issuerB = currencyData?.info?.issuerB;
  const issuerA = currencyData?.info?.issuerA;
  const curA = currencyData?.info?.curA;
  const curB = currencyData?.info?.curB;

  const [connectTokenTab, setConnectTokenTab] = useState("Limit");
  //from new update
  const [paymentModel, setPaymentModel] = useState(false);
  const [offerType, setOfferType] = useState("");
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState("Limit");
  const [orderStatus, setOrderStatus] = useState(false);
  const [amount, setAmount] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  const accountInfo = useSelector(state => state.signInData?.balance);
  const network = useSelector(state => state.networkReducers.token);
  const location = useLocation();
  const dispatch = useDispatch();

  const [marketVal, setMarketVal] = useState({
    buyAmount: "",
    sellAmount: "",
  });

  const [limitVal, setLimitVal] = useState({
    buyAmount: "",
    sellAmount: "",
    buyPrice: price,
    sellPrice: price,
  });

  const clearForms = useCallback(() => {
    setLimitVal(pre => ({ ...pre, buyAmount: "", sellAmount: "" }));
    setMarketVal({ buyAmount: "", sellAmount: "" });
  }, []);

  const userCurrencies = accountInfo?.currencies?.filter(val => {
    if (baseCurrent === "XLM") return val.asset_code === curB;

    return val.account === issuerB && val.currency === curB;
  });
  const userCurrencyBalance = userCurrencies?.length && userCurrencies[0].balance;
  const balance = accountInfo?.balance;
  const accountStr = accountInfo?.account;
  const tempCurrency = title && title.split("/");
  const currentCurrency = tempCurrency?.length && tempCurrency[0];
  const baseCurrency = tempCurrency?.length && tempCurrency[1];
  const totalBuyPrice = marketVal.buyAmount * price;
  const totalSellPrice = marketVal.sellAmount * price;
  const totalBuyPriceLimit = limitVal.buyAmount * limitVal.buyPrice;
  const totalSellPriceLimit = limitVal.sellAmount * limitVal.sellPrice;

  useEffect(() => {
    setLimitVal({
      buyAmount: "",
      sellAmount: "",
      buyPrice: price,
      sellPrice: price,
    });
  }, [price]);

  useEffect(() => {
    if (orderStatus) {
      setMarketVal({
        buyAmount: 0,
        sellAmount: 0,
        sellPrice: 0,
        buyPrice: 0,
      });
      setLimitVal({ buyAmount: 0, sellAmount: 0, sellPrice: 0, buyPrice: 0 });
      setTotalPrice(0);
      setLimitPrice(0);
    }
  }, [orderStatus]);

  const handleClickOpen = () => {
    if (location.pathname === "/exchange") {
      dispatch(setModalOpen(true));
      setOpen(true);
    }
  };

  const handleMarketVal = e => {
    setMarketVal({
      ...marketVal,
      [e.target.name]: e.target.value,
    });
  };

  const handleLimitVal = e => {
    setLimitVal({
      ...limitVal,
      [e.target.name]: e.target.value,
    });
  };

  const handleBuyMarket = () => {
    if (marketVal.buyAmount > 0) {
      setPaymentModel(true);
      setOfferType("buy");
      setOrderType("Market");
      setAmount(marketVal.buyAmount);
      setTotalPrice(totalBuyPrice);
    } else {
      toast.error("Please enter amount");
    }
  };

  const handleSellMarket = () => {
    if (marketVal.sellAmount > 0) {
      setPaymentModel(true);
      setOfferType("sell");
      setOrderType("Market");
      setAmount(marketVal.sellAmount);
      setTotalPrice(totalSellPrice);
    } else {
      toast.error("Please enter amount");
    }
  };

  const handleBuyLimit = () => {
    if (limitVal.buyAmount > 0) {
      setPaymentModel(true);
      setOfferType("buy");
      setOrderType("Limit");
      setAmount(limitVal.buyAmount);
      setTotalPrice(totalBuyPriceLimit);
      setLimitPrice(limitVal.buyPrice);
    } else {
      toast.error("Please enter amount");
    }
  };

  const handleSellLimit = () => {
    if (limitVal.sellAmount > 0) {
      setPaymentModel(true);
      setOfferType("sell");
      setOrderType("Limit");
      setAmount(limitVal.sellAmount);
      setTotalPrice(totalSellPriceLimit);
      setLimitPrice(limitVal.sellPrice);
    } else {
      toast.error("Please enter amount");
    }
  };

  const handleBuyMarketSlider = amount => {
    setMarketVal({
      ...marketVal,
      buyAmount: amount,
    });
  };

  const handleSellMarketSlider = amount => {
    setMarketVal({
      ...marketVal,
      sellAmount: amount,
    });
  };

  const handleBuyLimitSlider = amount => {
    setLimitVal({
      ...limitVal,
      buyAmount: amount,
    });
  };

  const handleSellLimitSlider = amount => {
    setLimitVal({
      ...limitVal,
      sellAmount: amount,
    });
  };

  useEffect(() => {
    clearForms();
  }, [connectTokenTab, clearForms]);

  return (
    <div className="connection-sec flex flex-col w-full ">
      <div className="connects-tabs flex">
        <div
          className={clsx("tabs-item", {
            active: connectTokenTab === "Limit",
          })}
          onClick={setConnectTokenTab.bind(this, "Limit")}>
          Limit
        </div>
        <div
          className={clsx("tabs-item", {
            active: connectTokenTab === "Market",
          })}
          onClick={setConnectTokenTab.bind(this, "Market")}>
          Market
        </div>
        <div
          className={clsx("tabs-item", {
            active: connectTokenTab === "Order",
          })}
          onClick={setConnectTokenTab.bind(this, "Order")}>
          Trigger Order
        </div>
      </div>
      <div className="content ">
        <div className="buy-side flex flex-col">
          {connectTokenTab === "Limit" ? (
            <>
              <div className="hdr flex items-center w-full justify-between">
                <div className="le">Buy {baseCurrency}</div>
                <div className="ri">
                  {currentCurrency} Available: {currentCurrency === "XLM" ? accountStr : balance}
                </div>
              </div>
              <div className="input-data flex flex-col">
                <div className="field flex items-center">
                  <div className="lbl flex">Price</div>
                  <input
                    type="text"
                    className="txt flex cleanbtn w-full"
                    value={limitVal.buyPrice}
                    name="buyPrice"
                    onChange={handleLimitVal}
                    placeholder="Please enter price"
                  />
                  <div className="tag flex">{baseCurrency}</div>
                </div>
                <div className="field flex items-center">
                  <div className="lbl flex">Amount</div>
                  <input
                    type="text"
                    value={limitVal.buyAmount}
                    name="buyAmount"
                    onChange={handleLimitVal}
                    className="lbl flex cleanbtn w-full px-3"
                    placeholder=""
                  />
                  <div className="tag flex">{currentCurrency}</div>
                </div>
              </div>
              <div className="horizontal-map flex aic">
                <div className="road-map flex" style={{ width: "100% !important" }}>
                  {/* <div className="line flex"></div> */}
                  <Slider className="colortrykrtyhuwy" value={limitVal.buyAmount} dots={true} step={10} onChange={handleBuyLimitSlider} />
                  {/* <div className="flex aic justify-between w-full absolute top-[-6px]">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div> */}
                </div>

                <div className="number flex aic jc">{limitVal.buyAmount > 0 ? limitVal.buyAmount : 0}%</div>
              </div>
              <div className="token-val py-4">
                {Number(limitVal.buyAmount) > balance ? (
                  <h4 className="redcolormilja margintTopiffs">Not enough funds</h4>
                ) : (
                  <h4 className="greycolormilja margintTopiffs ">
                    Value:- {totalBuyPriceLimit.toFixed(6)} {baseCurrency}
                  </h4>
                )}
              </div>
              <div className="action flex aic jc">
                {/* If wallet isn't connected then connect wallet button otherwise buy/sell */}
                {isWalletConnected ? (
                  <div className="btn button" onClick={handleBuyLimit} disabled={Number(limitVal.buyAmount) > balance}>
                    Buy {baseCurrency}
                  </div>
                ) : (
                  <div className="btn button" onClick={handleClickOpen}>
                    Connect Wallet
                  </div>
                )}
                {/* <div className="btn button">Connect Wallet</div> */}
              </div>
            </>
          ) : connectTokenTab === "Market" ? (
            <>
              <div className="hdr flex items-center w-full justify-between">
                <div className="le">Buy {baseCurrency}</div>
                <div className="ri">
                  {currentCurrency} Available: {currentCurrency === "XLM" ? accountStr : balance}
                </div>
              </div>
              <div className="input-data flex flex-col">
                <div className="field flex items-center">
                  <div className="lbl flex">Price</div>
                  <input type="text" value={price} className="txt flex cleanbtn w-full" placeholder="Market" />
                  <div className="tag flex">{baseCurrency}</div>
                </div>
                <div className="field flex items-center">
                  <div className="lbl flex">Amount</div>
                  <input
                    type="text"
                    name="buyAmount"
                    value={marketVal.buyAmount}
                    onChange={handleMarketVal}
                    className="lbl flex cleanbtn w-full px-3"
                    placeholder=""
                  />
                  <div className="tag flex">{currentCurrency}</div>
                </div>
              </div>
              <div className="horizontal-map flex aic">
                <div className="road-map flex" style={{ width: "100% !important" }}>
                  <Slider className="colortrykrtyhuwy" value={marketVal.buyAmount} dots={true} step={10} onChange={handleBuyMarketSlider} />
                  {/* <div className="line flex"></div>
                  <div className="flex aic justify-between w-full absolute top-[-6px]">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div> */}
                </div>
                <div className="number flex aic jc">{marketVal.buyAmount > 0 ? marketVal.buyAmount : 0}%</div>
              </div>
              <div className="token-val py-4">
                {" "}
                {Number(marketVal.buyAmount) > balance ? (
                  <h4 className="redcolormilja margintTopiffs">Not enough funds</h4>
                ) : (
                  <h4 className="greycolormilja margintTopiffs ">
                    Value:- {totalBuyPrice.toFixed(6)} {baseCurrency}
                  </h4>
                )}
              </div>
              <div className="action flex aic jc">
                {/* If wallet isn't connected then connect wallet button otherwise buy/sell */}
                {isWalletConnected ? (
                  <div className="btn button" disabled={Number(marketVal.buyAmount) > balance} onClick={handleBuyMarket}>
                    Buy {baseCurrency}
                  </div>
                ) : (
                  <div className="btn button" onClick={handleClickOpen}>
                    Connect Wallet
                  </div>
                )}
                {/* <div className="btn button">Connect Wallet</div> */}
              </div>
            </>
          ) : connectTokenTab === "Order" ? (
            <>
              <div className="hdr flex items-center w-full justify-between">
                <div className="le">Buy {baseCurrency}</div>
                <div className="ri">
                  {currentCurrency} Available: {currentCurrency === "XLM" ? accountStr : balance}
                </div>
              </div>
              <div className="input-data flex flex-col">
                <div className="field flex items-center">
                  <div className="lbl flex">Price</div>
                  <input type="text" className="txt flex cleanbtn w-full" placeholder="Please enter Trigger price" />
                  <div className="tag flex">{baseCurrency}</div>
                </div>
                <div className="field flex items-center">
                  <div className="lbl flex">Limit</div>
                  <input type="text" className="txt flex cleanbtn w-full" placeholder="Please enter Limit price" />
                  <div className="tag flex">{baseCurrency}</div>
                </div>
                <div className="field flex items-center">
                  <div className="lbl flex">Amount</div>
                  <input type="text" className="lbl flex cleanbtn w-full px-3" placeholder="" />
                  <div className="tag flex">{currentCurrency}</div>
                </div>
              </div>
              <div className="horizontal-map flex aic">
                <div className="road-map flex">
                  <Slider className="colortrykrtyhuwy" defaultValue={0} dots={true} step={10} />
                  {/* <div className="line flex"></div>
                  <div className="flex aic justify-between w-full absolute top-[-6px]">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div> */}
                </div>
                <div className="number flex aic jc">0%</div>
              </div>
              <div className="token-val py-4">Value --{baseCurrency}</div>
              <div className="action flex aic jc">
                <div className="btn button">Buy {baseCurrency}</div>
              </div>
            </>
          ) : null}
        </div>

        <div className="sell-side flex flex-col">
          {connectTokenTab === "Limit" ? (
            <>
              <div className="hdr flex items-center w-full justify-between">
                <div className="le">Sell {baseCurrency}</div>
                <div className="ri">
                  {baseCurrency} Available: {userCurrencyBalance}
                </div>
              </div>
              <div className="input-data flex flex-col">
                <div className="field flex items-center">
                  <div className="lbl flex">Price</div>
                  <input
                    type="text"
                    value={limitVal.sellPrice}
                    name="sellPrice"
                    onChange={handleLimitVal}
                    className="txt flex cleanbtn w-full"
                    placeholder="Please enter price"
                  />
                  <div className="tag flex">{baseCurrency}</div>
                </div>
                <div className="field flex items-center">
                  <div className="lbl flex">Amount</div>
                  <input
                    type="text"
                    value={limitVal.sellAmount}
                    name="sellAmount"
                    onChange={handleLimitVal}
                    className="lbl flex cleanbtn w-full px-3"
                    placeholder=""
                  />
                  <div className="tag flex">{currentCurrency}</div>
                </div>
              </div>
              <div className="horizontal-map flex aic">
                <div className="road-map flex">
                  <Slider className="colortrykrtyhuwy" value={limitVal.sellAmount} dots={true} step={10} onChange={handleSellLimitSlider} />
                  {/* <div className="line flex"></div>
                  <div className="flex aic justify-between w-full absolute top-[-6px]">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div> */}
                </div>
                <div className="number flex aic jc">{limitVal.sellAmount > 0 ? limitVal.sellAmount : 0}%</div>
              </div>
              <div className="token-val py-4">
                <h4 className="greycolormilja margintTopiffs ">
                  Value:- {totalSellPriceLimit.toFixed(6)} {baseCurrency}
                </h4>
              </div>
              <div className="action flex aic jc">
                {/* If wallet isn't connected then connect wallet button otherwise buy/sell */}
                {isWalletConnected ? (
                  <div
                    className="btn button"
                    onClick={handleSellLimit}
                    disabled={Number(limitVal.sellAmount) > Number(userCurrencyBalance)}>
                    Sell {baseCurrency}
                  </div>
                ) : (
                  <div className="btn button" onClick={handleClickOpen}>
                    Connect Wallet
                  </div>
                )}
                {/* <div className="btn button">Connect Wallet</div> */}
              </div>
            </>
          ) : connectTokenTab === "Market" ? (
            <>
              <div className="hdr flex items-center w-full justify-between">
                <div className="le">Sell {baseCurrency}</div>
                <div className="ri">
                  {baseCurrency} Available: {userCurrencyBalance}
                </div>
              </div>
              <div className="input-data flex flex-col">
                <div className="field flex items-center">
                  <div className="lbl flex">Price</div>
                  <input
                    type="text"
                    value={marketVal.sellPrice}
                    name="sellPrice"
                    onChange={handleMarketVal}
                    className="txt flex cleanbtn w-full"
                    placeholder="Market"
                    disabled
                  />
                  <div className="tag flex">{baseCurrency}</div>
                </div>
                <div className="field flex items-center">
                  <div className="lbl flex">Amount</div>
                  <input
                    type="text"
                    name="sellAmount"
                    value={marketVal.sellAmount}
                    onChange={handleMarketVal}
                    className="lbl flex cleanbtn w-full px-3"
                    placeholder=""
                  />
                  <div className="tag flex">{currentCurrency}</div>
                </div>
              </div>
              <div className="horizontal-map flex aic">
                <div className="road-map flex">
                  <Slider
                    className="colortrykrtyhuwy"
                    value={marketVal.sellAmount}
                    dots={true}
                    step={10}
                    onChange={handleSellMarketSlider}
                  />
                  {/* <div className="line flex"></div>
                  <div className="flex aic justify-between w-full absolute top-[-6px]">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div> */}
                </div>
                <div className="number flex aic jc">{marketVal.sellAmount > 0 ? marketVal.sellAmount : 0}%</div>
              </div>
              <div className="token-val py-4">
                <h4 className="greycolormilja margintTopiffs ">
                  Value:- {totalSellPrice.toFixed(6)} {baseCurrency}
                </h4>
              </div>
              <div className="action flex aic jc">
                {/* Connect wallet or sell button  */}
                {isWalletConnected ? (
                  <div
                    className="btn button"
                    disabled={Number(marketVal.sellAmount) > Number(userCurrencyBalance)}
                    onClick={handleSellMarket}>
                    Sell {baseCurrency}
                  </div>
                ) : (
                  <div className="btn button" onClick={handleClickOpen}>
                    Connect Wallet
                  </div>
                )}
                {/* <div className="btn button">Connect Wallet</div> */}
              </div>
            </>
          ) : connectTokenTab === "Order" ? (
            <>
              <div className="hdr flex items-center w-full justify-between">
                <div className="le">Sell {baseCurrency}</div>
                <div className="ri">
                  {currentCurrency} Available: {balance}
                </div>
              </div>
              <div className="input-data flex flex-col">
                <div className="field flex items-center">
                  <div className="lbl flex">Price</div>
                  <input type="text" className="txt flex cleanbtn w-full" placeholder="Please enter Trigger price" />
                  <div className="tag flex">{baseCurrency}</div>
                </div>
                <div className="field flex items-center">
                  <div className="lbl flex">Limit</div>
                  <input type="text" className="txt flex cleanbtn w-full" placeholder="Please enter Limit price" />
                  <div className="tag flex">{baseCurrency}</div>
                </div>
                <div className="field flex items-center">
                  <div className="lbl flex">Amount</div>
                  <input type="text" className="lbl flex cleanbtn w-full px-3" placeholder="" />
                  <div className="tag flex">{currentCurrency}</div>
                </div>
              </div>
              <div className="horizontal-map flex aic">
                <div className="road-map flex">
                  <Slider className="colortrykrtyhuwy" defaultValue={0} dots={true} step={10} />
                  {/* <div className="line flex"></div>
                  <div className="flex aic justify-between w-full absolute top-[-6px]">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div> */}
                </div>
                <div className="number flex aic jc">0%</div>
              </div>
              <div className="token-val py-4">Value --{baseCurrency}</div>
              <div className="action flex aic jc">
                <div className="btn button">Sell {baseCurrency}</div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <WalletConnect network={network} open={open} setOpen={setOpen} />
        </Modal>
      )}
      {paymentModel && (
        <OfferModel
          show={paymentModel}
          hide={setPaymentModel.bind(this, false)}
          amount={amount}
          price={orderType === "Limit" ? limitPrice : price}
          total={totalPrice}
          sellCurrency={currentCurrency}
          buyCurrency={baseCurrency}
          accountNo={network === "xrp" ? accountInfo?.account : accountInfo?.account}
          buyIssuer={issuerB}
          sellIssuer={issuerA}
          offerType={offerType}
          orderType={orderType}
          setOrderStatus={setOrderStatus}
          clearForms={clearForms}
        />
      )}
    </div>
  );
};

export default ExchangeWallet;
