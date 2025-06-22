import "./style.css";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { connectWallet, logoutUser } from "../../redux/actions";
import * as balanceAction from "../../redux/xummBalance/action";
import * as QRCodeAction from "../../redux/xummQRCode/action";
import * as accountOfferAction from "../../redux/accountOffers/action";
import * as historyOfferAction from "../../redux/historyOffers/action";
import { useNavigate } from "react-router-dom";
import { addWalletData } from "../../api/executers/wallet";
import { toast } from "react-toastify";

const DisconnectModal = props => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const disconnectWallet = () => {
   
    // handleWalletData(props.walletData)
    dispatch(balanceAction.setBalanceEmpty());
    dispatch(QRCodeAction.setQRCodeDisconnect());
    dispatch(connectWallet(false));
    //clear acc offers content

    dispatch(accountOfferAction.setAccountOffersProcessing(true));
    dispatch(accountOfferAction.setAccountOffers([]));
    dispatch(accountOfferAction.setAccountOffersProcessing(false));
    //clear history content
    dispatch(historyOfferAction.setHistoryOffersProcessing());
    dispatch(historyOfferAction.setHistoryOffers([]));
    dispatch(historyOfferAction.setStopHistoryOffersProcessing());
    localStorage.removeItem("nft_login");
    dispatch(logoutUser());
    navigate("/");
    props.onHide();
  };

  const handleWalletData = async (data) => {
    let payload = {
      wallet_address: data, 
    }
    try {
      const resp = await addWalletData(payload)
      if(resp){
        console.log("wallat disconnected");
        toast.success("Wallet disconnected."); 
      }

    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        {/* <Modal.Title id="contained-modal-title-vcenter">
          Disconnect Wallet
        </Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <h2>Are you sure you want to disconnect?</h2>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="modalbtn cancel-btn">
          Cancel
        </Button>
        <Button className="modalbtn disconnect-btn" onClick={disconnectWallet}>
          Disconnect
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default DisconnectModal;
