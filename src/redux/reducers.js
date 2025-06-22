import { combineReducers } from "redux";
import authReducer from "./auth/reducer";
import signInData from "./xummBalance";
import QRCodeReducer from "./xummQRCode";
import paymentQRCodeReducer from "./xummPaymentQRCode/index";
import paymentResponseReducer from "./xummPaymentResponse";
import bookOffers from "./bookOffers";
import accountOffers from "./accountOffers";
import historyOffers from "./historyOffers";
import trades from "./tradesData";
import chart from "./chartData";
import generalReducers from "./general";
import networkReducers from "./network";
import themeReducer from "./themeSlice";
import multiChainWallet from "./multiChainWallet/reducer";

const rootReducer = combineReducers({
  authReducer,
  signInData,
  QRCodeReducer,
  paymentQRCodeReducer,
  paymentResponseReducer,
  bookOffers,
  accountOffers,
  historyOffers,
  trades,
  chart,
  generalReducers,
  networkReducers,
  themeReducer,
  multiChainWallet,
});
export default rootReducer;
