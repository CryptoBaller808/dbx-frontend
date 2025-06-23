/**
 * DBX Enhanced Exchange Page
 * Multi-chain trading interface with dynamic network selection
 * 
 * @version 3.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Dropdown, Badge, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { SearchIcon, ExchangeIcon, SunIcon, MenuIcon2 } from '../Icons/';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { setNetwork, switchNetwork, updateNetworkBalances } from '../redux/network/action';
import { WalletManager } from '../services/wallets';
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
  const { activeNetwork, networkType, walletConnections, balances } = useSelector(state => state.networkReducers);
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  
  // Multi-chain state
  const [selectedNetwork, setSelectedNetwork] = useState(activeNetwork || 'XRP');
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedFromAsset, setSelectedFromAsset] = useState(null);
  const [selectedToAsset, setSelectedToAsset] = useState(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [exchangeData, setExchangeData] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  
  // Trading state
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradePrice, setTradePrice] = useState('');
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    loadNetworkAssets(selectedNetwork);
  }, [selectedNetwork, isWalletConnected]);

  const loadNetworkAssets = async (network) => {
    setIsLoadingAssets(true);
    try {
      const networkConfig = SUPPORTED_NETWORKS[network];
      if (!networkConfig) return;

      // Get available trading pairs for the network
      const assets = await getNetworkTradingPairs(network);
      setAvailableAssets(assets);
      
      // Set default assets if none selected
      if (assets.length > 0 && !selectedFromAsset) {
        setSelectedFromAsset(assets[0]);
        if (assets.length > 1) {
          setSelectedToAsset(assets[1]);
        }
      }
      
      // Load exchange data for selected pair
      if (selectedFromAsset && selectedToAsset) {
        await loadExchangeData(network, selectedFromAsset, selectedToAsset);
      }
    } catch (error) {
      console.error('Failed to load network assets:', error);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const getNetworkTradingPairs = async (network) => {
    // Mock data for now - will be replaced with actual API calls
    const mockAssets = {
      'BTC': [
        { symbol: 'BTC', name: 'Bitcoin', icon: '/images/networks/btc.png' },
        { symbol: 'USDT', name: 'Tether USD', icon: '/images/tokens/usdt.png' }
      ],
      'ETH': [
        { symbol: 'ETH', name: 'Ethereum', icon: '/images/networks/eth.png' },
        { symbol: 'USDC', name: 'USD Coin', icon: '/images/tokens/usdc.png' },
        { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '/images/tokens/wbtc.png' }
      ],
      'BNB': [
        { symbol: 'BNB', name: 'BNB', icon: '/images/networks/bnb.png' },
        { symbol: 'BUSD', name: 'Binance USD', icon: '/images/tokens/busd.png' }
      ],
      'AVAX': [
        { symbol: 'AVAX', name: 'Avalanche', icon: '/images/networks/avax.png' },
        { symbol: 'USDC.e', name: 'USD Coin (Bridged)', icon: '/images/tokens/usdc.png' }
      ],
      'MATIC': [
        { symbol: 'MATIC', name: 'Polygon', icon: '/images/networks/matic.png' },
        { symbol: 'USDC', name: 'USD Coin', icon: '/images/tokens/usdc.png' }
      ],
      'SOL': [
        { symbol: 'SOL', name: 'Solana', icon: '/images/networks/sol.png' },
        { symbol: 'USDC', name: 'USD Coin', icon: '/images/tokens/usdc.png' }
      ],
      'XDC': [
        { symbol: 'XDC', name: 'XDC Network', icon: '/images/networks/xdc.png' },
        { symbol: 'USDT', name: 'Tether USD', icon: '/images/tokens/usdt.png' }
      ],
      'XRP': [
        { symbol: 'XRP', name: 'XRP', icon: '/images/networks/xrp.png' },
        { symbol: 'USD', name: 'US Dollar', icon: '/images/tokens/usd.png' }
      ],
      'XLM': [
        { symbol: 'XLM', name: 'Stellar Lumens', icon: '/images/networks/xlm.png' },
        { symbol: 'USDC', name: 'USD Coin', icon: '/images/tokens/usdc.png' }
      ]
    };
    
    return mockAssets[network] || [];
  };

  const loadExchangeData = async (network, fromAsset, toAsset) => {
    try {
      // Mock exchange data - will be replaced with actual API calls
      const mockData = {
        price: '42,350.00',
        change24h: '+2.45%',
        volume24h: '1,234,567',
        high24h: '43,100.00',
        low24h: '41,800.00'
      };
      
      setExchangeData(mockData);
      
      // Mock order book data
      const mockOrderBook = {
        bids: [
          { price: '42,340.00', amount: '0.5432', total: '23,012.45' },
          { price: '42,335.00', amount: '1.2345', total: '52,234.12' },
          { price: '42,330.00', amount: '0.8765', total: '37,123.45' }
        ],
        asks: [
          { price: '42,355.00', amount: '0.7654', total: '32,456.78' },
          { price: '42,360.00', amount: '1.1234', total: '47,567.89' },
          { price: '42,365.00', amount: '0.9876', total: '41,890.12' }
        ]
      };
      
      setOrderBook(mockOrderBook);
    } catch (error) {
      console.error('Failed to load exchange data:', error);
    }
  };

  const handleNetworkChange = (network) => {
    setSelectedNetwork(network);
    dispatch(setNetwork(network));
    setSelectedFromAsset(null);
    setSelectedToAsset(null);
  };

  const handleAssetSwap = () => {
    const temp = selectedFromAsset;
    setSelectedFromAsset(selectedToAsset);
    setSelectedToAsset(temp);
  };

  const handlePlaceOrder = async () => {
    if (!tradeAmount || !tradePrice) return;
    
    setIsPlacingOrder(true);
    try {
      // Mock order placement - will be replaced with actual trading logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setTradeAmount('');
      setTradePrice('');
      
      // Show success message
      alert(`${tradeType.toUpperCase()} order placed successfully!`);
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
      <div className="asset-option">
        <img src={asset.icon} alt={asset.symbol} className="asset-icon" />
        <div className="asset-info">
          <span className="asset-symbol">{asset.symbol}</span>
          <span className="asset-name">{asset.name}</span>
        </div>
      </div>
    ),
    asset
  });

  return (
    <div className="exchange-page">
      <Container fluid>
        {/* Header with Network Selector */}
        <Row className="exchange-header">
          <Col md={6}>
            <div className="page-title">
              <ExchangeIcon className="page-icon" />
              <h2>Multi-Chain Exchange</h2>
            </div>
          </Col>
          <Col md={6} className="text-end">
            <NetworkSelector
              selectedNetwork={selectedNetwork}
              onNetworkChange={handleNetworkChange}
              showBalance={true}
            />
          </Col>
        </Row>

        {/* Trading Pair Selection */}
        <Row className="trading-pair-section">
          <Col md={12}>
            <Card className="trading-pair-card">
              <Card.Body>
                <div className="trading-pair-header">
                  <h5>Select Trading Pair</h5>
                  <Badge bg="secondary">{selectedNetwork} Network</Badge>
                </div>
                
                <div className="asset-selector-container">
                  <div className="asset-selector">
                    <label>From</label>
                    {isLoadingAssets ? (
                      <div className="loading-placeholder">
                        <Spinner animation="border" size="sm" />
                        <span>Loading assets...</span>
                      </div>
                    ) : (
                      <Select
                        value={selectedFromAsset ? formatAssetOption(selectedFromAsset) : null}
                        onChange={(option) => setSelectedFromAsset(option.asset)}
                        options={availableAssets.map(formatAssetOption)}
                        placeholder="Select asset..."
                        className="asset-select"
                      />
                    )}
                  </div>
                  
                  <button 
                    className="swap-assets-btn"
                    onClick={handleAssetSwap}
                    disabled={!selectedFromAsset || !selectedToAsset}
                  >
                    ⇄
                  </button>
                  
                  <div className="asset-selector">
                    <label>To</label>
                    {isLoadingAssets ? (
                      <div className="loading-placeholder">
                        <Spinner animation="border" size="sm" />
                        <span>Loading assets...</span>
                      </div>
                    ) : (
                      <Select
                        value={selectedToAsset ? formatAssetOption(selectedToAsset) : null}
                        onChange={(option) => setSelectedToAsset(option.asset)}
                        options={availableAssets.map(formatAssetOption)}
                        placeholder="Select asset..."
                        className="asset-select"
                      />
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Trading Interface */}
        <Row className="trading-interface">
          {/* Chart and Market Data */}
          <Col lg={8}>
            <Card className="chart-card">
              <Card.Body>
                {selectedFromAsset && selectedToAsset ? (
                  <>
                    <GraphHeadComponent 
                      fromAsset={selectedFromAsset}
                      toAsset={selectedToAsset}
                      exchangeData={exchangeData}
                    />
                    <Chart 
                      symbol={`${selectedFromAsset.symbol}${selectedToAsset.symbol}`}
                      network={selectedNetwork}
                    />
                  </>
                ) : (
                  <div className="chart-placeholder">
                    <h5>Select trading pair to view chart</h5>
                    <p>Choose both assets to start trading</p>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            {/* Order Book */}
            <Card className="orderbook-card mt-3">
              <Card.Body>
                <h6>Order Book</h6>
                {selectedFromAsset && selectedToAsset ? (
                  <BookOffersTable 
                    orderBook={orderBook}
                    fromAsset={selectedFromAsset}
                    toAsset={selectedToAsset}
                  />
                ) : (
                  <div className="orderbook-placeholder">
                    <p>Select trading pair to view order book</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          {/* Trading Panel */}
          <Col lg={4}>
            <Card className="trading-panel">
              <Card.Body>
                <div className="trading-tabs">
                  <button 
                    className={`tab-btn ${tradeType === 'buy' ? 'active buy' : ''}`}
                    onClick={() => setTradeType('buy')}
                  >
                    Buy {selectedFromAsset?.symbol || ''}
                  </button>
                  <button 
                    className={`tab-btn ${tradeType === 'sell' ? 'active sell' : ''}`}
                    onClick={() => setTradeType('sell')}
                  >
                    Sell {selectedFromAsset?.symbol || ''}
                  </button>
                </div>
                
                <div className="trading-form">
                  <div className="form-group">
                    <label>Price ({selectedToAsset?.symbol || 'USD'})</label>
                    <input
                      type="number"
                      value={tradePrice}
                      onChange={(e) => setTradePrice(e.target.value)}
                      placeholder="0.00"
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Amount ({selectedFromAsset?.symbol || ''})</label>
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="0.00"
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Total ({selectedToAsset?.symbol || 'USD'})</label>
                    <input
                      type="text"
                      value={tradeAmount && tradePrice ? (parseFloat(tradeAmount) * parseFloat(tradePrice)).toFixed(2) : ''}
                      readOnly
                      placeholder="0.00"
                      className="form-control"
                    />
                  </div>
                  
                  <button
                    className={`place-order-btn ${tradeType}`}
                    onClick={handlePlaceOrder}
                    disabled={!selectedFromAsset || !selectedToAsset || !tradeAmount || !tradePrice || isPlacingOrder}
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
                </div>
              </Card.Body>
            </Card>
            
            {/* Wallet Balance */}
            <ExchangeWallet 
              selectedNetwork={selectedNetwork}
              selectedAssets={[selectedFromAsset, selectedToAsset].filter(Boolean)}
            />
          </Col>
        </Row>

        {/* Account Orders */}
        <Row className="account-orders">
          <Col md={12}>
            <Card>
              <Card.Body>
                <h6>Your Orders</h6>
                <AccountOffersTable 
                  network={selectedNetwork}
                  tradingPair={selectedFromAsset && selectedToAsset ? 
                    `${selectedFromAsset.symbol}/${selectedToAsset.symbol}` : null
                  }
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Exchange;

