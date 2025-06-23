/**
 * DBX Enhanced Wallet Connect Modal
 * Multi-chain wallet connection interface
 * 
 * @version 2.1.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WalletManager, WALLET_TYPES } from '../../services/wallets';
import { switchNetwork, updateNetworkBalances, setWalletConnection } from '../../redux/network/action';
import { SUPPORTED_NETWORKS } from '../../config/networks';
import './WalletConnectModal.css';

const WalletConnectModal = ({ isOpen, onClose, preSelectedNetwork = null }) => {
  const dispatch = useDispatch();
  const { activeNetwork, networkType } = useSelector(state => state.networkReducers);
  
  const [selectedNetwork, setSelectedNetwork] = useState(preSelectedNetwork || activeNetwork);
  const [availableWallets, setAvailableWallets] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [step, setStep] = useState('network'); // 'network' or 'wallet'

  useEffect(() => {
    if (isOpen && selectedNetwork) {
      loadAvailableWallets();
    }
  }, [isOpen, selectedNetwork]);

  const loadAvailableWallets = () => {
    try {
      const wallets = WalletManager.getAvailableWallets(selectedNetwork);
      setAvailableWallets(wallets);
      
      // If only one wallet available, skip to wallet step
      if (wallets.length === 1) {
        setStep('wallet');
      }
    } catch (error) {
      console.error('Failed to load available wallets:', error);
      setConnectionError('Failed to load available wallets');
    }
  };

  const handleNetworkSelect = (networkSymbol) => {
    setSelectedNetwork(networkSymbol);
    setConnectionError(null);
    setStep('wallet');
  };

  const handleWalletConnect = async (walletType) => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const connection = await WalletManager.connect(selectedNetwork, walletType);
      
      if (connection) {
        // Update Redux state
        dispatch(switchNetwork(selectedNetwork, networkType));
        dispatch(setWalletConnection(selectedNetwork, {
          type: walletType,
          address: connection.account || connection.address || connection.publicKey,
          isConnected: true
        }));

        // Get and update balance
        try {
          const balance = await WalletManager.getBalance(selectedNetwork);
          dispatch(updateNetworkBalances(selectedNetwork, balance));
        } catch (balanceError) {
          console.warn('Failed to get balance:', balanceError);
        }

        onClose();
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setConnectionError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleWalletInstall = (installUrl) => {
    window.open(installUrl, '_blank');
  };

  const getNetworkIcon = (networkSymbol) => {
    return `/images/networks/${networkSymbol.toLowerCase()}.png`;
  };

  const getWalletIcon = (walletType) => {
    return `/images/wallets/${walletType}.png`;
  };

  const renderNetworkSelection = () => {
    const networks = SUPPORTED_NETWORKS.filter(network => 
      process.env.REACT_APP_ENABLE_TESTNETS === 'true' || networkType === 'mainnet'
    );

    return (
      <div className="wallet-modal-content">
        <div className="wallet-modal-header">
          <h2>Select Network</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="network-grid">
          {networks.map(network => (
            <div
              key={network.symbol}
              className={`network-card ${selectedNetwork === network.symbol ? 'selected' : ''}`}
              onClick={() => handleNetworkSelect(network.symbol)}
            >
              <img 
                src={getNetworkIcon(network.symbol)} 
                alt={network.name}
                className="network-icon"
                onError={(e) => {
                  e.target.src = '/images/networks/default.png';
                }}
              />
              <div className="network-info">
                <h3>{network.name}</h3>
                <p>{network.symbol}</p>
                <span className="network-category">{network.category}</span>
              </div>
              {network.isTestnet && (
                <span className="testnet-badge">Testnet</span>
              )}
            </div>
          ))}
        </div>

        <div className="network-type-toggle">
          <label>
            <input
              type="checkbox"
              checked={networkType === 'testnet'}
              onChange={(e) => {
                const newType = e.target.checked ? 'testnet' : 'mainnet';
                dispatch(switchNetwork(selectedNetwork, newType));
              }}
            />
            Show Testnets
          </label>
        </div>
      </div>
    );
  };

  const renderWalletSelection = () => {
    const selectedNetworkInfo = SUPPORTED_NETWORKS.find(n => n.symbol === selectedNetwork);

    return (
      <div className="wallet-modal-content">
        <div className="wallet-modal-header">
          <button 
            className="back-button"
            onClick={() => setStep('network')}
          >
            ← Back
          </button>
          <h2>Connect Wallet</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="selected-network-info">
          <img 
            src={getNetworkIcon(selectedNetwork)} 
            alt={selectedNetworkInfo?.name}
            className="selected-network-icon"
          />
          <div>
            <h3>{selectedNetworkInfo?.name}</h3>
            <p>{selectedNetworkInfo?.symbol} • {networkType}</p>
          </div>
        </div>

        {connectionError && (
          <div className="connection-error">
            <p>{connectionError}</p>
          </div>
        )}

        <div className="wallet-grid">
          {availableWallets.map(wallet => (
            <div
              key={wallet.type}
              className={`wallet-card ${!wallet.installed ? 'not-installed' : ''}`}
              onClick={() => {
                if (wallet.installed) {
                  handleWalletConnect(wallet.type);
                } else {
                  handleWalletInstall(wallet.installUrl);
                }
              }}
            >
              <img 
                src={getWalletIcon(wallet.type)} 
                alt={wallet.name}
                className="wallet-icon"
                onError={(e) => {
                  e.target.src = '/images/wallets/default.png';
                }}
              />
              <div className="wallet-info">
                <h3>{wallet.name}</h3>
                {wallet.networks && (
                  <p className="supported-networks">
                    Supports: {wallet.networks.join(', ')}
                  </p>
                )}
              </div>
              
              {!wallet.installed ? (
                <button className="install-button">
                  Install
                </button>
              ) : (
                <button 
                  className="connect-button"
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
              )}
            </div>
          ))}
        </div>

        {availableWallets.length === 0 && (
          <div className="no-wallets">
            <p>No compatible wallets found for {selectedNetworkInfo?.name}</p>
            <p>Please install a supported wallet to continue.</p>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="wallet-modal-overlay">
      <div className="wallet-modal">
        {step === 'network' ? renderNetworkSelection() : renderWalletSelection()}
      </div>
    </div>
  );
};

export default WalletConnectModal;

