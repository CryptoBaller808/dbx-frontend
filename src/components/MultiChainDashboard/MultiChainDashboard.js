import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectWalletConnections,
  selectAllBalances,
  selectSupportedNetworks,
  selectNetworkConfig,
  selectIsWalletLoading,
  selectPendingTransactions
} from '../../redux/multiChainWallet/reducer';
import { 
  initializeWalletSystem,
  fetchAllBalances,
  connectToWallet 
} from '../../redux/multiChainWallet/actions';
import NetworkSelector from '../NetworkSelector/NetworkSelector';
import './MultiChainDashboard.css';

/**
 * Multi-Chain Dashboard Component
 * Unified view of all blockchain networks, balances, and connections
 */
const MultiChainDashboard = ({ 
  showNetworkSelector = true,
  showBalances = true,
  showPendingTransactions = true,
  compact = false 
}) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  
  const connections = useSelector(selectWalletConnections);
  const balances = useSelector(selectAllBalances);
  const supportedNetworks = useSelector(selectSupportedNetworks);
  const isLoading = useSelector(selectIsWalletLoading);
  const pendingTransactions = useSelector(selectPendingTransactions);
  
  // Calculate total portfolio value (would need price data in real implementation)
  const totalPortfolioValue = 0; // Placeholder
  
  // Get connected networks
  const connectedNetworks = Object.keys(connections);
  const disconnectedNetworks = supportedNetworks.filter(
    network => !connectedNetworks.includes(network)
  );
  
  useEffect(() => {
    // Initialize wallet system on component mount
    dispatch(initializeWalletSystem());
  }, [dispatch]);
  
  const handleRefreshBalances = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchAllBalances());
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleConnectWallet = async (chainId, walletType) => {
    try {
      await dispatch(connectToWallet(chainId, walletType));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  
  const formatBalance = (balance, decimals = 6) => {
    if (!balance) return '0.00';
    const num = parseFloat(balance);
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: decimals 
    });
  };
  
  const NetworkCard = ({ chainId, isConnected }) => {
    const config = useSelector(state => selectNetworkConfig(state, chainId));
    const connection = connections[chainId];
    const balance = balances[chainId];
    
    if (!config) return null;
    
    return (
      <div 
        className={`network-card ${isConnected ? 'network-card--connected' : 'network-card--disconnected'}`}
        onClick={() => setSelectedNetwork(chainId)}
      >
        <div className="network-card__header">
          <div className="network-card__info">
            <span 
              className="network-card__icon"
              style={{ color: config.color }}
            >
              {config.icon}
            </span>
            <div className="network-card__details">
              <h3 className="network-card__name">{config.name}</h3>
              <span className="network-card__symbol">{config.symbol}</span>
            </div>
          </div>
          
          <div className="network-card__status">
            {isConnected ? (
              <div className="network-card__connected">
                <div className="network-card__status-dot network-card__status-dot--connected"></div>
                <span>Connected</span>
              </div>
            ) : (
              <div className="network-card__disconnected">
                <div className="network-card__status-dot network-card__status-dot--disconnected"></div>
                <span>Not Connected</span>
              </div>
            )}
          </div>
        </div>
        
        {isConnected && (
          <div className="network-card__content">
            {connection && (
              <div className="network-card__wallet">
                <span className="network-card__wallet-label">Wallet:</span>
                <span className="network-card__wallet-type">
                  {connection.walletType || 'Unknown'}
                </span>
              </div>
            )}
            
            {balance && showBalances && (
              <div className="network-card__balance">
                <div className="network-card__balance-main">
                  <span className="network-card__balance-amount">
                    {formatBalance(balance.native?.balance, config.decimals)}
                  </span>
                  <span className="network-card__balance-symbol">
                    {config.symbol}
                  </span>
                </div>
                
                {balance.tokens && balance.tokens.length > 0 && (
                  <div className="network-card__tokens">
                    <span className="network-card__tokens-count">
                      +{balance.tokens.length} token{balance.tokens.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {connection?.address && (
              <div className="network-card__address">
                <span className="network-card__address-label">Address:</span>
                <span className="network-card__address-value">
                  {`${connection.address.slice(0, 6)}...${connection.address.slice(-4)}`}
                </span>
              </div>
            )}
          </div>
        )}
        
        {!isConnected && (
          <div className="network-card__actions">
            <button 
              className="network-card__connect-btn"
              onClick={(e) => {
                e.stopPropagation();
                // Show wallet selection modal or connect with default wallet
                const defaultWallet = config.walletTypes[0];
                handleConnectWallet(chainId, defaultWallet);
              }}
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    );
  };
  
  if (compact) {
    return (
      <div className="multi-chain-dashboard multi-chain-dashboard--compact">
        {showNetworkSelector && (
          <div className="multi-chain-dashboard__selector">
            <NetworkSelector 
              variant="tabs" 
              size="small"
              showConnectedOnly={true}
            />
          </div>
        )}
        
        <div className="multi-chain-dashboard__summary">
          <div className="multi-chain-dashboard__stat">
            <span className="multi-chain-dashboard__stat-label">Connected</span>
            <span className="multi-chain-dashboard__stat-value">
              {connectedNetworks.length}/{supportedNetworks.length}
            </span>
          </div>
          
          {showPendingTransactions && pendingTransactions.length > 0 && (
            <div className="multi-chain-dashboard__stat">
              <span className="multi-chain-dashboard__stat-label">Pending</span>
              <span className="multi-chain-dashboard__stat-value">
                {pendingTransactions.length}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="multi-chain-dashboard">
      <div className="multi-chain-dashboard__header">
        <div className="multi-chain-dashboard__title">
          <h2>Multi-Chain Portfolio</h2>
          <p>Manage your assets across all blockchain networks</p>
        </div>
        
        <div className="multi-chain-dashboard__actions">
          <button 
            className="multi-chain-dashboard__refresh-btn"
            onClick={handleRefreshBalances}
            disabled={refreshing || isLoading}
          >
            <svg 
              className={`multi-chain-dashboard__refresh-icon ${refreshing ? 'spinning' : ''}`}
              width="16" 
              height="16" 
              viewBox="0 0 16 16"
            >
              <path 
                d="M8 2V0L5.5 2.5L8 5V3C10.76 3 13 5.24 13 8S10.76 13 8 13 3 10.76 3 8H1C1 11.87 4.13 15 8 15S15 11.87 15 8 11.87 1 8 1Z" 
                fill="currentColor"
              />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {showNetworkSelector && (
        <div className="multi-chain-dashboard__selector">
          <NetworkSelector 
            variant="tabs" 
            size="medium"
            onNetworkChange={(chainId) => setSelectedNetwork(chainId)}
          />
        </div>
      )}
      
      <div className="multi-chain-dashboard__stats">
        <div className="multi-chain-dashboard__stat-card">
          <div className="multi-chain-dashboard__stat-icon">🌐</div>
          <div className="multi-chain-dashboard__stat-content">
            <span className="multi-chain-dashboard__stat-label">Networks Connected</span>
            <span className="multi-chain-dashboard__stat-value">
              {connectedNetworks.length} of {supportedNetworks.length}
            </span>
          </div>
        </div>
        
        <div className="multi-chain-dashboard__stat-card">
          <div className="multi-chain-dashboard__stat-icon">💰</div>
          <div className="multi-chain-dashboard__stat-content">
            <span className="multi-chain-dashboard__stat-label">Total Portfolio</span>
            <span className="multi-chain-dashboard__stat-value">
              ${totalPortfolioValue.toLocaleString()}
            </span>
          </div>
        </div>
        
        {showPendingTransactions && (
          <div className="multi-chain-dashboard__stat-card">
            <div className="multi-chain-dashboard__stat-icon">⏳</div>
            <div className="multi-chain-dashboard__stat-content">
              <span className="multi-chain-dashboard__stat-label">Pending Transactions</span>
              <span className="multi-chain-dashboard__stat-value">
                {pendingTransactions.length}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="multi-chain-dashboard__content">
        {connectedNetworks.length > 0 && (
          <div className="multi-chain-dashboard__section">
            <h3 className="multi-chain-dashboard__section-title">
              Connected Networks ({connectedNetworks.length})
            </h3>
            <div className="multi-chain-dashboard__networks">
              {connectedNetworks.map(chainId => (
                <NetworkCard 
                  key={chainId} 
                  chainId={chainId} 
                  isConnected={true} 
                />
              ))}
            </div>
          </div>
        )}
        
        {disconnectedNetworks.length > 0 && (
          <div className="multi-chain-dashboard__section">
            <h3 className="multi-chain-dashboard__section-title">
              Available Networks ({disconnectedNetworks.length})
            </h3>
            <div className="multi-chain-dashboard__networks">
              {disconnectedNetworks.map(chainId => (
                <NetworkCard 
                  key={chainId} 
                  chainId={chainId} 
                  isConnected={false} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="multi-chain-dashboard__loading">
          <div className="spinner"></div>
          <span>Loading wallet data...</span>
        </div>
      )}
    </div>
  );
};

export default MultiChainDashboard;

