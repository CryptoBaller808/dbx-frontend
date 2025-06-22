import React, { useState } from "react";
import _ from "loadsh";
import "./style.css";
import { Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import * as PaymentResponseAction from "../../redux/xummPaymentResponse/action";
import * as balanceAction from "../../redux/xummBalance/action";
import * as bookOfferAction from "../../redux/bookOffers/action";
import * as accountOfferAction from "../../redux/accountOffers/action";
import * as historyOfferAction from "../../redux/historyOffers/action";

import { getBookOffers, getAccountOffers, getUserCurrencies } from "../../helper/ws";
import { getFullAccountOffers, getOrderHistory } from "../../helper";
import { toast } from "react-toastify";
import { useSocket } from "../../context/socket";
import Loader from "../Loader";

const TOAST_MESSAGE = {
  xlm: "Open LOBSTR App to approve transaction.",
  xrp: "Open Xumm App to approve transaction.",
};

const SOCKET_REQUEST = {
  xlm: "xlm-payment-request",
  xrp: "xumm-payment-request",
};

const shouldAskForSecretKey = process.env.REACT_APP_PROMPT_FOR_TESTING_KEY === "true";

const OfferModel = ({
  show,
  hide,
  amount,
  price,
  total,
  sellCurrency,
  accountNo,
  offerType,
  buyCurrency,
  buyIssuer,
  sellIssuer,
  orderType,
  setOrderStatus,
  clearForms,
}) => {
  const [isKeyModalVisible, setIsKeyModalVisible] = useState(false);
  const dispatch = useDispatch();
  const accountInfo = useSelector(state => state?.signInData?.balance);
  const userToken = accountInfo?.userToken;
  const paymentResponse = useSelector(state => state.paymentResponseReducer?.paymentResponse?.success);
  const socket = useSocket();
  const network = useSelector(state => state.networkReducers.token);

  const handleOnConfirm = secretKey => {
    sendDataToBackend(secretKey);
    setIsKeyModalVisible(false);
  };

  const handlePaymentConfirm = () => {
    if (shouldAskForSecretKey) {
      setIsKeyModalVisible(true)
    }
    else {
      sendDataToBackend();
    }
  };

  const sendDataToBackend = (secretKey = null) => {
    toast.success(TOAST_MESSAGE[network]);
    clearForms();

    if (offerType === "buy") {
      const buyOfferInfo = {
        account: userToken,
        buyValue: total,
        buyCurrency,
        buyIssuer:userToken,
        sellValue: amount,
        sellCurrency,
        sellIssuer,
        userToken,
        side: "Buy",
        offerType: orderType,
        currPrice: price,
      };
      console.log('buyOfferInfo',buyOfferInfo);
      if (secretKey) buyOfferInfo.secretKey = secretKey;

      socket.emit(SOCKET_REQUEST[network], buyOfferInfo);
    } else {
      const sellOfferInfo = {
        account: userToken,
        buyValue: amount,
        buyCurrency: sellCurrency,
        buyIssuer: sellIssuer,
        sellValue: total,
        sellCurrency: buyCurrency,
        sellIssuer: userToken,
        userToken,
        side: "Sell",
        offerType: orderType,
        currPrice: price,
      };
      console.log('sellOfferInfo',sellOfferInfo);

      if (secretKey) sellOfferInfo.secretKey = secretKey;

      socket.emit(SOCKET_REQUEST[network], sellOfferInfo);
    }

    const submitBookOfferData = {
      currentCurrency: sellCurrency,
      baseCurrency: buyCurrency,
      currentIssuer: sellIssuer,
      baseIssuer: buyIssuer,
    };


    socket.on("payment-response", args => {
      hide();
      //empty amount
      console.log('payment-response', args);
      dispatch(PaymentResponseAction.setPaymentResponse(args));

      if (args.success) {
        getBookOffers(submitBookOfferData, accountNo)
          .then(res => {
            if (res.status === "success" && res.result?.offers.length) {
              dispatch(bookOfferAction.setBookOffersProcessing());
              dispatch(bookOfferAction.setBookOffers(res.result.offers));
              dispatch(bookOfferAction.setStopBookOffersProcessing());
            } else {
              dispatch(bookOfferAction.setBookOffersProcessing());
              dispatch(bookOfferAction.setBookOffers([]));
              dispatch(bookOfferAction.setStopBookOffersProcessing());
            }
          })
          .catch(err => console.log("err", err));
        //update Account offer data
        socket.on("payment-response-xlm", args => {
          toast.success("Offer added successfully,Please check console.", args);
          console.log('payment-response-xlm', args);

          getFullAccountOffers({ accountNo: accountNo, network })
            .then(res => {
              if (res.data.success) {
                const offerResult = res.data.data;
                dispatch(accountOfferAction.setAccountOffers(offerResult));
              }
            })
            .catch(err => console.log("err", err));

          getOrderHistory({ accountNo, network })
            .then(res => {
              if (res.data.success) {
                dispatch(historyOfferAction.setHistoryOffersProcessing());
                dispatch(historyOfferAction.setHistoryOffers(res.data.data));
                dispatch(historyOfferAction.setStopHistoryOffersProcessing());
              }
            })
            .catch(err => console.log("err", err));

          hide();
        });
        getFullAccountOffers({ accountNo: accountNo, network })
          .then(res => {
            // console.log("AccountOffers", res);
            if (res.data.success) {
              let offerResult = res.data.data;
              dispatch(accountOfferAction.setAccountOffers(offerResult));
            }
          })
          .catch(err => console.log("err", err));
        //account history offers

        getOrderHistory({ accountNo, network })
          .then(res => {
            console.log("getOrderHistory res----------->", res);

            if (res.data.success) {
              // setAccLoading(true);
              console.log("-------------HISTORY OFF------------------");

              dispatch(historyOfferAction.setHistoryOffersProcessing());
              dispatch(historyOfferAction.setHistoryOffers(res.data.data));
              dispatch(historyOfferAction.setStopHistoryOffersProcessing());
            }
          })
          .catch(err => console.log("err", err));
        const getAccountBalance = { accountNo, userToken };
        socket.on("payment-response-xlm", args => {
          toast.success("Offer added successfully,Please check console.", args);
          console.log('payment-response-xlm', args);

          getFullAccountOffers({ accountNo: accountNo, network })
            .then(res => {
              if (res.data.success) {
                const offerResult = res.data.data;
                dispatch(accountOfferAction.setAccountOffers(offerResult));
              }
            })
            .catch(err => console.log("err", err));

          getOrderHistory({ accountNo, network })
            .then(res => {
              if (res.data.success) {
                dispatch(historyOfferAction.setHistoryOffersProcessing());
                dispatch(historyOfferAction.setHistoryOffers(res.data.data));
                dispatch(historyOfferAction.setStopHistoryOffersProcessing());
              }
            })
            .catch(err => console.log("err", err));

          hide();
        });
        toast.success(args.message);
        //order success ->set order status
        setOrderStatus(true);
        socket.on("account-response", args => {
          dispatch(balanceAction.setBalance(args));
          console.log('account-response', args);

          getUserCurrencies(accountNo)
            .then(res => {
              if (res.status === "success") {
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
        });
      } else {
        toast.error(args.message);
        setOrderStatus(false);
      }
    });

    socket.on("payment-response-xlm", args => {
      toast.success("Offer added successfully,Please check console.", args);
      console.log('payment-response-xlm', args);

      getFullAccountOffers({ accountNo: accountNo, network })
        .then(res => {
          if (res.data.success) {
            const offerResult = res.data.data;
            dispatch(accountOfferAction.setAccountOffers(offerResult));
          }
        })
        .catch(err => console.log("err", err));

      getOrderHistory({ accountNo, network })
        .then(res => {
          if (res.data.success) {
            dispatch(historyOfferAction.setHistoryOffersProcessing());
            dispatch(historyOfferAction.setHistoryOffers(res.data.data));
            dispatch(historyOfferAction.setStopHistoryOffersProcessing());
          }
        })
        .catch(err => console.log("err", err));

      hide();
    });

    socket.on("transaction-error", args => {
      console.log('transaction-error',args);
      toast.error(args);
      hide();
    });
  };

  return (
    <>
      <Modal title={<span className="text-2xl">Create Offer</span>} open={show} footer={null} closable onCancel={hide}>
        <div className="m-4">
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-between mb-2">
              <label className="fs-3 text-muted">Order Type: </label>
              <label className="fs-3">{orderType}</label>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <label className="fs-3 text-muted">Amount: </label>
              <label className="fs-3">{amount}</label>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <label className="fs-3 text-muted">Price: </label>
              <label className="fs-3">{price}</label>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <label className="fs-3 text-muted">Total: </label>
              <label className="fs-3">{total.toFixed(6)}</label>
            </div>

            <div className="d-flex justify-content-between">
              <label className="fs-3 text-muted">Currency: </label>
              <label className="fs-3">{buyCurrency}</label>
            </div>
          </div>
          <button className="confirmBtn" onClick={handlePaymentConfirm}>
            Confirm
          </button>
        </div>
      </Modal>
      <ModalForSecretKey open={isKeyModalVisible} onConfirm={handleOnConfirm} onCancel={() => setIsKeyModalVisible(false)} />
    </>
  );
};

export const ModalForSecretKey = ({ open, onConfirm, onCancel }) => {
  const [privateKey, setPrivateKey] = useState("");

  const handleOnConfirm = () => {
    console.log('privateKey', privateKey);
    if (privateKey) onConfirm(privateKey);
  };

  return (
    <Modal title={<span className="text-2xl">Enter your private key</span>} open={open} footer={null} closable onCancel={onCancel}>
      <div className="privateKey">
        <input type="password" className="fs-3" value={privateKey} onChange={e => setPrivateKey(e.target.value.trim())} />
        <p>This is a test environment. You won't see this modal in production.</p>
      </div>

      <button className="confirmBtn" onClick={handleOnConfirm} disabled={!privateKey}>
        Confirm
      </button>
    </Modal>
  );
};

export default OfferModel;
