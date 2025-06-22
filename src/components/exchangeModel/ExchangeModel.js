import React, { useState } from "react";
import "./style.css";
import SwapComponent from "../../components/swapComponent/SwapComponent";

import { Tabs } from "antd";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import XummLogo from "./../../Images/XummLogo.png";
import LedgerLogo from "./../../Images/LedgerLogo.png";
import axios from "axios";
const MethodButton = styled(Button)({
  backgroundColor: "#E7E8EA4D",
  border: "1px solid #E7E8EA4D",
  color: "#000",
  width: "100%",
  margin: "5px",
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  flexDirection: "column",
  height: "56px",
});

const ActionButton = styled(Button)({
  background: "linear-gradient(to right, #A7D63FE5, #39B54A, #9FD340)",
  border: "none",
  color: "#fff",
  width: "100%",
  margin: "5px",
  display: "flex",
  justifyContent: "space-evenly",
  flexDirection: "column",
  height: "56px",
  borderRadius: "12px",
});

const TokenButton = styled(Button)({
  backgroundColor: "#E7E8EA4D",
  border: "1px solid #E7E8EA4D",
  color: "#000",
  width: "100%",
  margin: "5px",
  padding: "0px 20px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "row",
  height: "56px",
});

const InsufficientBalanceButton = styled(Button)({
  backgroundColor: "#E7E8EA4D",
  border: "none",
  color: "#000",
  width: "100%",
  margin: "5px",
  display: "flex",
  justifyContent: "space-evenly",
  flexDirection: "column",
  height: "56px",
  borderRadius: "12px",
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    width: "373px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
    width: "373px",
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  const [loading,setloading] = useState()
  const [xumppres,setxumppres] = useState('')
  console.log('res22',res)
  const connectXumppwallet = async ()  => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/Accounts/connectwallet`)
    console.log('res22',res)
    if(res){
      setxumppres(res?.data)
    }
  }

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const { TabPane } = Tabs;
function Swap() {
  const [walletConnected, setWalletConnected] = React.useState(false);
  return (
    <div>
      <Tabs className="pdngbtm" defaultActiveKey="1" centered size="large">
        <TabPane tab="Swap" key="1">
          <SwapComponent
            walletConnected={walletConnected}
            setWalletConnected={setWalletConnected}
          />
        </TabPane>
      </Tabs>
      <BootstrapDialog
        onClose={() => setWalletConnected(false)}
        aria-labelledby="customized-dialog-title"
        open={walletConnected}
      >
        {
          xumm_png ?
          <>
          <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={() => setWalletConnected(false)}
            >
              <h2>Select Wallet</h2>
            </BootstrapDialogTitle>
            <DialogContent style={{ minHeight: "300px", overflowX: "hidden" }}>
              <p style={{ color: "#8F8F80", fontSize: "12px" }}>
                Please scan this qr code from mobile app:
              </p>
              <MethodButton>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    width: "60%",
                  }}
                >
                  <img
                    src={xumppres?.xumm_png}
                    alt=""
                    style={{ width: "20px", height: "20px", marginRight: "5px" }}
                  />
                </div>
              </MethodButton>
            </DialogContent>
            <DialogActions>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <ActionButton autoFocus onClick={() => setWalletConnected(true)}>
                  <span style={{ fontSize: "18px", fontStyle: "bold" }}>
                    Qr scanned ?
                  </span>
                </ActionButton>
              </div>
            </DialogActions>
          </>
        :
        <>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={() => setWalletConnected(false)}
            >
              <h2>Select Wallet</h2>
            </BootstrapDialogTitle>
            <DialogContent style={{ minHeight: "300px", overflowX: "hidden" }}>
              <p style={{ color: "#8F8F80", fontSize: "12px" }}>
                Connect your wallet using one of the following methods:
              </p>
              <ActionButton
              onClick={connectXumppwallet}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    width: "60%",
                  }}
                >
                  <img
                    src={XummLogo}
                    alt=""
                    style={{ width: "20px", height: "20px", marginRight: "5px" }}
                  />
                  <span style={{ fontSize: "18px", fontStyle: "bold" }}>
                    XUMM App
                  </span>
                </div>
              </ActionButton>
              <MethodButton>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    width: "60%",
                  }}
                >
                  <img
                    src={LedgerLogo}
                    alt=""
                    style={{ width: "20px", height: "20px", marginRight: "5px" }}
                  />
                  <span style={{ fontSize: "18px", fontStyle: "bold" }}>
                    Ledger Device
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontStyle: "bold",
                    color: "red",
                    textAlign: "right",
                    width: "100%",
                  }}
                >
                  {" "}
                  Coming soon
                </span>
              </MethodButton>
            </DialogContent>
            <DialogActions>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <span style={{ color: "#8F8F80", fontSize: "12px" }}>
                  Don’t have a wallet?
                </span>
                <ActionButton autoFocus onClick={() => setWalletConnected(true)}>
                  <span style={{ fontSize: "18px", fontStyle: "bold" }}>
                    Create New Wallet
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontStyle: "bold",
                      color: "red",
                      textAlign: "right",
                      width: "100%",
                    }}
                  >
                    {" "}
                    Coming soon
                  </span>
                </ActionButton>
              </div>
            </DialogActions>
        </>
        }
      </BootstrapDialog>
    </div>
  );
}

export default Swap;
