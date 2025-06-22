import {
  SET_PAYMENT_RESPONSE,
  PAYMENT_RESPONSE_PROCESSING,
  STOP_PAYMENT_RESPONSE_PROCESSING,
} from "./type";

export const setPaymentResponseProcessing = () => {
  return {
    type: PAYMENT_RESPONSE_PROCESSING,
  };
};

export const setStopPaymentResponseProcessing = () => {
  return {
    type: STOP_PAYMENT_RESPONSE_PROCESSING,
  };
};

export const setPaymentResponse = (payload) => {
  return {
    type: SET_PAYMENT_RESPONSE,
    payload,
  };
};
