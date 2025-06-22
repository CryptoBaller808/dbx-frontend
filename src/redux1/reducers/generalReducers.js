const initState = {
    showRightbar: false,
    showSidebar: false,
    user: null,
    isAuthenticated: false,
  };
  
  const generalReducers = (state = initState, action) => {
    const { type, payload } = action;
    switch (type) {
      case "GET_USER":
        return {
          ...state,
          user: payload,
          isAuthenticated: true,
          apploaded: true,
        };
      case "UPDATE_NOTIFICATIONS":
        return {
          ...state,
          notifications: payload,
        };
      case "UPDATE_NOTIFICATIONS_SOCKET_UPDATE":
        return {
          ...state,
          socket_notification: payload,
        };
      case "AUTHENTICATION_FAIL": {
        return {
          ...state,
          isAuthenticated: false,
          user: null,
          apploaded: true,
        };
      }
      default:
        return state;
    }
  };
  
  export default generalReducers;
  