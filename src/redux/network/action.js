import {
  SET_NETWORK
} from "./type";

export const setNetwork = (payload) => {
  return {
    type: SET_NETWORK,
    payload,
  };
};
