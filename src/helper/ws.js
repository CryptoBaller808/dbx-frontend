import { GET_STELLAR_ORDER_BOOK } from "./api/url";
import { ApiCall } from ".";

export const getAccountOffers = account => {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(process.env.REACT_APP_XRP_TESTNET);

      const accountOffers = {
        id: 2,
        command: "account_offers",
        account,
      };

      ws.onopen = () => {
        ws.send(JSON.stringify(accountOffers));
      };

      ws.onmessage = function (event) {
        const json = JSON.parse(event.data);
        try {
          if ((json.event = "data")) {
            resolve(json);
          }
        } catch (err) {
          console.log(err);
        }
      };
    } catch (error) {
      console.log("error", error);
    }
  });
};

export const getBookOffers = (data, userAccount) => {
  return new Promise((resolve, reject) => {
    try {
      if (data?.currentCurrency === "XLM") {
        ApiCall(GET_STELLAR_ORDER_BOOK, "post", data).then(resp => {
          resolve(resp.data);
        });
      } else {
        const ws = new WebSocket(process.env.REACT_APP_XRP_TESTNET);

        const getVal = (issuerVal, curVal) => {
          if (curVal === "XRP") {
            return {
              currency: curVal,
            };
          } else {
            return {
              currency: curVal,
              issuer: issuerVal,
            };
          }
        };

        // const getTakerPays = (issuerVal, curVal) => {
        // 	if (curVal === "XRP") {
        // 		return {
        // 			currency: curVal,
        // 		};
        // 	} else {
        // 		return {
        // 			currency: curVal,
        // 			issuer: issuerVal,
        // 		};
        // 	}
        // };

        const bookOffers = {
          id: 4,
          command: "book_offers",
          taker: userAccount,
          taker_pays: getVal(data.baseIssuer, data.baseCurrency),
          taker_gets: getVal(data.currentIssuer, data.currentCurrency),
          limit: 500,
        };

        ws.onopen = () => {
          ws.send(JSON.stringify(bookOffers));
        };

        ws.onmessage = function (event) {
          const json = JSON.parse(event.data);
          try {
            if ((json.event = "data")) {
              resolve(json);
              ws.close();
            }
          } catch (err) {
            console.log(err);
          }
        };
      }
    } catch (error) {
      console.log("error", error);
    }
  });
};

export const getUserCurrencies = account => {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(process.env.REACT_APP_XRP_TESTNET);

      const submitData = {
        id: 2,
        command: "account_lines",
        ledger_index: "validated",
        account,
      };

      ws.onopen = () => {
        ws.send(JSON.stringify(submitData));
      };

      ws.onmessage = function (event) {
        const json = JSON.parse(event.data);
        try {
          if ((json.event = "data")) {
            resolve(json);
          }
        } catch (err) {
          console.log(err);
        }
      };
    } catch (error) {
      console.log("error", error);
    }
  });
};
//get accout history Offers
// export const getHistoryOffers = account => {
//   return new Promise((resolve, reject) => {
//     try {
//       const ws = new WebSocket(process.env.REACT_APP_XRP_TESTNET);

//       const historyOffers = {
//         id: 2,
//         command: "account_tx",
//         account: account,
//         ledger_index_min: -1,
//         ledger_index_max: -1,
//         binary: false,
//         limit: 2,
//         forward: false,
//       };

//       ws.onopen = () => {
//         ws.send(JSON.stringify(historyOffers));
//       };

//       ws.onmessage = function (event) {
//         const json = JSON.parse(event.data);
//         try {
//           if ((json.event = "data")) {
//             resolve(json);
//             ws.close();
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       };
//     } catch (error) {
//       console.log("error", error);
//     }
//   });
// };
