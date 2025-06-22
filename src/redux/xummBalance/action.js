import {
  SET_BALANCE,
  BALANCE_PROCESSING,
  STOP_BALANCE_PROCESSING,
  SET_BALANCE_EMPTY,
} from "./type";

export const setBalanceProcessing = () => {
  return {
    type: BALANCE_PROCESSING,
  };
};

export const setStopBalanceProcessing = () => {
  return {
    type: STOP_BALANCE_PROCESSING,
  };
};
export const setBalanceEmpty = () => {
  return {
    type: SET_BALANCE_EMPTY,
  };
};

export const setBalance = (payload) => {
  return {
    type: SET_BALANCE,
    payload,
  };
};
