import {
  SET_NETWORK
} from "./type";

const defaultReducer = {
  token: 'xrp'
};

const networkReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_NETWORK: {
      return {
        ...state,
        token: payload
      };
    }

    default: {
      return state;
    }
  }
};

export default networkReducer;
