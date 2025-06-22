import React, { useState, useEffect } from "react";
import { CrossIcon } from "../../Icons";
import axios from "axios";
import { useSelector, useDispatch, connect } from "react-redux";

import { setModalOpen, connectWallet } from "../../redux/actions";
import * as balanceAction from "../../redux/xummBalance/action";
import * as QRCodeAction from "../../redux/xummQRCode/action";
// import setAuthToken from "../../redux/actions/setHeaderToken";
import { useSocket } from "../../context/socket";
import XummLogo from "../../Images/XummLogo.png";
import LegerLogo from "../../Images/XRPLLogo.png";
import setAuthToken from "../../redux/actions/setHeaderToken";
import { toast } from "react-toastify";
const WalletConnect = ({ open, setOpen }) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const [loading, setloading] = useState();
  const [xumppres, setxumppres] = useState("");
  const QRCodeResponse = useSelector(state => state.QRCodeReducer.QRcode);
  const [xummUrlMobile, setXummUrlMobile] = useState();

  const [qRCodeImage, setQRCodeImage] = useState(QRCodeResponse);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, []);

  const connectXumppwallet = async () => {
    setloading(true);
    socket.emit("xumm-qr-code");
    if (qRCodeImage == null) {
      socket.on("qr-response", args => {
        console.log("qr-response", args);
        dispatch(QRCodeAction.setQRCode(args));
        setQRCodeImage(args);
      });
    }

    socket.on("qr-app-response", args => {
      console.log("qr app resp", args);
      const decodedPayload = decodeURIComponent(args);
      setXummUrlMobile(decodedPayload);
      console.log("decoded payload", decodedPayload);
    });

    socket.on("account-response", args => {
      console.log("account-responsee", args);

      if (args?.success) {
        dispatch(balanceAction.setBalance(args));
        setxumppres(args);
        Verifywallet(args.account, args?.userToken);
        if (args) {
          dispatch(connectWallet(true));
        }
      } else {
        toast.error("Wallet connect request rejected.");
      }

      setOpen(false);
    });

    socket.on("connection");
  };

  const Verifywallet = async (wallet, userToken) => {
    console.log("Verifywallet", { wallet, userToken });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/Accounts/verifyWallet`, {
        wallet: wallet,
        usertoken: userToken,
      });
      console.log("Verifywallet res22", res);
      if (res?.data == "User Haven't resolved the sign in request yet.") {
        return alert("Please scan qr code through xumpp app");
      } else {
        dispatch(connectWallet(true));
        setOpen(false);
      }
      let data = res?.data;

      if (res) {
        setAuthToken(data.access_token);
      }

      localStorage.setItem("nft_login", JSON.stringify(data));
      const res2 = await axios.get(`${process.env.REACT_APP_API_URL}/profiles/getuserProfile/${data.id}`);

      if (res2?.data) {
        dispatch({
          type: "GET_USER",
          payload: { ...data, ...res2.data },
        });
        setOpen(false);
      }
    } catch (error) {}
  };

  return (
    <div className="wallet-connect flex flex-col">
      <div className="wrap flex flex-col">
        {qRCodeImage ? (
          <>
            <div className="hdr flex aic">
              <div className="lbl">Connect using XUMM</div>
              <div className="ico flex aic jc pointer" onClick={e => setOpen(false)}>
                <CrossIcon />
              </div>
            </div>
            <div className="desc">Scan QR code to connect</div>
            <div className="action flex flex-col">
              <div className="avil-wallet flex flex-col aic jc">
                <div className="btn flex aic jc">
                  <img style={{ width: 140, height: 140 }} src={qRCodeImage} className="img flex aic" />
                  <p className="lbl flex aic">QR scanned?</p>
                </div>
              </div>
              {/* <div className="new-wallet flex flex-col aic jc">
                <div className="qt-lbl"></div>
                <div onClick={Verifywallet} className="btn button">
                  QR scanned?
                </div>
              </div> */}
              <div className="new-wallet flex flex-col aic jc">
                <div className="qt-lbl"></div>
                {/* <div onClick={Verifywallet} className="btn button">
                  Qr scanned ?
                </div> */}
                <a href={`${xummUrlMobile}`} target="_blank" className="btn button">
                  Open XUMM App
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="hdr flex aic">
              <div className="lbl"></div>
              <div className="ico flex aic jc pointer" onClick={e => setOpen(false)}>
                <CrossIcon />
              </div>
            </div>
            <div className="desc headss">Select a Wallet</div>
            <div className="action flex flex-col">
              <div className="avil-wallet flex flex-col aic jc">
                <div class="field flex input-search">
                  <input type="text" class="txt search" placeholder="Search name or paste address" value="" />
                </div>
                <div
                  onClick={() => {
                    connectXumppwallet();
                  }}
                  className="btn flex aic jc">
                  <img
                    src={XummLogo}
                    className="img flex aic"
                    alt="xumm logo"
                    style={{ width: "40px", height: "40px", marginRight: "5px" }}
                  />
                  <p className="lbl  aic">
                    {loading ? "loading..." : "XUMM App"}
                    {/*<small>XUMM App</small>*/}
                  </p>
                </div>
                {/* <div className="btn flex aic jc">
                  <img src={LegerLogo} className="img flex aic" alt="leger logo" style={{width:"40px", height: "40px", marginRight: "5px" }} />
                  <p className="lbl  aic">XRP <small>XRP</small></p>
                  <p className="lbl  aic">Ledger Device</p>
                </div> */}
              </div>
              {/* <div className="new-wallet flex flex-col aic jc">
                <div className="qt-lbl">Don’t have a wallet?</div>
                <div className="btn button">Create New Wallet</div>
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
