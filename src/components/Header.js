import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MenuIcon } from "../Icons";
import LogoHorizontal from "../assets/DBX-new.png";
import LogoutIcon from "@mui/icons-material/Logout";
import Modal from "./Modal";
import WalletConnect from "./WalletConnect";
import { useSelector, useDispatch } from "react-redux";
import { setModalOpen } from "../redux/actions";
import { setToken } from "../redux/network/action";
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

  //prepring user id string
  const accountStr = balance?.account;
  let dottedStr = accountStr?.substr(0, 5) + "..." + accountStr?.substr(accountStr?.length - 4);

  const network = useSelector(state => state.networkReducers.token);

  const onHide = () => {
    setModalShow(false);
  };

  const handelDisconnect = () => {
    setWalletData(balance?.account)

    // dispatch(balanceAction.setBalanceEmpty());
    setModalShow(true);
  };
  // const { generalReducers, user } = useSelector(state => state);
  // console.log("generalReducers", generalReducers);
  //is wallet is connected or not
  const navList = [
    { id: 1, title: "Home", slug: "/", icon: "" },
    { id: 2, title: "Buy/Sell", slug: "/buysell", icon: "" },
    { id: 3, title: "Exchange", slug: "/exchange", icon: "" },
    { id: 4, title: "Swap", slug: "/swap", icon: "" },
    { id: 5, title: "NFT", slug: "/nft", icon: "" },
   {/*} { id: 5, title: "NFT", slug: "/nft", icon: "" },
    { id: 2, title: "Buy/Sell", slug: "/buysell", icon: "" },
    { id: 3, title: "Exchange", slug: "/exchange", icon: "" },
    { id: 4, title: "Swap", slug: "/swap", icon: "" },
    { id: 5, title: "NFT", slug: "/nft", icon: "" },
    {
      /*} { id: 5, title: "NFT", slug: "/nft", icon: "" },
    { id: 6, title: "Orders", slug: "/orders", icon: <DropDownIcon /> },
    { id: 7, title: "DBX Coin", slug: "/dbx_coin", icon: "" },
  { id: 8, title: "DBX Card", slug: "/dbx_card", icon: "" },*/
    },
  ];
  const handleClickOpen = () => {
    //if (location.pathname === "/exchange") {
    dispatch(setModalOpen(true));
    setOpen(true);
    //}
  };

  const handleNetworkSelection = (selectedNetwork) => {
    // Update local state
    if (setSelectedToken) {
      setSelectedToken(selectedNetwork);
    }
    // Update global Redux state
    dispatch(setToken(selectedNetwork.value));
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
            <TokenListDropDown network={network} setSelectedValue={handleNetworkSelection} />
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
