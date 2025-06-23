/**
 * DBX Enhanced Exchange Page
 * Multi-chain trading interface with dynamic network selection
 * 
 * @version 3.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Dropdown, Badge, Spinner, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { SearchIcon, ExchangeIcon, SunIcon, MenuIcon2 } from '../Icons/';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { switchNetwork, updateNetworkBalances } from '../redux/network/action';
import NetworkSelector from '../components/NetworkSelector';
import ExchangeGraph from '../components/ExchangeGraph';
import ExchangeRatesComponent from '../components/exchangeRatesComponent/ExchangeRatesComponent';
import GraphHeadComponent from '../components/graphHeadComponent/GraphHeadComponent';
import ExchangeWallet from '../components/exchangeWallet/ExchangeWallet';
import AccountOffersTable from '../components/accountOfferTable/AccountOffersTable';
import BookOffersTable from '../components/bookOfferTable/BookOffersTable';
import Chart from '../components/charts';
import './Exchange.css';

const Exchange = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const { activeNetwork, networkType, connectedNetworks, networkBalances } = useSelector(state => state.networkReducers);
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  
  // Multi-chain state
  const [selectedNetwork, setSelectedNetwork] = useState(activeNetwork || 'XRP');
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedFromAsset, setSelectedFromAsset] = useState(null);
  const [selectedToAsset, setSelectedToAsset] = useState(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [exchangeData, setExchangeData] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [networkError, setNetworkError] = useState(null);
  
  // Trading state
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradePrice, setTradePrice] = useState('');
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  // Legacy XRP support
  const [currencyData, setCurrencyData] = useState(null);
  const [dropVal, setDropVal] = useState(0);

  useEffect(() => {
    if (selectedNetwork) {
      loadNetworkAssets(selectedNetwork);
    }
  }, [selectedNetwork, isWalletConnected, networkType]);

  useEffect(() => {
    // Update selected network when Redux state changes
    if (activeNetwork && activeNetwork !== selectedNetwork) {
      setSelectedNetwork(activeNetwork);
    }
  }, [activeNetwork]);

  const loadNetworkAssets = async (network) => {
    setIsLoadingAssets(true);
    setNetworkError(null);
    
    try {
      const networkConfig = SUPPORTED_NETWORKS[network];
      if (!networkConfig) {
        throw new Error(`Network ${network} not supported`);
      }

      // Get available trading pairs for the network
      const assets = await getNetworkTradingPairs(network);
      setAvailableAssets(assets);
      
      // Set default assets if none selected or network changed
      if (assets.length > 0) {
        if (!selectedFromAsset || selectedFromAsset.network !== network) {
          setSelectedFromAsset(assets[0]);
        }
        if (!selectedToAsset || selectedToAsset.network !== network) {
          const defaultToAsset = assets.find(asset => 
            asset.symbol === 'USDT' || asset.symbol === 'USDC' || asset.symbol === 'USD'
          ) || assets[1];
          setSelectedToAsset(defaultToAsset);
        }
      }
      
      // Load exchange data for selected pair
      if (selectedFromAsset && selectedToAsset) {
        await loadExchangeData(network, selectedFromAsset, selectedToAsset);
      }
    } catch (error) {
      console.error('Failed to load network assets:', error);
      setNetworkError(error.message);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const getNetworkTradingPairs = async (network) => {
    // Enhanced trading pairs with more comprehensive data
    const tradingPairs = {
      'BTC': [
        { 
          symbol: 'BTC', 
          name: 'Bitcoin', 
          icon: '/images/networks/btc.png',
          network: 'BTC',
          decimals: 8,
          type: 'native'
        },
        { 
          symbol: 'USDT', 
          name: 'Tether USD', 
          icon: '/images/tokens/usdt.png',
          network: 'BTC',
          decimals: 8,
          type: 'token'
        }
      ],
      'ETH': [
        { 
          symbol: 'ETH', 
          name: 'Ethereum', 
          icon: '/images/networks/eth.png',
          network: 'ETH',
          decimals: 18,
          type: 'native'
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin', 
          icon: '/images/tokens/usdc.png',
          network: 'ETH',
          decimals: 6,
          type: 'token'
        },
        { 
          symbol: 'WBTC', 
          name: 'Wrapped Bitcoin', 
          icon: '/images/tokens/wbtc.png',
          network: 'ETH',
          decimals: 8,
          type: 'token'
        },
        { 
          symbol: 'DAI', 
          name: 'Dai Stablecoin', 
          icon: '/images/tokens/dai.png',
          network: 'ETH',
          decimals: 18,
          type: 'token'
        }
      ],
      'BNB': [
        { 
          symbol: 'BNB', 
          name: 'BNB', 
          icon: '/images/networks/bnb.png',
          network: 'BNB',
          decimals: 18,
          type: 'native'
        },
        { 
          symbol: 'BUSD', 
          name: 'Binance USD', 
          icon: '/images/tokens/busd.png',
          network: 'BNB',
          decimals: 18,
          type: 'token'
        },
        { 
          symbol: 'USDT', 
          name: 'Tether USD', 
          icon: '/images/tokens/usdt.png',
          network: 'BNB',
          decimals: 18,
          type: 'token'
        }
      ],
      'AVAX': [
        { 
          symbol: 'AVAX', 
          name: 'Avalanche', 
          icon: '/images/networks/avax.png',
          network: 'AVAX',
          decimals: 18,
          type: 'native'
        },
        { 
          symbol: 'USDC.e', 
          name: 'USD Coin (Bridged)', 
          icon: '/images/tokens/usdc.png',
          network: 'AVAX',
          decimals: 6,
          type: 'token'
        }
      ],
      'MATIC': [
        { 
          symbol: 'MATIC', 
          name: 'Polygon', 
          icon: '/images/networks/matic.png',
          network: 'MATIC',
          decimals: 18,
          type: 'native'
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin', 
          icon: '/images/tokens/usdc.png',
          network: 'MATIC',
          decimals: 6,
          type: 'token'
        }
      ],
      'SOL': [
        { 
          symbol: 'SOL', 
          name: 'Solana', 
          icon: '/images/networks/sol.png',
          network: 'SOL',
          decimals: 9,
          type: 'native'
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin', 
          icon: '/images/tokens/usdc.png',
          network: 'SOL',
          decimals: 6,
          type: 'token'
        }
      ],
      'XDC': [
        { 
          symbol: 'XDC', 
          name: 'XDC Network', 
          icon: '/images/networks/xdc.png',
          network: 'XDC',
          decimals: 18,
          type: 'native'
        },
        { 
          symbol: 'USDT', 
          name: 'Tether USD', 
          icon: '/images/tokens/usdt.png',
          network: 'XDC',
          decimals: 6,
          type: 'token'
        }
      ],
      'XRP': [
        { 
          symbol: 'XRP', 
          name: 'XRP', 
          icon: '/images/networks/xrp.png',
          network: 'XRP',
          decimals: 6,
          type: 'native'
        },
        { 
          symbol: 'USD', 
          name: 'US Dollar', 
          icon: '/images/tokens/usd.png',
          network: 'XRP',
          decimals: 2,
          type: 'fiat'
        }
      ],
      'XLM': [
        { 
          symbol: 'XLM', 
          name: 'Stellar Lumens', 
          icon: '/images/networks/xlm.png',
          network: 'XLM',
          decimals: 7,
          type: 'native'
        },
        { 
          symbol: 'USDC', 
          name: 'USD Coin', 
          icon: '/images/tokens/usdc.png',
          network: 'XLM',
          decimals: 7,
          type: 'token'
        }
      ]
    };
    
    return tradingPairs[network] || [];
  };

  const loadExchangeData = async (network, fromAsset, toAsset) => {
    try {
      // Enhanced mock exchange data with network-specific information
      const mockPrices = {
        'BTC': { base: 42350, volatility: 0.05 },
        'ETH': { base: 2650, volatility: 0.08 },
        'BNB': { base: 315, volatility: 0.12 },
        'AVAX': { base: 38, volatility: 0.15 },
        'MATIC': { base: 0.85, volatility: 0.18 },
        'SOL': { base: 98, volatility: 0.20 },
        'XDC': { base: 0.045, volatility: 0.25 },
        'XRP': { base: 0.52, volatility: 0.15 },
        'XLM': { base: 0.11, volatility: 0.20 }
      };

      const basePrice = mockPrices[fromAsset.symbol]?.base || 1;
      const volatility = mockPrices[fromAsset.symbol]?.volatility || 0.1;
      const change = (Math.random() - 0.5) * volatility * 100;
      
      const mockData = {
        price: basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        change24h: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
        volume24h: (Math.random() * 10000000).toLocaleString('en-US'),
        high24h: (basePrice * (1 + Math.random() * 0.1)).toLocaleString('en-US', { minimumFractionDigits: 2 }),
        low24h: (basePrice * (1 - Math.random() * 0.1)).toLocaleString('en-US', { minimumFractionDigits: 2 }),
        network: network,
        pair: `${fromAsset.symbol}/${toAsset.symbol}`
      };
      
      setExchangeData(mockData);
      
      // Enhanced mock order book with realistic data
      const generateOrderBook = () => {
        const bids = [];
        const asks = [];
        
        for (let i = 0; i < 10; i++) {
          const bidPrice = basePrice * (1 - (i + 1) * 0.001);
          const askPrice = basePrice * (1 + (i + 1) * 0.001);
          const amount = Math.random() * 10;
          
          bids.push({
            price: bidPrice.toFixed(fromAsset.decimals > 2 ? 6 : 2),
            amount: amount.toFixed(4),
            total: (bidPrice * amount).toFixed(2)
          });
          
          asks.push({
            price: askPrice.toFixed(fromAsset.decimals > 2 ? 6 : 2),
            amount: amount.toFixed(4),
            total: (askPrice * amount).toFixed(2)
          });
        }
        
        return { bids, asks };
      };
      
      setOrderBook(generateOrderBook());
    } catch (error) {
      console.error('Failed to load exchange data:', error);
    }
  };

  const handleNetworkChange = (network) => {
    setSelectedNetwork(network);
    dispatch(switchNetwork(network, networkType));
    setSelectedFromAsset(null);
    setSelectedToAsset(null);
    setExchangeData(null);
    setOrderBook({ bids: [], asks: [] });
  };

  const handleAssetSwap = () => {
    const temp = selectedFromAsset;
    setSelectedFromAsset(selectedToAsset);
    setSelectedToAsset(temp);
    
    if (selectedToAsset && selectedFromAsset) {
      loadExchangeData(selectedNetwork, selectedToAsset, selectedFromAsset);
    }
  };

  const handlePlaceOrder = async () => {
    if (!tradeAmount || !tradePrice || !selectedFromAsset || !selectedToAsset) return;
    
    setIsPlacingOrder(true);
    try {
      // Mock order placement with network-specific logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder = {
        id: Date.now(),
        type: tradeType,
        pair: `${selectedFromAsset.symbol}/${selectedToAsset.symbol}`,
        amount: tradeAmount,
        price: tradePrice,
        total: (parseFloat(tradeAmount) * parseFloat(tradePrice)).toFixed(2),
        network: selectedNetwork,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      setOrderHistory(prev => [newOrder, ...prev]);
      
      // Reset form
      setTradeAmount('');
      setTradePrice('');
      
      // Show success message
      alert(`${tradeType.toUpperCase()} order placed successfully on ${selectedNetwork} network!`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
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
        <Badge bg="secondary" className="ms-auto">{asset.network}</Badge>
      </div>
    ),
    asset
  });

  const isNetworkConnected = connectedNetworks && connectedNetworks[selectedNetwork];
  const networkBalance = networkBalances && networkBalances[selectedNetwork];

  return (
    <div className="exchange-page">
      <Container fluid>
        {/* Header with Network Selector */}
        <Row className="exchange-header mb-4">
          <Col md={6}>
            <div className="page-title d-flex align-items-center">
              <ExchangeIcon className="page-icon me-2" />
              <h2 className="mb-0">Multi-Chain Exchange</h2>
            </div>
          </Col>
          <Col md={6} className="text-end">
            <NetworkSelector
              selectedNetwork={selectedNetwork}
              onNetworkChange={handleNetworkChange}
              showBalance={true}
              compact={false}
            />
          </Col>
        </Row>

        {/* Network Status Alert */}
        {networkError && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger" dismissible onClose={() => setNetworkError(null)}>
                <Alert.Heading>Network Error</Alert.Heading>
                {networkError}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Connection Status */}
        {!isNetworkConnected && (
          <Row className="mb-3">
            <Col>
              <Alert variant="warning">
                <Alert.Heading>Wallet Not Connected</Alert.Heading>
                Please connect your wallet to {selectedNetwork} network to start trading.
              </Alert>
            </Col>
          </Row>
        )}

        {/* Trading Pair Selection */}
        <Row className="trading-pair-section mb-4">
          <Col md={12}>
            <Card className="trading-pair-card">
              <Card.Body>
                <div className="trading-pair-header d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Select Trading Pair</h5>
                  <div className="d-flex align-items-center">
                    <Badge bg="primary" className="me-2">{selectedNetwork} Network</Badge>
                    <Badge bg={networkType === 'mainnet' ? 'success' : 'warning'}>
                      {networkType.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <Row className="asset-selector-container">
                  <Col md={5}>
                    <div className="asset-selector">
                      <label className="form-label">From</label>
                      {isLoadingAssets ? (
                        <div className="loading-placeholder d-flex align-items-center p-3 border rounded">
                          <Spinner animation="border" size="sm" className="me-2" />
                          <span>Loading assets...</span>
                        </div>
                      ) : (
                        <Select
                          value={selectedFromAsset ? formatAssetOption(selectedFromAsset) : null}
                          onChange={(option) => {
                            setSelectedFromAsset(option.asset);
                            if (option.asset && selectedToAsset) {
                              loadExchangeData(selectedNetwork, option.asset, selectedToAsset);
                            }
                          }}
                          options={availableAssets.map(formatAssetOption)}
                          placeholder="Select asset..."
                          className="asset-select"
                          isSearchable
                        />
                      )}
                    </div>
                  </Col>
                  
                  <Col md={2} className="d-flex align-items-end justify-content-center">
                    <button 
                      className="btn btn-outline-primary swap-assets-btn"
                      onClick={handleAssetSwap}
                      disabled={!selectedFromAsset || !selectedToAsset}
                      style={{ marginBottom: '8px' }}
                    >
                      ⇄
                    </button>
                  </Col>
                  
                  <Col md={5}>
                    <div className="asset-selector">
                      <label className="form-label">To</label>
                      {isLoadingAssets ? (
                        <div className="loading-placeholder d-flex align-items-center p-3 border rounded">
                          <Spinner animation="border" size="sm" className="me-2" />
                          <span>Loading assets...</span>
                        </div>
                      ) : (
                        <Select
                          value={selectedToAsset ? formatAssetOption(selectedToAsset) : null}
                          onChange={(option) => {
                            setSelectedToAsset(option.asset);
                            if (selectedFromAsset && option.asset) {
                              loadExchangeData(selectedNetwork, selectedFromAsset, option.asset);
                            }
                          }}
                          options={availableAssets.map(formatAssetOption)}
                          placeholder="Select asset..."
                          className="asset-select"
                          isSearchable
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Trading Interface */}
        <Row className="trading-interface">
          {/* Chart and Market Data */}
          <Col lg={8}>
            <Card className="chart-card mb-3">
              <Card.Body>
                {selectedFromAsset && selectedToAsset && exchangeData ? (
                  <>
                    <div className="chart-header mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{exchangeData.pair}</h5>
                          <div className="d-flex align-items-center">
                            <span className="price me-3">${exchangeData.price}</span>
                            <span className={`change ${exchangeData.change24h.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                              {exchangeData.change24h}
                            </span>
                          </div>
                        </div>
                        <div className="market-stats text-end">
                          <div className="stat">
                            <small className="text-muted">24h Volume</small>
                            <div>${exchangeData.volume24h}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Chart 
                      symbol={`${selectedFromAsset.symbol}${selectedToAsset.symbol}`}
                      network={selectedNetwork}
                      isDarkMode={isDarkMode}
                    />
                  </>
                ) : (
                  <div className="chart-placeholder text-center py-5">
                    <ExchangeIcon size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">Select trading pair to view chart</h5>
                    <p className="text-muted">Choose both assets to start trading</p>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            {/* Order Book */}
            <Card className="orderbook-card">
              <Card.Body>
                <h6 className="mb-3">Order Book</h6>
                {selectedFromAsset && selectedToAsset && orderBook.bids.length > 0 ? (
                  <div className="orderbook-container">
                    <Row>
                      <Col md={6}>
                        <h6 className="text-success">Bids</h6>
                        <div className="orderbook-side">
                          <div className="orderbook-header">
                            <span>Price ({selectedToAsset.symbol})</span>
                            <span>Amount ({selectedFromAsset.symbol})</span>
                            <span>Total</span>
                          </div>
                          {orderBook.bids.slice(0, 5).map((bid, index) => (
                            <div key={index} className="orderbook-row text-success">
                              <span>{bid.price}</span>
                              <span>{bid.amount}</span>
                              <span>{bid.total}</span>
                            </div>
                          ))}
                        </div>
                      </Col>
                      <Col md={6}>
                        <h6 className="text-danger">Asks</h6>
                        <div className="orderbook-side">
                          <div className="orderbook-header">
                            <span>Price ({selectedToAsset.symbol})</span>
                            <span>Amount ({selectedFromAsset.symbol})</span>
                            <span>Total</span>
                          </div>
                          {orderBook.asks.slice(0, 5).map((ask, index) => (
                            <div key={index} className="orderbook-row text-danger">
                              <span>{ask.price}</span>
                              <span>{ask.amount}</span>
                              <span>{ask.total}</span>
                            </div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div className="orderbook-placeholder text-center py-4">
                    <p className="text-muted">Select trading pair to view order book</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          {/* Trading Panel */}
          <Col lg={4}>
            <Card className="trading-panel mb-3">
              <Card.Body>
                <div className="trading-tabs mb-3">
                  <div className="btn-group w-100" role="group">
                    <button 
                      type="button"
                      className={`btn ${tradeType === 'buy' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setTradeType('buy')}
                    >
                      Buy {selectedFromAsset?.symbol || ''}
                    </button>
                    <button 
                      type="button"
                      className={`btn ${tradeType === 'sell' ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => setTradeType('sell')}
                    >
                      Sell {selectedFromAsset?.symbol || ''}
                    </button>
                  </div>
                </div>
                
                <div className="trading-form">
                  <div className="mb-3">
                    <label className="form-label">Price ({selectedToAsset?.symbol || 'USD'})</label>
                    <input
                      type="number"
                      value={tradePrice}
                      onChange={(e) => setTradePrice(e.target.value)}
                      placeholder="0.00"
                      className="form-control"
                      step="any"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Amount ({selectedFromAsset?.symbol || ''})</label>
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="0.00"
                      className="form-control"
                      step="any"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Total ({selectedToAsset?.symbol || 'USD'})</label>
                    <input
                      type="text"
                      value={tradeAmount && tradePrice ? (parseFloat(tradeAmount) * parseFloat(tradePrice)).toFixed(6) : ''}
                      readOnly
                      placeholder="0.00"
                      className="form-control"
                    />
                  </div>
                  
                  <button
                    className={`btn w-100 ${tradeType === 'buy' ? 'btn-success' : 'btn-danger'}`}
                    onClick={handlePlaceOrder}
                    disabled={!selectedFromAsset || !selectedToAsset || !tradeAmount || !tradePrice || isPlacingOrder || !isNetworkConnected}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Placing Order...
                      </>
                    ) : (
                      `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedFromAsset?.symbol || ''}`
                    )}
                  </button>
                  
                  {!isNetworkConnected && (
                    <small className="text-muted d-block mt-2 text-center">
                      Connect wallet to place orders
                    </small>
                  )}
                </div>
              </Card.Body>
            </Card>
            
            {/* Wallet Balance */}
            <Card className="wallet-balance-card">
              <Card.Body>
                <h6 className="mb-3">Wallet Balance</h6>
                {isNetworkConnected ? (
                  <div className="balance-list">
                    {selectedFromAsset && (
                      <div className="balance-item d-flex justify-content-between">
                        <span>{selectedFromAsset.symbol}</span>
                        <span>{networkBalance?.[selectedFromAsset.symbol] || '0.00'}</span>
                      </div>
                    )}
                    {selectedToAsset && selectedToAsset.symbol !== selectedFromAsset?.symbol && (
                      <div className="balance-item d-flex justify-content-between">
                        <span>{selectedToAsset.symbol}</span>
                        <span>{networkBalance?.[selectedToAsset.symbol] || '0.00'}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted text-center">Connect wallet to view balances</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Account Orders */}
        <Row className="account-orders mt-4">
          <Col md={12}>
            <Card>
              <Card.Body>
                <h6 className="mb-3">Your Orders</h6>
                {orderHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Pair</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Price</th>
                          <th>Total</th>
                          <th>Network</th>
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderHistory.slice(0, 10).map((order) => (
                          <tr key={order.id}>
                            <td>{order.pair}</td>
                            <td>
                              <Badge bg={order.type === 'buy' ? 'success' : 'danger'}>
                                {order.type.toUpperCase()}
                              </Badge>
                            </td>
                            <td>{order.amount}</td>
                            <td>{order.price}</td>
                            <td>{order.total}</td>
                            <td>
                              <Badge bg="secondary">{order.network}</Badge>
                            </td>
                            <td>
                              <Badge bg="warning">{order.status}</Badge>
                            </td>
                            <td>{new Date(order.timestamp).toLocaleTimeString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">No orders yet</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Footer */}
        <Row className="mt-5">
          <Col>
            <div className="text-center text-muted">
              <p>
                Digital Block Exchanges uses the charting solution provided by{" "}
                <a href="https://www.tradingview.com/" rel="noreferrer" target="_blank" className="text-decoration-none">
                  TradingView
                </a>
                , a platform for traders and investors with versatile analytical tools.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Exchange;

