/**
 * DBX Enhanced Wallet Connection Component
 * Properly maps networks to their corresponding wallet types
 * 
 * @version 2.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import walletConnectorService from '../services/walletConnectorService';
import './WalletConnect/WalletConnect.css';

// Network to Wallet Mapping
const NETWORK_WALLET_MAPPING = {
  BTC: {
    primary: 'electrum',
    alternatives: ['ledger', 'trezor', 'exodus'],
    displayName: 'Bitcoin Wallet'
  },
  ETH: {
    primary: 'metamask',
    alternatives: ['walletconnect', 'coinbase', 'ledger'],
    displayName: 'MetaMask'
  },
  BNB: {
    primary: 'metamask',
    alternatives: ['trustwallet', 'binance', 'walletconnect'],
    displayName: 'MetaMask'
  },
  AVAX: {
    primary: 'metamask',
    alternatives: ['avalanche', 'walletconnect'],
    displayName: 'MetaMask'
  },
  MATIC: {
    primary: 'metamask',
    alternatives: ['walletconnect', 'coinbase'],
    displayName: 'MetaMask'
  },
  SOL: {
    primary: 'phantom',
    alternatives: ['solflare', 'sollet', 'ledger'],
    displayName: 'Phantom'
  },
  XDC: {
    primary: 'xdcpay',
    alternatives: ['metamask', 'ledger'],
    displayName: 'XDCPay'
  },
  XRP: {
    primary: 'xumm',
    alternatives: ['ledger', 'toast', 'exodus'],
    displayName: 'Xumm'
  },
  XLM: {
    primary: 'freighter',
    alternatives: ['albedo', 'ledger', 'lobstr'],
    displayName: 'Freighter'
  }
};

// Wallet Display Information
const WALLET_INFO = {
  metamask: {
    name: 'MetaMask',
    icon: '/images/wallets/metamask.png',
    installUrl: 'https://metamask.io/download/',
    description: 'Connect using MetaMask wallet'
  },
  phantom: {
    name: 'Phantom',
    icon: '/images/wallets/phantom.png',
    installUrl: 'https://phantom.app/',
    description: 'Connect using Phantom wallet'
  },
  xumm: {
    name: 'Xumm',
    icon: '/images/wallets/xumm.png',
    installUrl: 'https://xumm.app/',
    description: 'Connect using Xumm wallet'
  },
  freighter: {
    name: 'Freighter',
    icon: '/images/wallets/freighter.png',
    installUrl: 'https://www.freighter.app/',
    description: 'Connect using Freighter wallet'
  },
  xdcpay: {
    name: 'XDCPay',
    icon: '/images/wallets/xdcpay.png',
    installUrl: 'https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo',
    description: 'Connect using XDCPay wallet'
  },
  electrum: {
    name: 'Bitcoin Wallet',
    icon: '/images/wallets/bitcoin.png',
    installUrl: 'https://electrum.org/',
    description: 'Connect using Bitcoin wallet'
  },
  walletconnect: {
    name: 'WalletConnect',
    icon: '/images/wallets/walletconnect.png',
    installUrl: 'https://walletconnect.com/',
    description: 'Connect using WalletConnect'
  },
  ledger: {
    name: 'Ledger',
    icon: '/images/wallets/ledger.png',
    installUrl: 'https://www.ledger.com/',
    description: 'Connect using Ledger hardware wallet'
  }
};

const EnhancedWalletConnect = ({ className = '' }) => {
  const dispatch = useDispatch();
  
  // Get current network from Redux state
  const { activeNetwork } = useSelector(state => state.networkReducers || { activeNetwork: 'XRP' });
  
  // Component state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Get wallet mapping for current network
  const getWalletForNetwork = (network) => {
    const mapping = NETWORK_WALLET_MAPPING[network?.toUpperCase()];
    return mapping || NETWORK_WALLET_MAPPING.XRP; // Fallback to XRP
  };

  // Get current wallet info
  const currentWalletMapping = getWalletForNetwork(activeNetwork);
  const primaryWallet = currentWalletMapping.primary;
  const walletInfo = WALLET_INFO[primaryWallet];

  // Check if wallet is available
  const isWalletAvailable = (walletType) => {
    return walletConnectorService.isWalletAvailable(walletType);
  };

  // Handle wallet connection
  const handleWalletConnect = async (walletType = primaryWallet) => {
    try {
      setIsConnecting(true);
      setConnectionError(null);

      // Check if wallet is available
      if (!isWalletAvailable(walletType)) {
        throw new Error(`${WALLET_INFO[walletType]?.name || walletType} is not installed`);
      }

      // Connect to wallet
      const connection = await walletConnectorService.connectWallet(
        activeNetwork.toUpperCase(),
        walletType
      );

      setConnectedWallet({
        network: activeNetwork.toUpperCase(),
        walletType,
        address: connection.address,
        balance: connection.balance
      });

      setShowWalletOptions(false);
    } catch (error) {
      setConnectionError(error.message);
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle wallet disconnect
  const handleWalletDisconnect = async () => {
    try {
      await walletConnectorService.disconnectWallet(activeNetwork.toUpperCase());
      setConnectedWallet(null);
    } catch (error) {
      console.error('Wallet disconnect failed:', error);
    }
  };

  // Update wallet when network changes
  useEffect(() => {
    // Check if there's already a connected wallet for this network
    const existingWallet = walletConnectorService.getConnectedWallet(activeNetwork.toUpperCase());
    if (existingWallet) {
      setConnectedWallet({
        network: activeNetwork.toUpperCase(),
        walletType: existingWallet.walletType,
        address: existingWallet.address,
        balance: existingWallet.balance
      });
    } else {
      setConnectedWallet(null);
    }
    
    // Clear any previous errors
    setConnectionError(null);
  }, [activeNetwork]);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Render wallet connection button
  const renderWalletButton = () => {
    if (connectedWallet) {
      return (
        <div className="connected-wallet">
          <div className="wallet-info">
            <img 
              src={WALLET_INFO[connectedWallet.walletType]?.icon || '/images/wallets/default.png'} 
              alt={WALLET_INFO[connectedWallet.walletType]?.name}
              className="wallet-icon"
            />
            <div className="wallet-details">
              <div className="wallet-address">{formatAddress(connectedWallet.address)}</div>
              <div className="wallet-network">{connectedWallet.network}</div>
            </div>
          </div>
          <button 
            className="disconnect-button"
            onClick={handleWalletDisconnect}
          >
            Disconnect
          </button>
        </div>
      );
    }

    return (
      <div className="wallet-connect-container">
        <button
          className={`connect-wallet-button ${className}`}
          onClick={() => handleWalletConnect()}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <div className="connecting-state">
              <div className="spinner" />
              Connecting...
            </div>
          ) : (
            <div className="connect-state">
              <img 
                src={walletInfo?.icon || '/images/wallets/default.png'} 
                alt={walletInfo?.name}
                className="wallet-icon"
              />
              Connect {currentWalletMapping.displayName}
            </div>
          )}
        </button>

        {/* Alternative wallets button */}
        {currentWalletMapping.alternatives.length > 0 && (
          <button
            className="alternative-wallets-button"
            onClick={() => setShowWalletOptions(!showWalletOptions)}
          >
            Other Wallets
          </button>
        )}
      </div>
    );
  };

  // Render wallet options modal
  const renderWalletOptions = () => {
    if (!showWalletOptions) return null;

    const allWallets = [primaryWallet, ...currentWalletMapping.alternatives];

    return (
      <div className="wallet-options-modal">
        <div className="wallet-options-content">
          <div className="wallet-options-header">
            <h3>Choose Wallet for {activeNetwork.toUpperCase()}</h3>
            <button 
              className="close-button"
              onClick={() => setShowWalletOptions(false)}
            >
              ×
            </button>
          </div>
          
          <div className="wallet-options-list">
            {allWallets.map(walletType => {
              const info = WALLET_INFO[walletType];
              const available = isWalletAvailable(walletType);
              
              return (
                <div 
                  key={walletType}
                  className={`wallet-option ${!available ? 'unavailable' : ''}`}
                  onClick={() => available ? handleWalletConnect(walletType) : window.open(info?.installUrl)}
                >
                  <img 
                    src={info?.icon || '/images/wallets/default.png'} 
                    alt={info?.name}
                    className="wallet-option-icon"
                  />
                  <div className="wallet-option-info">
                    <div className="wallet-option-name">{info?.name}</div>
                    <div className="wallet-option-description">{info?.description}</div>
                  </div>
                  <div className="wallet-option-status">
                    {available ? (
                      <span className="available">Available</span>
                    ) : (
                      <span className="install">Install</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`enhanced-wallet-connect ${className}`}>
      {renderWalletButton()}
      {renderWalletOptions()}
      
      {/* Error display */}
      {connectionError && (
        <div className="connection-error">
          <div className="error-message">{connectionError}</div>
          <button 
            className="retry-button"
            onClick={() => setConnectionError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedWalletConnect;

