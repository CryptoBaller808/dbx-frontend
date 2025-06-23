/**
 * DBX Enhanced Swap Page
 * Cross-chain swap interface with wallet auto-detection
 * 
 * @version 3.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import { Tabs } from 'antd';
import { SUPPORTED_NETWORKS } from '../../config/networks';
import { switchNetwork, updateNetworkBalances } from '../../redux/network/action';
import { WalletManager } from '../../services/wallets';
import NetworkSelector from '../../components/NetworkSelector';
import SwapComponent from '../../components/swapComponent/SwapComponent';
import './style.css';

const { TabPane } = Tabs;

const EnhancedSwap = () => {
  const dispatch = useDispatch();
  const { activeNetwork, networkType, connectedNetworks, networkBalances } = useSelector(state => state.networkReducers);
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  
  // Cross-chain swap state
  const [fromNetwork, setFromNetwork] = useState(activeNetwork || 'ETH');
  const [toNetwork, setToNetwork] = useState('BNB');
  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [swapRoute, setSwapRoute] = useState(null);
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(20);
  
  // UI state
  const [availableFromAssets, setAvailableFromAssets] = useState([]);
  const [availableToAssets, setAvailableToAssets] = useState([]);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [swapDetails, setSwapDetails] = useState(null);
  
  // Wallet connection modal
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWalletNetwork, setSelectedWalletNetwork] = useState(null);

  useEffect(() => {
    loadNetworkAssets(fromNetwork, 'from');
  }, [fromNetwork, isWalletConnected]);

  useEffect(() => {
    loadNetworkAssets(toNetwork, 'to');
  }, [toNetwork, isWalletConnected]);

  useEffect(() => {
    if (fromAsset && toAsset && fromAmount) {
      calculateExchangeRate();
    }
  }, [fromAsset, toAsset, fromAmount, fromNetwork, toNetwork]);

  const loadNetworkAssets = async (network, direction) => {
    try {
      const networkConfig = SUPPORTED_NETWORKS[network];
      if (!networkConfig) return;

      const assets = await getNetworkAssets(network);
      
      if (direction === 'from') {
        setAvailableFromAssets(assets);
        if (assets.length > 0 && (!fromAsset || fromAsset.network !== network)) {
          setFromAsset(assets[0]);
        }
      } else {
        setAvailableToAssets(assets);
        if (assets.length > 0 && (!toAsset || toAsset.network !== network)) {
          const defaultAsset = assets.find(asset => 
            asset.symbol === 'USDT' || asset.symbol === 'USDC' || asset.symbol === 'USD'
          ) || assets[0];
          setToAsset(defaultAsset);
        }
      }
    } catch (error) {
      console.error(`Failed to load ${direction} assets for ${network}:`, error);
    }
  };

  const getNetworkAssets = async (network) => {
    // Enhanced asset data with cross-chain bridge support
    const networkAssets = {
      'BTC': [
        { 
          symbol: 'BTC', 
          name: 'Bitcoin', 
          icon: '/images/networks/btc.png',
          network: 'BTC',
          decimals: 8,
          type: 'native',
          bridgeable: true
        }
      ],
      'ETH': [
        { 
          symbol: 'ETH', 
          name: 'Ethereum', 
          icon: '/images/networks/eth.png',
          network: 'ETH',
          decimals: 18,
          type: 'native',
          bridgeable: true
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin', 
          icon: '/images/tokens/usdc.png',
          network: 'ETH',
          decimals: 6,
          type: 'token',
          bridgeable: true
        },
        { 
          symbol: 'USDT', 
          name: 'Tether USD', 
          icon: '/images/tokens/usdt.png',
          network: 'ETH',
          decimals: 6,
          type: 'token',
          bridgeable: true
        },
        { 
          symbol: 'WBTC', 
          name: 'Wrapped Bitcoin', 
          icon: '/images/tokens/wbtc.png',
          network: 'ETH',
          decimals: 8,
          type: 'token',
          bridgeable: true
        }
      ],
      'BNB': [
        { 
          symbol: 'BNB', 
          name: 'BNB', 
          icon: '/images/networks/bnb.png',
          network: 'BNB',
          decimals: 18,
          type: 'native',
          bridgeable: true
        },
        { 
          symbol: 'USDT', 
          name: 'Tether USD', 
          icon: '/images/tokens/usdt.png',
          network: 'BNB',
          decimals: 18,
          type: 'token',
          bridgeable: true
        },
        { 
          symbol: 'BUSD', 
          name: 'Binance USD', 
          icon: '/images/tokens/busd.png',
          network: 'BNB',
          decimals: 18,
          type: 'token',
          bridgeable: true
        }
      ],
      'AVAX': [
        { 
          symbol: 'AVAX', 
          name: 'Avalanche', 
          icon: '/images/networks/avax.png',
          network: 'AVAX',
          decimals: 18,
          type: 'native',
          bridgeable: true
        },
        { 
          symbol: 'USDC.e', 
          name: 'USD Coin (Bridged)', 
          icon: '/images/tokens/usdc.png',
          network: 'AVAX',
          decimals: 6,
          type: 'token',
          bridgeable: true
        }
      ],
      'MATIC': [
        { 
          symbol: 'MATIC', 
          name: 'Polygon', 
          icon: '/images/networks/matic.png',
          network: 'MATIC',
          decimals: 18,
          type: 'native',
          bridgeable: true
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin', 
          icon: '/images/tokens/usdc.png',
          network: 'MATIC',
          decimals: 6,
          type: 'token',
          bridgeable: true
        }
      ],
      'SOL': [
        { 
          symbol: 'SOL', 
          name: 'Solana', 
          icon: '/images/networks/sol.png',
          network: 'SOL',
          decimals: 9,
          type: 'native',
          bridgeable: true
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin', 
          icon: '/images/tokens/usdc.png',
          network: 'SOL',
          decimals: 6,
          type: 'token',
          bridgeable: true
        }
      ],
      'XDC': [
        { 
          symbol: 'XDC', 
          name: 'XDC Network', 
          icon: '/images/networks/xdc.png',
          network: 'XDC',
          decimals: 18,
          type: 'native',
          bridgeable: false
        }
      ],
      'XRP': [
        { 
          symbol: 'XRP', 
          name: 'XRP', 
          icon: '/images/networks/xrp.png',
          network: 'XRP',
          decimals: 6,
          type: 'native',
          bridgeable: false
        }
      ],
      'XLM': [
        { 
          symbol: 'XLM', 
          name: 'Stellar Lumens', 
          icon: '/images/networks/xlm.png',
          network: 'XLM',
          decimals: 7,
          type: 'native',
          bridgeable: false
        }
      ]
    };
    
    return networkAssets[network] || [];
  };

  const calculateExchangeRate = async () => {
    if (!fromAsset || !toAsset || !fromAmount || parseFloat(fromAmount) <= 0) {
      setExchangeRate(null);
      setToAmount('');
      return;
    }

    setIsLoadingRate(true);
    setSwapError(null);

    try {
      // Mock exchange rate calculation
      const mockRates = {
        'BTC': 42350,
        'ETH': 2650,
        'BNB': 315,
        'AVAX': 38,
        'MATIC': 0.85,
        'SOL': 98,
        'XDC': 0.045,
        'XRP': 0.52,
        'XLM': 0.11,
        'USDC': 1,
        'USDT': 1,
        'BUSD': 1,
        'DAI': 1,
        'WBTC': 42350
      };

      const fromRate = mockRates[fromAsset.symbol] || 1;
      const toRate = mockRates[toAsset.symbol] || 1;
      const rate = fromRate / toRate;
      
      // Add slippage and fees
      const slippageMultiplier = 1 - (slippage / 100);
      const feeMultiplier = fromNetwork === toNetwork ? 0.997 : 0.995; // Higher fee for cross-chain
      const finalRate = rate * slippageMultiplier * feeMultiplier;
      
      const calculatedToAmount = (parseFloat(fromAmount) * finalRate).toFixed(toAsset.decimals > 6 ? 6 : toAsset.decimals);
      
      setExchangeRate({
        rate: finalRate,
        fromRate,
        toRate,
        priceImpact: ((1 - finalRate / rate) * 100).toFixed(2),
        minimumReceived: (parseFloat(calculatedToAmount) * 0.98).toFixed(toAsset.decimals > 6 ? 6 : toAsset.decimals)
      });
      
      setToAmount(calculatedToAmount);
      
      // Calculate swap route
      if (fromNetwork !== toNetwork) {
        setSwapRoute({
          type: 'cross-chain',
          steps: [
            { network: fromNetwork, action: 'swap', asset: fromAsset.symbol },
            { network: 'bridge', action: 'bridge', from: fromNetwork, to: toNetwork },
            { network: toNetwork, action: 'receive', asset: toAsset.symbol }
          ],
          estimatedTime: '5-15 minutes',
          bridgeFee: '0.1%'
        });
      } else {
        setSwapRoute({
          type: 'same-chain',
          steps: [
            { network: fromNetwork, action: 'swap', from: fromAsset.symbol, to: toAsset.symbol }
          ],
          estimatedTime: '1-3 minutes',
          bridgeFee: '0%'
        });
      }
    } catch (error) {
      console.error('Failed to calculate exchange rate:', error);
      setSwapError('Failed to get exchange rate. Please try again.');
    } finally {
      setIsLoadingRate(false);
    }
  };

  const handleNetworkSwap = () => {
    const tempNetwork = fromNetwork;
    const tempAsset = fromAsset;
    
    setFromNetwork(toNetwork);
    setToNetwork(tempNetwork);
    setFromAsset(toAsset);
    setToAsset(tempAsset);
    setFromAmount(toAmount);
    setToAmount('');
  };

  const handleSwap = async () => {
    if (!fromAsset || !toAsset || !fromAmount || !exchangeRate) return;
    
    // Check wallet connections
    const fromNetworkConnected = connectedNetworks && connectedNetworks[fromNetwork];
    const toNetworkConnected = fromNetwork === toNetwork ? fromNetworkConnected : (connectedNetworks && connectedNetworks[toNetwork]);
    
    if (!fromNetworkConnected) {
      setSelectedWalletNetwork(fromNetwork);
      setShowWalletModal(true);
      return;
    }
    
    if (!toNetworkConnected && fromNetwork !== toNetwork) {
      setSelectedWalletNetwork(toNetwork);
      setShowWalletModal(true);
      return;
    }
    
    // Show confirmation modal
    setSwapDetails({
      from: {
        amount: fromAmount,
        asset: fromAsset,
        network: fromNetwork
      },
      to: {
        amount: toAmount,
        asset: toAsset,
        network: toNetwork
      },
      rate: exchangeRate,
      route: swapRoute,
      slippage,
      deadline
    });
    
    setShowConfirmModal(true);
  };

  const confirmSwap = async () => {
    setIsSwapping(true);
    setShowConfirmModal(false);
    
    try {
      // Mock swap execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      setExchangeRate(null);
      setSwapRoute(null);
      
      alert('Swap completed successfully!');
    } catch (error) {
      console.error('Swap failed:', error);
      setSwapError('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  const connectWallet = async (network) => {
    try {
      await WalletManager.connectToNetwork(network);
      setShowWalletModal(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const formatAssetOption = (asset) => ({
    value: asset.symbol,
    label: (
      <div className="asset-option d-flex align-items-center">
        <img 
          src={asset.icon} 
          alt={asset.symbol} 
          className="asset-icon me-2"
          style={{ width: '24px', height: '24px' }}
          onError={(e) => {
            e.target.src = '/images/networks/default.png';
          }}
        />
        <div className="asset-info">
          <div className="asset-symbol fw-bold">{asset.symbol}</div>
          <div className="asset-name text-muted small">{asset.name}</div>
        </div>
        <div className="ms-auto">
          <Badge bg="secondary" className="me-1">{asset.network}</Badge>
          {asset.bridgeable && <Badge bg="success" className="small">Bridge</Badge>}
        </div>
      </div>
    ),
    asset
  });

  const getNetworkOptions = () => {
    return Object.keys(SUPPORTED_NETWORKS).map(networkKey => ({
      value: networkKey,
      label: (
        <div className="network-option d-flex align-items-center">
          <img 
            src={SUPPORTED_NETWORKS[networkKey].icon} 
            alt={networkKey} 
            className="network-icon me-2"
            style={{ width: '20px', height: '20px' }}
          />
          <span>{SUPPORTED_NETWORKS[networkKey].name}</span>
        </div>
      )
    }));
  };

  const getBalance = (network, symbol) => {
    return networkBalances?.[network]?.[symbol] || '0.00';
  };

  return (
    <Container className="swap-page py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Cross-Chain Swap</h2>
              <p className="text-muted mb-0">Swap tokens across different blockchain networks</p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Badge bg={networkType === 'mainnet' ? 'success' : 'warning'}>
                {networkType.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {swapError && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setSwapError(null)}>
              {swapError}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="swap-card">
            <Card.Body className="p-4">
              {/* From Section */}
              <div className="swap-section mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0">From</label>
                  <small className="text-muted">
                    Balance: {getBalance(fromNetwork, fromAsset?.symbol)} {fromAsset?.symbol}
                  </small>
                </div>
                
                <div className="swap-input-container">
                  <Row>
                    <Col md={6}>
                      <Select
                        value={getNetworkOptions().find(opt => opt.value === fromNetwork)}
                        onChange={(option) => setFromNetwork(option.value)}
                        options={getNetworkOptions()}
                        placeholder="Select network..."
                        className="network-select mb-2"
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        value={fromAsset ? formatAssetOption(fromAsset) : null}
                        onChange={(option) => setFromAsset(option.asset)}
                        options={availableFromAssets.map(formatAssetOption)}
                        placeholder="Select asset..."
                        className="asset-select mb-2"
                        isSearchable
                      />
                    </Col>
                  </Row>
                  
                  <div className="amount-input-container">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="form-control amount-input"
                      step="any"
                    />
                    <button
                      className="btn btn-outline-primary btn-sm max-btn"
                      onClick={() => setFromAmount(getBalance(fromNetwork, fromAsset?.symbol))}
                      disabled={!fromAsset}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="text-center mb-3">
                <button
                  className="btn btn-outline-primary swap-direction-btn"
                  onClick={handleNetworkSwap}
                  disabled={!fromAsset || !toAsset}
                >
                  ⇅
                </button>
              </div>

              {/* To Section */}
              <div className="swap-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0">To</label>
                  <small className="text-muted">
                    Balance: {getBalance(toNetwork, toAsset?.symbol)} {toAsset?.symbol}
                  </small>
                </div>
                
                <div className="swap-input-container">
                  <Row>
                    <Col md={6}>
                      <Select
                        value={getNetworkOptions().find(opt => opt.value === toNetwork)}
                        onChange={(option) => setToNetwork(option.value)}
                        options={getNetworkOptions()}
                        placeholder="Select network..."
                        className="network-select mb-2"
                      />
                    </Col>
                    <Col md={6}>
                      <Select
                        value={toAsset ? formatAssetOption(toAsset) : null}
                        onChange={(option) => setToAsset(option.asset)}
                        options={availableToAssets.map(formatAssetOption)}
                        placeholder="Select asset..."
                        className="asset-select mb-2"
                        isSearchable
                      />
                    </Col>
                  </Row>
                  
                  <div className="amount-input-container">
                    <input
                      type="text"
                      value={isLoadingRate ? 'Calculating...' : toAmount}
                      readOnly
                      placeholder="0.0"
                      className="form-control amount-input"
                    />
                    {isLoadingRate && (
                      <Spinner animation="border" size="sm" className="loading-spinner" />
                    )}
                  </div>
                </div>
              </div>

              {/* Exchange Rate Info */}
              {exchangeRate && (
                <div className="exchange-info mb-4">
                  <div className="info-row">
                    <span>Exchange Rate</span>
                    <span>1 {fromAsset.symbol} = {exchangeRate.rate.toFixed(6)} {toAsset.symbol}</span>
                  </div>
                  <div className="info-row">
                    <span>Price Impact</span>
                    <span className={parseFloat(exchangeRate.priceImpact) > 5 ? 'text-warning' : 'text-success'}>
                      {exchangeRate.priceImpact}%
                    </span>
                  </div>
                  <div className="info-row">
                    <span>Minimum Received</span>
                    <span>{exchangeRate.minimumReceived} {toAsset.symbol}</span>
                  </div>
                  {swapRoute && (
                    <div className="info-row">
                      <span>Route</span>
                      <span>
                        {swapRoute.type === 'cross-chain' ? 'Cross-Chain Bridge' : 'Same Chain'}
                        {swapRoute.estimatedTime && ` (${swapRoute.estimatedTime})`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Swap Settings */}
              <div className="swap-settings mb-4">
                <Row>
                  <Col md={6}>
                    <label className="form-label">Slippage Tolerance</label>
                    <div className="input-group">
                      <input
                        type="number"
                        value={slippage}
                        onChange={(e) => setSlippage(parseFloat(e.target.value))}
                        className="form-control"
                        step="0.1"
                        min="0.1"
                        max="50"
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <label className="form-label">Transaction Deadline</label>
                    <div className="input-group">
                      <input
                        type="number"
                        value={deadline}
                        onChange={(e) => setDeadline(parseInt(e.target.value))}
                        className="form-control"
                        min="1"
                        max="60"
                      />
                      <span className="input-group-text">min</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Swap Button */}
              <button
                className="btn btn-primary w-100 swap-btn"
                onClick={handleSwap}
                disabled={!fromAsset || !toAsset || !fromAmount || !exchangeRate || isSwapping || isLoadingRate}
              >
                {isSwapping ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Swapping...
                  </>
                ) : fromNetwork === toNetwork ? (
                  `Swap ${fromAsset?.symbol || ''} for ${toAsset?.symbol || ''}`
                ) : (
                  `Cross-Chain Swap ${fromAsset?.symbol || ''} to ${toAsset?.symbol || ''}`
                )}
              </button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Wallet Connection Modal */}
      <Modal show={showWalletModal} onHide={() => setShowWalletModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Connect Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please connect your wallet to {selectedWalletNetwork} network to continue with the swap.</p>
          <div className="d-grid">
            <Button
              variant="primary"
              onClick={() => connectWallet(selectedWalletNetwork)}
            >
              Connect to {selectedWalletNetwork}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Swap Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Swap</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {swapDetails && (
            <div className="swap-confirmation">
              <div className="swap-summary mb-3">
                <div className="from-to-display">
                  <div className="swap-amount">
                    <img src={swapDetails.from.asset.icon} alt="" className="asset-icon" />
                    <span className="amount">{swapDetails.from.amount}</span>
                    <span className="symbol">{swapDetails.from.asset.symbol}</span>
                    <Badge bg="secondary">{swapDetails.from.network}</Badge>
                  </div>
                  <div className="swap-arrow">→</div>
                  <div className="swap-amount">
                    <img src={swapDetails.to.asset.icon} alt="" className="asset-icon" />
                    <span className="amount">{swapDetails.to.amount}</span>
                    <span className="symbol">{swapDetails.to.asset.symbol}</span>
                    <Badge bg="secondary">{swapDetails.to.network}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="swap-details">
                <div className="detail-row">
                  <span>Exchange Rate</span>
                  <span>1 {swapDetails.from.asset.symbol} = {swapDetails.rate.rate.toFixed(6)} {swapDetails.to.asset.symbol}</span>
                </div>
                <div className="detail-row">
                  <span>Price Impact</span>
                  <span>{swapDetails.rate.priceImpact}%</span>
                </div>
                <div className="detail-row">
                  <span>Minimum Received</span>
                  <span>{swapDetails.rate.minimumReceived} {swapDetails.to.asset.symbol}</span>
                </div>
                <div className="detail-row">
                  <span>Slippage Tolerance</span>
                  <span>{swapDetails.slippage}%</span>
                </div>
                {swapDetails.route && swapDetails.route.type === 'cross-chain' && (
                  <>
                    <div className="detail-row">
                      <span>Bridge Fee</span>
                      <span>{swapDetails.route.bridgeFee}</span>
                    </div>
                    <div className="detail-row">
                      <span>Estimated Time</span>
                      <span>{swapDetails.route.estimatedTime}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmSwap}>
            Confirm Swap
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Legacy Swap Component Wrapper
const Swap = () => {
  const [activeTab, setActiveTab] = useState('1');
  
  return (
    <div className="swap-container">
      <Tabs 
        className="swap-tabs" 
        activeKey={activeTab}
        onChange={setActiveTab}
        centered 
        size="large"
      >
        <TabPane tab="Enhanced Swap" key="1">
          <EnhancedSwap />
        </TabPane>
        <TabPane tab="Legacy Swap" key="2">
          <SwapComponent />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Swap;

