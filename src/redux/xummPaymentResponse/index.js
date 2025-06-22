import {
  SET_PAYMENT_RESPONSE,
  PAYMENT_RESPONSE_PROCESSING,
  STOP_PAYMENT_RESPONSE_PROCESSING,
} from "./type";

const defaultReducer = {
  paymentResponse: null,
  processing: false,
};

const paymentResponseReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case PAYMENT_RESPONSE_PROCESSING: {
      return {
        ...state,
        processing: true,
      };
    }

    case SET_PAYMENT_RESPONSE: {
      return {
        ...state,
        paymentResponse: payload,
        processing: false,
      };
    }

    case STOP_PAYMENT_RESPONSE_PROCESSING: {
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

export default paymentResponseReducer;
