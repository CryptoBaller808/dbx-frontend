/**
 * DBX Enhanced Multi-Network Transaction History Display
 * Advanced transaction tracking with wallet integration and chain-specific features
 * 
 * @version 5.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Dropdown, Spinner, Alert, Pagination, Modal, Row, Col } from 'react-bootstrap';
import { 
  SearchIcon, FilterIcon, ExternalLinkIcon, RefreshIcon, CalendarIcon, 
  WalletIcon, NetworkIcon, TrendingUpIcon, TrendingDownIcon, ClockIcon,
  CheckCircleIcon, XCircleIcon, AlertCircleIcon, InfoIcon
} from '../Icons';
import transactionHistoryService from '../services/transactionHistoryService';
import './EnhancedTransactionHistory.css';

const EnhancedTransactionHistory = ({
  walletAddress,
  selectedNetworks = null,
  selectedTokens = null,
  className = "",
  showFilters = true,
  showWalletInfo = true,
  pageSize = 20,
  autoRefresh = true,
  refreshInterval = 30000
}) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    networks: selectedNetworks || [],
    tokens: selectedTokens || [],
    types: [],
    status: [],
    timeRange: null,
    amountRange: { min: null, max: null },
    dateRange: { start: null, end: null }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [walletBalances, setWalletBalances] = useState({});
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Network configurations with explorer URLs
  const networkConfigs = {
    BTC: { 
      name: 'Bitcoin', 
      explorer: 'https://blockstream.info/tx/',
      color: '#f7931a',
      icon: '/images/tokens/btc.png'
    },
    ETH: { 
      name: 'Ethereum', 
      explorer: 'https://etherscan.io/tx/',
      color: '#627eea',
      icon: '/images/tokens/eth.png'
    },
    BNB: { 
      name: 'BNB Chain', 
      explorer: 'https://bscscan.com/tx/',
      color: '#f3ba2f',
      icon: '/images/tokens/bnb.png'
    },
    AVAX: { 
      name: 'Avalanche', 
      explorer: 'https://snowtrace.io/tx/',
      color: '#e84142',
      icon: '/images/tokens/avax.png'
    },
    MATIC: { 
      name: 'Polygon', 
      explorer: 'https://polygonscan.com/tx/',
      color: '#8247e5',
      icon: '/images/tokens/matic.png'
    },
    SOL: { 
      name: 'Solana', 
      explorer: 'https://solscan.io/tx/',
      color: '#9945ff',
      icon: '/images/tokens/sol.png'
    },
    XDC: { 
      name: 'XDC Network', 
      explorer: 'https://explorer.xinfin.network/tx/',
      color: '#00d4aa',
      icon: '/images/tokens/xdc.png'
    },
    XRP: { 
      name: 'XRP Ledger', 
      explorer: 'https://xrpscan.com/tx/',
      color: '#23292f',
      icon: '/images/tokens/xrp.png'
    },
    XLM: { 
      name: 'Stellar', 
      explorer: 'https://stellarchain.io/tx/',
      color: '#7d00ff',
      icon: '/images/tokens/xlm.png'
    }
  };

  // Load transaction history with enhanced features
  useEffect(() => {
    if (!walletAddress) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const loadTransactions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const options = {
          networks: filters.networks.length > 0 ? filters.networks : null,
          tokens: filters.tokens.length > 0 ? filters.tokens : null,
          types: filters.types.length > 0 ? filters.types : null,
          status: filters.status.length > 0 ? filters.status : null,
          timeRange: filters.timeRange,
          amountRange: filters.amountRange.min || filters.amountRange.max ? filters.amountRange : null,
          dateRange: filters.dateRange.start || filters.dateRange.end ? filters.dateRange : null,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize
        };

        const result = await transactionHistoryService.getWalletTransactionHistory(walletAddress, options);
        setTransactions(result.transactions);
        setTotalTransactions(result.total);
        setHasMore(result.hasMore);
        setLastRefresh(new Date());

        // Load statistics if first page
        if (currentPage === 1) {
          const stats = await transactionHistoryService.getWalletStatistics(walletAddress);
          setStatistics(stats);
        }

        // Load wallet balances for each network
        if (showWalletInfo) {
          const balances = {};
          for (const network of Object.keys(networkConfigs)) {
            // Mock balance data - in real implementation, this would fetch from blockchain
            balances[network] = {
              balance: (Math.random() * 10).toFixed(4),
              usdValue: (Math.random() * 1000).toFixed(2)
            };
          }
          setWalletBalances(balances);
        }
      } catch (err) {
        setError('Failed to load transaction history');
        console.error('Transaction history error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [walletAddress, filters, currentPage, pageSize, showWalletInfo]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !walletAddress) return;

    const interval = setInterval(async () => {
      try {
        const options = {
          networks: filters.networks.length > 0 ? filters.networks : null,
          limit: pageSize,
          offset: 0 // Always refresh first page
        };

        const result = await transactionHistoryService.getWalletTransactionHistory(walletAddress, options);
        
        // Only update if we're on the first page
        if (currentPage === 1) {
          setTransactions(result.transactions);
          setTotalTransactions(result.total);
          setLastRefresh(new Date());
        }
      } catch (err) {
        console.error('Auto-refresh error:', err);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [walletAddress, filters.networks, pageSize, currentPage, autoRefresh, refreshInterval]);

  // Handle search with debouncing
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchQuery('');
      return;
    }

    setSearchQuery(query);
    setIsLoading(true);
    
    try {
      const result = await transactionHistoryService.searchTransactions(walletAddress, query, { limit: pageSize });
      setTransactions(result.transactions);
      setTotalTransactions(result.total);
      setHasMore(false);
    } catch (err) {
      setError('Search failed');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, pageSize]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page
    setSearchQuery(''); // Clear search
  }, []);

  // Handle transaction details modal
  const handleTransactionClick = useCallback(async (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
    
    // Load detailed transaction information
    try {
      const details = await transactionHistoryService.getTransactionDetails(transaction.hash, transaction.network);
      if (details) {
        setSelectedTransaction(details);
      }
    } catch (err) {
      console.error('Failed to load transaction details:', err);
    }
  }, []);

  // Format transaction amount with proper decimals
  const formatAmount = useCallback((amount, symbol, network) => {
    if (!amount) return '0';
    
    // Network-specific decimal handling
    const decimals = {
      BTC: 8, ETH: 6, BNB: 6, AVAX: 6, MATIC: 6, 
      SOL: 6, XDC: 6, XRP: 6, XLM: 6
    };
    
    const decimal = decimals[network] || 6;
    
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M ${symbol}`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K ${symbol}`;
    } else if (amount >= 1) {
      return `${amount.toFixed(4)} ${symbol}`;
    } else {
      return `${amount.toFixed(decimal)} ${symbol}`;
    }
  }, []);

  // Format USD value with proper formatting
  const formatUSD = useCallback((value) => {
    if (!value) return 'N/A';
    
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  }, []);

  // Format timestamp with relative time
  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }, []);

  // Get status icon and variant
  const getStatusDisplay = useCallback((status) => {
    switch (status) {
      case 'confirmed':
        return { icon: CheckCircleIcon, variant: 'success', text: 'Confirmed' };
      case 'pending':
        return { icon: ClockIcon, variant: 'warning', text: 'Pending' };
      case 'failed':
        return { icon: XCircleIcon, variant: 'danger', text: 'Failed' };
      default:
        return { icon: AlertCircleIcon, variant: 'secondary', text: 'Unknown' };
    }
  }, []);

  // Get transaction type display
  const getTypeDisplay = useCallback((type) => {
    const types = {
      send: { variant: 'primary', icon: '↗️', text: 'Send' },
      receive: { variant: 'success', icon: '↙️', text: 'Receive' },
      swap: { variant: 'info', icon: '🔄', text: 'Swap' },
      stake: { variant: 'warning', icon: '🔒', text: 'Stake' },
      unstake: { variant: 'warning', icon: '🔓', text: 'Unstake' },
      bridge: { variant: 'secondary', icon: '🌉', text: 'Bridge' },
      contract: { variant: 'dark', icon: '📄', text: 'Contract' }
    };
    
    return types[type] || { variant: 'light', icon: '❓', text: type };
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(totalTransactions / pageSize);

  if (error) {
    return (
      <Alert variant="danger" className={`enhanced-transaction-history-error ${className}`}>
        <AlertCircleIcon className="me-2" />
        <strong>Error:</strong> {error}
        <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => window.location.reload()}>
          <RefreshIcon className="me-1" />
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className={`enhanced-transaction-history ${className}`}>
      {/* Wallet Information Panel */}
      {showWalletInfo && walletAddress && (
        <Card className="mb-3 wallet-info-card">
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <WalletIcon className="me-2" />
                <h6 className="mb-0">Wallet Overview</h6>
              </div>
              <Badge bg="success" className="wallet-status">
                Connected
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="wallet-address mb-3">
              <small className="text-muted">Address:</small>
              <div className="address-display">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                <Button variant="outline-secondary" size="sm" className="ms-2">
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="network-balances">
              <Row>
                {Object.entries(networkConfigs).slice(0, 4).map(([network, config]) => (
                  <Col key={network} xs={6} md={3} className="mb-2">
                    <div className="balance-item">
                      <img 
                        src={config.icon} 
                        alt={network}
                        className="network-icon"
                        onError={(e) => e.target.src = '/images/tokens/placeholder.png'}
                      />
                      <div className="balance-info">
                        <div className="balance-amount">
                          {walletBalances[network]?.balance || '0.0000'}
                        </div>
                        <div className="balance-usd">
                          ${walletBalances[network]?.usdValue || '0.00'}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Statistics Summary */}
      {statistics && (
        <Card className="mb-3 stats-card">
          <Card.Body>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{statistics.totalTransactions}</div>
                <div className="stat-label">Total Transactions</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{formatUSD(statistics.totalVolume)}</div>
                <div className="stat-label">Total Volume</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{statistics.successfulTransactions}</div>
                <div className="stat-label">Successful</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{statistics.pendingTransactions}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{Object.keys(statistics.networkBreakdown).length}</div>
                <div className="stat-label">Networks Used</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{formatTimestamp(lastRefresh.toISOString())}</div>
                <div className="stat-label">Last Updated</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Enhanced Search and Filters */}
      {showFilters && (
        <Card className="mb-3 filters-card">
          <Card.Body>
            <div className="filters-row">
              {/* Search */}
              <InputGroup className="search-input">
                <InputGroup.Text>
                  <SearchIcon />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by hash, token, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
                />
                <Button 
                  variant="outline-primary" 
                  onClick={() => handleSearch(searchQuery)}
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </InputGroup>

              {/* Filter Dropdowns */}
              <div className="filter-dropdowns">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <NetworkIcon className="me-1" />
                    Networks ({filters.networks.length})
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.entries(networkConfigs).map(([network, config]) => (
                      <Dropdown.Item
                        key={network}
                        active={filters.networks.includes(network)}
                        onClick={() => {
                          const newNetworks = filters.networks.includes(network)
                            ? filters.networks.filter(n => n !== network)
                            : [...filters.networks, network];
                          handleFilterChange('networks', newNetworks);
                        }}
                      >
                        <img 
                          src={config.icon} 
                          alt={network}
                          className="dropdown-icon me-2"
                          onError={(e) => e.target.src = '/images/tokens/placeholder.png'}
                        />
                        {config.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <FilterIcon className="me-1" />
                    Type ({filters.types.length})
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {['send', 'receive', 'swap', 'stake', 'unstake', 'bridge', 'contract'].map(type => (
                      <Dropdown.Item
                        key={type}
                        active={filters.types.includes(type)}
                        onClick={() => {
                          const newTypes = filters.types.includes(type)
                            ? filters.types.filter(t => t !== type)
                            : [...filters.types, type];
                          handleFilterChange('types', newTypes);
                        }}
                      >
                        {getTypeDisplay(type).icon} {getTypeDisplay(type).text}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <CalendarIcon className="me-1" />
                    Time Range
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleFilterChange('timeRange', null)}>
                      All Time
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('timeRange', 24 * 60 * 60 * 1000)}>
                      Last 24 Hours
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('timeRange', 7 * 24 * 60 * 60 * 1000)}>
                      Last 7 Days
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange('timeRange', 30 * 24 * 60 * 60 * 1000)}>
                      Last 30 Days
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Enhanced Transaction Table */}
      <Card className="transactions-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Transaction History</h5>
            <div className="header-actions">
              {autoRefresh && (
                <Badge bg="info" className="me-2">
                  Auto-refresh: {refreshInterval / 1000}s
                </Badge>
              )}
              <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
                <RefreshIcon className="me-1" />
                Refresh
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="loading-container">
              <Spinner animation="border" className="me-2" />
              <span>Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <InfoIcon className="empty-icon mb-3" />
              <p>No transactions found</p>
              {searchQuery && (
                <Button variant="link" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <Table responsive hover className="enhanced-transactions-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Asset</th>
                  <th>Amount</th>
                  <th>Value (USD)</th>
                  <th>Network</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => {
                  const statusDisplay = getStatusDisplay(tx.status);
                  const typeDisplay = getTypeDisplay(tx.type);
                  const networkConfig = networkConfigs[tx.network];
                  
                  return (
                    <tr 
                      key={tx.id || index} 
                      className="enhanced-transaction-row"
                      onClick={() => handleTransactionClick(tx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <Badge bg={typeDisplay.variant} className="type-badge">
                          {typeDisplay.icon} {typeDisplay.text}
                        </Badge>
                      </td>
                      <td>
                        <div className="asset-cell">
                          <img 
                            src={`/images/tokens/${tx.tokenSymbol.toLowerCase()}.png`}
                            alt={tx.tokenSymbol}
                            className="token-icon"
                            onError={(e) => {
                              e.target.src = '/images/tokens/placeholder.png';
                            }}
                          />
                          <div>
                            <div className="token-symbol">{tx.tokenSymbol}</div>
                            <div className="token-name">{tx.tokenName}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="amount-cell">
                          <div className="amount">
                            {formatAmount(tx.amount, tx.tokenSymbol, tx.network)}
                          </div>
                          <div className="description">{tx.description}</div>
                        </div>
                      </td>
                      <td>
                        <span className="usd-value">{formatUSD(tx.valueUSD)}</span>
                      </td>
                      <td>
                        <div className="network-cell">
                          <img 
                            src={networkConfig?.icon || '/images/tokens/placeholder.png'}
                            alt={tx.network}
                            className="network-icon"
                            onError={(e) => e.target.src = '/images/tokens/placeholder.png'}
                          />
                          <Badge 
                            bg="secondary" 
                            className="network-badge"
                            style={{ backgroundColor: networkConfig?.color }}
                          >
                            {tx.network}
                          </Badge>
                        </div>
                      </td>
                      <td>
                        <Badge bg={statusDisplay.variant} className="status-badge">
                          <statusDisplay.icon className="me-1" />
                          {statusDisplay.text}
                        </Badge>
                      </td>
                      <td>
                        <span className="timestamp">{formatTimestamp(tx.timestamp)}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`${networkConfig?.explorer}${tx.hash}`, '_blank');
                            }}
                            title="View on Explorer"
                          >
                            <ExternalLinkIcon />
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransactionClick(tx);
                            }}
                            title="View Details"
                            className="ms-1"
                          >
                            <InfoIcon />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
        
        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <Card.Footer>
            <div className="d-flex justify-content-between align-items-center">
              <div className="pagination-info">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalTransactions)} of {totalTransactions} transactions
              </div>
              <Pagination size="sm" className="mb-0">
                <Pagination.First 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                />
                <Pagination.Prev 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  if (page > totalPages) return null;
                  return (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
                <Pagination.Last 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* Transaction Details Modal */}
      <Modal 
        show={showTransactionModal} 
        onHide={() => setShowTransactionModal(false)}
        size="lg"
        className="transaction-details-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div className="transaction-details">
              <Row>
                <Col md={6}>
                  <div className="detail-group">
                    <label>Transaction Hash</label>
                    <div className="detail-value hash-value">
                      {selectedTransaction.hash}
                      <Button variant="outline-secondary" size="sm" className="ms-2">
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <label>Network</label>
                    <div className="detail-value">
                      <img 
                        src={networkConfigs[selectedTransaction.network]?.icon}
                        alt={selectedTransaction.network}
                        className="detail-network-icon me-2"
                        onError={(e) => e.target.src = '/images/tokens/placeholder.png'}
                      />
                      {networkConfigs[selectedTransaction.network]?.name} ({selectedTransaction.network})
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <label>Status</label>
                    <div className="detail-value">
                      <Badge bg={getStatusDisplay(selectedTransaction.status).variant}>
                        {getStatusDisplay(selectedTransaction.status).text}
                      </Badge>
                      {selectedTransaction.confirmations && (
                        <span className="ms-2 text-muted">
                          {selectedTransaction.confirmations} confirmations
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <label>Type</label>
                    <div className="detail-value">
                      <Badge bg={getTypeDisplay(selectedTransaction.type).variant}>
                        {getTypeDisplay(selectedTransaction.type).icon} {getTypeDisplay(selectedTransaction.type).text}
                      </Badge>
                    </div>
                  </div>
                </Col>
                
                <Col md={6}>
                  <div className="detail-group">
                    <label>Amount</label>
                    <div className="detail-value amount-large">
                      {formatAmount(selectedTransaction.amount, selectedTransaction.tokenSymbol, selectedTransaction.network)}
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <label>USD Value</label>
                    <div className="detail-value usd-large">
                      {formatUSD(selectedTransaction.valueUSD)}
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <label>Fee</label>
                    <div className="detail-value">
                      {selectedTransaction.fee} {selectedTransaction.network}
                      {selectedTransaction.feeUSD && (
                        <span className="text-muted ms-2">
                          (${selectedTransaction.feeUSD.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <label>Timestamp</label>
                    <div className="detail-value">
                      {new Date(selectedTransaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                </Col>
              </Row>
              
              <hr />
              
              <Row>
                <Col md={6}>
                  <div className="detail-group">
                    <label>From Address</label>
                    <div className="detail-value address-value">
                      {selectedTransaction.fromAddress}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-group">
                    <label>To Address</label>
                    <div className="detail-value address-value">
                      {selectedTransaction.toAddress}
                    </div>
                  </div>
                </Col>
              </Row>
              
              {selectedTransaction.blockNumber && (
                <div className="detail-group">
                  <label>Block Number</label>
                  <div className="detail-value">
                    {selectedTransaction.blockNumber}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-primary"
            onClick={() => {
              const networkConfig = networkConfigs[selectedTransaction?.network];
              if (networkConfig && selectedTransaction) {
                window.open(`${networkConfig.explorer}${selectedTransaction.hash}`, '_blank');
              }
            }}
          >
            <ExternalLinkIcon className="me-1" />
            View on Explorer
          </Button>
          <Button variant="secondary" onClick={() => setShowTransactionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EnhancedTransactionHistory;

