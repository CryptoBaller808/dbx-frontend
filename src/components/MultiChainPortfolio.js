/**
 * DBX Multi-Chain Portfolio Dashboard
 * Unified balance and transaction display across all networks
 * 
 * @version 3.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Modal, Button, Dropdown, ProgressBar } from 'react-bootstrap';
import { Tabs, Table, Tooltip } from 'antd';
import { 
  WalletOutlined, 
  SwapOutlined, 
  TrendingUpOutlined, 
  TrendingDownOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FilterOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { updateNetworkBalances } from '../redux/network/action';
import { WalletManager } from '../services/wallets';
import NetworkSelector from '../components/NetworkSelector';
import './Portfolio.css';

const { TabPane } = Tabs;

const MultiChainPortfolio = () => {
  const dispatch = useDispatch();
  const { activeNetwork, networkType, connectedNetworks, networkBalances } = useSelector(state => state.networkReducers);
  
  // Portfolio state
  const [portfolioData, setPortfolioData] = useState({});
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [portfolioChange24h, setPortfolioChange24h] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // UI state
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [showBalanceValues, setShowBalanceValues] = useState(true);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('value');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    loadPortfolioData();
    loadTransactionHistory();
  }, [connectedNetworks, networkType]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(connectedNetworks || {}).length > 0) {
        loadPortfolioData();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [connectedNetworks]);

  const loadPortfolioData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const portfolioData = {};
      let totalValue = 0;
      let totalChange = 0;
      
      // Load data for each connected network
      for (const [network, connection] of Object.entries(connectedNetworks || {})) {
        if (connection.isConnected) {
          const networkData = await loadNetworkPortfolio(network);
          portfolioData[network] = networkData;
          totalValue += networkData.totalValue;
          totalChange += networkData.change24h;
        }
      }
      
      setPortfolioData(portfolioData);
      setTotalPortfolioValue(totalValue);
      setPortfolioChange24h(totalChange);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
      setError('Failed to load portfolio data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadNetworkPortfolio = async (network) => {
    // Mock portfolio data - will be replaced with actual API calls
    const mockPrices = {
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

    const networkConfig = SUPPORTED_NETWORKS[network];
    const nativeSymbol = networkConfig?.nativeSymbol || network;
    
    // Generate mock balances
    const assets = [];
    const nativeBalance = Math.random() * 10;
    const nativePrice = mockPrices[nativeSymbol] || 1;
    const nativeValue = nativeBalance * nativePrice;
    
    assets.push({
      symbol: nativeSymbol,
      name: networkConfig?.name || network,
      balance: nativeBalance.toFixed(6),
      price: nativePrice,
      value: nativeValue,
      change24h: (Math.random() - 0.5) * 20,
      icon: networkConfig?.icon || '/images/networks/default.png',
      type: 'native'
    });
    
    // Add some token balances
    const tokens = ['USDC', 'USDT', 'DAI', 'WBTC'];
    tokens.forEach(token => {
      if (Math.random() > 0.5) { // 50% chance to have this token
        const balance = Math.random() * 1000;
        const price = mockPrices[token] || 1;
        const value = balance * price;
        
        assets.push({
          symbol: token,
          name: getTokenName(token),
          balance: balance.toFixed(6),
          price: price,
          value: value,
          change24h: (Math.random() - 0.5) * 10,
          icon: `/images/tokens/${token.toLowerCase()}.png`,
          type: 'token'
        });
      }
    });
    
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalChange = assets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);
    
    return {
      network,
      assets,
      totalValue,
      change24h: totalChange,
      changePercent: totalValue > 0 ? (totalChange / totalValue) * 100 : 0
    };
  };

  const loadTransactionHistory = async () => {
    setIsLoadingTransactions(true);
    
    try {
      // Mock transaction data
      const mockTransactions = [];
      const transactionTypes = ['send', 'receive', 'swap', 'trade', 'nft'];
      const networks = Object.keys(connectedNetworks || {});
      
      for (let i = 0; i < 50; i++) {
        const network = networks[Math.floor(Math.random() * networks.length)];
        const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const amount = (Math.random() * 10).toFixed(6);
        const networkConfig = SUPPORTED_NETWORKS[network];
        
        mockTransactions.push({
          id: `tx_${i + 1}`,
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          type,
          network,
          amount,
          symbol: networkConfig?.nativeSymbol || network,
          usdValue: (parseFloat(amount) * (Math.random() * 1000 + 100)).toFixed(2),
          from: `0x${Math.random().toString(16).substr(2, 8)}...`,
          to: `0x${Math.random().toString(16).substr(2, 8)}...`,
          status: Math.random() > 0.1 ? 'confirmed' : 'pending',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          fee: (Math.random() * 0.01).toFixed(6),
          confirmations: Math.floor(Math.random() * 100)
        });
      }
      
      // Sort by timestamp (newest first)
      mockTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const getTokenName = (symbol) => {
    const tokenNames = {
      'USDC': 'USD Coin',
      'USDT': 'Tether USD',
      'DAI': 'Dai Stablecoin',
      'WBTC': 'Wrapped Bitcoin',
      'BUSD': 'Binance USD'
    };
    return tokenNames[symbol] || symbol;
  };

  const getFilteredAssets = () => {
    let allAssets = [];
    
    // Collect assets from all networks or selected network
    if (selectedNetwork === 'all') {
      Object.values(portfolioData).forEach(networkData => {
        allAssets = allAssets.concat(networkData.assets.map(asset => ({
          ...asset,
          network: networkData.network
        })));
      });
    } else if (portfolioData[selectedNetwork]) {
      allAssets = portfolioData[selectedNetwork].assets.map(asset => ({
        ...asset,
        network: selectedNetwork
      }));
    }
    
    // Filter small balances
    if (hideSmallBalances) {
      allAssets = allAssets.filter(asset => asset.value >= 1);
    }
    
    // Sort assets
    switch (sortBy) {
      case 'value':
        allAssets.sort((a, b) => b.value - a.value);
        break;
      case 'change':
        allAssets.sort((a, b) => b.change24h - a.change24h);
        break;
      case 'symbol':
        allAssets.sort((a, b) => a.symbol.localeCompare(b.symbol));
        break;
      case 'balance':
        allAssets.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
        break;
    }
    
    return allAssets;
  };

  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Network filter
    if (selectedNetwork !== 'all') {
      filtered = filtered.filter(tx => tx.network === selectedNetwork);
    }
    
    // Type filter
    if (transactionFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === transactionFilter);
    }
    
    return filtered;
  };

  const formatCurrency = (value, showValue = true) => {
    if (!showValue || !showBalanceValues) {
      return '****';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    const formatted = Math.abs(value).toFixed(2);
    return `${value >= 0 ? '+' : '-'}${formatted}%`;
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'send': return '↗️';
      case 'receive': return '↙️';
      case 'swap': return '🔄';
      case 'trade': return '📈';
      case 'nft': return '🎨';
      default: return '💫';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'failed':
        return <Badge bg="danger">Failed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const handleRefresh = () => {
    loadPortfolioData();
    loadTransactionHistory();
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const exportTransactions = () => {
    // Mock export functionality
    alert('Export functionality coming soon!');
  };

  const AssetCard = ({ asset }) => (
    <Card className="asset-card mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={2}>
            <img 
              src={asset.icon} 
              alt={asset.symbol}
              className="asset-icon"
              onError={(e) => {
                e.target.src = '/images/networks/default.png';
              }}
            />
          </Col>
          <Col xs={4}>
            <div>
              <h6 className="asset-symbol mb-1">{asset.symbol}</h6>
              <small className="text-muted">{asset.name}</small>
              {asset.network && (
                <div>
                  <Badge bg="secondary" className="network-badge">{asset.network}</Badge>
                </div>
              )}
            </div>
          </Col>
          <Col xs={3} className="text-end">
            <div className="asset-balance">
              {showBalanceValues ? asset.balance : '****'}
            </div>
            <small className="text-muted">{asset.symbol}</small>
          </Col>
          <Col xs={3} className="text-end">
            <div className="asset-value">
              {formatCurrency(asset.value)}
            </div>
            <div className={`asset-change ${asset.change24h >= 0 ? 'positive' : 'negative'}`}>
              {asset.change24h >= 0 ? <TrendingUpOutlined /> : <TrendingDownOutlined />}
              {formatPercentage(asset.change24h)}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="portfolio-dashboard">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <WalletOutlined className="me-2" />
                Multi-Chain Portfolio
              </h2>
              <p className="text-muted mb-0">
                Track your assets across all blockchain networks
                {lastUpdated && (
                  <small className="ms-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </small>
                )}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowBalanceValues(!showBalanceValues)}
              >
                {showBalanceValues ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <ReloadOutlined className={isLoading ? 'spinning' : ''} />
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Portfolio Overview */}
      <Row className="mb-4">
        <Col lg={4}>
          <Card className="portfolio-summary-card">
            <Card.Body>
              <h6 className="text-muted mb-2">Total Portfolio Value</h6>
              <h2 className="portfolio-value mb-2">
                {formatCurrency(totalPortfolioValue)}
              </h2>
              <div className={`portfolio-change ${portfolioChange24h >= 0 ? 'positive' : 'negative'}`}>
                {portfolioChange24h >= 0 ? <TrendingUpOutlined /> : <TrendingDownOutlined />}
                {formatCurrency(Math.abs(portfolioChange24h))} (
                {formatPercentage(totalPortfolioValue > 0 ? (portfolioChange24h / totalPortfolioValue) * 100 : 0)})
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="portfolio-stats-card">
            <Card.Body>
              <h6 className="text-muted mb-3">Network Distribution</h6>
              {Object.entries(portfolioData).map(([network, data]) => (
                <div key={network} className="network-distribution mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center">
                      <img 
                        src={SUPPORTED_NETWORKS[network]?.icon} 
                        alt={network}
                        className="network-icon-small me-2"
                      />
                      <span>{network}</span>
                    </div>
                    <span>{formatCurrency(data.totalValue)}</span>
                  </div>
                  <ProgressBar 
                    now={totalPortfolioValue > 0 ? (data.totalValue / totalPortfolioValue) * 100 : 0}
                    variant={data.changePercent >= 0 ? 'success' : 'danger'}
                    style={{ height: '4px' }}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="portfolio-actions-card">
            <Card.Body>
              <h6 className="text-muted mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button variant="primary" size="sm">
                  <SwapOutlined className="me-2" />
                  Cross-Chain Swap
                </Button>
                <Button variant="outline-primary" size="sm">
                  <DownloadOutlined className="me-2" />
                  Export Portfolio
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <FilterOutlined className="me-2" />
                  Advanced Filters
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        <Col lg={8}>
          <Card className="assets-card">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Assets</h5>
                <div className="d-flex align-items-center gap-2">
                  <NetworkSelector
                    selectedNetwork={selectedNetwork}
                    onNetworkChange={setSelectedNetwork}
                    showBalance={false}
                    compact={true}
                    includeAllOption={true}
                  />
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      Sort: {sortBy}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setSortBy('value')}>By Value</Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy('change')}>By Change</Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy('symbol')}>By Symbol</Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy('balance')}>By Balance</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button
                    variant={hideSmallBalances ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setHideSmallBalances(!hideSmallBalances)}
                  >
                    Hide Small
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading portfolio data...</p>
                </div>
              ) : getFilteredAssets().length > 0 ? (
                getFilteredAssets().map((asset, index) => (
                  <AssetCard key={`${asset.network}-${asset.symbol}-${index}`} asset={asset} />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No assets found</p>
                  <small>Connect your wallets to view your portfolio</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="transactions-card">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Transactions</h5>
                <div className="d-flex align-items-center gap-2">
                  <select
                    value={transactionFilter}
                    onChange={(e) => setTransactionFilter(e.target.value)}
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                  >
                    <option value="all">All Types</option>
                    <option value="send">Send</option>
                    <option value="receive">Receive</option>
                    <option value="swap">Swap</option>
                    <option value="trade">Trade</option>
                    <option value="nft">NFT</option>
                  </select>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={exportTransactions}
                  >
                    <DownloadOutlined />
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="transactions-body">
              {isLoadingTransactions ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" />
                  <p className="mt-2">Loading transactions...</p>
                </div>
              ) : getFilteredTransactions().length > 0 ? (
                getFilteredTransactions().slice(0, 10).map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="transaction-item"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <div className="d-flex align-items-center">
                      <div className="transaction-icon me-3">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="transaction-type">
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </div>
                            <small className="text-muted">
                              {new Date(transaction.timestamp).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="text-end">
                            <div className="transaction-amount">
                              {transaction.amount} {transaction.symbol}
                            </div>
                            <small className="text-muted">
                              ${transaction.usdValue}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <Badge bg="secondary" className="network-badge-small">
                            {transaction.network}
                          </Badge>
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No transactions found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction Detail Modal */}
      <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div className="transaction-details">
              <div className="detail-row">
                <span>Transaction Hash</span>
                <span className="hash-text">{selectedTransaction.hash}</span>
              </div>
              <div className="detail-row">
                <span>Type</span>
                <span>
                  {getTransactionIcon(selectedTransaction.type)} {selectedTransaction.type}
                </span>
              </div>
              <div className="detail-row">
                <span>Network</span>
                <Badge bg="secondary">{selectedTransaction.network}</Badge>
              </div>
              <div className="detail-row">
                <span>Amount</span>
                <span>{selectedTransaction.amount} {selectedTransaction.symbol}</span>
              </div>
              <div className="detail-row">
                <span>USD Value</span>
                <span>${selectedTransaction.usdValue}</span>
              </div>
              <div className="detail-row">
                <span>From</span>
                <span className="address-text">{selectedTransaction.from}</span>
              </div>
              <div className="detail-row">
                <span>To</span>
                <span className="address-text">{selectedTransaction.to}</span>
              </div>
              <div className="detail-row">
                <span>Fee</span>
                <span>{selectedTransaction.fee} {selectedTransaction.symbol}</span>
              </div>
              <div className="detail-row">
                <span>Status</span>
                {getStatusBadge(selectedTransaction.status)}
              </div>
              <div className="detail-row">
                <span>Confirmations</span>
                <span>{selectedTransaction.confirmations}</span>
              </div>
              <div className="detail-row">
                <span>Timestamp</span>
                <span>{new Date(selectedTransaction.timestamp).toLocaleString()}</span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransactionModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => alert('View on explorer coming soon!')}>
            View on Explorer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MultiChainPortfolio;

