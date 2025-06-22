import {
	BOOK_OFFERS_PROCESSING,
	SET_BOOK_OFFERS,
	STOP_SET_BOOK_OFFERS_PROCESSING,
} from "./type";

export const setBookOffersProcessing = () => {
	return {
		type: BOOK_OFFERS_PROCESSING,
	};
};

export const setStopBookOffersProcessing = () => {
	return {
		type: STOP_SET_BOOK_OFFERS_PROCESSING,
	};
};

export const setBookOffers = (payload) => {
	return {
		type: SET_BOOK_OFFERS,
		payload,
	};
};
