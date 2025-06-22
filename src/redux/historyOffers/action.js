import { HISTORY_OFFERS_PROCESSING, SET_HISTORY_OFFERS, STOP_SET_HISTORY_OFFERS_PROCESSING } from "./type";

export const setHistoryOffersProcessing = () => {
  return {
    type: HISTORY_OFFERS_PROCESSING,
  };
};

export const setStopHistoryOffersProcessing = () => {
  return {
    type: STOP_SET_HISTORY_OFFERS_PROCESSING,
  };
};

export const setHistoryOffers = payload => {
  return {
    type: SET_HISTORY_OFFERS,
    payload,
  };
};
