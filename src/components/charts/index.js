// @ts-nocheck
import React, { useState, useEffect } from "react";
import * as TradingView from "../../public/charting_library";
import Datafeed from "./data/datafeed.js";
import { dev } from "./data/helpers";
import { useSelector } from "react-redux";

const overrides = {
  "symbolWatermarkProperties.visibility": false,
};

const Chart = ({ currencyData, isDarkMode }) => {
  const [tvWidget, setTvWIdget] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(currencyData?.info?.title);
  const [symbol, setSymbol] = useState("");
  const network = useSelector(state => state.networkReducers.token);

  if (!selectedAsset) {
    setSelectedAsset("XRP/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B");
    setSymbol("XRP/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B");
  }

  useEffect(() => {
    console.log("charts: currencyData update: ", currencyData);
    if (currencyData?.info?.title === "XRP/SOLO") {
      setSelectedAsset(`XRP/534F4C4F00000000000000000000000000000000/${currencyData?.info?.issuerB}`);
    } else {
      setSelectedAsset(`${currencyData?.info?.title}/${currencyData?.info?.issuerB}`);
    }

    setSymbol(`${currencyData?.info?.title}/${currencyData?.info?.issuerB}`);
  }, [currencyData]);

  //Initiate tvWidget
  useEffect(() => {
    setTvWIdget(
      new TradingView.widget({
        symbol: !selectedAsset ? "XRP/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" : `${symbol}`, // default symbol
        interval: "1D", // default interval
        fullscreen: false, // displays the chart in the fullscreen mode
        container: "tv_chart_container",
        datafeed: Datafeed(network),
        library_path: "/charting_library/",
        autosize: true,
        // debug: true,
        theme: isDarkMode ? "Dark" : "Light",
        disabled_features: [
          "header_symbol_search",
          "header_compare",
          "symbol_search_hot_key",
          "main_series_scale_menu",
          "display_market_status",
          "timeframes_toolbar",
        ],
        enabled_features: ["hide_left_toolbar_by_default", "hide_resolution_in_legend"],
        overrides: overrides,
      }),
    );

    return () => {
      //tvWidget?.remove();
    };
  }, [isDarkMode]);

  // handle asset change
  useEffect(() => {
    if (!selectedAsset) return;
    tvWidget?.onChartReady?.(() => {
      if (isDarkMode) {
        tvWidget?.applyOverrides({
          "paneProperties.background": "#1f1f1f",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "hotpink",
          "paneProperties.horzGridProperties.color": "hotpink",
          "scalesProperties.lineColor": "orange",
          "scalesProperties.textColor": "orange",
        });
      }

      tvWidget?.activeChart()?.setSymbol(selectedAsset);
      if (dev) console.log("[onChartReady].[useEffect] selectedAsset changed to: ", selectedAsset);
    });
  }, [selectedAsset, tvWidget]);

  return <div id="tv_chart_container" className="w-full h-full"></div>;
};

export default Chart;
