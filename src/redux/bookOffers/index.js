import {
	BOOK_OFFERS_PROCESSING,
	SET_BOOK_OFFERS,
	STOP_SET_BOOK_OFFERS_PROCESSING,
} from "./type";

const defaultReducer = {
	bookOffer: [],
	processing: false,
};

const bookOffersReducer = (state = defaultReducer, action) => {
	const { type, payload } = action;
	switch (type) {
		case BOOK_OFFERS_PROCESSING: {
			return {
				...state,
				processing: true,
			};
		}

		case SET_BOOK_OFFERS: {
			return {
				...state,
				bookOffer: payload,
				processing: false,
			};
		}

		case STOP_SET_BOOK_OFFERS_PROCESSING: {
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

export default bookOffersReducer;
