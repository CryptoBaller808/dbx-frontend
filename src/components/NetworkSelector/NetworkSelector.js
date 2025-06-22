import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectSupportedNetworks, 
  selectActiveNetwork, 
  selectNetworkConfig,
  selectIsChainConnected,
  selectIsNetworkSwitching 
} from '../../redux/multiChainWallet/reducer';
import { switchToNetwork, setActiveNetwork } from '../../redux/multiChainWallet/actions';
import './NetworkSelector.css';

/**
 * Dynamic Network Selector Component
 * Beautiful, intuitive network switching with visual indicators
 */
const NetworkSelector = ({ 
  onNetworkChange, 
  showConnectedOnly = false,
  variant = 'dropdown', // 'dropdown', 'tabs', 'grid'
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredNetwork, setHoveredNetwork] = useState(null);
  
  const supportedNetworks = useSelector(selectSupportedNetworks);
  const activeNetwork = useSelector(selectActiveNetwork);
  const isNetworkSwitching = useSelector(selectIsNetworkSwitching);
  
  // Get network configurations and connection status
  const networks = supportedNetworks.map(chainId => ({
    chainId,
    config: useSelector(state => selectNetworkConfig(state, chainId)),
    isConnected: useSelector(state => selectIsChainConnected(state, chainId))
  })).filter(network => !showConnectedOnly || network.isConnected);
  
  const activeNetworkConfig = useSelector(state => selectNetworkConfig(state, activeNetwork));
  
  const handleNetworkSelect = async (chainId) => {
    try {
      setIsOpen(false);
      
      if (chainId === activeNetwork) return;
      
      // Dispatch network switch action
      await dispatch(switchToNetwork(chainId));
      
      // Call parent callback if provided
      if (onNetworkChange) {
        onNetworkChange(chainId);
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };
  
  const handleKeyDown = (event, chainId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNetworkSelect(chainId);
    }
  };
  
  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`network-selector network-selector--${size}`}>
        <button
          className={`network-selector__trigger ${isOpen ? 'network-selector__trigger--open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isNetworkSwitching}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="network-selector__current">
            {activeNetworkConfig ? (
              <>
                <span 
                  className="network-selector__icon"
                  style={{ color: activeNetworkConfig.color }}
                >
                  {activeNetworkConfig.icon}
                </span>
                <span className="network-selector__name">
                  {activeNetworkConfig.name}
                </span>
                <span className="network-selector__symbol">
                  {activeNetworkConfig.symbol}
                </span>
              </>
            ) : (
              <span className="network-selector__placeholder">
                Select Network
              </span>
            )}
          </div>
          
          {isNetworkSwitching ? (
            <div className="network-selector__loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <svg 
              className={`network-selector__arrow ${isOpen ? 'network-selector__arrow--up' : ''}`}
              width="12" 
              height="12" 
              viewBox="0 0 12 12"
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          )}
        </button>
        
        {isOpen && (
          <div className="network-selector__dropdown">
            <div className="network-selector__list" role="listbox">
              {networks.map(({ chainId, config, isConnected }) => (
                <button
                  key={chainId}
                  className={`network-selector__option ${
                    chainId === activeNetwork ? 'network-selector__option--active' : ''
                  } ${
                    isConnected ? 'network-selector__option--connected' : ''
                  }`}
                  onClick={() => handleNetworkSelect(chainId)}
                  onKeyDown={(e) => handleKeyDown(e, chainId)}
                  onMouseEnter={() => setHoveredNetwork(chainId)}
                  onMouseLeave={() => setHoveredNetwork(null)}
                  role="option"
                  aria-selected={chainId === activeNetwork}
                >
                  <div className="network-selector__option-content">
                    <span 
                      className="network-selector__icon"
                      style={{ color: config.color }}
                    >
                      {config.icon}
                    </span>
                    <div className="network-selector__option-text">
                      <span className="network-selector__name">
                        {config.name}
                      </span>
                      <span className="network-selector__symbol">
                        {config.symbol}
                      </span>
                    </div>
                  </div>
                  
                  <div className="network-selector__option-status">
                    {isConnected && (
                      <div className="network-selector__connected-indicator">
                        <div className="network-selector__connected-dot"></div>
                        <span>Connected</span>
                      </div>
                    )}
                    
                    {chainId === activeNetwork && (
                      <svg 
                        className="network-selector__check"
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16"
                      >
                        <path 
                          d="M13.5 4.5L6 12L2.5 8.5" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          fill="none"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Tabs variant
  if (variant === 'tabs') {
    return (
      <div className={`network-selector-tabs network-selector-tabs--${size}`}>
        <div className="network-selector-tabs__list" role="tablist">
          {networks.map(({ chainId, config, isConnected }) => (
            <button
              key={chainId}
              className={`network-selector-tabs__tab ${
                chainId === activeNetwork ? 'network-selector-tabs__tab--active' : ''
              } ${
                isConnected ? 'network-selector-tabs__tab--connected' : ''
              }`}
              onClick={() => handleNetworkSelect(chainId)}
              disabled={isNetworkSwitching}
              role="tab"
              aria-selected={chainId === activeNetwork}
            >
              <span 
                className="network-selector-tabs__icon"
                style={{ color: config.color }}
              >
                {config.icon}
              </span>
              <span className="network-selector-tabs__name">
                {config.name}
              </span>
              {isConnected && (
                <div className="network-selector-tabs__connected-dot"></div>
              )}
            </button>
          ))}
        </div>
        
        {isNetworkSwitching && (
          <div className="network-selector-tabs__loading">
            <div className="spinner"></div>
            <span>Switching network...</span>
          </div>
        )}
      </div>
    );
  }
  
  // Grid variant
  if (variant === 'grid') {
    return (
      <div className={`network-selector-grid network-selector-grid--${size}`}>
        <div className="network-selector-grid__list">
          {networks.map(({ chainId, config, isConnected }) => (
            <button
              key={chainId}
              className={`network-selector-grid__item ${
                chainId === activeNetwork ? 'network-selector-grid__item--active' : ''
              } ${
                isConnected ? 'network-selector-grid__item--connected' : ''
              }`}
              onClick={() => handleNetworkSelect(chainId)}
              disabled={isNetworkSwitching}
              onMouseEnter={() => setHoveredNetwork(chainId)}
              onMouseLeave={() => setHoveredNetwork(null)}
            >
              <div className="network-selector-grid__content">
                <span 
                  className="network-selector-grid__icon"
                  style={{ color: config.color }}
                >
                  {config.icon}
                </span>
                <span className="network-selector-grid__name">
                  {config.name}
                </span>
                <span className="network-selector-grid__symbol">
                  {config.symbol}
                </span>
              </div>
              
              {isConnected && (
                <div className="network-selector-grid__connected-indicator">
                  <div className="network-selector-grid__connected-dot"></div>
                </div>
              )}
              
              {chainId === activeNetwork && (
                <div className="network-selector-grid__active-indicator">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path 
                      d="M13.5 4.5L6 12L2.5 8.5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {isNetworkSwitching && (
          <div className="network-selector-grid__loading-overlay">
            <div className="network-selector-grid__loading">
              <div className="spinner"></div>
              <span>Switching network...</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

export default NetworkSelector;

