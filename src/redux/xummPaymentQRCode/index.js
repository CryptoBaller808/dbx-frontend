import {
	SET_PAYMENT_QR_CODE,
	PAYMENT_QR_CODE_PROCESSING,
	STOP_PAYMENT_QR_CODE_PROCESSING,
	PAYMENT_QR_CODE_DISCONNECT,
} from "./type";

const defaultReducer = {
	paymentQRcode: null,
	processing: false,
};

const paymentQRCodeReducer = (state = defaultReducer, action) => {
	const { type, payload } = action;
	switch (type) {
		case PAYMENT_QR_CODE_PROCESSING: {
			return {
				...state,
				processing: true,
			};
		}

		case SET_PAYMENT_QR_CODE: {
			return {
				...state,
				paymentQRcode: payload,
				processing: false,
			};
		}

		case STOP_PAYMENT_QR_CODE_PROCESSING: {
			return {
				...state,
				processing: false,
			};
		}
		case PAYMENT_QR_CODE_DISCONNECT: {
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

export default paymentQRCodeReducer;
