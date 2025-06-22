import {
	SET_PAYMENT_QR_CODE,
	PAYMENT_QR_CODE_PROCESSING,
	STOP_PAYMENT_QR_CODE_PROCESSING,
	PAYMENT_QR_CODE_DISCONNECT,
} from "./type";

export const setPaymentQRCodeProcessing = () => {
	return {
		type: PAYMENT_QR_CODE_PROCESSING,
	};
};

export const setStopPaymentQRCodeProcessing = () => {
	return {
		type: STOP_PAYMENT_QR_CODE_PROCESSING,
	};
};
export const setPaymentQRCodeDisconnect = () => {
	return {
		type: PAYMENT_QR_CODE_DISCONNECT,
	};
};

export const setPaymentQRCode = (payload) => {
	return {
		type: SET_PAYMENT_QR_CODE,
		payload,
	};
};
