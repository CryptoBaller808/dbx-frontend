// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import * as TradingView from "../../public/charting_library";
import Datafeed from "./data/datafeed.js";
import { dev } from "./data/helpers";
import { useSelector } from "react-redux";

const overrides = {
  "symbolWatermarkProperties.visibility": false,
};

const Chart = ({ currencyData, isDarkMode, selectedFromAsset, selectedToAsset }) => {
  const [tvWidget, setTvWidget] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isChartReady, setIsChartReady] = useState(false);
  const [chartError, setChartError] = useState(null);
  const network = useSelector(state => state.networkReducers.token);
  const containerRef = useRef(null);

  // Generate symbol from asset selection
  useEffect(() => {
    if (selectedFromAsset && selectedToAsset) {
      const fromSymbol = selectedFromAsset.value.split('_')[0] || selectedFromAsset.label.split(' ')[0];
      const toSymbol = selectedToAsset.value.split('_')[0] || selectedToAsset.label.split(' ')[0];
      const newSymbol = `${fromSymbol}/${toSymbol}`;
      const newAsset = `${fromSymbol}/${toSymbol}/default`;
      
      setSelectedAsset(newAsset);
      setSymbol(newSymbol);
      setChartError(null);
      
      if (dev) console.log("Chart: Asset selection changed to:", newSymbol);
    } else if (currencyData?.info?.title) {
      // Fallback to legacy currency data
      if (currencyData?.info?.title === "XRP/SOLO") {
        setSelectedAsset(`XRP/534F4C4F00000000000000000000000000000000/${currencyData?.info?.issuerB}`);
      } else {
        setSelectedAsset(`${currencyData?.info?.title}/${currencyData?.info?.issuerB}`);
      }
      setSymbol(`${currencyData?.info?.title}/${currencyData?.info?.issuerB}`);
    } else {
      // Default symbol
      setSelectedAsset("XRP/USD/rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B");
      setSymbol("XRP/USD");
    }
  }, [selectedFromAsset, selectedToAsset, currencyData]);

  // Initialize TradingView widget
  useEffect(() => {
    if (!selectedAsset) return;

    try {
      // Clean up existing widget
      if (tvWidget) {
        tvWidget.remove();
        setTvWidget(null);
        setIsChartReady(false);
      }

      const widget = new TradingView.widget({
        symbol: selectedAsset,
        interval: "1D",
        fullscreen: false,
        container: "tv_chart_container",
        datafeed: Datafeed(network),
        library_path: "/charting_library/",
        autosize: true,
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
        loading_screen: { backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff" },
      });

      widget.onChartReady(() => {
        setIsChartReady(true);
        setChartError(null);
        
        if (isDarkMode) {
          widget.applyOverrides({
            "paneProperties.background": "#1f1f1f",
            "paneProperties.backgroundType": "solid",
            "paneProperties.vertGridProperties.color": "#333333",
            "paneProperties.horzGridProperties.color": "#333333",
            "scalesProperties.lineColor": "#666666",
            "scalesProperties.textColor": "#ffffff",
          });
        }

        if (dev) console.log("[Chart] Widget ready for symbol:", selectedAsset);
      });

      setTvWidget(widget);
    } catch (error) {
      console.error("Error initializing TradingView widget:", error);
      setChartError("Failed to load chart. Please try again.");
    }

    return () => {
      // Cleanup on unmount
      if (tvWidget) {
        try {
          tvWidget.remove();
        } catch (error) {
          console.warn("Error removing TradingView widget:", error);
        }
      }
    };
  }, [selectedAsset, network, isDarkMode]);

  // Handle symbol changes after chart is ready
  useEffect(() => {
    if (!tvWidget || !isChartReady || !selectedAsset) return;

    try {
      tvWidget.activeChart()?.setSymbol(selectedAsset, () => {
        if (dev) console.log("[Chart] Symbol changed to:", selectedAsset);
      });
    } catch (error) {
      console.error("Error changing symbol:", error);
      setChartError("Failed to load chart data for selected pair.");
    }
  }, [selectedAsset, tvWidget, isChartReady]);

  // Handle theme changes
  useEffect(() => {
    if (!tvWidget || !isChartReady) return;

    try {
      if (isDarkMode) {
        tvWidget.applyOverrides({
          "paneProperties.background": "#1f1f1f",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "#333333",
          "paneProperties.horzGridProperties.color": "#333333",
          "scalesProperties.lineColor": "#666666",
          "scalesProperties.textColor": "#ffffff",
        });
      } else {
        tvWidget.applyOverrides({
          "paneProperties.background": "#ffffff",
          "paneProperties.backgroundType": "solid",
          "paneProperties.vertGridProperties.color": "#e1e1e1",
          "paneProperties.horzGridProperties.color": "#e1e1e1",
          "scalesProperties.lineColor": "#cccccc",
          "scalesProperties.textColor": "#000000",
        });
      }
    } catch (error) {
      console.warn("Error applying theme:", error);
    }
  }, [isDarkMode, tvWidget, isChartReady]);

  return (
    <div className="chart-container" style={{ width: "100%", height: "100%", position: "relative" }}>
      {chartError && (
        <div 
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: isDarkMode ? "#ffffff" : "#000000",
            backgroundColor: isDarkMode ? "#1f1f1f" : "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            border: `1px solid ${isDarkMode ? "#333333" : "#e1e1e1"}`,
            zIndex: 1000,
          }}
        >
          <div>{chartError}</div>
          <button 
            onClick={() => {
              setChartError(null);
              // Trigger re-initialization
              setSelectedAsset(prev => prev + "");
            }}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      {!isChartReady && !chartError && (
        <div 
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: isDarkMode ? "#ffffff" : "#000000",
            zIndex: 999,
          }}
        >
          <div>Loading chart...</div>
          <div style={{ marginTop: "10px" }}>
            <div 
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #007bff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
          </div>
        </div>
      )}
      
      <div 
        id="tv_chart_container" 
        ref={containerRef}
        className="w-full h-full"
        style={{ 
          visibility: isChartReady && !chartError ? "visible" : "hidden",
          minHeight: "400px",
        }}
      />
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Chart;
