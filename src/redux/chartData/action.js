import { CHART_PROCESSING, SET_CHART, STOP_SET_CHART_PROCESSING } from "./type";

export const setChartProcessing = () => {
  return {
    type: CHART_PROCESSING,
  };
};

export const setStopChartProcessing = () => {
  return {
    type: STOP_SET_CHART_PROCESSING,
  };
};

export const setChart = payload => {
  return {
    type: SET_CHART,
    payload,
  };
};
