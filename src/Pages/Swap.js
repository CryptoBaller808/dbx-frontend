import { TokenIcon, DropDownIcon, ExchangeIcon, ExchangeArrowIcon, ArrowDownIcon } from "../Icons";
import Modal from "../components/Modal";
import WalletConnect from "../components/WalletConnect";
import Select from "react-select";
import currency from "../helper/currencies";
import { useSocket } from "../context/socket";
import { setModalOpen, connectWallet } from "../redux/actions";
import * as balanceAction from "../redux/xummBalance/action";
import * as QRCodeAction from "../redux/xummQRCode/action";
import { useSelector } from "react-redux";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";
import ReactModal from "react-bootstrap/Modal";
import ExchangeModalIcon from "../Images/exchange-color.png";
import SwapTransModal from "../components/loader/SwapTransModal";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";

const Swap = () => {
  const socket = useSocket();
  const [error, setError] = useState("");
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [swapData, setSwapData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  
  const dispatch = useDispatch();
  const balanceData = useSelector(state => state.signInData?.balance);
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  const networkData = useSelector(state => state.networkReducers);
  
  // Mock swap functionality for now
  const handleSwap = useCallback(async () => {
    if (!fromToken || !toToken || !fromAmount) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSwapData({
        from: { token: fromToken, amount: fromAmount },
        to: { token: toToken, amount: toAmount },
        rate: exchangeRate,
        timestamp: new Date().toISOString()
      });
      
      setShowModal(true);
      
      // Reset form
      setFromAmount("");
      setToAmount("");
      setExchangeRate(null);
    } catch (err) {
      setError("Swap failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [fromToken, toToken, fromAmount, toAmount, exchangeRate]);
  
  // Mock exchange rate calculation
  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const mockRate = Math.random() * 2 + 0.5; // Random rate between 0.5 and 2.5
      setExchangeRate(mockRate);
      setToAmount((parseFloat(fromAmount) * mockRate).toFixed(6));
    } else {
      setExchangeRate(null);
      setToAmount("");
    }
  }, [fromToken, toToken, fromAmount]);
  
  const tokenOptions = useMemo(() => [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'BNB', label: 'BNB (BNB)' },
    { value: 'XRP', label: 'XRP (XRP)' },
    { value: 'XLM', label: 'Stellar (XLM)' },
    { value: 'USDC', label: 'USD Coin (USDC)' },
    { value: 'USDT', label: 'Tether (USDT)' }
  ], []);

  return (
    <div className="swap-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="swap-card">
              <div className="swap-header">
                <h3>Token Swap</h3>
                <p>Swap tokens across different networks</p>
              </div>
              
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              
              <div className="swap-form">
                {/* From Token */}
                <div className="swap-section">
                  <label>From</label>
                  <div className="token-input">
                    <Select
                      value={tokenOptions.find(opt => opt.value === fromToken)}
                      onChange={(option) => setFromToken(option?.value || "")}
                      options={tokenOptions}
                      placeholder="Select token..."
                      className="token-select"
                    />
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="amount-input"
                    />
                  </div>
                </div>
                
                {/* Swap Arrow */}
                <div className="swap-arrow">
                  <button 
                    className="swap-btn"
                    onClick={() => {
                      setFromToken(toToken);
                      setToToken(fromToken);
                      setFromAmount(toAmount);
                    }}
                  >
                    <ExchangeArrowIcon />
                  </button>
                </div>
                
                {/* To Token */}
                <div className="swap-section">
                  <label>To</label>
                  <div className="token-input">
                    <Select
                      value={tokenOptions.find(opt => opt.value === toToken)}
                      onChange={(option) => setToToken(option?.value || "")}
                      options={tokenOptions}
                      placeholder="Select token..."
                      className="token-select"
                    />
                    <input
                      type="text"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="amount-input"
                    />
                  </div>
                </div>
                
                {/* Exchange Rate */}
                {exchangeRate && (
                  <div className="exchange-rate">
                    <small>
                      1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}
                    </small>
                  </div>
                )}
                
                {/* Swap Button */}
                <button
                  className="swap-execute-btn"
                  onClick={handleSwap}
                  disabled={!fromToken || !toToken || !fromAmount || isLoading}
                >
                  {isLoading ? "Swapping..." : "Swap Tokens"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <ReactModal show={showModal} onHide={() => setShowModal(false)} centered>
        <ReactModal.Header closeButton>
          <ReactModal.Title>Swap Successful!</ReactModal.Title>
        </ReactModal.Header>
        <ReactModal.Body>
          {swapData && (
            <div>
              <p>Your swap has been completed successfully.</p>
              <div className="swap-details">
                <div>From: {swapData.from.amount} {swapData.from.token}</div>
                <div>To: {swapData.to.amount} {swapData.to.token}</div>
                <div>Rate: {swapData.rate?.toFixed(6)}</div>
              </div>
            </div>
          )}
        </ReactModal.Body>
        <ReactModal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </ReactModal.Footer>
      </ReactModal>
    </div>
  );
};

export default Swap;

