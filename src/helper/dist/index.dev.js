"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getTVChartData =
  exports.getChartData =
  exports.getTickersData =
  exports.getTradesData =
  exports.getOrderHistory =
  exports.getFullAccountOffers =
  exports.ApiCall =
    void 0;

var _iconsMaterial = require("@mui/icons-material");

var _axios = _interopRequireDefault(require("axios"));

var _index = require("../config/index");

var _url = require("./api/url");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

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
var ApiCall = function ApiCall(url, method) {
  var data =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var headers =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return new Promise(function (resolve, reject) {
    (0, _axios["default"])({
      method: method,
      url: "".concat(_index.BASE_URL).concat(url),
      data: data,
      headers: _objectSpread({}, headers),
    })
      .then(resolve)
      ["catch"](reject);
  });
};

exports.ApiCall = ApiCall;

var getFullAccountOffers = function getFullAccountOffers(accNo) {
  var data = {
    accountNo: accNo,
  };
  return new Promise(function (resolve, reject) {
    ApiCall(_url.GET_ACC_OFFERS, "post", data)
      .then(function (res) {
        resolve(res);
      })
      ["catch"](reject);
  });
};

exports.getFullAccountOffers = getFullAccountOffers;

var getOrderHistory = function getOrderHistory(accNo) {
  var data = {
    accountNo: accNo,
  };
  return new Promise(function (resolve, reject) {
    ApiCall(_url.GET_HIS_OFFERS, "post", data)
      .then(function (res) {
        return resolve(res);
      })
      ["catch"](reject);
  });
};

exports.getOrderHistory = getOrderHistory;

var getTradesData = function getTradesData(acc) {
  var data = {
    acc: acc,
  };
  return new Promise(function (resolve, reject) {
    ApiCall(_url.GET_TRADES, "post", data)
      .then(function (res) {
        return resolve(res);
      })
      ["catch"](reject);
  });
};

exports.getTradesData = getTradesData;

var getTickersData = function getTickersData(acc) {
  var data = {
    acc: acc,
  };
  return new Promise(function (resolve, reject) {
    ApiCall(_url.GET_TICKERS, "post", data)
      .then(function (res) {
        return resolve(res);
      })
      ["catch"](reject);
  });
};

exports.getTickersData = getTickersData;

var getChartData = function getChartData(acc) {
  var data;
  return regeneratorRuntime.async(function getChartData$(_context) {
    while (1) {
      switch ((_context.prev = _context.next)) {
        case 0:
          data = {
            acc: acc,
          };
          return _context.abrupt(
            "return",
            new Promise(function (resolve, reject) {
              ApiCall(_url.GET_CHART_DATA, "post", data)
                .then(function (res) {
                  return resolve(res);
                })
                ["catch"](reject);
            })
          );

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getChartData = getChartData;

var getTVChartData = function getTVChartData(acc) {
  var data;
  return regeneratorRuntime.async(function getTVChartData$(_context2) {
    while (1) {
      switch ((_context2.prev = _context2.next)) {
        case 0:
          data = {
            acc: acc,
          };
          return _context2.abrupt(
            "return",
            new Promise(function (resolve, reject) {
              ApiCall(_url.GET_TVCHART_DATA, "post", data)
                .then(function (res) {
                  return resolve(res);
                })
                ["catch"](reject);
            })
          );

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getTVChartData = getTVChartData;
