import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MenuIcon } from "../Icons";
import LogoHorizontal from "../assets/DBX-new.png";
import LogoutIcon from "@mui/icons-material/Logout";
import Modal from "./Modal";
import WalletConnect from "./WalletConnect";
import { useSelector, useDispatch } from "react-redux";
import { setModalOpen } from "../redux/actions";
import { setNetwork, setToken } from "../redux/network/action";
import DisconnectModal from "./Modal/DisconnectModal";
import TokenListDropDown from "./TokenListDropDown";

const Header = ({ openSidebar, setOpenSidebar, setSelectedToken }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [walletData, setWalletData] = useState(null);

  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  const balance = useSelector(state => state.signInData?.balance);
  const network = useSelector(state => state.networkReducers.token);

  //prepring user id string
  const accountStr = balance?.account;
  let dottedStr = accountStr?.substr(0, 5) + "..." + accountStr?.substr(accountStr?.length - 4);

  const onHide = () => {
    setModalShow(false);
  };

  const handelDisconnect = () => {
    setWalletData(balance?.account)
    setModalShow(true);
  };

  // Enhanced network selection handler
  const handleNetworkSelection = (selectedNetwork) => {
    console.log('Network selected:', selectedNetwork);
    
    // Update Redux state with new network
    dispatch(setNetwork(selectedNetwork.value));
    dispatch(setToken(selectedNetwork.value));
    
    // Update local state if needed
    if (setSelectedToken) {
      setSelectedToken(selectedNetwork);
    }
    
    // Force re-render of components that depend on network state
    window.dispatchEvent(new CustomEvent('networkChanged', { 
      detail: { network: selectedNetwork.value } 
    }));
  };

  const navList = [
    { id: 1, title: "Home", slug: "/", icon: "" },
    { id: 2, title: "Buy/Sell", slug: "/buysell", icon: "" },
    { id: 3, title: "Exchange", slug: "/exchange", icon: "" },
    { id: 4, title: "Swap", slug: "/swap", icon: "" },
    { id: 5, title: "NFT", slug: "/nft", icon: "" },
  ];

  const handleClickOpen = () => {
    dispatch(setModalOpen(true));
    setOpen(true);
  };

  return (
    <div className="header-cmp flex items-center">
      <div className="wrapWidth wrap flex items-center">
        <div className="hdr-left flex items-center">
          <Link to="/">
            <img src={LogoHorizontal} className="logo-img" />
          </Link>

          <div
            className="menu-icon"
            onClick={e => {
              setOpenSidebar(!openSidebar);
              e.stopPropagation();
            }}>
            <MenuIcon />
          </div>
        </div>
        <div className="hdr-center flex items-center justify-center">
          <div className="nav-list flex aic">
            {navList.map((item, index) => (
              <NavLink
                key={index}
                to={`${item.slug}`}
                exact
                onClick={e => setActiveTab(item.title)}
                className={`li-item flex aic ${activeTab === item.title ? "active1" : ""}`}>
                {item.title}
                {item.icon && <div className="ico">{item.icon}</div>}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="hdr-right flex items-center justify-center gap-3">
          <div className="token-selection flex items-center">
            <TokenListDropDown 
              network={network} 
              setSelectedValue={handleNetworkSelection} 
            />
          </div>
          {isWalletConnected ? (
            balance?.success ? (
              <>
                <div className={dottedStr !== "undefined...undefined" && "mainbtnn btn button cleanbtn"}>
                  {dottedStr !== "undefined...undefined" && (
                    <>
                      <div className="xpr33">
                        <p>{dottedStr}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="disconnect-wallet btn button cleanbtn ml-4" onClick={handelDisconnect}>
                  <LogoutIcon fontSize="small" className="logout-icon " />
                </div>
              </>
            ) : (
              <button className="btn button cleanbtn" onClick={() => handleClickOpen()}>
                Connect Wallet
              </button>
            )
          ) : (
            <button className="btn button cleanbtn" onClick={() => handleClickOpen()}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <WalletConnect network={network} open={open} setOpen={setOpen} />
        </Modal>
      )}
      {modalShow && <DisconnectModal show={handelDisconnect} onHide={onHide} walletData={walletData}/>}
    </div>
  );
};

export default Header;
  return (
    <div className="header-cmp flex items-center">
      <div className="wrapWidth wrap flex items-center">
        <div className="hdr-left flex items-center">
          <Link to="/">
            <img src={LogoHorizontal} className="logo-img" />
          </Link>

          <div
            className="menu-icon"
            onClick={e => {
              setOpenSidebar(!openSidebar);
              e.stopPropagation();
            }}>
            {/* <NetworksSelection network={network} /> */}

            <MenuIcon />
          </div>
        </div>
        <div className="hdr-center flex items-center justify-center">
          <div className="nav-list flex aic">
            {navList.map((item, index) => (
              <NavLink
                key={index}
                to={`${item.slug}`}
                exact
                onClick={e => setActiveTab(item.title)}
                className={`li-item flex aic ${activeTab === item.title ? "active1" : ""}`}>
                {item.title}
                {item.icon && <div className="ico">{item.icon}</div>}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="hdr-right flex items-center justify-center gap-3">
          {/* {!generalReducers?.isAuthenticated ? (
            <button className="btn button cleanbtn" onClick={e => setOpen(true)}>
              Connect Wallet
            </button>
          ) : (
            <h1 style={{ color: "white" }}>{user?.firstname ? user?.firstname : "No name"}</h1>
          )} */}
          <div className="token-selection flex items-center">
            <TokenListDropDown network={network} setSelectedValue={setSelectedToken} />
          </div>
          {isWalletConnected ? (
            balance?.success ? (
              <>
                <div className={dottedStr !== "undefined...undefined" && "mainbtnn btn button cleanbtn"}>
                  {/* <div>
                    <p className="xpr1">{balance?.balance}</p>
                  </div> */}

                  {dottedStr !== "undefined...undefined" && (
                    <>
                      {/* <div>
                        <p className="xpr1">XRP</p>
                      </div> */}
                      <div className="xpr33">
                        <p>{dottedStr}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="disconnect-wallet btn button cleanbtn ml-4" onClick={handelDisconnect}>
                  <LogoutIcon fontSize="small" className="logout-icon " />
                </div>
              </>
            ) : (
              <button className="btn button cleanbtn" onClick={() => handleClickOpen()}>
                Connect Wallet
              </button>
            )
          ) : (
            <button className="btn button cleanbtn" onClick={() => handleClickOpen()}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <WalletConnect network={network} open={open} setOpen={setOpen} />
        </Modal>
      )}
      {modalShow && <DisconnectModal show={handelDisconnect} onHide={onHide} walletData={walletData}/>}
    </div>
  );
};

export default Header;
