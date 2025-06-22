import QRCode from "react-qr-code";
import { useState, useEffect } from "react";
import { connectWallet } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useSocket } from "../../context/socket";
import * as balanceAction from "../../redux/xummBalance/action";
import { toast } from "react-toastify";
import { CrossIcon } from "../../Icons";
import { addWalletData } from "../../api/executers/wallet";
import axios from "axios";
import setAuthToken from "../../redux/actions/setHeaderToken";

const StellarWalletConnect = ({ setOpen }) => {
  const [uri, setUri] = useState(null);
  const dispatch = useDispatch();
  const socket = useSocket();

  const connectXlmWallet = async () => {
    socket.emit("xlm-qr-code");
    socket.off("qr-app-response");
    socket.off("connect-error");
    socket.off("account-response");
    socket.off("wallet_disconnect");
    socket.on("qr-app-response", args => {
      setUri(args);
    });

    socket.on("connect-error", args => {
      console.log("connect-error", args);
      toast.error("Error in connect wallet.");
      setOpen(false);
    });

    socket.on("account-response", args => {
      dispatch(balanceAction.setBalance(args));
      toast.success("Wallet connected successfully."); 
      if (args) {
        dispatch(connectWallet(true));
        // handleWalletData(args)
        Verifywallet(args?.userToken);
        setOpen(false);
      }
    });


    socket.on("wallet_disconnect", (args) => {
      dispatch(balanceAction.setBalance(null)); 
      dispatch(connectWallet(false));
      toast.warning("Wallet disconnected.");
    });

    socket.on("connection");
  };

  const openApp = async () => {
  };
  const close = async () => {
    setOpen(false)
  };
  useEffect(() => {
    connectXlmWallet();
  }, []);


  const handleWalletData = async (args) => { 
    let payload = {
      wallet_address: args?.account,
      access_token: args?.userToken,
      provider: "lobstr" 
    }
    try {
      const resp = await addWalletData(payload)
      if(resp){
        console.log("wallet connected");
      }

    } catch (error) {
      console.error(error);
    }
  }

  const Verifywallet = async (wallet, userToken) => {
    console.log("Verifywallet", { wallet, userToken });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/Accounts/verifyWallet`, {
        wallet: wallet,
        usertoken: userToken,
        provider: "LOBSTR"
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
    <div className="p-8 bg-white">
      <div onClick={close} className="absolute right-2 top-2">
        <CrossIcon />
      </div>
      <span className="font-bold mb-2 text-lg">Connect using LOBSTR</span>

      <div className="desc mt-2 mb-1">Scan QR code to connect</div>
      {uri ? (
        <QRCode size={240} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={uri} viewBox={`0 0 256 256`} />
      ) : (
        "Loading..."
      )}
      <button onClick={openApp} class="mt-4 bg-green w-full text-gray-800 p-2 font-semibold  border border-green-400 rounded">
        Open LOBSTR App{" "}
      </button>
    </div>
  );
};

export default StellarWalletConnect;
