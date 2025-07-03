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
  const [loading, setloading] = useState(false);
  const [xumppres, setxumppres] = useState("");
  const QRCodeResponse = useSelector(state => state.QRCodeReducer.QRcode);
  const [xummUrlMobile, setXummUrlMobile] = useState();
  const [qRCodeImage, setQRCodeImage] = useState(QRCodeResponse);
  const [connectionError, setConnectionError] = useState(null);
  const [connectionTimeout, setConnectionTimeout] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, [open, connectionTimeout]);

  // Reset states when modal opens
  useEffect(() => {
    if (open) {
      setConnectionError(null);
      setloading(false);
    }
  }, [open]);

  const connectXumppwallet = async () => {
    try {
      setloading(true);
      setConnectionError(null);
      
      // Clear any existing timeout
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      
      // Set a timeout for the connection attempt
      const timeout = setTimeout(() => {
        setloading(false);
        setConnectionError("Connection timeout. Please try again or check your internet connection.");
        toast.error("Connection timeout. Please try again.");
        
        // Clean up socket listeners
        socket.off("qr-response");
        socket.off("qr-app-response");
        socket.off("account-response");
        socket.off("connect_error");
      }, 15000); // Reduced to 15 seconds for better UX
      
      setConnectionTimeout(timeout);

      // Clean up any existing listeners before adding new ones
      socket.off("qr-response");
      socket.off("qr-app-response");
      socket.off("account-response");
      socket.off("connect_error");

      socket.emit("xumm-qr-code");
      
      if (qRCodeImage == null) {
        socket.on("qr-response", args => {
          console.log("qr-response", args);
          
          // Clear timeout when we get QR code
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            setConnectionTimeout(null);
          }
          
          if (args) {
            dispatch(QRCodeAction.setQRCode(args));
            setQRCodeImage(args);
            setloading(false);
            
            // Set a new timeout for QR code scanning
            const scanTimeout = setTimeout(() => {
              setConnectionError("QR code scan timeout. Please try again.");
              toast.error("QR code scan timeout. Please try again.");
            }, 60000); // 60 seconds for QR scanning
            
            setConnectionTimeout(scanTimeout);
          } else {
            setloading(false);
            setConnectionError("Failed to generate QR code. Please try again.");
            toast.error("Failed to generate QR code");
          }
        });
      } else {
        setloading(false);
        
        // If QR code already exists, set timeout for scanning
        const scanTimeout = setTimeout(() => {
          setConnectionError("QR code scan timeout. Please try again.");
          toast.error("QR code scan timeout. Please try again.");
        }, 60000);
        
        setConnectionTimeout(scanTimeout);
      }

      socket.on("qr-app-response", args => {
        console.log("qr app resp", args);
        try {
          const decodedPayload = decodeURIComponent(args);
          setXummUrlMobile(decodedPayload);
          console.log("decoded payload", decodedPayload);
        } catch (error) {
          console.error("Error decoding XUMM URL:", error);
          setConnectionError("Error processing XUMM app link");
          toast.error("Error processing XUMM app link");
        }
      });

      socket.on("account-response", args => {
        console.log("account-responsee", args);
        
        // Clear timeout when we get a response
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          setConnectionTimeout(null);
        }
        
        setloading(false);

        if (args?.success) {
          dispatch(balanceAction.setBalance(args));
          setxumppres(args);
          Verifywallet(args.account, args?.userToken);
          if (args) {
            dispatch(connectWallet(true));
          }
        } else {
          setConnectionError("Wallet connection request was rejected or failed");
          toast.error("Wallet connect request rejected or failed.");
        }
      });

      // Handle socket connection errors
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setloading(false);
        setConnectionError("Connection error. Please check your internet connection and try again.");
        toast.error("Connection error. Please try again.");
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          setConnectionTimeout(null);
        }
      });

    } catch (error) {
      console.error("Error connecting to XUMM:", error);
      setloading(false);
      setConnectionError("Failed to connect to XUMM wallet. Please try again.");
      toast.error("Failed to connect to XUMM wallet");
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }
    }
  };
          setConnectionTimeout(null);
        }
        
        setloading(false);

        if (args?.success) {
          dispatch(balanceAction.setBalance(args));
          setxumppres(args);
          Verifywallet(args.account, args?.userToken);
          if (args) {
            dispatch(connectWallet(true));
          }
        } else {
          setConnectionError("Wallet connection request was rejected");
          toast.error("Wallet connect request rejected.");
        }
      });

      // Handle socket connection errors
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setloading(false);
        setConnectionError("Connection error. Please check your internet connection.");
        toast.error("Connection error. Please try again.");
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          setConnectionTimeout(null);
        }
      });

      socket.on("connection");
    } catch (error) {
      console.error("Error connecting to XUMM:", error);
      setloading(false);
      setConnectionError("Failed to connect to XUMM wallet");
      toast.error("Failed to connect to XUMM wallet");
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }
    }
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
        setConnectionError("Please scan QR code through XUMM app");
        return;
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
    } catch (error) {
      console.error("Error verifying wallet:", error);
      setConnectionError("Failed to verify wallet connection");
      toast.error("Failed to verify wallet connection");
    }
  };

  const handleRetry = () => {
    setConnectionError(null);
    setQRCodeImage(null);
    dispatch(QRCodeAction.setQRCode(null));
    connectXumppwallet();
  };

  const handleClose = () => {
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
      setConnectionTimeout(null);
    }
    setloading(false);
    setConnectionError(null);
    setOpen(false);
  };

  return (
    <div className="wallet-connect flex flex-col">
      <div className="wrap flex flex-col">
        {qRCodeImage ? (
          <>
            <div className="hdr flex aic">
              <div className="lbl">Connect using XUMM</div>
              <div className="ico flex aic jc pointer" onClick={handleClose}>
                <CrossIcon />
              </div>
            </div>
            <div className="desc">Scan QR code to connect</div>
            
            {connectionError && (
              <div className="error-message" style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
                {connectionError}
                <button onClick={handleRetry} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                  Retry
                </button>
              </div>
            )}
            
            <div className="action flex flex-col">
              <div className="avil-wallet flex flex-col aic jc">
                <div className="btn flex aic jc">
                  <img style={{ width: 140, height: 140 }} src={qRCodeImage} className="img flex aic" />
                  <p className="lbl flex aic">QR scanned?</p>
                </div>
              </div>
              <div className="new-wallet flex flex-col aic jc">
                <div className="qt-lbl"></div>
                {xummUrlMobile && (
                  <a href={`${xummUrlMobile}`} target="_blank" rel="noopener noreferrer" className="btn button">
                    Open XUMM App
                  </a>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="hdr flex aic">
              <div className="lbl"></div>
              <div className="ico flex aic jc pointer" onClick={handleClose}>
                <CrossIcon />
              </div>
            </div>
            <div className="desc headss">Select a Wallet</div>
            
            {connectionError && (
              <div className="error-message" style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
                {connectionError}
                <button onClick={handleRetry} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                  Retry
                </button>
              </div>
            )}
            
            <div className="action flex flex-col">
              <div className="avil-wallet flex flex-col aic jc">
                <div className="field flex input-search">
                  <input type="text" className="txt search" placeholder="Search name or paste address" value="" />
                </div>
                <div
                  onClick={() => {
                    if (!loading) {
                      connectXumppwallet();
                    }
                  }}
                  className={`btn flex aic jc ${loading ? 'loading' : ''}`}
                  style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  <img
                    src={XummLogo}
                    className="img flex aic"
                    alt="xumm logo"
                    style={{ width: "40px", height: "40px", marginRight: "5px" }}
                  />
                  <p className="lbl aic">
                    {loading ? "Connecting..." : "XUMM App"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
