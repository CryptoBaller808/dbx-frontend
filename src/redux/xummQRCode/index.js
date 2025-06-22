import {
  SET_QR_CODE,
  QR_CODE_PROCESSING,
  STOP_QR_CODE_PROCESSING,
  QR_CODE_DISCONNECT,
} from "./type";

const defaultReducer = {
  QRcode: null,
  processing: false,
};

const QRCodeReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  switch (type) {
    case QR_CODE_PROCESSING: {
      return {
        ...state,
        processing: true,
      };
    }

    case SET_QR_CODE: {
      return {
        ...state,
        QRcode: payload,
        processing: false,
      };
    }

    case STOP_QR_CODE_PROCESSING: {
      return {
        ...state,
        processing: false,
      };
    }
    case QR_CODE_DISCONNECT: {
      return {
        ...state,
        ...defaultReducer,
      };
    }

    default: {
      return state;
    }
  }
};

export default QRCodeReducer;
