import { TRADES_PROCESSING, SET_TRADES, STOP_SET_TRADES_PROCESSING } from "./type";

export const setTradesProcessing = () => {
  return {
    type: TRADES_PROCESSING,
  };
};

export const setStopTradesProcessing = () => {
  return {
    type: STOP_SET_TRADES_PROCESSING,
  };
};

export const setTrades = payload => {
  return {
    type: SET_TRADES,
    payload,
  };
};
