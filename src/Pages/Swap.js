import React, { useState, useEffect, useRef } from "react";
import { TokenIcon, DropDownIcon, ExchangeIcon, ExchangeArrowIcon, ArrowDownIcon } from "../Icons";
import Modal from "../components/Modal";
import WalletConnect from "../components/WalletConnect";
import Select from "react-select";
import currency from "../helper/currencies";
import { useSocket } from "../context/socket";
import { setModalOpen, connectWallet } from "../redux/actions";
import * as balanceAction from "../redux/xummBalance/action";
import * as QRCodeAction from "../redux/xummQRCode/action";
import { useSelector } from "react-redux";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";
import ReactModal from "react-bootstrap/Modal";
import ExchangeModalIcon from "../Images/exchange-color.png";
import SwapTransModal from "../components/loader/SwapTransModal";

const Swap = () => {
  const socket = useSocket();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(null);
  const [show, setShow] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);
  const [success, setSuccess] = useState("");
  const [swapFromBalance, setSwapFromBalance] = useState({});
  const [swapToBalance, setSwapToBalance] = useState({});
  const [localExchangeRate, setLocalExchangeRate] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [flag, setFlag] = useState(false);
  const swapFromRef = useRef();
  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];

  const balance = useSelector(state => state.signInData?.balance);
  // console.log("balance", balance);
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);

  const [swapFrom, setSwapFrom] = useState({ currency: "", issuer: "", id: -1, value: "" });
  const [swapTo, setSwapTo] = useState({ currency: "", issuer: "", value: "", id: -1 });
  const [finalExchangeRate, setFinalExchangeRate] = useState("");
  const [exchangeRate, setExchangeRate] = useState({
    swapFromExchange: "",
    swapToExchange: "",
    exchangeRateForOne: 0,
  });
  const swapToRef = useRef();
  const [accountData, setAccountData] = useState();
  const [currencies, setCurrencies] = useState();

  // fetch currencies
  useEffect(() => {
    const fetchCurrency = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/Accounts/getAssetLists`);
      if (response.data.success) {
        const filtered = response.data.data.filter((item) => (item.is_swap && item.ledger === "xrp"))
        setCurrencies(filtered);
      }

    };
    fetchCurrency();
  }, []);

  // handle swap
  const handleSwap = () => {
    setError("");
    setLocalExchangeRate(0);
    setSwapFromBalance();
    setSwapToBalance();
    if (balance) {
      const { account, userToken } = balance;

      setSwapTo(swapTo => ({ ...swapTo, value: "" }));
      setError("");
      const item = {
        source_account: account,
        destination_account: account,
        destination_amount: {
          currency: swapTo.currency,
          value: "-1",
          issuer: swapTo.issuer,
        },
        sendmax: {
          currency: swapFrom.currency,
          value: swapFrom.value,
          issuer: swapFrom.issuer,
        },
      };

      socket.emit("get-available-swap-path", item);

      socket.on("available-path", args => {
        console.log("availabkle path", args);
        if (args.alternatives?.length === 0) {
          setError("XRP does not have any Swap value for the current pair, please try after sometime.");
        } else {
          setAccountData(args.alternatives);
        }
      });

      socket.on("available-path-error", args => {
        console.log("error", args);
        let error = args;

        if (typeof error === "string") {
          setError(args);
        } else if (typeof error === "object") {
          setError("XRP Node is facing some issue, please check after sometime");
        }
      });

      socket.emit("get-all-user-currencies", { ...balance, accountInfo: balance.account });

      socket.on("get-all-user-currencies-response", args => {
        console.log("get all user currency", args);
        let accountCurrenciesItem = args.accountCurrencies?.find(
          item => swapTo.issuer === item?.issuer_address && swapTo.currency === item?.currency,
        );
        let currencyListItem = args.currencyList[0];
        setSwapFromBalance(currencyListItem);
        setSwapToBalance(accountCurrenciesItem);
      });
      socket.on("get-all-user-currencies-error", args => console.log(args));
    } else {
      setError("Please connect Wallet for SWAP ");
    }
  };

  // handle clean state
  const handleCleanState = () => {
    setSwapTo(swapTo => ({ ...swapTo, value: "" }));
  };

  // prevent same currency
  useEffect(() => {
    if (swapFrom.currency === swapTo.currency) {
      if (swapTo.currency === "XRP") {
        setSwapFrom(swapFrom => ({ ...swapFrom, id: 15, currency: "USD", issuer: "" }));
      } else {
        setSwapFrom(swapFrom => ({ ...swapFrom, id: 2, currency: "XRP", issuer: "", value: 0 }));
      }
    }
  }, [swapFrom.currency, swapTo.currency]);

  // run handle swap
  useEffect(() => {
    if (swapFrom.currency !== "" && swapFrom.value !== "" && swapTo.currency !== "") {
      handleSwap();
    }
    return handleCleanState();
  }, [swapTo.issuer, swapFrom.currency, swapFrom.value]);

  // handleSetSwap
  const handleSetSwapTo = e => {
    // let value = e.target.value;
    let value = e.value;
    console.log(value);
    let currentObject = currencies.map(c => {
      if (c.id === parseInt(value)) {
        setSwapTo(swapTo => ({ ...swapTo, currency: c.asset_code, issuer: c.asset_issuer, id: c.id }));
      }
      return c;
    });
  };

  // handle success true
  const handleSuccess = () => {
    setIsTransaction(false);
    setSwapFrom(swapFrom => ({ ...swapFrom, currency: "", issuer: "", id: -1, value: "" }));
    setSwapTo(swapTo => ({ ...swapTo, currency: "", issuer: "", value: "", id: -1 }));
  };

  // handle setSwapFrom
  const handleSetSwapFrom = e => {
    // let value = e.target.value; 
    let value = e.value;
    let currentObject = currencies.map(c => {
      if (c.id === parseInt(value)) {
        setSwapFrom(swapFrom => ({ ...swapFrom, currency: c.asset_code, issuer: c.asset_issuer, id: c.id }));
      }

      return c;
    });
  };

  useEffect(() => {
    const find = accountData?.map(data => {
      if (typeof data?.source_amount === "object") {
        // source_amount is an object

        if (data?.destination_amount?.currency === swapTo.currency && data?.source_amount?.currency === swapFrom.currency) {
          let localExchangeRate = getExchangeRate(data?.source_amount?.value, data?.destination_amount?.value);
          setLocalExchangeRate(localExchangeRate);
          let finalrate = Number(localExchangeRate * swapFrom.value)?.toFixed(4);
          setSwapTo(swapTo => ({ ...swapTo, value: finalrate }));
          setExchangeRate(exchangeRate => ({
            ...exchangeRate,
            swapFromExchange: data?.source_amount?.currency,
            swapToExchange: data?.destination_amount?.currency,
            exchangeRateForOne: localExchangeRate,
          }));
          setFinalExchangeRate(finalrate);
          setFlag(true);
        }
      } else if (typeof data?.source_amount === "string" && swapFrom.currency === "XRP") {
        // source amount is string => XRP

        if (data?.destination_amount?.currency === swapTo.currency) {
          let XRPValue = parseInt(data?.source_amount) / 1000000;
          let localExchangeRate = getExchangeRate(XRPValue, data?.destination_amount?.value);
          setLocalExchangeRate(localExchangeRate);
          let finalrate = Number(localExchangeRate * swapFrom.value)?.toFixed(4);
          setSwapTo(swapTo => ({ ...swapTo, value: finalrate }));
          setExchangeRate(exchangeRate => ({
            ...exchangeRate,
            swapFromExchange: data?.source_amount,
            swapToExchange: data?.destination_amount?.value,
            exchangeRateForOne: localExchangeRate,
          }));
          setFinalExchangeRate(finalrate);
          setFlag(true);
        }
      } else {
        setSwapTo(swapTo => ({ ...swapTo, value: "" }));
        setSwapFrom(swapFrom => ({ ...swapFrom, currency: "XRP" }));
        setFlag(false);
        console.log("Same currencies");
      }
      return data;
    });
  }, [accountData]);

  // exchange rate
  const getExchangeRate = (baseCurrency, targetCurrency) => {
    const forOneBC = targetCurrency / baseCurrency;
    return forOneBC;
  };

  // handleSwapCurrency
  const handleSwapCurrency = () => {
    const { account, userToken } = balance;

    if (swapTo.value !== "") {
      const item = {
        account: account,
        destination: account,
        userToken,
        receivingAmount: {
          currency: swapTo.currency,
          value: `${parseFloat(swapTo.value).toFixed(5)}`,
          issuer: swapTo.issuer,
        },

        sendMax: {
          currency: swapFrom.currency,
          value: `${parseFloat(swapFrom.value).toFixed(5)}`,
          issuer: swapFrom.issuer,
        },
      };

      socket.emit("xumm-payment", item);
      handleClose();
      setIsTransaction(true);

      let timeoutId = setTimeout(() => {
        setError("Something Went Wrong, Please Try Again");
        setIsTransaction(false);
      }, 2 * 60 * 1000); // 2 minutes in milliseconds

      socket.on("swap-payment-response", args => {
        clearTimeout(timeoutId); // clear the timeout if a response is received
        console.log(args);
        if (args.success === true) {
          handleSuccess();
          setSuccess(args.message);
        } else {
          setIsTransaction(false); // stop the loaders
          if (args.message === "Rejected") {
            setError("Transaction request on XUMM was declined.");
          } else {
            setError("Server Error, Please Try Again.");
          }
        }
      });
    }
  };

  useEffect(() => {
    console.log("swapfrom", swapFrom);
  }, [swapFrom]);

  useEffect(() => {
    if (currencies?.length) {
      setSwapTo(swapTo => ({ ...swapTo, id: 5, issuer: "rBZJzEisyXt2gvRWXLxHftFRkd1vJEpBQP", currency: "USD" }));
    }
  }, [currencies]);

  const options = currencies?.map((c) => ({
    value: c.id,
    label: (
      <div className="flex items-center gap-2">
        {c.icon_url && <img src={c.icon_url} alt={c.asset_code} className="w-4 h-4" />}
        {c.asset_code}
      </div>
    ),
  }));

  return (
    <div className="swap-page flex">
      {isTransaction && (
        <SwapTransModal
          swapfrom={swapFrom.value}
          swapTo={finalExchangeRate}
          swapFromCurrency={swapFrom.currency}
          swapToCurrency={swapTo.currency}
        />
      )}
      <ReactModal show={show} onHide={handleClose}>
        <ReactModal.Header closeButton>
          <p>Confirm Token Swap</p>
        </ReactModal.Header>
        <ReactModal.Body>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex mb-2 justify-content-center">
              <p className="me-2 text-center">
                {Number.isInteger(Number(swapFrom.value)) ? swapFrom.value : parseFloat(swapFrom.value).toFixed(5)}
              </p>
              <p className="mb-0 text-center">{swapFrom.currency}</p>
            </div>
            <div className="mb-2 exchange__modal-icon justify-content-center">
              <img src={ExchangeModalIcon} style={{ width: "30px", height: "30px" }} className="" />
            </div>
            <div className="d-flex mb-3 justify-content-center">
              <p className="me-2">{parseFloat(finalExchangeRate).toFixed(5)}</p>
              <p>{swapTo.currency}</p>
            </div>

            <div className="mb-3 align-self-center">
              <p className="mb-0" style={{ color: "#54626F" }}>
                Output is estimated, final result will depend on XRP Ledger
              </p>
            </div>

            <div
              className="text-center p-3 d-flex justify-content-between align-items-center w-100 rounded"
              style={{ backgroundColor: "#f1f1f1" }}>
              <p className="mb-0">Rate</p>
              <p className="mb-0">
                1 {swapFrom.currency} = {(exchangeRate?.exchangeRateForOne).toFixed(5)} {swapTo.currency}
              </p>
            </div>
          </div>
        </ReactModal.Body>
        <ReactModal.Footer>
          <button className="btn button py-2 w-100" onClick={handleSwapCurrency}>
            Submit
          </button>
        </ReactModal.Footer>
      </ReactModal>
      <div className="wrap wrapWidth flex aic flex-col">
        {error !== "" && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            <p>{error}</p>
          </Alert>
        )}
        {success.length !== 0 && (
          <Alert variant="success" onClose={() => setSuccess("")} dismissible>
            <p>{success}</p>
          </Alert>
        )}
        <div className="swap-block flex flex-col">
          <div className="swap-tab flex item-center justify-center">
            <div className="swap-item">Swap</div>
          </div>
          <div className="swap-cards flex items-center">
            <div className="card-left flex">
              <div className="card flex flex-col">
                <div className="card-hdr flex items-center justify-between">
                  <div className="token-info flex w-full">
                    {/*<div className="icon flex aic jc">
                      <TokenIcon />
                    </div>*/}
                    <div className="about-token flex flex-col w-full mb-4">
                      <div className="lbl mb-2">Swap From :</div>
                      {/* <select className="form-control" value={swapFrom.id} onChange={handleSetSwapFrom}>
                        <option value="-1" selected>
                          Select
                        </option>
                        {currencies &&
                          currencies.map(c => {
                            console.log('currence', c);
                            return (
                              <option value={c.id} issuer={c.asset_issuer} key={c.id}>
                                <img src={c?.icon_url} alt="" className="w-4 h-4" />
                                {c.asset_code}
                              </option>
                            );
                          })}
                      </select> */}

                      <Select
                        placeholder="Select"
                        styles={{
                          borderRadius: "9px",
                        }}
                        className="rounded-md"
                        classNames={{
                          control: () => "rounded rounded-lg !px-2 !py-1 border border-gray-300 focus:border-primary",
                          placeholder: () => "text-black",
                          menu: () => "bg-white border border-gray-300 rounded-2xl",
                          option: ({ isFocused, isSelected }) =>
                            `  ${isFocused ? "bg-gray-200" : ""} ${isSelected ? "bg-primary text-white" : ""}`,
                        }}
                        options={options}
                        value={options?.find((option) => option.value === swapFrom.id)}
                        onChange={(selectedOption) => handleSetSwapFrom(selectedOption)}
                      />
                    </div>
                  </div>
                </div>
                <div className="field flex">
                  <input
                    type="text"
                    className="txt cleanbtn"
                    placeholder="Swap amount"
                    value={swapFrom.value}
                    onChange={e => setSwapFrom({ ...swapFrom, value: e.target.value })}
                    pattern="\d*"
                    maxLength="5"
                  />
                </div>

                <div className="balance-field">
                  <p className="current-balance">
                    Balance: {Number(swapFromBalance?.balance?.balance || 0)?.toFixed(4)} {swapFromBalance?.currency}
                  </p>
                </div>
              </div>
            </div>
            <div className="card-center flex aic jc">
              <div className="exchange-icon flex aic jc">
                <ExchangeArrowIcon />
              </div>
            </div>
            <div className="card-right flex">
              <div className="card flex flex-col">
                <div className="card-hdr flex items-center justify-between">
                  <div className="token-info flex w-full">
                    {/*<div className="icon flex aic jc">
                      <img src="./images/DBXIcon.png" className="token-img" />
                    </div>*/}
                    <div className="about-token flex flex-col w-full mb-4">
                      <div className="lbl mb-2">Swap To:</div>
                      {/* <Select
                        defaultValue={swapTo}
                        onChange={(e) => setSwapTo({ ...swapTo, currency: e.asset_code, issuer: e.asset_issuer })}
                        getOptionLabel={option => option.asset_code}
                        getOptionValue={(option) => option.id}
                        options={currencies}
                        placeholder="Select Currency"
                        className="w-full"
                        disabled={!currencies ? true : false}
                      /> */}
                      {/* <select className="form-control" value={swapTo.id} onChange={handleSetSwapTo}  >
                        <option value="-1" selected>
                          Select
                        </option>
                        {currencies &&
                          currencies.map(c => {
                            return (
                              <option value={c.id} issuer={c.asset_issuer} key={c.id}>
                                {c.asset_code}
                              </option>
                            );
                          })}
                      </select> */}
                      <Select
                        placeholder="Select"
                        styles={{
                          borderRadius: "9px",
                        }}
                        className="rounded-md"
                        classNames={{
                          control: () => "rounded rounded-lg !px-2 !py-1 border border-gray-300 focus:border-primary",
                          placeholder: () => "text-black",
                          menu: () => "bg-white border border-gray-300 rounded-2xl",
                          option: ({ isFocused, isSelected }) =>
                            `  ${isFocused ? "bg-gray-200" : ""} ${isSelected ? "bg-primary text-white" : ""}`,
                        }}
                        options={options}
                        value={options?.find((option) => option.value === swapTo.id)}
                        onChange={(selectedOption) => handleSetSwapTo(selectedOption)}
                      />
                    </div>
                  </div>
                </div>
                <div className="field flex">
                  <input type="text" className="txt cleanbtn" value={swapTo.value} placeholder="Swap amount" disabled />
                </div>
                <div className="balance-field">
                  <p className="current-balance">
                    Balance: {Number(swapToBalance?.balance || 0)?.toFixed(4)} {swapToBalance?.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="exchange-box-wrapper">
            <div className="exchange-box">
              <h3>Exchange Rate</h3>
              <div className="exchange-box-currency">
                <p>
                  1 {swapFromBalance?.currency} = {localExchangeRate?.toFixed(4)} {swapToBalance?.currency}
                </p>
                <ExchangeArrowIcon />
              </div>
            </div>
          </div>
          <div className="action">
            {isWalletConnected ? (
              <div className="btn button" onClick={flag ? handleShow : null}>
                Swap Currency
              </div>
            ) : (
              <div className="btn button" onClick={() => setOpen(true)}>
                Connect Wallet
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <WalletConnect open={open} setOpen={setOpen} />
      </Modal>
    </div>
  );
};

export default Swap;
