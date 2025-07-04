/**
 * DBX Exchange Page - Fixed Version
 * Simplified to resolve deployment issues
 * 
 * @version 3.1.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Dropdown, Badge, Spinner, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { SearchIcon, ExchangeIcon, SunIcon, MenuIcon2 } from '../Icons/';
import ExchangeGraph from '../components/ExchangeGraph';
import ExchangeRatesComponent from '../components/exchangeRatesComponent/ExchangeRatesComponent';
import GraphHeadComponent from '../components/graphHeadComponent/GraphHeadComponent';
import ExchangeWallet from '../components/exchangeWallet/ExchangeWallet';
import AccountOffersTable from '../components/accountOfferTable/AccountOffersTable';
import BookOffersTable from '../components/bookOfferTable/BookOffersTable';
import Chart from '../components/charts';
import './Exchange.css';

// Simplified network configuration to avoid import issues
const BASIC_NETWORKS = {
  XRP: { symbol: 'XRP', name: 'XRP Ledger', color: '#000000' },
  BTC: { symbol: 'BTC', name: 'Bitcoin', color: '#f7931a' },
  ETH: { symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
  BNB: { symbol: 'BNB', name: 'BNB Smart Chain', color: '#f3ba2f' },
  AVAX: { symbol: 'AVAX', name: 'Avalanche', color: '#e84142' },
  MATIC: { symbol: 'MATIC', name: 'Polygon', color: '#8247e5' },
  SOL: { symbol: 'SOL', name: 'Solana', color: '#9945ff' },
  XDC: { symbol: 'XDC', name: 'XDC Network', color: '#2a8fbb' },
  XLM: { symbol: 'XLM', name: 'Stellar', color: '#14b6e7' }
};

const Exchange = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const networkData = useSelector(state => state.networkReducers);
  const isWalletConnected = useSelector(state => state.authReducer?.isWalletConnected);
  
  // Multi-chain state
  const [selectedNetwork, setSelectedNetwork] = useState('XRP');
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

  // Network switching handler
  const handleNetworkSwitch = (network) => {
    setSelectedNetwork(network);
    setNetworkError(null);
    setIsLoadingAssets(true);
    
    // Simulate loading assets for the selected network
    setTimeout(() => {
      const mockAssets = [
        { value: `${network}_NATIVE`, label: `${BASIC_NETWORKS[network]?.name} (${network})` },
        { value: 'USDC', label: 'USD Coin (USDC)' },
        { value: 'USDT', label: 'Tether (USDT)' }
      ];
      setAvailableAssets(mockAssets);
      setIsLoadingAssets(false);
    }, 1000);
  };

  // Initialize with default network
  useEffect(() => {
    handleNetworkSwitch(selectedNetwork);
  }, []);

  // Network selector options
  const networkOptions = Object.entries(BASIC_NETWORKS).map(([key, network]) => ({
    value: key,
    label: network.name,
    symbol: network.symbol,
    color: network.color
  }));

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
    <div className="exchange-page">
      <Container fluid>
        {/* Enhanced Network Selector */}
        <Row className="mb-4">
          <Col>
            <Card className="network-selector-card">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    <h5 className="mb-3">
                      <ExchangeIcon className="me-2" />
                      Multi-Chain Exchange
                    </h5>
                    <p className="text-muted mb-0">
                      Trade assets across {Object.keys(BASIC_NETWORKS).length} blockchain networks
                    </p>
                  </Col>
                  <Col md={6}>
                    <div className="network-selection">
                      <label className="form-label">Select Network:</label>
                      <Select
                        value={networkOptions.find(opt => opt.value === selectedNetwork)}
                        onChange={(option) => handleNetworkSwitch(option.value)}
                        options={networkOptions}
                        components={{ Option: NetworkOption }}
                        className="network-select"
                        placeholder="Choose blockchain network..."
                        isSearchable={false}
                      />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Network Status */}
        {networkError && (
          <Row className="mb-3">
            <Col>
              <Alert variant="warning">
                <strong>Network Issue:</strong> {networkError}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Trading Interface */}
        <Row>
          <Col lg={8}>
            {/* Asset Selection */}
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">
                  Trading Pair Selection - {BASIC_NETWORKS[selectedNetwork]?.name}
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <label className="form-label">From Asset:</label>
                    <Select
                      value={selectedFromAsset}
                      onChange={setSelectedFromAsset}
                      options={availableAssets}
                      placeholder="Select asset to sell..."
                      isLoading={isLoadingAssets}
                      className="mb-3"
                    />
                  </Col>
                  <Col md={6}>
                    <label className="form-label">To Asset:</label>
                    <Select
                      value={selectedToAsset}
                      onChange={setSelectedToAsset}
                      options={availableAssets}
                      placeholder="Select asset to buy..."
                      isLoading={isLoadingAssets}
                      className="mb-3"
                    />
                  </Col>
                </Row>
                
                {selectedFromAsset && selectedToAsset && (
                  <div className="trading-pair-info">
                    <Badge bg="primary">
                      {selectedFromAsset.label} → {selectedToAsset.label}
                    </Badge>
                    <small className="text-muted ms-2">
                      on {BASIC_NETWORKS[selectedNetwork]?.name}
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Chart Section */}
            <Card className="mb-4">
              <Card.Header>
                <GraphHeadComponent />
              </Card.Header>
              <Card.Body>
                <Chart 
                  selectedFromAsset={selectedFromAsset}
                  selectedToAsset={selectedToAsset}
                  isDarkMode={isDarkMode}
                />
              </Card.Body>
            </Card>

            {/* Order Book */}
            <Card>
              <Card.Header>
                <h6 className="mb-0">Order Book</h6>
              </Card.Header>
              <Card.Body>
                <BookOffersTable />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Wallet Section */}
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">Wallet & Balance</h6>
              </Card.Header>
              <Card.Body>
                <ExchangeWallet />
              </Card.Body>
            </Card>

            {/* Exchange Rates */}
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">Exchange Rates</h6>
              </Card.Header>
              <Card.Body>
                <ExchangeRatesComponent />
              </Card.Body>
            </Card>

            {/* Account Orders */}
            <Card>
              <Card.Header>
                <h6 className="mb-0">Your Orders</h6>
              </Card.Header>
              <Card.Body>
                <AccountOffersTable />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Coming Soon Features */}
        <Row className="mt-4">
          <Col>
            <Card className="text-center">
              <Card.Body>
                <h5>🚀 Coming Soon: Advanced Multi-Chain Features</h5>
                <p className="text-muted">
                  Cross-chain atomic swaps, yield farming, and advanced trading tools
                </p>
                <Badge bg="info">Phase 4 Development</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Exchange;

