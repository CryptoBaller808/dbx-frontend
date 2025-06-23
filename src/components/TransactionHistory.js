/**
 * DBX Transaction History Component
 * Multi-chain transaction display with filtering and search
 * 
 * @version 4.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Dropdown, Spinner, Alert, Pagination } from 'react-bootstrap';
import { SearchIcon, FilterIcon, ExternalLinkIcon, RefreshIcon, CalendarIcon } from '../Icons';
import transactionHistoryService from '../services/transactionHistoryService';
import './TransactionHistory.css';

const TransactionHistory = ({
  walletAddress,
  selectedNetworks = null,
  selectedTokens = null,
  className = "",
  showFilters = true,
  pageSize = 20
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
    timeRange: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // Load transaction history
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
          limit: pageSize,
          offset: (currentPage - 1) * pageSize
        };

        const result = await transactionHistoryService.getWalletTransactionHistory(walletAddress, options);
        setTransactions(result.transactions);
        setTotalTransactions(result.total);
        setHasMore(result.hasMore);

        // Load statistics if first page
        if (currentPage === 1) {
          const stats = await transactionHistoryService.getWalletStatistics(walletAddress);
          setStatistics(stats);
        }
      } catch (err) {
        setError('Failed to load transaction history');
        console.error('Transaction history error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [walletAddress, filters, currentPage, pageSize]);

  // Handle search
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

  // Format transaction amount
  const formatAmount = useCallback((amount, symbol) => {
    if (!amount) return '0';
    
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M ${symbol}`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K ${symbol}`;
    } else if (amount >= 1) {
      return `${amount.toFixed(4)} ${symbol}`;
    } else {
      return `${amount.toFixed(8)} ${symbol}`;
    }
  }, []);

  // Format USD value
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

  // Format timestamp
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
    
    return date.toLocaleDateString();
  }, []);

  // Get status badge variant
  const getStatusVariant = useCallback((status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  }, []);

  // Get transaction type badge variant
  const getTypeVariant = useCallback((type) => {
    switch (type) {
      case 'send': return 'primary';
      case 'receive': return 'success';
      case 'swap': return 'info';
      case 'stake': return 'warning';
      case 'unstake': return 'warning';
      case 'bridge': return 'secondary';
      case 'contract': return 'dark';
      default: return 'light';
    }
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(totalTransactions / pageSize);

  if (error) {
    return (
      <Alert variant="danger" className={`transaction-history-error ${className}`}>
        <strong>Error:</strong> {error}
        <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => window.location.reload()}>
          <RefreshIcon className="me-1" />
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className={`transaction-history ${className}`}>
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
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Search and Filters */}
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
                  placeholder="Search transactions..."
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
                    <FilterIcon className="me-1" />
                    Networks ({filters.networks.length})
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {['BTC', 'ETH', 'BNB', 'AVAX', 'MATIC', 'SOL', 'XDC', 'XRP', 'XLM'].map(network => (
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
                        {network}
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

      {/* Transaction Table */}
      <Card className="transactions-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Transaction History</h5>
            <Button variant="outline-primary" size="sm" onClick={() => window.location.reload()}>
              <RefreshIcon className="me-1" />
              Refresh
            </Button>
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
              <p>No transactions found</p>
              {searchQuery && (
                <Button variant="link" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <Table responsive hover className="transactions-table">
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
                {transactions.map((tx, index) => (
                  <tr key={tx.id || index} className="transaction-row">
                    <td>
                      <Badge bg={getTypeVariant(tx.type)} className="type-badge">
                        {tx.type}
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
                        <div className="amount">{formatAmount(tx.amount, tx.tokenSymbol)}</div>
                        <div className="description">{tx.description}</div>
                      </div>
                    </td>
                    <td>
                      <span className="usd-value">{formatUSD(tx.valueUSD)}</span>
                    </td>
                    <td>
                      <Badge bg="secondary" className="network-badge">
                        {tx.network}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(tx.status)} className="status-badge">
                        {tx.status}
                      </Badge>
                    </td>
                    <td>
                      <span className="timestamp">{formatTimestamp(tx.timestamp)}</span>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => window.open(`https://explorer.${tx.network.toLowerCase()}.com/tx/${tx.hash}`, '_blank')}
                      >
                        <ExternalLinkIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Card.Footer>
            <div className="d-flex justify-content-between align-items-center">
              <div className="pagination-info">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalTransactions)} of {totalTransactions} transactions
              </div>
              <Pagination size="sm" className="mb-0">
                <Pagination.Prev 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
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
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default TransactionHistory;

