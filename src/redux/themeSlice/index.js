import { SET_THEME } from "./type";

const defaultReducer = {
  isDarkMode: false,
};

const themeReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_THEME: {
      return {
        isDarkMode: payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default themeReducer;
