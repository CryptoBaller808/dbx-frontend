import { CHART_PROCESSING, SET_CHART, STOP_SET_CHART_PROCESSING } from "./type";

const defaultReducer = {
  chart: [],
  processing: false,
};

const chartReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case CHART_PROCESSING: {
      return {
        ...state,
        processing: true,
      };
    }

    case SET_CHART: {
      return {
        ...state,
        chart: payload,
        processing: false,
      };
    }

    case STOP_SET_CHART_PROCESSING: {
      return {
        ...state,
        processing: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default chartReducer;
