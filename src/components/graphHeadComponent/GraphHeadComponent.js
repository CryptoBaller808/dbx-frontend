import React, { useEffect, useState } from "react";
import { getTickersData } from "../../helper";
import clsx from "clsx";
import ThemeSwitch from "../theme-switch";
import { useSelector } from "react-redux";

const GraphHeadComponent = ({ currencyData2 }) => {
  const price = currencyData2?.info?.price;
  const title = currencyData2?.info?.title;
  const stat = currencyData2?.info?.stat;
  const [tickersData, setTickersData] = useState(null);
  const tempCurrency = title && title.split("/");
  const currentCurrency = tempCurrency?.length && tempCurrency[0];
  const baseCurrency = tempCurrency?.length && tempCurrency[1];
  const network = useSelector(state => state.networkReducers.token);
  console.log("network====>", network);

  useEffect(() => {
    async function fetchData() {
      if (currencyData2?.info) {
        let tickersInput = {
          symbols: [
            `${currencyData2.info.curA}/${
              currencyData2.info.curB === "SOLO" ? "534F4C4F00000000000000000000000000000000" : currencyData2.info.curB
            }+${currencyData2.info.issuerB}`,
          ],
        };
        getTickersData({ acc: tickersInput, network })
          .then(res => {
            if (res.data.success) {
              const apiResult = res.data.data;
              const data = Object.values(apiResult)[0];
              console.log("api result", apiResult);
              setTickersData(data);
              let hrChange = (data?.high_price - data?.low_price) / 100;
              console.log(hrChange);
            }
          })
          .catch(err => console.log("FROM SERVER CHART HEAD ERR", err));
        const acc = {
          curA: currencyData2?.info?.curA,
          curB: currencyData2?.info?.curB === "SOLO" ? "534F4C4F00000000000000000000000000000000" : currencyData2?.info?.curB,
          issuerB: currencyData2?.info?.issuerB,
        };
        // await getTradesData(acc)
        //   .then(res => {
        //     if (res.data.success) {
        //       // console.log("FROM SERVER CHART DATA ----------->", res.data.data);
        //       console.log("PARSED ARRAY :: ", res.data.data);
        //     } else {
        //     }
        //   })
        //   .catch(err => console.log("CHART DATA", err));
      }
    }
    fetchData();
  }, [currencyData2]);

  return (
    <div className="p-2 border-1 border-green rounded-lg flex items-center w-full bg-white">
      <div className=" flex w-full gap-4">
        <div className="font-bold flex items-center text-black">{title}</div>
        <div className=" flex gap-4 text-grey-70 text-sm font-thin ">
          <div className="item flex items-center justify-center flex-col">
            <div>Price</div>
            <div
              className={clsx("", {
                "text-red-500": stat < 0,
                "text-green-500": stat >= 0,
              })}>
              {isNaN(price) ? "--" : parseFloat(price).toFixed(5)}
            </div>
          </div>
          <div className="item flex items-center justify-center flex-col">
            <div>24h Chg</div>
            <div
              className={clsx("text-sm", {
                "text-red-500": stat < 0,
                "text-green-500": stat >= 0,
              })}>
              {isNaN(stat)?"0.00":parseFloat(stat).toFixed(3)}%
            </div>
          </div>
          <div className="item flex items-center  justify-center flex-col">
            <div>24h High</div>
            <div className="text-black">{Number(tickersData?.high_price || 0).toFixed(4) || 0}</div>
          </div>
          <div className="item flex items-center justify-center flex-col">
            <div>24h Vol({currentCurrency})</div>
            <div className="text-black">{Number(tickersData?.volume || 0)?.toFixed(4) || 0}</div>
          </div>
          <div className="item flex items-center  justify-center flex-col">
            <div>24h Vol({baseCurrency})</div>
            <div className="text-black">{Number(tickersData?.inverted_volume || 0)?.toFixed(4) || 0}</div>
          </div>
        </div>
      </div>
      <ThemeSwitch />
    </div>
  );
};

export default GraphHeadComponent;
