import { HISTORY_OFFERS_PROCESSING, SET_HISTORY_OFFERS, STOP_SET_HISTORY_OFFERS_PROCESSING } from "./type";

const defaultReducer = {
  historyOffer: [],
  processing: false,
};

const historyOffersReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case HISTORY_OFFERS_PROCESSING: {
      return {
        ...state,
        processing: true,
      };
    }

    case SET_HISTORY_OFFERS: {
      return {
        ...state,
        historyOffer: payload,
        processing: false,
      };
    }

    case STOP_SET_HISTORY_OFFERS_PROCESSING: {
      return {
        ...state,
        processing: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default historyOffersReducer;
