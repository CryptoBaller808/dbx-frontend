import { ApiCall } from "..";
import { GET_STELLAR_EXCHANGE_RATE, GET_STELLAR_SWAP_LIST, GET_SWAP_LIST } from "./url";

export const getSwapAssets = ({ network }) => {
  const API_URL = network === "xlm" ? GET_STELLAR_SWAP_LIST : GET_SWAP_LIST;
console.log('API_URL',API_URL);
  return new Promise((resolve, reject) => {
    ApiCall(API_URL, "get")
      .then(res => {
        resolve(res);
      })
      .catch(reject);
  });
};

// data = {fromCurrency, fromIssuer, toCurrency, toIssuer, amount}
export const getExchangeRates = data => {
  return new Promise((resolve, reject) => {
    ApiCall(GET_STELLAR_EXCHANGE_RATE, "post", data)
      .then(res => {
        resolve(res);
      })
      .catch(reject);
  });
};
