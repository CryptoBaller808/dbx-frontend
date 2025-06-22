import axios from "axios";

const mainNetURL = process.env.REACT_APP_SOLOGENIC_API_URL;

const testNetURL = process.env.REACT_APP_SOLOGENIC_TEST_API_URL;

// Tickers
export const getPrice = (data) => {
	return new Promise((resolve, reject) => {
		const curA = data.curA;
		const issuerA = data.issuerA;
		const curB = data.curB;
		const issuerB = data.issuerB;

		if (curA === "XRP") {
			const data = {
				symbols: [`${curA}/${curB}+${issuerB}`, `${curB}+${issuerB}/${curA}`],
			};

			const submitData = {
				method: "post",
				url: `${mainNetURL}/api/v1/tickers/24h`,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				data,
			};

			axios(submitData)
				.then((res) => {
					if (res.data.result === "success") {
						resolve(res.data);
					}
				})
				.catch((err) => console.log("err", err));
		} else if (curB === "XRP") {
			const data = {
				symbols: [`${curA}+${issuerA}/${curB}`, `${curB}/${curA}+${issuerA}`],
			};

			const submitData = {
				method: "post",
				url: `${mainNetURL}/api/v1/tickers/24h`,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				data,
			};

			axios(submitData)
				.then((res) => {
					if (res.data.result === "success") {
						resolve(res.data);
					}
				})
				.catch((err) => console.log("err", err));
		} else {
			const data = {
				symbols: [
					`${curA}+${issuerA}/${curB}+${issuerB}`,
					`${curB}+${issuerB}/${curA}+${issuerA}`,
				],
			};

			const submitData = {
				method: "post",
				url: `${mainNetURL}/api/v1/tickers/24h`,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				data,
			};

			axios(submitData)
				.then((res) => {
					if (res.data.result === "success") {
						resolve(res.data);
					}
				})
				.catch((err) => console.log("err", err));
		}
	});
};

// OHLC
export const getChartData = (data) => {
	return new Promise((resolve, reject) => {
		const curA = data.curA;
		const issuerA = data.issuerA;
		const curB = data.curB;
		const issuerB = data.issuerB;

		if (curA === "XRP") {
			const submitData = {
				method: "post",
				url: `${mainNetURL}/api/v1/ohlc?symbol=${curA}%2F${curB}%${issuerB}&period=1h&from=1658641378&to=1658644978`,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			};

			axios(submitData)
				.then((res) => {
					resolve(res.data);
				})
				.catch((err) => console.log("err", err));
		} else if (curB === "XRP") {
			const submitData = {
				method: "post",
				url: `${mainNetURL}/api/v1/ohlc?symbol=${curA}%${issuerA}%2F${curB}&period=1h&from=1658641378&to=1658644978`,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			};

			axios(submitData)
				.then((res) => {
					resolve(res.data);
				})
				.catch((err) => console.log("err", err));
		} else {
			const submitData = {
				method: "post",
				url: `${mainNetURL}/api/v1/ohlc?symbol=${curA}%${issuerA}%2F${curB}${issuerB}%&period=1h&from=1658641378&to=1658644978`,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			};

			axios(submitData)
				.then((res) => {
					resolve(res.data);
				})
				.catch((err) => console.log("err", err));
		}
	});
};
