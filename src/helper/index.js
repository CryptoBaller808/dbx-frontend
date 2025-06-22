import { Api } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../config/index";
import {
  GET_ACC_OFFERS,
  GET_HIS_OFFERS,
  GET_TVCHART_DATA,
  GET_CHART_DATA,
  GET_TICKERS,
  GET_TRADES,
  GET_STELLAR_TVCHART_DATA,
  GET_STELLAR_TRADES_DATA,
  GET_STELLAR_ACC_OFFERS,
  GET_STELLAR_HIS_OFFERS,
  GET_STELLAR_TICKERS,
} from "./api/url";
// import { store } from "../redux/store";

// export const AuthApiCall = (url, method, data = null, headers = {}) => {
//   return new Promise((resolve, reject) => {
//     const token =
//       store.getState().registerUsers?.registerData?.jwt?.accessToken;

//     axios({
//       method,
//       url: `${BASE_URL}${url}`,
//       data,
//       headers: {
//         Authorization: "Bearer " + token,
//         ...headers,
//       },
//     })
//       .then((res) => {
//         resolve(res);
//       })
//       .catch(reject);
//   });
// };

// export const AfterAuthApi = (url, method, data = null, headers = {}) => {
//   return new Promise((resolve, reject) => {
//     const token =
//       store.getState().loginUsers?.loginData?.data?.data?.jwt?.accessToken;

//     axios({
//       method,
//       url: `${BASE_URL}${url}`,
//       data,
//       headers: {
//         Authorization: "Bearer " + token,
//         ...headers,
//       },
//     })
//       .then((res) => {
//         resolve(res);
//       })
//       .catch(reject);
//   });
// };

// export const sendRequest = (url, method, data = {}) => {
//   return new Promise((resolve, reject) => {
//     AfterAuthApi(url, method, data)
//       .then((res) => {
//         if (res) {
//           resolve(res);
//         } else {
//           reject(res);
//         }
//       })
//       .catch((err) => {
//         reject();
//       });
//   });
// };

export const ApiCall = (url, method, data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers: {
        ...headers,
      },
    })
      .then(resolve)
      .catch(reject);
  });
};

export const getFullAccountOffers = ({ accountNo, network }) => {
  let data = {
    accountNo,
  };
  const API_URL = network === "xlm" ? GET_STELLAR_ACC_OFFERS : GET_ACC_OFFERS;

  return new Promise((resolve, reject) => {
    ApiCall(API_URL, "post", data)
      .then(res => {
        resolve(res);
      })
      .catch(reject);
  });
};
export const getOrderHistory = ({ accountNo, network }) => {
  let data = {
    accountNo,
  };

  const API_URL = network === "xlm" ? GET_STELLAR_HIS_OFFERS : GET_HIS_OFFERS;

  return new Promise((resolve, reject) => {
    ApiCall(API_URL, "post", data)
      .then(res => resolve(res))
      .catch(reject);
  });
};

export const getTradesData = acc => {
  let data = {
    acc,
  };
  const networkSelected = acc?.curA ?? "XRP";
  return new Promise((resolve, reject) => {
    ApiCall(networkSelected === "XLM" ? GET_STELLAR_TRADES_DATA : GET_TRADES, "post", data)
      .then(res => resolve(res))
      .catch(reject);
  });
};

export const getTickersData = ({ acc, network }) => {
  let data = {
    acc,
  };

  const URL = network === "xlm" ? GET_STELLAR_TICKERS : GET_TICKERS;
  return new Promise((resolve, reject) => {
    ApiCall(URL, "post", data)
      .then(res => resolve(res))
      .catch(reject);
  });
};
export const getChartData = async acc => {
  let data = {
    acc,
  };
  return new Promise((resolve, reject) => {
    ApiCall(GET_CHART_DATA, "post", data)
      .then(res => resolve(res))
      .catch(reject);
  });
};

var loading = false;

export const getTVChartData = async acc => {
  let data = {
    acc,
  };

  let url = GET_TVCHART_DATA;

  if (acc.curA === "XLM") url = GET_STELLAR_TVCHART_DATA;

  return new Promise((resolve, reject) => {
    if (loading) {
      resolve(false);
    } else {
      loading = true;
      ApiCall(url, "post", data)
        .then(res => {
          resolve(res);
          setTimeout(() => {
            loading = false;
          }, 2000);
        })
        .catch(reject);
    }
  });
};
