import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAvailableWallets,
  selectIsWalletLoading,
  selectWalletError,
  selectChainError,
  selectNetworkConfig,
  selectIsChainConnected
} from '../../redux/multiChainWallet/reducer';
import { 
  connectToWallet,
  clearWalletError,
  getAvailableWallets
} from '../../redux/multiChainWallet/actions';
import WalletErrorBoundary from '../ErrorBoundary/WalletErrorBoundary';
import './WalletConnectionModal.css';

/**
 * Enhanced Wallet Connection Modal
 * Auto-detects available wallets with beautiful UI and error handling
 */
const WalletConnectionModal = ({ 
  isOpen, 
  onClose, 
  chainId = null,
  title = "Connect Your Wallet",
  subtitle = "Choose your preferred wallet to get started"
}) => {
  const dispatch = useDispatch();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectionStep, setConnectionStep] = useState('select'); // 'select', 'connecting', 'success', 'error'
  const [detectedWallets, setDetectedWallets] = useState([]);
  
  const availableWallets = useSelector(selectAvailableWallets);
  const isLoading = useSelector(selectIsWalletLoading);
  const globalError = useSelector(selectWalletError);
  const chainError = useSelector(state => selectChainError(state, chainId));
  const networkConfig = useSelector(state => selectNetworkConfig(state, chainId));
  const isConnected = useSelector(state => selectIsChainConnected(state, chainId));
  
  const error = chainError || globalError;
  
  // Wallet configurations with detection logic
  const walletConfigs = {
    metamask: {
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask browser extension',
      downloadUrl: 'https://metamask.io/download/',
      detectFunction: () => typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      supportedChains: ['XDC', 'AVALANCHE', 'POLYGON', 'BSC'],
      color: '#f6851b'
    },
    phantom: {
      name: 'Phantom',
      icon: '👻',
      description: 'Connect using Phantom wallet',
      downloadUrl: 'https://phantom.app/',
      detectFunction: () => typeof window !== 'undefined' && window.solana?.isPhantom,
      supportedChains: ['SOLANA'],
      color: '#ab9ff2'
    },
    xumm: {
      name: 'XUMM',
      icon: '🔴',
      description: 'Connect using XUMM mobile wallet',
      downloadUrl: 'https://xumm.app/',
      detectFunction: () => true, // XUMM uses QR codes, always available
      supportedChains: ['XRP'],
      color: '#3052ff'
    },
    freighter: {
      name: 'Freighter',
      icon: '🌟',
      description: 'Connect using Freighter wallet',
      downloadUrl: 'https://freighter.app/',
      detectFunction: () => typeof window !== 'undefined' && window.freighterApi,
      supportedChains: ['STELLAR'],
      color: '#7b73ff'
    },
    solflare: {
      name: 'Solflare',
      icon: '☀️',
      description: 'Connect using Solflare wallet',
      downloadUrl: 'https://solflare.com/',
      detectFunction: () => typeof window !== 'undefined' && window.solflare,
      supportedChains: ['SOLANA'],
      color: '#fc8c03'
    },
    walletconnect: {
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect using WalletConnect protocol',
      downloadUrl: 'https://walletconnect.com/',
      detectFunction: () => true, // WalletConnect is always available
      supportedChains: ['XDC', 'AVALANCHE', 'POLYGON', 'BSC'],
      color: '#3b99fc'
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      detectWallets();
      setConnectionStep('select');
      setSelectedWallet(null);
      dispatch(clearWalletError());
    }
  }, [isOpen, dispatch]);
  
  useEffect(() => {
    if (isConnected && connectionStep === 'connecting') {
      setConnectionStep('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isConnected, connectionStep, onClose]);
  
  useEffect(() => {
    if (error && connectionStep === 'connecting') {
      setConnectionStep('error');
    }
  }, [error, connectionStep]);
  
  const detectWallets = () => {
    const detected = Object.entries(walletConfigs).map(([key, config]) => ({
      key,
      ...config,
      isDetected: config.detectFunction(),
      isSupported: !chainId || config.supportedChains.includes(chainId)
    })).filter(wallet => wallet.isSupported);
    
    setDetectedWallets(detected);
  };
  
  const handleWalletSelect = async (walletKey) => {
    if (!chainId) {
      console.error('No chain ID specified for wallet connection');
      return;
    }
    
    setSelectedWallet(walletKey);
    setConnectionStep('connecting');
    
    try {
      await dispatch(connectToWallet(chainId, walletKey));
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setConnectionStep('error');
    }
  };
  
  const handleRetry = () => {
    dispatch(clearWalletError(chainId));
    setConnectionStep('select');
    setSelectedWallet(null);
  };
  
  const handleClose = () => {
    dispatch(clearWalletError(chainId));
    setConnectionStep('select');
    setSelectedWallet(null);
    onClose();
  };
  
  if (!isOpen) return null;
  
  const getStepContent = () => {
    switch (connectionStep) {
      case 'connecting':
        return (
          <div className="wallet-modal__connecting">
            <div className="wallet-modal__connecting-animation">
              <div className="wallet-modal__spinner"></div>
              <div className="wallet-modal__connecting-icon">
                {walletConfigs[selectedWallet]?.icon}
              </div>
            </div>
            <h3>Connecting to {walletConfigs[selectedWallet]?.name}</h3>
            <p>Please approve the connection in your wallet...</p>
            {networkConfig && (
              <div className="wallet-modal__network-info">
                <span className="wallet-modal__network-icon" style={{ color: networkConfig.color }}>
                  {networkConfig.icon}
                </span>
                <span>Network: {networkConfig.name}</span>
              </div>
            )}
          </div>
        );
        
      case 'success':
        return (
          <div className="wallet-modal__success">
            <div className="wallet-modal__success-icon">✅</div>
            <h3>Successfully Connected!</h3>
            <p>Your {walletConfigs[selectedWallet]?.name} wallet is now connected to {networkConfig?.name}.</p>
          </div>
        );
        
      case 'error':
        return (
          <div className="wallet-modal__error">
            <div className="wallet-modal__error-icon">❌</div>
            <h3>Connection Failed</h3>
            <p className="wallet-modal__error-message">
              {error?.message || 'Failed to connect to wallet. Please try again.'}
            </p>
            <div className="wallet-modal__error-actions">
              <button 
                className="wallet-modal__retry-btn"
                onClick={handleRetry}
              >
                Try Again
              </button>
              <button 
                className="wallet-modal__cancel-btn"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="wallet-modal__select">
            <div className="wallet-modal__header">
              <h2>{title}</h2>
              <p>{subtitle}</p>
              {networkConfig && (
                <div className="wallet-modal__target-network">
                  <span className="wallet-modal__network-icon" style={{ color: networkConfig.color }}>
                    {networkConfig.icon}
                  </span>
                  <span>Connecting to {networkConfig.name}</span>
                </div>
              )}
            </div>
            
            <div className="wallet-modal__wallets">
              {detectedWallets.map((wallet) => (
                <button
                  key={wallet.key}
                  className={`wallet-modal__wallet-option ${
                    !wallet.isDetected ? 'wallet-modal__wallet-option--not-detected' : ''
                  }`}
                  onClick={() => wallet.isDetected ? handleWalletSelect(wallet.key) : window.open(wallet.downloadUrl, '_blank')}
                  disabled={isLoading}
                >
                  <div className="wallet-modal__wallet-content">
                    <div className="wallet-modal__wallet-info">
                      <span 
                        className="wallet-modal__wallet-icon"
                        style={{ color: wallet.color }}
                      >
                        {wallet.icon}
                      </span>
                      <div className="wallet-modal__wallet-details">
                        <span className="wallet-modal__wallet-name">{wallet.name}</span>
                        <span className="wallet-modal__wallet-description">{wallet.description}</span>
                      </div>
                    </div>
                    
                    <div className="wallet-modal__wallet-status">
                      {wallet.isDetected ? (
                        <div className="wallet-modal__detected">
                          <div className="wallet-modal__detected-dot"></div>
                          <span>Detected</span>
                        </div>
                      ) : (
                        <div className="wallet-modal__not-detected">
                          <span>Install</span>
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M3 6L6 3L9 6M6 3V9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {detectedWallets.length === 0 && (
              <div className="wallet-modal__no-wallets">
                <div className="wallet-modal__no-wallets-icon">🔍</div>
                <h3>No Compatible Wallets Found</h3>
                <p>Please install a compatible wallet for {networkConfig?.name || 'this network'}.</p>
              </div>
            )}
            
            <div className="wallet-modal__help">
              <p>New to crypto wallets?</p>
              <a 
                href="https://ethereum.org/en/wallets/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="wallet-modal__help-link"
              >
                Learn about wallets →
              </a>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="wallet-modal__overlay" onClick={handleClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="wallet-modal__close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </button>
        
        <WalletErrorBoundary>
          <div className="wallet-modal__content">
            {getStepContent()}
          </div>
        </WalletErrorBoundary>
      </div>
    </div>
  );
};

export default WalletConnectionModal;

