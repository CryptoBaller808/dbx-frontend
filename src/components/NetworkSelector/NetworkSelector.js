/**
 * DBX Network Selector Component
 * 
 * Advanced network selector with multi-chain support
 * Allows users to switch between different blockchain networks seamlessly
 * 
 * @version 1.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setNetwork, 
  setNetworkType, 
  switchNetwork 
} from '../../redux/network/action';
import { 
  SUPPORTED_NETWORKS, 
  getNetworksSorted, 
  getNetworkBySymbol,
  NETWORK_TYPES 
} from '../../config/networks';
import './NetworkSelector.css';

/**
 * Network Selector Component
 */
const NetworkSelector = ({ 
  className = '', 
  showTestnets = false, 
  compact = false,
  onNetworkChange = null 
}) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  
  // Redux state
  const { 
    activeNetwork, 
    networkType, 
    connectedNetworks, 
    networkStatus,
    preferences 
  } = useSelector(state => state.networkReducers);
  
  // Component state
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNetworks, setFilteredNetworks] = useState([]);

  // Get current network configuration
  const currentNetwork = getNetworkBySymbol(activeNetwork);
  
  // Filter networks based on search and preferences
  useEffect(() => {
    const networks = Object.entries(getNetworksSorted());
    const filtered = networks.filter(([symbol, network]) => {
      const matchesSearch = network.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           symbol.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Show testnets based on preference
      const showNetwork = showTestnets || preferences.showTestnets || true;
      
      return matchesSearch && showNetwork;
    });
    
    setFilteredNetworks(filtered);
  }, [searchTerm, showTestnets, preferences.showTestnets]);

  // Handle network selection
  const handleNetworkSelect = (networkSymbol) => {
    if (networkSymbol !== activeNetwork) {
      dispatch(switchNetwork(networkSymbol, networkType));
      
      // Call external callback if provided
      if (onNetworkChange) {
        onNetworkChange(networkSymbol);
      }
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle network type toggle
  const handleNetworkTypeToggle = () => {
    const newType = networkType === NETWORK_TYPES.MAINNET 
      ? NETWORK_TYPES.TESTNET 
      : NETWORK_TYPES.MAINNET;
    dispatch(setNetworkType(newType));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get connection status for network
  const getConnectionStatus = (networkSymbol) => {
    return connectedNetworks[networkSymbol]?.connected || false;
  };

  // Get network status indicator
  const getStatusIndicator = (networkSymbol) => {
    const status = networkStatus[networkSymbol];
    const isConnected = getConnectionStatus(networkSymbol);
    
    if (status === 'connecting') return 'connecting';
    if (status === 'error') return 'error';
    if (isConnected) return 'connected';
    return 'disconnected';
  };

  return (
    <div className={`network-selector ${className}`} ref={dropdownRef}>
      {/* Current Network Display */}
      <div 
        className={`network-selector-trigger ${compact ? 'compact' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="network-info">
          <div className="network-icon">
            <img 
              src={currentNetwork?.ui?.icon || '/images/networks/default.png'} 
              alt={currentNetwork?.name || 'Network'} 
              onError={(e) => {
                e.target.src = '/images/networks/default.png';
              }}
            />
            <div className={`status-indicator ${getStatusIndicator(activeNetwork)}`} />
          </div>
          
          {!compact && (
            <div className="network-details">
              <div className="network-name">{currentNetwork?.displayName || activeNetwork}</div>
              <div className="network-type">{networkType}</div>
            </div>
          )}
        </div>
        
        <div className="dropdown-arrow">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="network-selector-dropdown">
          {/* Search Input */}
          <div className="network-search">
            <input
              type="text"
              placeholder="Search networks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Network Type Toggle */}
          <div className="network-type-toggle">
            <button
              className={`type-button ${networkType === NETWORK_TYPES.MAINNET ? 'active' : ''}`}
              onClick={() => dispatch(setNetworkType(NETWORK_TYPES.MAINNET))}
            >
              Mainnet
            </button>
            <button
              className={`type-button ${networkType === NETWORK_TYPES.TESTNET ? 'active' : ''}`}
              onClick={() => dispatch(setNetworkType(NETWORK_TYPES.TESTNET))}
            >
              Testnet
            </button>
          </div>

          {/* Network List */}
          <div className="network-list">
            {filteredNetworks.map(([symbol, network]) => {
              const isActive = symbol === activeNetwork;
              const isConnected = getConnectionStatus(symbol);
              const status = getStatusIndicator(symbol);
              
              return (
                <div
                  key={symbol}
                  className={`network-item ${isActive ? 'active' : ''} ${status}`}
                  onClick={() => handleNetworkSelect(symbol)}
                >
                  <div className="network-item-icon">
                    <img 
                      src={network.ui.icon} 
                      alt={network.name}
                      onError={(e) => {
                        e.target.src = '/images/networks/default.png';
                      }}
                    />
                    <div className={`status-indicator ${status}`} />
                  </div>
                  
                  <div className="network-item-info">
                    <div className="network-item-name">{network.displayName}</div>
                    <div className="network-item-symbol">{symbol}</div>
                  </div>
                  
                  <div className="network-item-status">
                    {isConnected && (
                      <div className="connected-badge">Connected</div>
                    )}
                    {status === 'connecting' && (
                      <div className="connecting-spinner" />
                    )}
                    {status === 'error' && (
                      <div className="error-badge">Error</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="network-selector-footer">
            <div className="network-count">
              {filteredNetworks.length} networks available
            </div>
            <div className="network-type-indicator">
              {networkType}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;

