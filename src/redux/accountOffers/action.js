import { ACCOUNT_OFFERS_PROCESSING, SET_ACCOUNT_OFFERS } from "./type";

//this is the loading indicator for fetch accountffwers, we will pass boolean to avoid two actions
export const setAccountOffersProcessing = payload => {
  return {
    type: ACCOUNT_OFFERS_PROCESSING,
    payload,
  };
};

export const setAccountOffers = payload => {
  return {
    type: SET_ACCOUNT_OFFERS,
    payload,
  };
};
