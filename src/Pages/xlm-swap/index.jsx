import React, { useState, useEffect, useCallback, useMemo } from "react";
import CustomModal from "../../components/Modal";
import WalletConnect from "../../components/WalletConnect";
import { ExchangeArrowIcon } from "../../Icons";
import { Alert } from "react-bootstrap";
import { useSocket } from "../../context/socket";
import { useSelector } from "react-redux";
import { getExchangeRates, getSwapAssets } from "../../helper/api/swap";
import SwapTransModal from "../../components/loader/SwapTransModal";
import ExchangeModalIcon from "../../Images/exchange-color.png";
import { LoadingIndicatorIcon } from "../../assets/svg";
import { Modal } from "antd";
import Select from "react-select";

import './index.css';
import { toast } from "react-toastify";
import axios from "axios";

let timeout = null;
const shouldAskForSecretKey = process.env.REACT_APP_PROMPT_FOR_TESTING_KEY === "true";

const DEFAULT_SWAP_VALS = { currency: "", issuer: "", id: -1, value: "" };
const DEFAULT_SWAP_BALS = { currency: "", balance: "0.00000" };

const XLMSwap = () => {
  const socket = useSocket();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [isTransaction, setIsTransaction] = useState(false);
  const [success, setSuccess] = useState("");
  const [swapFromBalance, setSwapFromBalance] = useState(DEFAULT_SWAP_BALS);
  const [swapToBalance, setSwapToBalance] = useState(DEFAULT_SWAP_BALS);
  const [localExchangeRate, setLocalExchangeRate] = useState(0);
  const network = useSelector(state => state.networkReducers.token);
  const [loading, setLoading] = useState(false);
  const balance = useSelector(state => state.signInData?.balance);
  const userCurrencies = useMemo(() => balance?.currencies ?? [], [balance?.currencies]);
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  const [swapFrom, setSwapFrom] = useState(DEFAULT_SWAP_VALS);
  const [swapTo, setSwapTo] = useState(DEFAULT_SWAP_VALS);
  const [finalExchangeRate, setFinalExchangeRate] = useState("");
  const [currencies, setCurrencies] = useState();
  const [allowSwap, setAllowSwap] = useState(false);
  const [isKeyModalVisible, setIsKeyModalVisible] = useState(false);

  // fetch currencies
  useEffect(() => {
    const fetchCurrency = async () => {
      // const response = await getSwapAssets({ network: "xlm" });
      // setCurrencies(response.data.data);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/Accounts/getAssetLists`);
      if (response.data.success) {
        const filtered = response.data.data.filter((item) => (item.is_swap && item.ledger === "xlm"))
        setCurrencies(filtered);
      }
    };
    fetchCurrency();
  }, []);

  const handleCleanForm = useCallback(() => {
    setSwapFrom(DEFAULT_SWAP_VALS);
    setSwapTo(DEFAULT_SWAP_VALS);
    setSwapFromBalance(DEFAULT_SWAP_BALS);
    setSwapToBalance(DEFAULT_SWAP_BALS);
    setFinalExchangeRate("");
  }, []);

  // handleSetSwap
  const handleSetSwapTo = useCallback(
    e => {
      // const value = e.target.value;
      const value = e.value;

      const selectedCurrency = currencies.find(cur => String(cur.id) === String(value));
      setSwapTo(pre => ({
        ...pre,
        currency: selectedCurrency?.asset_code,
        issuer: selectedCurrency?.asset_issuer,
        id: selectedCurrency?.id,
      }));
    },
    [currencies],
  );

  // handle setSwapFrom
  const handleSetSwapFrom = useCallback(
    e => {
      // const value = e.target.value; 
      const value = e.value;
      console.log(value);
      const selectedCurrency = currencies.find(cur => String(cur.id) === String(value));
      setSwapFrom(pre => ({
        ...pre,
        currency: selectedCurrency?.asset_code,
        issuer: selectedCurrency?.asset_issuer,
        id: selectedCurrency?.id,
      }));
    },
    [currencies],
  );

  const onFromAmountChange = useCallback(
    e => {
      const val = e.target.value;
      setSwapFrom({ ...swapFrom, value: val });
    },
    [swapFrom],
  );

  useEffect(() => {
    let currencyBalance = 0.0;

    if (swapFrom.currency === "XLM") {
      currencyBalance = Number(balance?.account ?? "0.00000");
      setSwapFromBalance({ currency: "XLM", balance: balance?.account });
    } else {
      const exist = userCurrencies.find(urCur => urCur.asset_issuer === swapFrom.issuer);
      currencyBalance = Number(exist?.balance ?? "0.00000");

      setSwapFromBalance({ currency: swapFrom.currency, balance: exist?.balance ?? "0.00000" });
    }

    const val = Number(swapFrom?.value ?? "0.00000");
    if (!isNaN(val) && val > currencyBalance) setError("Insufficient funds.");
    else setError("");
  }, [swapFrom, balance, userCurrencies]);

  useEffect(() => {
    if (swapTo.currency === "XLM") {
      setSwapToBalance({ currency: "XLM", balance: balance?.account });
    } else {
      const exist = userCurrencies.find(urCur => urCur.asset_issuer === swapTo.issuer);
      setSwapToBalance({ currency: swapTo.currency, balance: exist?.balance ?? "0.00000" });
    }
  }, [swapTo, balance, userCurrencies]);

  // fetch swap rates
  useEffect(() => {
    if (swapFrom.currency !== "" && swapFrom.value !== "" && swapTo.currency !== "") {
      if (swapFrom.currency === swapTo.currency) return;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          setLoading(true);
          const resp = await getExchangeRates({
            fromCurrency: swapFrom?.currency,
            fromIssuer: swapFrom?.issuer,
            toCurrency: swapTo?.currency,
            toIssuer: swapTo?.issuer,
            amount: swapFrom?.value,
          });

          const data = resp?.data?.data;
          const rate = Number(data?.destination_amount) / Number(data?.source_amount);

          setFinalExchangeRate(data?.destination_amount ?? "0.00000");

          if (!isNaN(rate)) {
            setAllowSwap(true);
          }

          setLocalExchangeRate(rate);
        } catch (error) { }
        setLoading(false);
      }, 1000);
    }
  }, [swapTo, swapFrom]);

  const handleConfirmSwap = () => {
    if (shouldAskForSecretKey) setIsKeyModalVisible(true);
    else sendDataToBackend();
  };

  const handleConfirmTestingModal = secretKey => {
    sendDataToBackend(secretKey);
    setIsKeyModalVisible(false);
  };

  const sendDataToBackend = (secretKey = null) => {
    setShow(false);
    setIsTransaction(true);

    toast.success("Please open LOBSTR mobile app to sign and submit the transaction.");

    const txnInfo = {
      fromCurrency: swapFrom?.currency,
      fromIssuer: swapFrom?.issuer,
      toCurrency: swapTo?.currency,
      toIssuer: swapTo?.issuer,
      sourceAmount: swapFrom?.value,
      userToken: balance?.userToken,
      destAmount: finalExchangeRate,
    };

    if (secretKey) txnInfo.secretKey = secretKey;

    socket.emit("xlm-swap-request", txnInfo);

    socket.on("payment-response-xlm", args => {
      console.log("args===>", args);

      toast.success("Trade successfull.");
      handleCleanForm();
      setIsTransaction(false);
    });

    socket.on("transaction-error", args => {
      toast.error(args);
      setIsTransaction(false);
    });
  };

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

      <Modal footer={""} title={"Confirm Token Swap"} destroyOnClose={true} open={show} onCancel={setShow.bind(this, false)}>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex mb-2 justify-content-center">
            <p className="me-2 text-center">
              {Number.isInteger(Number(swapFrom.value)) ? swapFrom.value : parseFloat(swapFrom.value).toFixed(5)}
            </p>
            <p className="mb-0 text-center">{swapFrom.currency}</p>
          </div>
          <div className="mb-2 exchange__modal-icon justify-content-center">
            <img alt="" src={ExchangeModalIcon} style={{ width: "30px", height: "30px" }} className="" />
          </div>
          <div className="d-flex mb-3 justify-content-center">
            <p className="me-2">{isNaN(finalExchangeRate) ? "0.0000" : parseFloat(finalExchangeRate).toFixed(5)}</p>
            <p>{swapTo.currency}</p>
          </div>

          <div className="mb-3 align-self-center">
            <p className="mb-0" style={{ color: "#54626F" }}>
              Output is estimated, final result will depend on Stellar Network Rates
            </p>
          </div>

          <div
            className="text-center p-3 d-flex justify-content-between align-items-center w-100 rounded"
            style={{ backgroundColor: "#f1f1f1" }}>
            <p className="mb-0">Rate</p>
            <p className="mb-0">
              1 {swapFrom.currency} = {localExchangeRate?.toFixed(5)} {swapTo.currency}
            </p>
          </div>
        </div>

        <button className="btn button py-2 w-100 mt-2" onClick={handleConfirmSwap}>
          Submit
        </button>
      </Modal>
      <ModalForSecretKey onConfirm={handleConfirmTestingModal} setShow={setIsKeyModalVisible} show={isKeyModalVisible} />
      <div className="wrap wrapWidth flex aic flex-col">
        {!!error && (
          <Alert variant="danger" onClose={setError.bind(this, "")} dismissible>
            <p>{error}</p>
          </Alert>
        )}

        {!!success.length && (
          <Alert variant="success" onClose={setSuccess.bind(this, "")} dismissible>
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
                    <div className="about-token flex flex-col w-full mb-4">
                      <div className="lbl mb-2">Swap From :</div>
                      {/* <select className="form-control" value={swapFrom.id} onChange={handleSetSwapFrom}>
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
                    onChange={onFromAmountChange}
                    pattern="\d*"
                    maxLength="10"
                  />
                </div>

                <div className="balance-field">
                  <p className="current-balance">
                    Balance: {Number(swapFromBalance?.balance || 0)?.toFixed(4)} {swapFrom?.currency}
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
                    <div className="about-token flex flex-col w-full mb-4">
                      <div className="lbl mb-2">Swap To:</div>
                      {/* <select className="form-control" value={swapTo.id} onChange={handleSetSwapTo}>
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
                  <input
                    type="text"
                    className="txt cleanbtn"
                    value={isNaN(localExchangeRate) ? "" : localExchangeRate * swapFrom?.value}
                    placeholder="Swap amount"
                    disabled
                  />
                </div>
                <div className="balance-field">
                  <p className="current-balance">
                    Balance: {Number(swapToBalance?.balance || 0)?.toFixed(4)} {swapToBalance?.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="action">
            {isWalletConnected ? (
              <button
                disabled={loading || isNaN(localExchangeRate) || !allowSwap || error}
                className="btn button items-center"
                onClick={setShow.bind(this, true)}>
                {loading && (
                  <div className="p-2">
                    <LoadingIndicatorIcon className="m-auto animate-spin" height={20} width={20} />
                  </div>
                )}
                {!loading && "Swap Currency"}
              </button>
            ) : (
              <div className="btn button" onClick={() => setOpen(true)}>
                Connect Wallet
              </div>
            )}
          </div>

          <div className="exchange-box-wrapper pt-4">
            <div className="exchange-box">
              <h3>Exchange Rate</h3>
              <div className="exchange-box-currency">
                {isNaN(localExchangeRate) ? (
                  <p>Exchange not allowed</p>
                ) : (
                  <p className="flex flex-row">
                    1 {swapFromBalance?.currency} ={" "}
                    {loading ? (
                      <LoadingIndicatorIcon className="m-auto animate-spin" height={20} width={20} />
                    ) : (
                      localExchangeRate?.toFixed(4)
                    )}{" "}
                    {swapToBalance?.currency}
                    {/* {} */}
                  </p>
                )}
                <ExchangeArrowIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomModal open={open} onClose={setOpen.bind(this, false)}>
        <WalletConnect network={network} open={open} setOpen={setOpen} />
      </CustomModal>
    </div>
  );
};

const ModalForSecretKey = ({ onConfirm, show, setShow }) => {
  const [privateKey, setPrivateKey] = useState("");

  const handleOnConfirm = () => {
    if (privateKey) onConfirm(privateKey);
  };

  return (
    <Modal footer={""} title="Enter your private key" destroyOnClose={true} open={show} onCancel={setShow.bind(this, false)}>
      <div className="d-flex flex-column justify-content-center align-items-center privateKeyModalSwap">
        <input type="password" className="fs-3" value={privateKey} onChange={e => setPrivateKey(e.target.value.trim())} />
        <p className="d-flex mb-2 justify-content-center">This is a test environment. You won't see this modal in production.</p>
      </div>

      <button className="btn button py-2 w-100 mt-2" onClick={handleOnConfirm}>
        Submit
      </button>
    </Modal>
  );
};

export default XLMSwap;