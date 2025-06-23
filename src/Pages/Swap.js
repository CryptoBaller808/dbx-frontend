/**
 * DBX Swap Page - Fixed Version
 * Simplified cross-chain swap interface
 * 
 * @version 3.1.0
 * @author DBX Development Team
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Badge, Spinner, Alert, Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { TokenIcon, DropDownIcon, ExchangeIcon, ExchangeArrowIcon, ArrowDownIcon } from "../Icons";
import { useSocket } from "../context/socket";
import { setModalOpen, connectWallet } from "../redux/actions";
import * as balanceAction from "../redux/xummBalance/action";
import * as QRCodeAction from "../redux/xummQRCode/action";
import axios from "axios";
import ReactModal from "react-bootstrap/Modal";
import ExchangeModalIcon from "../Images/exchange-color.png";
import SwapTransModal from "../components/loader/SwapTransModal";

// Simplified network configuration
const SWAP_NETWORKS = {
  BTC: { symbol: 'BTC', name: 'Bitcoin', color: '#f7931a' },
  ETH: { symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
  BNB: { symbol: 'BNB', name: 'BNB Smart Chain', color: '#f3ba2f' },
  AVAX: { symbol: 'AVAX', name: 'Avalanche', color: '#e84142' },
  MATIC: { symbol: 'MATIC', name: 'Polygon', color: '#8247e5' },
  SOL: { symbol: 'SOL', name: 'Solana', color: '#9945ff' },
  XDC: { symbol: 'XDC', name: 'XDC Network', color: '#2a8fbb' },
  XRP: { symbol: 'XRP', name: 'XRP Ledger', color: '#000000' },
  XLM: { symbol: 'XLM', name: 'Stellar', color: '#14b6e7' }
};

const Swap = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  
  // State management
  const [error, setError] = useState("");
  const [fromNetwork, setFromNetwork] = useState("ETH");
  const [toNetwork, setToNetwork] = useState("BNB");
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [swapData, setSwapData] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isCalculatingRate, setIsCalculatingRate] = useState(false);
  
  // Redux state
  const balanceData = useSelector(state => state.signInData?.balance);
  const isWalletConnected = useSelector(state => state.authReducer?.isWalletConnected);
  const networkData = useSelector(state => state.networkReducers);
  
  // Network options for dropdowns
  const networkOptions = useMemo(() => 
    Object.entries(SWAP_NETWORKS).map(([key, network]) => ({
      value: key,
      label: network.name,
      symbol: network.symbol,
      color: network.color
    })), []
  );

  // Token options based on selected networks
  const getTokenOptions = useCallback((network) => {
    const baseTokens = [
      { value: `${network}_NATIVE`, label: `${SWAP_NETWORKS[network]?.name} (${network})` },
      { value: 'USDC', label: 'USD Coin (USDC)' },
      { value: 'USDT', label: 'Tether (USDT)' }
    ];
    
    // Add network-specific tokens
    if (network === 'ETH') {
      baseTokens.push(
        { value: 'WBTC', label: 'Wrapped Bitcoin (WBTC)' },
        { value: 'DAI', label: 'Dai Stablecoin (DAI)' }
      );
    }
    
    return baseTokens;
  }, []);

  // Mock exchange rate calculation
  const calculateExchangeRate = useCallback(async () => {
    if (!fromNetwork || !toNetwork || !fromToken || !toToken || !fromAmount) {
      setExchangeRate(null);
      setToAmount("");
      return;
    }
    
    setIsCalculatingRate(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock rate calculation
      const mockRate = Math.random() * 2 + 0.5; // Random rate between 0.5 and 2.5
      setExchangeRate(mockRate);
      
      const calculatedAmount = (parseFloat(fromAmount) * mockRate).toFixed(6);
      setToAmount(calculatedAmount);
    } catch (err) {
      setError("Failed to calculate exchange rate");
    } finally {
      setIsCalculatingRate(false);
    }
  }, [fromNetwork, toNetwork, fromToken, toToken, fromAmount]);

  // Handle swap execution
  const handleSwap = useCallback(async () => {
    if (!fromNetwork || !toNetwork || !fromToken || !toToken || !fromAmount) {
      setError("Please fill in all fields");
      return;
    }
    
    if (!isWalletConnected) {
      setError("Please connect your wallet first");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Mock swap execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSwapData({
        fromNetwork,
        toNetwork,
        from: { token: fromToken, amount: fromAmount },
        to: { token: toToken, amount: toAmount },
        rate: exchangeRate,
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`
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
  }, [fromNetwork, toNetwork, fromToken, toToken, fromAmount, toAmount, exchangeRate, isWalletConnected]);

  // Network switching handler
  const handleNetworkSwitch = (type, network) => {
    if (type === 'from') {
      setFromNetwork(network);
      setFromToken("");
    } else {
      setToNetwork(network);
      setToToken("");
    }
    setExchangeRate(null);
    setToAmount("");
  };

  // Swap networks
  const swapNetworks = () => {
    const tempNetwork = fromNetwork;
    const tempToken = fromToken;
    
    setFromNetwork(toNetwork);
    setFromToken(toToken);
    setToNetwork(tempNetwork);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount("");
    setExchangeRate(null);
  };

  // Calculate rate when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateExchangeRate();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [calculateExchangeRate]);

  // Custom network option component
  const NetworkOption = ({ data, ...props }) => (
    <div {...props} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px' }}>
      <div 
        style={{ 
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          backgroundColor: data.color,
          marginRight: '8px' 
        }} 
      />
      <span>{data.label}</span>
    </div>
  );

  return (
    <div className="swap-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            {/* Header */}
            <div className="text-center mb-4">
              <h2>🔄 Cross-Chain Token Swap</h2>
              <p className="text-muted">
                Swap tokens across {Object.keys(SWAP_NETWORKS).length} different blockchain networks
              </p>
            </div>

            {/* Main Swap Card */}
            <Card className="swap-card">
              <Card.Header>
                <h5 className="mb-0">
                  <ExchangeIcon className="me-2" />
                  Multi-Chain Swap
                </h5>
              </Card.Header>
              <Card.Body>
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                
                {/* From Section */}
                <div className="swap-section mb-3">
                  <label className="form-label">From</label>
                  <Row>
                    <Col md={6}>
                      <Select
                        value={networkOptions.find(opt => opt.value === fromNetwork)}
                        onChange={(option) => handleNetworkSwitch('from', option.value)}
                        options={networkOptions}
                        components={{ Option: NetworkOption }}
                        placeholder="Select network..."
                        className="mb-2"
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        value={getTokenOptions(fromNetwork).find(opt => opt.value === fromToken)}
                        onChange={(option) => setFromToken(option?.value || "")}
                        options={getTokenOptions(fromNetwork)}
                        placeholder="Select token..."
                        className="mb-2"
                      />
                    </Col>
                  </Row>
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.0"
                    className="form-control amount-input"
                  />
                </div>
                
                {/* Swap Arrow */}
                <div className="text-center mb-3">
                  <button 
                    className="btn btn-outline-primary swap-arrow-btn"
                    onClick={swapNetworks}
                    type="button"
                  >
                    <ExchangeArrowIcon />
                  </button>
                </div>
                
                {/* To Section */}
                <div className="swap-section mb-3">
                  <label className="form-label">To</label>
                  <Row>
                    <Col md={6}>
                      <Select
                        value={networkOptions.find(opt => opt.value === toNetwork)}
                        onChange={(option) => handleNetworkSwitch('to', option.value)}
                        options={networkOptions}
                        components={{ Option: NetworkOption }}
                        placeholder="Select network..."
                        className="mb-2"
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        value={getTokenOptions(toNetwork).find(opt => opt.value === toToken)}
                        onChange={(option) => setToToken(option?.value || "")}
                        options={getTokenOptions(toNetwork)}
                        placeholder="Select token..."
                        className="mb-2"
                      />
                    </Col>
                  </Row>
                  <div className="position-relative">
                    <input
                      type="text"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="form-control amount-input"
                    />
                    {isCalculatingRate && (
                      <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                        <Spinner size="sm" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Exchange Rate */}
                {exchangeRate && !isCalculatingRate && (
                  <div className="exchange-rate-info mb-3">
                    <small className="text-muted">
                      1 {fromToken} = {exchangeRate.toFixed(6)} {toToken}
                    </small>
                    <br />
                    <small className="text-muted">
                      {fromNetwork} → {toNetwork}
                    </small>
                  </div>
                )}
                
                {/* Swap Button */}
                <button
                  className="btn btn-primary w-100 swap-execute-btn"
                  onClick={handleSwap}
                  disabled={!fromNetwork || !toNetwork || !fromToken || !toToken || !fromAmount || isLoading || isCalculatingRate}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Swapping...
                    </>
                  ) : (
                    "Execute Cross-Chain Swap"
                  )}
                </button>
                
                {!isWalletConnected && (
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      Connect your wallet to start swapping
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Features Info */}
            <Card className="mt-4">
              <Card.Body className="text-center">
                <h6>🚀 Cross-Chain Swap Features</h6>
                <Row className="mt-3">
                  <Col md={4}>
                    <Badge bg="success" className="mb-2">✓ Multi-Network</Badge>
                    <p className="small text-muted">Support for 9 major blockchains</p>
                  </Col>
                  <Col md={4}>
                    <Badge bg="info" className="mb-2">⚡ Fast Execution</Badge>
                    <p className="small text-muted">Optimized routing algorithms</p>
                  </Col>
                  <Col md={4}>
                    <Badge bg="warning" className="mb-2">🔒 Secure</Badge>
                    <p className="small text-muted">Non-custodial swaps</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Success Modal */}
      <ReactModal show={showModal} onHide={() => setShowModal(false)} centered>
        <ReactModal.Header closeButton>
          <ReactModal.Title>🎉 Swap Successful!</ReactModal.Title>
        </ReactModal.Header>
        <ReactModal.Body>
          {swapData && (
            <div>
              <p>Your cross-chain swap has been completed successfully.</p>
              <div className="swap-details">
                <div><strong>From:</strong> {swapData.from.amount} {swapData.from.token} ({swapData.fromNetwork})</div>
                <div><strong>To:</strong> {swapData.to.amount} {swapData.to.token} ({swapData.toNetwork})</div>
                <div><strong>Rate:</strong> {swapData.rate?.toFixed(6)}</div>
                <div><strong>Transaction:</strong> <code>{swapData.txHash}</code></div>
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

