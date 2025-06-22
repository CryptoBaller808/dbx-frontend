import { ACCOUNT_OFFERS_PROCESSING, SET_ACCOUNT_OFFERS } from "./type";

const defaultReducer = {
  accountOffer: [],
  processing: false,
};

const accountOffersReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACCOUNT_OFFERS_PROCESSING: {
      return {
        ...state,
        processing: payload,
      };
    }

    case SET_ACCOUNT_OFFERS: {
      return {
        ...state,
        accountOffer: payload,
        processing: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default accountOffersReducer;
