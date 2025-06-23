"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = require("./helpers.js");

var _axios = _interopRequireDefault(require("axios"));

var _helper = require("../../../helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var lookback = 0;
var Datafeed = {
  onReady: function onReady(callback) {
    // console.log('[onReady]: Method call');
    setTimeout(function () {
      return callback(_helpers.configurationData);
    });
  },
  searchSymbols: function searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    return regeneratorRuntime.async(function searchSymbols$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("[searchSymbols]: Method call", userInput, exchange, symbolType, onResultReadyCallback);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  resolveSymbol: function resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    var splitSymbolName, symbolNameToShow, symbolInfoResolved;
    return regeneratorRuntime.async(function resolveSymbol$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // symbol name to show
            // example symbolName = "XRP/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
            // example symbolName to show = "XRP/USD"
            splitSymbolName = symbolName.split("/");
            symbolNameToShow = "".concat(splitSymbolName[0], "/").concat(splitSymbolName[1]);
            symbolInfoResolved = {
              ticker: symbolName,
              name: symbolNameToShow,
              description: symbolNameToShow,
              type: "crypto",
              session: "24x7",
              timezone: "Etc/UTC",
              exchange: "Sologenic",
              minmov: 1,
              pricescale: 10000000000000000,
              visible_plots_set: "ohlcv",
              has_intraday: true,
              has_weekly_and_monthly: false,
              supported_resolutions: _helpers.configurationData.supported_resolutions,
              volume_precision: 4,
              data_status: "streaming"
            };
            if (_helpers.dev) console.log("[resolveSymbol]: Resolved symbolInfo: ", symbolInfoResolved);
            setTimeout(function () {
              onSymbolResolvedCallback(symbolInfoResolved);
            }, 0);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  getBars: function getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
    var from, to, firstDataRequest, curA, curB, issuerB;
    return regeneratorRuntime.async(function getBars$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            from = periodParams.from, to = periodParams.to, firstDataRequest = periodParams.firstDataRequest;

            if (firstDataRequest) {
              to = Math.round(new Date().getTime() / 1000);
            }

            console.log("[getBars]: Method call", symbolInfo, resolution, periodParams, resolution);
            curA = symbolInfo.ticker.split("/")[0];
            curB = symbolInfo.ticker.split("/")[1];
            issuerB = symbolInfo.ticker.split("/")[2]; // axios({
            //   method: "get",
            //   url: `https://api.sologenic.org/api/v1/ohlc?symbol=${curA}%2F${curB}%2B${issuerB}&from=${from}&to=${to}&period=${getIBCompatibleTimeframe(
            //     resolution,
            //   )}`,
            //   withCredentials: false,
            // })

            (0, _helper.getTVChartData)({
              curA: curA,
              curB: curB,
              issuerB: issuerB,
              period: (0, _helpers.getIBCompatibleTimeframe)(resolution),
              from: from,
              to: to
            }).then(function (res) {
              var result = res.data.data.map(function (bar) {
                return {
                  time: bar[0] * 1000,
                  open: bar[1],
                  high: bar[2],
                  low: bar[3],
                  close: bar[4],
                  volume: bar[5]
                };
              });

              if (result.length > 0) {
                onHistoryCallback(result, {
                  noData: false
                });
              } else if (lookback < 3) {
                onHistoryCallback(result, {
                  noData: false
                });
                lookback++;
              } else {
                lookback = 0;
                onHistoryCallback(result, {
                  noData: true
                });
              }
            })["catch"](function (err) {
              return console.error("err", err);
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  subscribeBars: function subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {// console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID, resolution);
  },
  unsubscribeBars: function unsubscribeBars(subscriberUID) {// console.log('[unsubscribeBars]: Method call with subscribeUID:', subscriberUID);
  }
};
var _default = Datafeed;
exports["default"] = _default;