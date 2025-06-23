/**
 * DBX Wallet Connect Component
 * Enhanced multi-chain wallet connection
 * 
 * @version 2.1.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WalletConnectModal from './WalletConnectModal';
import { WalletManager } from '../../services/wallets';
import { switchNetwork, updateNetworkBalances } from '../../redux/network/action';
import XRP from './XRP';
import XLM from './XLM';
import './WalletConnect.css';

const WalletConnect = (props) => {
  const { network } = props;
  const dispatch = useDispatch();
  const { activeNetwork, networkType, walletConnections, balances } = useSelector(state => state.networkReducers);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});

  // All hooks must be called at the top level - before any conditional returns
  useEffect(() => {
    // Only initialize for non-legacy networks
    if (network === 'xlm' || network === 'xrp' || !network) {
      return; // Early return inside useEffect is allowed
    }

    // Initialize wallet manager
    WalletManager.initialize();
    
    // Setup event listeners
    WalletManager.on('walletConnected', handleWalletConnected);
    WalletManager.on('walletDisconnected', handleWalletDisconnected);
    WalletManager.on('accountChanged', handleAccountChanged);
    WalletManager.on('networkChanged', handleNetworkChanged);
    
    // Load initial connection status
    updateConnectionStatus();
    
    return () => {
      WalletManager.off('walletConnected', handleWalletConnected);
      WalletManager.off('walletDisconnected', handleWalletDisconnected);
      WalletManager.off('accountChanged', handleAccountChanged);
      WalletManager.off('networkChanged', handleNetworkChanged);
    };
  }, [network]); // Add network as dependency

  // Legacy support for XRP and XLM - moved after all hooks
  if (network === 'xlm') {
    return <XLM {...props} />;
  } else if (network === 'xrp' || !network) {
    return <XRP {...props} />;
  }

  const updateConnectionStatus = () => {
    const status = WalletManager.getConnectionStatus();
    setConnectionStatus(status);
  };

  const handleWalletConnected = (data) => {
    console.log('Wallet connected:', data);
    updateConnectionStatus();
    refreshBalances();
  };

  const handleWalletDisconnected = (data) => {
    console.log('Wallet disconnected:', data);
    updateConnectionStatus();
  };

  const handleAccountChanged = (data) => {
    console.log('Account changed:', data);
    updateConnectionStatus();
    refreshBalances();
  };

  const handleNetworkChanged = (data) => {
    console.log('Network changed:', data);
    updateConnectionStatus();
    refreshBalances();
  };

  const refreshBalances = async () => {
    try {
      const connections = WalletManager.getActiveConnections();
      
      for (const [network, connection] of Object.entries(connections)) {
        try {
          const balance = await WalletManager.getBalance(network);
          dispatch(updateNetworkBalances(network, balance));
        } catch (error) {
          console.warn(`Failed to get balance for ${network}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleDisconnect = async (network = null) => {
    try {
      if (network) {
        await WalletManager.disconnect(network);
      } else {
        await WalletManager.disconnectAll();
      }
      updateConnectionStatus();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const isConnected = () => {
    return connectionStatus[activeNetwork]?.isConnected || false;
  };

  const getConnectedAddress = () => {
    const connection = connectionStatus[activeNetwork]?.connection;
    return connection?.account || connection?.address || connection?.publicKey || null;
  };

  const getBalance = () => {
    return balances[activeNetwork] || null;
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance) => {
    if (!balance) return '0.00';
    return `${balance.formatted} ${balance.symbol}`;
  };

  return (
    <div className="wallet-connect-container">
      {isConnected() ? (
        <div className="wallet-connected">
          <div className="wallet-info">
            <div className="network-indicator">
              <img 
                src={`/images/networks/${activeNetwork.toLowerCase()}.png`}
                alt={activeNetwork}
                className="network-icon-small"
                onError={(e) => {
                  e.target.src = '/images/networks/default.png';
                }}
              />
              <span className="network-name">{activeNetwork}</span>
            </div>
            
            <div className="wallet-details">
              <div className="wallet-address">
                {formatAddress(getConnectedAddress())}
              </div>
              <div className="wallet-balance">
                {formatBalance(getBalance())}
              </div>
            </div>
          </div>
          
          <div className="wallet-actions">
            <button 
              className="refresh-button"
              onClick={refreshBalances}
              title="Refresh Balance"
            >
              ↻
            </button>
            <button 
              className="disconnect-button"
              onClick={() => handleDisconnect(activeNetwork)}
              title="Disconnect Wallet"
            >
              ⚡
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="connect-wallet-button"
          onClick={handleConnect}
        >
          <span className="connect-icon">🔗</span>
          Connect Wallet
        </button>
      )}

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedNetwork={activeNetwork}
      />
    </div>
  );
};

export default WalletConnect;