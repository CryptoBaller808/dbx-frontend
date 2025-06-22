import {
  SET_BALANCE,
  BALANCE_PROCESSING,
  STOP_BALANCE_PROCESSING,
  SET_BALANCE_EMPTY,
} from "./type";

const defaultReducer = {
  balance: null,
  processing: false,
};

const balanceReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case BALANCE_PROCESSING: {
      return {
        ...state,
        processing: true,
      };
    }

    case SET_BALANCE: {
      return {
        ...state,
        balance: payload,
        processing: false,
      };
    }

    case STOP_BALANCE_PROCESSING: {
      return {
        ...state,
        processing: false,
      };
    }
    case SET_BALANCE_EMPTY: {
      return {
        ...state,
        ...defaultReducer,
      };
    }

    default: {
      return state;
    }
  }
};

export default balanceReducer;
