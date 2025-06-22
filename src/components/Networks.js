import { Popover, Input } from "antd";
import xmlLogo from "../assets/XLM.svg";
import xrpLogo from "../assets/XRP.svg";
import { useState, useMemo, useCallback, useRef } from "react";
import { SearchOutlined, DownCircleFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setNetwork } from "../redux/network/action";
import { connectWallet, logoutUser } from "../redux/actions";
import * as balanceAction from "../redux/xummBalance/action";
import * as QRCodeAction from "../redux/xummQRCode/action";
import * as accountOfferAction from "../redux/accountOffers/action";
import * as historyOfferAction from "../redux/historyOffers/action";

const mapping = {
  xrp: { label: "XRP Ledger", icon: xmlLogo },
  xlm: { label: "XLM Network", icon: xrpLogo },
};

const getImage = (src, alt) => <img src={src} alt={alt} width="30" height="30" />;

const items = Object.keys(mapping).map(key => ({ ...mapping[key], key, icon: getImage(mapping[key].icon, mapping[key].label) }));

const Item = ({ item, onClick }) => (
  <div onClick={onClick} className="flex py-2 px-1 items-center cursor pointer hover:bg-[#eee] w-full">
    {item.icon}&nbsp;&nbsp;
    <span className="font-semibold">{item.label}</span>
  </div>
);

const NetworkSelector = ({ network }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const disconnectWallet = () => {
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
  };

  const doSearch = evt => {
    setQuery(evt.target.value);
  };

  const handleMenuClick = useCallback(
    selected => () => {
      disconnectWallet();
      dispatch(setNetwork(selected.key));
      setOpen(false);
    },
    [disconnectWallet],
  );

  const renderItem = useCallback(item => <Item key={item.key} item={item} onClick={handleMenuClick(item)} />, [handleMenuClick]);

  const options = useMemo(() => items.filter(i => i.label.toLowerCase().includes(query.toLowerCase())), [query]);

  const text = (
    <div className="py-2">
      <Input onChange={doSearch} placeholder="Search Network" prefix={<SearchOutlined />} />{" "}
    </div>
  );

  const content = useMemo(() => <div className="w-[230px]">{options.map(renderItem)}</div>, [options, renderItem]);

  const selected = useMemo(() => mapping[network], [network]);

  return (
    <Popover open={open} placement="bottom" title={text} content={content} arrow={false}>
      <div
        onClick={() => setOpen(true)}
        className="w-[200px] h-[44px] bg-[#8F8F8F] px-1 border-4 border-[#39B54A] flex rounded-full items-center justify-between font-semibold mx-3 cursor-pointer">
        <span className="flex items-center">
          {getImage(selected.icon, selected.label)}&nbsp;&nbsp;
          {selected.label}
        </span>
        &nbsp;&nbsp; &nbsp;&nbsp;
        <DownCircleFilled style={{ color: "white", fontSize: 20 }} />
      </div>
    </Popover>
  );
};

export default NetworkSelector;
