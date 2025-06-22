import axios from "axios";

// conversio rate 
export const covertXrpToUsd = async (xrp) => {

    let usdRate = 0;
    let xrpRate = Number(xrp);
    try {
        const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=XRP&tsyms=USD');
        const data = res.data;
        usdRate = data?.USD;

        let convertedRate = xrpRate * Number(usdRate);
        console.log(xrpRate, usdRate, convertedRate);
        return convertedRate;

    }catch(e) {
        console.log(e);
    }
}