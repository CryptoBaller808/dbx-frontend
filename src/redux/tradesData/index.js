import { TRADES_PROCESSING, SET_TRADES, STOP_SET_TRADES_PROCESSING } from "./type";

const defaultReducer = {
  trades: [],
  processing: false,
};

const accountOffersReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case TRADES_PROCESSING: {
      return {
        ...state,
        processing: true,
      };
    }

    case SET_TRADES: {
      return {
        ...state,
        trades: payload,
        processing: false,
      };
    }

    case STOP_SET_TRADES_PROCESSING: {
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

export default accountOffersReducer;
