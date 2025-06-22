import React, { useState, useEffect } from "react";
import _ from "loadsh";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { getBookOffers, getAccountOffers } from "../../helper/ws";
import * as bookOfferAction from "../../redux/bookOffers/action";
import * as accountOfferAction from "../../redux/accountOffers/action";
import * as historyOfferAction from "../../redux/historyOffers/action";
import { useSocket } from "../../context/socket";
import { Table, Space, Button } from "antd";
import Loader from "../loader/Loader";
import { getFullAccountOffers, getOrderHistory, getTickersData } from "../../helper";
import getExchangeRate from "../../helper/api/exchangeRate";
import { toast } from "react-toastify";
import ExchangeDeleteModal from "../loader/ExchangeDeleteModal";
import clsx from "clsx";
import WalletConnect from "../WalletConnect";
import Modal from "../Modal";
import emptyFolder from "../../assets/open-folder.png";
import { ModalForSecretKey } from "../offerModel";

const DELETE_EVENTS = {
  xlm: "xlm-delete-offers",
  xrp: "delete-offers",
};

const shouldAskForSecretKey = process.env.REACT_APP_PROMPT_FOR_TESTING_KEY === "true";

const AccountOffersTable = ({ currencyData2, dropVal, setDropVal }) => {
  const [orderTab, setOrderTab] = useState("open");
  const [accLoading, setAccLoading] = useState(true);
  const [hisLoading, setHisLoading] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const network = useSelector(state => state.networkReducers.token);
  const balanceData = useSelector(state => state.signInData?.balance);
  const userAccount = network === "xrp" ? balanceData?.account : balanceData?.userToken;
  const dispatch = useDispatch();
  const accountOffer = useSelector(state => state.accountOffers?.accountOffer);
  const accountOfferProcessing = useSelector(state => state.accountOffers?.processing);
  const historyOffer = useSelector(state => state.historyOffers?.historyOffer);
  const historyOfferProcessing = useSelector(state => state.historyOffers?.processing);
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  const [accountOfferData, setAccountOfferData] = useState(accountOffer);
  const [historyOfferData, setHistoryOfferData] = useState(historyOffer);
  const socket = useSocket();
  const [isConnectModalVisible, setConnectModalVisible] = useState(false);
  const [isKeyModalVisible, setIsKeyModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSecretKeyModal = val => {
    setSelectedRecord({ txId: val?.id, offerType: val.offerType });
    if (shouldAskForSecretKey) setIsKeyModalVisible(true);
    else onDelete();
  };

  const handleOnConfirm = secretKey => {
    onDelete(secretKey);
    setIsKeyModalVisible(false);
  };

  useEffect(() => {
    setAccLoading(true);
    socket.on("drops-val", args => {
      const drops = Number(args);
      setDropVal(drops);
    });
    if (dropVal !== undefined) {
      setTimeout(() => {
        setAccLoading(false);
      }, 2000);
    }
    setAccountOfferData(accountOffer);
  }, [accountOffer]);

  useEffect(() => {
    setHisLoading(true);
    setHistoryOfferData(historyOffer);
    setHisLoading(false);
  }, [historyOffer]);

  useEffect(() => {
    if (isWalletConnected) {
      //get account offers
      getFullAccountOffers({ accountNo: userAccount, network })
        .then(res => {
          if (res.data.success) {
            const offerResult = res.data.data;
            dispatch(accountOfferAction.setAccountOffersProcessing(true));
            dispatch(accountOfferAction.setAccountOffers(offerResult));
          } else {
            dispatch(accountOfferAction.setAccountOffers([]));
          }
        })
        .catch(err => console.log("getFullAccountOffers.error", err));
      dispatch(accountOfferAction.setAccountOffersProcessing(false));

      getOrderHistory({ accountNo: userAccount, network })
        .then(res => {
          if (res.data.success) {
            dispatch(historyOfferAction.setHistoryOffersProcessing());
            dispatch(historyOfferAction.setHistoryOffers(res.data.data));
            dispatch(historyOfferAction.setStopHistoryOffersProcessing());
          }
        })
        .catch(err => console.log("err", err));
    } else {
      dispatch(accountOfferAction.setAccountOffersProcessing(true));
      dispatch(accountOfferAction.setAccountOffers([]));
      dispatch(accountOfferAction.setAccountOffersProcessing(false));

      dispatch(historyOfferAction.setHistoryOffersProcessing());
      dispatch(historyOfferAction.setHistoryOffers([]));
      dispatch(historyOfferAction.setStopHistoryOffersProcessing());
    }
  }, [isWalletConnected, userAccount]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Pair",
      dataIndex: "pair",
      key: "pair",
    },
    {
      title: "Type",
      dataIndex: "offerType",
      key: "offerType",
    },
    {
      title: "Side",
      dataIndex: "side",
      key: "side",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button danger type="text" onClick={e => onDelete(record.key, e)}>
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const filteredColumns = columns?.filter(col => col.title !== "Action");

  const onDelete = (secretKey = "") => {
    if (!selectedRecord) return;

    const accInfo = {
      account: balanceData?.account,
      userToken: balanceData?.userToken,
      tx_id: selectedRecord?.txId ?? selectedRecord?.id,
      offerType: selectedRecord?.offerType,
      secretKey,
    };

    setisLoading(true);
    socket.emit(DELETE_EVENTS[network], accInfo);

    socket.on("delete-offers-response", args => {
      setSelectedRecord(null);
      setisLoading(false);
      if (args?.success === false) {
        toast.error(args?.message);
      } else if (args?.success === true) {
        toast.success(args?.message);

        // get account offer
        getFullAccountOffers({ accountNo: userAccount, network })
          .then(res => {
            if (res.data.success) {
              // setAccLoading(true);
              let offerResult = res?.data?.data;
              // offerResult = _.orderBy(offerResult, ["seq"], ["desc"]);
              dispatch(accountOfferAction.setAccountOffersProcessing(true));
              dispatch(accountOfferAction.setAccountOffers(offerResult));
            } else {
              dispatch(accountOfferAction.setAccountOffers([]));
            }
          })
          .catch(err => console.log("err", err));
        dispatch(accountOfferAction.setAccountOffersProcessing(false));

        //get offer history
        getOrderHistory({ accountNo: userAccount, network })
          .then(res => {
            // console.log("getOrderHistory res----------->", res);

            if (res.data.success) {
              // setAccLoading(true);
              // console.log("-------------HISTORY OFF------------------");

              dispatch(historyOfferAction.setHistoryOffersProcessing());
              dispatch(historyOfferAction.setHistoryOffers(res?.data?.data || []));
              dispatch(historyOfferAction.setStopHistoryOffersProcessing());
            }
          })
          .catch(err => console.log("err", err));
      }
    });
  };

  const dataSource = accountOfferData.map((obj, indx) => {
    const total = (obj.price * obj.amount).toFixed(5);
    const crrPair = obj.pair;
    const totalCurrency = crrPair.split("/");

    return {
      key: indx + 1,
      date: moment(obj.date).format("YYYY-MM-DD HH:mm:ss"),
      pair: obj.pair,
      offerType: obj.offerType,
      side: obj.side,
      amount: obj.amount,
      price: obj.price,
      total: `${total} ${totalCurrency[1]}`,
      action: obj,
    };
  });

  useEffect(() => {
    if (accountOfferProcessing) {
      setAccLoading(true);
    } else {
      setTimeout(() => {
        setAccLoading(false);
      }, 2000);
    }
  }, [accountOfferProcessing]);

  //history offers data
  const dataSourceHistory = historyOfferData.map((obj, indx) => {
    const total = (obj.price * obj.amount).toFixed(5);
    const crrPair = obj.pair;
    const totalCurrency = crrPair.split("/");

    return {
      key: indx + 1,
      date: moment(obj.date).format("YYYY-MM-DD HH:mm:ss"),
      pair: obj.pair,
      offerType: obj.offerType,
      side: obj.side,
      amount: obj.amount,
      price: obj.price,
      total: `${total} ${totalCurrency[1]}`,
      // action: obj,
    };
  });

  useEffect(() => {
    if (historyOfferProcessing) {
      setHisLoading(true);
    } else {
      setTimeout(() => {
        setHisLoading(false);
      }, 2000);
    }
  }, [historyOfferProcessing]);

  //get current A and B currency and it's issuer
  useEffect(() => {
    async function fetchData() {
      if (currencyData2?.info) {
        let tickersInput = {
          symbols: [`${currencyData2.info.curA}/${currencyData2.info.curB}+${currencyData2.info.issuerB}`],
        };
        getTickersData({ acc: tickersInput, network })
          .then(res => {
            if (res.data.success) {
              const apiResult = res.data.data;
              const data = Object.values(apiResult)[0];
              // console.log("FROM SERVER TICKERS  ----------->", data);
            }
          })
          .catch(err => console.log("FROM SERVER CHART HEAD ERR", err));
        const acc = {
          curA: currencyData2?.info?.curA,
          curB: currencyData2?.info?.curB,
          issuerB: currencyData2?.info?.issuerB,
        };
        // await getTradesData(acc)
        //   .then(res => {
        //     if (res.data.success) {
        //       // console.log("FROM SERVER CHART DATA ----------->", res.data.data);
        //       console.log("PARSED ARRAY :: ", res.data.data);
        //     } else {
        //     }
        //   })
        //   .catch(err => console.log("CHART DATA", err));
      }
    }
    fetchData();
  }, [currencyData2]);

  return (
    <>
      {isLoading && <ExchangeDeleteModal network={network} />}
      <div className="orders-sec flex flex-col">
        {/* Tab component */}
        <div className="tabs-sec flex aic">
          <div
            className={clsx("i-tab", {
              active: orderTab === "open",
            })}
            onClick={setOrderTab.bind(this, "open")}>
            Open orders
          </div>
          <div
            className={clsx("i-tab", {
              active: orderTab === "history",
            })}
            onClick={setOrderTab.bind(this, "history")}>
            24h Order History (Last 50)
          </div>
        </div>

        {/* Table component */}
        <div className="table-block flex overflow-scroll">
          <div className="tbl-sec flex flex-col">
            {/* Table Columns component */}
            <div className="tbl-row flex">
              {orderTab === "open" &&
                columns.map(obj => {
                  return (
                    <div className="tbl-col" key={obj.key}>
                      {obj.title}
                    </div>
                  );
                })}
              {orderTab === "history" &&
                filteredColumns?.map(obj => {
                  return (
                    <div className="tbl-col" key={obj.key}>
                      {obj.title}
                    </div>
                  );
                })}
            </div>

            {isWalletConnected && orderTab === "open" && (
              <>
                {accLoading && (
                  <div className="flex items-center justify-center">
                    <Loader />
                  </div>
                )}
                {!accLoading && dataSource.length > 0 ? (
                  dataSource.map((item, index) => {
                    let total = (Number(item?.price) * Number(item?.amount)).toFixed(4);
                    return (
                      <div className="tbl-row flex" key={index}>
                        <div className="tbl-col">{item.date}</div>
                        <div className="tbl-col">{item.pair}</div>
                        <div className="tbl-col">{item.offerType}</div>
                        <div className={`tbl-col ${item.side === "Buy" ? "green" : "red"}`}>{item.side}</div>

                        <div className="tbl-col">{item.price}</div>
                        <div className="tbl-col">{item?.amount}</div>
                        <div className="tbl-col">{total}</div>
                        <div
                          onClick={e => {
                            handleSecretKeyModal(item.action, e);
                          }}
                          className={`tbl-col cursor-pointer red`}>
                          Delete
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="flex items-center justify-center ">
                      <img src={emptyFolder} alt="" />
                      <span className="text-2xl text-gray-300 font-semibold ">No Records</span>
                    </div>
                  </>
                )}
              </>
            )}

            {isWalletConnected && orderTab === "history" && (
              <>
                {hisLoading && <Loader />}
                {!hisLoading && dataSourceHistory.length > 0 ? (
                  dataSourceHistory.map((item, index) => (
                    <div className="tbl-row flex" key={index}>
                      <div className="tbl-col">{item.date}</div>
                      <div className="tbl-col">{item.pair}</div>
                      <div className="tbl-col">{item.offerType}</div>
                      <div className={`tbl-col ${item.side === "Buy" ? "green" : "red"}`}>{item.side}</div>

                      <div className="tbl-col">{item.price}</div>
                      <div className="tbl-col">{item.amount}</div>
                      <div className="tbl-col">{item.total}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-center no-result">No result found</div>
                  </>
                )}
              </>
            )}

            {!isWalletConnected && (
              <div className="btn button w-52 self-center" onClick={setConnectModalVisible.bind(this, true)}>
                connect wallet
              </div>
            )}
          </div>
        </div>
        {isConnectModalVisible && (
          <Modal open={isConnectModalVisible} onClose={setConnectModalVisible.bind(this, false)}>
            <WalletConnect network={network} open={isConnectModalVisible} setOpen={setConnectModalVisible} />
          </Modal>
        )}
      </div>

      <ModalForSecretKey open={isKeyModalVisible} onConfirm={handleOnConfirm} onCancel={() => setIsKeyModalVisible(false)} />
    </>
  );
};

export default AccountOffersTable;
