import { configurationData, dev, getIBCompatibleTimeframe } from "./helpers.js";
import axios from "axios";
import { getTVChartData } from "../../../helper";
import { GET_STELLAR_TVCHART_DATA } from "../../../helper/api/url.js";
import { BASE_URL } from "../../../config/index.js";

let lookback = 0;
const Datafeed = (network = "xrp") => ({
  onReady: callback => {
    // console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("[searchSymbols]: Method call", userInput, exchange, symbolType, onResultReadyCallback);
  },

  resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    // symbol name to show
    // example symbolName = "XRP/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"
    // example symbolName to show = "XRP/USD"
    const splitSymbolName = symbolName.split("/");
    const symbolNameToShow = `${splitSymbolName[0]}/${splitSymbolName[1]}`;

    const symbolInfoResolved = {
      ticker: symbolName,
      name: symbolNameToShow,
      description: symbolNameToShow,
      type: "crypto",
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: "",
      minmov: 1,
      pricescale: 1000000000000000,
      visible_plots_set: "ohlcv",
      has_intraday: true,
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 4,
      data_status: "streaming",
    };
    if (dev) console.log("[resolveSymbol]: Resolved symbolInfo: ", symbolInfoResolved);
    setTimeout(() => {
      onSymbolResolvedCallback(symbolInfoResolved);
    }, 0);
  },

  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    let { from, to, firstDataRequest } = periodParams;
    if (firstDataRequest) {
      to = Math.round(new Date().getTime() / 1000);
    }

    const countBack = periodParams.countBack;

    console.log("[getBars]: Method call", symbolInfo, resolution, periodParams, resolution);
    const curA = symbolInfo.ticker.split("/")[0];
    const curB = symbolInfo.ticker.split("/")[1];
    const issuerB = symbolInfo.ticker.split("/")[2];

    // axios({
    //   method: "post",
    //   url: `https://api.sologenic.org/api/v1/ohlc?symbol=${curA}%2F${curB}%2B${issuerB}&from=${from}&to=${to}&period=${getIBCompatibleTimeframe(
    //     resolution,
    //   )}`,
    //   withCredentials: false,
    // })

    if (network === "xlm") {
      const resp = await axios.post(`${BASE_URL}/${GET_STELLAR_TVCHART_DATA}`, {
        acc: {
          curA,
          curB,
          issuerB,
          period: getIBCompatibleTimeframe(resolution),
          from,
          to,
          countBack,
        },
      });

      if (!resp?.data?.data?.length) {
        setTimeout(onHistoryCallback([], { noData: true }));
      }

      const result = (resp ? resp.data.data : []).map(bar => {
        return {
          time: bar[0] * 1000,
          open: bar[1],
          high: bar[2],
          low: bar[3],
          close: bar[4],
          volume: bar[5],
        };
      });

      onHistoryCallback(result);
      return;
    }

    getTVChartData({ curA, curB, issuerB, period: getIBCompatibleTimeframe(resolution), from, to, countBack })
      .then(res => {
        const result = (res ? res.data.data : []).map(bar => {
          return {
            time: bar[0] * 1000,
            open: bar[1],
            high: bar[2],
            low: bar[3],
            close: bar[4],
            volume: bar[5],
          };
        });

        if (result.length > 0) {
          onHistoryCallback(result, { noData: true });
        } else if (lookback < 3) {
          onHistoryCallback(result, { noData: true });
          lookback++;
        } else {
          lookback = 0;
          onHistoryCallback(result, { noData: true });
        }
      })
      .catch(err => console.error("err", err));
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
    // console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID, resolution);
  },

  unsubscribeBars: subscriberUID => {
    // console.log('[unsubscribeBars]: Method call with subscribeUID:', subscriberUID);
  },
});

export default Datafeed;
