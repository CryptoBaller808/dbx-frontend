import {
	SET_QR_CODE,
	QR_CODE_PROCESSING,
	STOP_QR_CODE_PROCESSING,
	QR_CODE_DISCONNECT,
} from "./type";

export const setQRCodeProcessing = () => {
	return {
		type: QR_CODE_PROCESSING,
	};
};

export const setStopQRCodeProcessing = () => {
	return {
		type: STOP_QR_CODE_PROCESSING,
	};
};
export const setQRCodeDisconnect = () => {
	return {
		type: QR_CODE_DISCONNECT,
	};
};

export const setQRCode = (payload) => {
	return {
		type: SET_QR_CODE,
		payload,
	};
};
