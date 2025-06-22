import axios from "axios";
import { GET_STELLAR_LIVE_PRICES } from "./url";
import { ApiCall } from "../index";
import { GET_TICKERS } from "./url";

const getExchangeRate = data => {
  return new Promise(async (resolve, reject) => {
    const curA = data.curA;
    const issuerA = data.issuerA;
    const curB = data.curB;
    const issuerB = data.issuerB;
    if (data.mainToken === "XLM") {
      const resp = await ApiCall(`${GET_STELLAR_LIVE_PRICES}?ledger=xlm`, "get");   
      if (resp.data && resp.data.success) {
        resolve(resp.data.data);
      } else {
        resolve([]);
      }
    } else {
      if (curA === "XRP") {  
        const resp = await ApiCall(`${GET_STELLAR_LIVE_PRICES}?ledger=xrp`, "get");   
        if (resp.data && resp.data.success) {
          resolve(resp.data.data);
        } else {
          resolve([]);
        }
        // let data = {
        //   acc: {
        //     symbols: [`${curA}/${curB === "SOLO" ? "534F4C4F00000000000000000000000000000000" : curB}+${issuerB}`],
        //   },
        // };
 
        // ApiCall(GET_TICKERS, "post", data)
        //   .then(res => {
        //     let data = res.data;
        //     let result = Object.values(data?.data)[0];
        //     resolve(result?.last_price); 
        //   })
        //   .catch(reject);
        // axios
        //   .get(`${process.env.REACT_APP_XRP_PAIR_PRICE}${curA}:${curB}.${issuerB}`) // XRP:CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr
        //   .then(res => {
        //     if (res.data.result === "success") {
        //       resolve(res.data.rate);
        //     }
        //   })
        //   .catch(err => console.log("err", err));
      } else if (curB === "XRP") {
        axios
          .get(`${process.env.REACT_APP_XRP_PAIR_PRICE}${curA}.${issuerA}:${curB}`)
          .then(res => {
            if (res.data.result === "success") {
              resolve(res.data.rate);
            }
          })
          .catch(err => console.log("err", err));
      } else {
        axios
          .get(`${process.env.REACT_APP_XRP_PAIR_PRICE}${curA}.${issuerA}:${curB}.${issuerB}`)
          .then(res => {
            if (res.data.result === "success") {
              resolve(res.data.rate);
            }
          })
          .catch(err => console.log("err", err));
      }
    }
  });
};

export default getExchangeRate;
