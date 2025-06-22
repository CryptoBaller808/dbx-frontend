import React from "react";
import ConductComponent from "../../components/conductComponent/ConductComponent";
import CryptoComponent from "../../components/crypto-component/CryptoComponent";
import HourComponent from "../../components/hourComponent/HourComponent";
import TradingComponent from "../../components/tradingComponent/TradingComponent";
import AccountComponent from "../../components/accountComponent/AccountComponent";
import "./style.css";
import Analytics from "../../components/analyticsComponent/analytics";
import Tables from "../../components/tableComponent/table1";
import Analytic2 from "../../components/analytic2/Analytic2";
function LandingPage() {
  return (
    <div>
      <CryptoComponent />
      {/*<Analytics />*/}
      {/* <Analytic2 /> */}
      {/*<Tables />*/}
      <TradingComponent />
      {/* I himself commit just for test */}
      {/* <HourComponent /> */}
      <ConductComponent />
      <AccountComponent />
    </div>
  );
}

export default LandingPage;
