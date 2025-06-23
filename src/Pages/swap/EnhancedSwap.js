/**
 * DBX Enhanced Swap Page
 * Cross-chain swap interface with wallet auto-detection
 * 
 * @version 3.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import { Tabs } from 'antd';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { SUPPORTED_NETWORKS } from '../../config/networks';
import { setNetwork, updateNetworkBalances } from '../../redux/network/action';
import { WalletManager } from '../../services/wallets';
import NetworkSelector from '../../components/NetworkSelector';
import SwapComponent from '../../components/swapComponent/SwapComponent';
import './style.css';
import './EnhancedSwap.css';

const ActionButton = styled(Button)({
  background: 'linear-gradient(to right, #A7D63FE5, #39B54A, #9FD340)',
  border: 'none',
  color: '#fff',
  width: '100%',
  margin: '5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '56px',
  borderRadius: '12px',
  '&:hover': {
    background: 'linear-gradient(to right, #96C235, #2A8F3A, #8BC230)',
  },
  '&:disabled': {
    background: '#ccc',
    color: '#666',
  }
});

const TokenButton = styled(Button)({
  backgroundColor: '#E7E8EA4D',
  border: '1px solid #E7E8EA4D',
  color: '#000',
  width: '100%',
  margin: '5px',
  padding: '0px 20px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '56px',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: '#D7D8DA',
  }
});

const EnhancedSwap = () => {
  const dispatch = useDispatch();
  const { activeNetwork, networkType, walletConnections, balances } = useSelector(state => state.networkReducers);
  const isWalletConnected = useSelector(state => state.authReducer.isWalletConnected);
  
  // Cross-chain swap state
  const [fromNetwork, setFromNetwork] = useState(activeNetwork || 'XRP');
  const [toNetwork, setToNetwork] = useState('ETH');
  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapQuote, setSwapQuote] = useState(null);
  const [slippage, setSlippage] = useState(0.5); // 0.5% default slippage
  const [availableAssets, setAvailableAssets] = useState({});
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [swapRoute, setSwapRoute] = useState(null);
  const [estimatedGas, setEstimatedGas] = useState(null);

  useEffect(() => {
    loadNetworkAssets();
  }, []);

  useEffect(() => {
    if (fromAsset && toAsset && fromAmount) {
      getSwapQuote();
    }
  }, [fromAsset, toAsset, fromAmount, slippage]);

  const loadNetworkAssets = async () => {
    setIsLoadingAssets(true);
    try {
      const assets = {};
      
      for (const [networkSymbol, networkConfig] of Object.entries(SUPPORTED_NETWORKS)) {
        assets[networkSymbol] = await getNetworkAssets(networkSymbol);
      }
      
      setAvailableAssets(assets);
      
      // Set default assets
      if (assets[fromNetwork]?.length > 0) {
        setFromAsset(assets[fromNetwork][0]);
      }
      if (assets[toNetwork]?.length > 0) {
        setToAsset(assets[toNetwork][0]);
      }
    } catch (error) {
      console.error('Failed to load network assets:', error);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const getNetworkAssets = async (network) => {
    // Mock data for now - will be replaced with actual API calls
    const mockAssets = {
      'BTC': [
        { symbol: 'BTC', name: 'Bitcoin', icon: '/images/networks/btc.png', balance: '0.5432' },
        { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '/images/tokens/wbtc.png', balance: '0.0000' }
      ],
      'ETH': [
        { symbol: 'ETH', name: 'Ethereum', icon: '/images/networks/eth.png', balance: '2.3456' },
        { symbol: 'USDC', name: 'USD Coin', icon: '/images/tokens/usdc.png', balance: '1,234.56' },
        { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '/images/tokens/wbtc.png', balance: '0.1234' }
      ],
      'BNB': [
        { symbol: 'BNB', name: 'BNB', icon: '/images/networks/bnb.png', balance: '5.6789' },
        { symbol: 'BUSD', name: 'Binance USD', icon: '/images/tokens/busd.png', balance: '2,345.67' }
      ],
      'AVAX': [
        { symbol: 'AVAX', name: 'Avalanche', icon: '/images/networks/avax.png', balance: '12.3456' },
        { symbol: 'USDC.e', name: 'USD Coin (Bridged)', icon: '/images/tokens/usdc.png', balance: '567.89' }
      ],
      'MATIC': [
        { symbol: 'MATIC', name: 'Polygon', icon: '/images/networks/matic.png', balance: '1,234.56' },
        { symbol: 'USDC', name: 'USD Coin', icon: '/images/tokens/usdc.png', balance: '890.12' }
      ],
      'SOL': [
        { symbol: 'SOL', name: 'Solana', icon: '/images/networks/sol.png', balance: '45.6789' },
        { symbol: 'USDC', name: 'USD Coin', icon: '/images/tokens/usdc.png', balance: '1,567.89' }
      ],
      'XDC': [
        { symbol: 'XDC', name: 'XDC Network', icon: '/images/networks/xdc.png', balance: '10,000.00' },
        { symbol: 'USDT', name: 'Tether USD', icon: '/images/tokens/usdt.png', balance: '500.00' }
      ],
      'XRP': [
        { symbol: 'XRP', name: 'XRP', icon: '/images/networks/xrp.png', balance: '2,345.67' },
        { symbol: 'USD', name: 'US Dollar', icon: '/images/tokens/usd.png', balance: '1,000.00' }
      ],
      'XLM': [
        { symbol: 'XLM', name: 'Stellar Lumens', icon: '/images/networks/xlm.png', balance: '3,456.78' },
        { symbol: 'USDC', name: 'USD Coin', icon: '/images/tokens/usdc.png', balance: '789.01' }
      ]
    };
    
    return mockAssets[network] || [];
  };

  const getSwapQuote = async () => {
    if (!fromAsset || !toAsset || !fromAmount) return;
    
    setIsLoadingRate(true);
    try {
      // Mock swap quote - will be replaced with actual cross-chain bridge APIs
      const mockRate = Math.random() * 100 + 1;
      const mockToAmount = (parseFloat(fromAmount) * mockRate).toFixed(6);
      const mockGas = '$2.50';
      const mockRoute = fromNetwork === toNetwork ? 'Direct Swap' : 'Cross-Chain Bridge';
      
      setExchangeRate(mockRate);
      setToAmount(mockToAmount);
      setEstimatedGas(mockGas);
      setSwapRoute(mockRoute);
      
      const quote = {
        fromAmount,
        toAmount: mockToAmount,
        rate: mockRate,
        slippage,
        estimatedGas: mockGas,
        route: mockRoute,
        priceImpact: '0.12%',
        minimumReceived: (parseFloat(mockToAmount) * (1 - slippage / 100)).toFixed(6)
      };
      
      setSwapQuote(quote);
    } catch (error) {
      console.error('Failed to get swap quote:', error);
    } finally {
      setIsLoadingRate(false);
    }
  };

  const handleSwap = async () => {
    if (!swapQuote || !fromAsset || !toAsset) return;
    
    setIsSwapping(true);
    try {
      // Mock swap execution - will be replaced with actual swap logic
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      setSwapQuote(null);
      
      // Show success message
      alert(`Successfully swapped ${fromAmount} ${fromAsset.symbol} for ${swapQuote.toAmount} ${toAsset.symbol}!`);
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  const handleNetworkSwap = () => {
    const tempNetwork = fromNetwork;
    const tempAsset = fromAsset;
    
    setFromNetwork(toNetwork);
    setToNetwork(tempNetwork);
    
    // Swap assets if they exist on the new networks
    if (availableAssets[toNetwork]?.length > 0) {
      setFromAsset(availableAssets[toNetwork][0]);
    }
    if (availableAssets[tempNetwork]?.length > 0) {
      setToAsset(availableAssets[tempNetwork][0]);
    }
  };

  const formatAssetDisplay = (asset) => (
    <div className="asset-display">
      <img src={asset.icon} alt={asset.symbol} className="asset-icon" />
      <div className="asset-info">
        <span className="asset-symbol">{asset.symbol}</span>
        <span className="asset-balance">Balance: {asset.balance}</span>
      </div>
    </div>
  );

  const isCrossChain = fromNetwork !== toNetwork;

  return (
    <div className="enhanced-swap-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="swap-card">
              <Card.Header className="swap-header">
                <h4>Cross-Chain Swap</h4>
                <div className="slippage-settings">
                  <span>Slippage: </span>
                  <select 
                    value={slippage} 
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    className="slippage-select"
                  >
                    <option value={0.1}>0.1%</option>
                    <option value={0.5}>0.5%</option>
                    <option value={1.0}>1.0%</option>
                    <option value={2.0}>2.0%</option>
                  </select>
                </div>
              </Card.Header>
              
              <Card.Body className="swap-body">
                {/* From Section */}
                <div className="swap-section">
                  <div className="section-header">
                    <span>From</span>
                    <NetworkSelector
                      selectedNetwork={fromNetwork}
                      onNetworkChange={setFromNetwork}
                      compact={true}
                    />
                  </div>
                  
                  <div className="asset-input-container">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="amount-input"
                    />
                    
                    <div className="asset-selector">
                      {isLoadingAssets ? (
                        <div className="loading-asset">
                          <Spinner animation="border" size="sm" />
                        </div>
                      ) : (
                        <TokenButton
                          onClick={() => {/* Open asset selection modal */}}
                          disabled={!availableAssets[fromNetwork]?.length}
                        >
                          {fromAsset ? formatAssetDisplay(fromAsset) : 'Select Asset'}
                        </TokenButton>
                      )}
                    </div>
                  </div>
                  
                  {fromAsset && (
                    <div className="asset-balance">
                      Available: {fromAsset.balance} {fromAsset.symbol}
                    </div>
                  )}
                </div>

                {/* Swap Button */}
                <div className="swap-direction">
                  <button 
                    className="swap-direction-btn"
                    onClick={handleNetworkSwap}
                    title="Swap networks and assets"
                  >
                    ⇅
                  </button>
                  
                  {isCrossChain && (
                    <Badge bg="info" className="cross-chain-badge">
                      Cross-Chain
                    </Badge>
                  )}
                </div>

                {/* To Section */}
                <div className="swap-section">
                  <div className="section-header">
                    <span>To</span>
                    <NetworkSelector
                      selectedNetwork={toNetwork}
                      onNetworkChange={setToNetwork}
                      compact={true}
                    />
                  </div>
                  
                  <div className="asset-input-container">
                    <input
                      type="text"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="amount-input readonly"
                    />
                    
                    <div className="asset-selector">
                      {isLoadingAssets ? (
                        <div className="loading-asset">
                          <Spinner animation="border" size="sm" />
                        </div>
                      ) : (
                        <TokenButton
                          onClick={() => {/* Open asset selection modal */}}
                          disabled={!availableAssets[toNetwork]?.length}
                        >
                          {toAsset ? formatAssetDisplay(toAsset) : 'Select Asset'}
                        </TokenButton>
                      )}
                    </div>
                  </div>
                  
                  {toAsset && swapQuote && (
                    <div className="asset-balance">
                      Minimum received: {swapQuote.minimumReceived} {toAsset.symbol}
                    </div>
                  )}
                </div>

                {/* Swap Details */}
                {swapQuote && (
                  <div className="swap-details">
                    <div className="detail-row">
                      <span>Exchange Rate:</span>
                      <span>1 {fromAsset.symbol} = {exchangeRate?.toFixed(6)} {toAsset.symbol}</span>
                    </div>
                    <div className="detail-row">
                      <span>Route:</span>
                      <span>{swapRoute}</span>
                    </div>
                    <div className="detail-row">
                      <span>Price Impact:</span>
                      <span className="price-impact">{swapQuote.priceImpact}</span>
                    </div>
                    <div className="detail-row">
                      <span>Estimated Gas:</span>
                      <span>{estimatedGas}</span>
                    </div>
                  </div>
                )}

                {/* Cross-chain Warning */}
                {isCrossChain && (
                  <Alert variant="info" className="cross-chain-alert">
                    <strong>Cross-Chain Swap</strong>
                    <br />
                    This swap will bridge assets between {fromNetwork} and {toNetwork} networks. 
                    Transaction may take 5-15 minutes to complete.
                  </Alert>
                )}

                {/* Swap Button */}
                <ActionButton
                  onClick={handleSwap}
                  disabled={!swapQuote || !fromAmount || isSwapping || isLoadingRate}
                  className="swap-execute-btn"
                >
                  {isSwapping ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {isCrossChain ? 'Bridging...' : 'Swapping...'}
                    </>
                  ) : isLoadingRate ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Getting Quote...
                    </>
                  ) : (
                    `${isCrossChain ? 'Bridge' : 'Swap'} ${fromAsset?.symbol || ''} → ${toAsset?.symbol || ''}`
                  )}
                </ActionButton>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Swaps */}
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h6>Recent Swaps</h6>
              </Card.Header>
              <Card.Body>
                <div className="recent-swaps-placeholder">
                  <p>Your recent swap transactions will appear here</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EnhancedSwap;

