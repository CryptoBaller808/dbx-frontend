import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectWalletError,
  selectChainError,
  selectNetworkConfig
} from '../../redux/multiChainWallet/reducer';
import { 
  clearWalletError,
  retryConnection,
  switchToNetwork
} from '../../redux/multiChainWallet/actions';
import './ErrorHandler.css';

/**
 * Smart Error Handler Component
 * Provides helpful guidance and recovery options for wallet and network errors
 */
const ErrorHandler = ({ 
  chainId = null,
  showInline = false,
  onDismiss = null 
}) => {
  const dispatch = useDispatch();
  
  const globalError = useSelector(selectWalletError);
  const chainError = useSelector(state => selectChainError(state, chainId));
  const networkConfig = useSelector(state => selectNetworkConfig(state, chainId));
  
  const error = chainError || globalError;
  
  if (!error) return null;
  
  const getErrorInfo = (error) => {
    const errorType = error.type || 'unknown';
    const errorCode = error.code;
    
    switch (errorType) {
      case 'WALLET_NOT_FOUND':
        return {
          icon: '🔍',
          title: 'Wallet Not Found',
          message: 'The requested wallet is not installed or available.',
          severity: 'warning',
          actions: [
            {
              label: 'Install Wallet',
              action: () => window.open(getWalletDownloadUrl(error.walletType), '_blank'),
              primary: true
            },
            {
              label: 'Try Different Wallet',
              action: () => dispatch(clearWalletError(chainId))
            }
          ]
        };
        
      case 'WALLET_CONNECTION_REJECTED':
        return {
          icon: '❌',
          title: 'Connection Rejected',
          message: 'You rejected the wallet connection request.',
          severity: 'info',
          actions: [
            {
              label: 'Try Again',
              action: () => dispatch(retryConnection(chainId, error.walletType)),
              primary: true
            },
            {
              label: 'Cancel',
              action: () => dispatch(clearWalletError(chainId))
            }
          ]
        };
        
      case 'WRONG_NETWORK':
        return {
          icon: '🔄',
          title: 'Wrong Network',
          message: `Please switch to ${networkConfig?.name || 'the correct network'} in your wallet.`,
          severity: 'warning',
          actions: [
            {
              label: `Switch to ${networkConfig?.name || 'Network'}`,
              action: () => dispatch(switchToNetwork(chainId)),
              primary: true
            },
            {
              label: 'Cancel',
              action: () => dispatch(clearWalletError(chainId))
            }
          ]
        };
        
      case 'NETWORK_NOT_SUPPORTED':
        return {
          icon: '⚠️',
          title: 'Network Not Supported',
          message: `${networkConfig?.name || 'This network'} is not supported by your wallet.`,
          severity: 'error',
          actions: [
            {
              label: 'Add Network to Wallet',
              action: () => addNetworkToWallet(chainId),
              primary: true
            },
            {
              label: 'Use Different Wallet',
              action: () => dispatch(clearWalletError(chainId))
            }
          ]
        };
        
      case 'INSUFFICIENT_BALANCE':
        return {
          icon: '💰',
          title: 'Insufficient Balance',
          message: `You don't have enough ${networkConfig?.symbol || 'tokens'} to complete this transaction.`,
          severity: 'warning',
          actions: [
            {
              label: 'Get Tokens',
              action: () => window.open(getTokenFaucetUrl(chainId), '_blank'),
              primary: true
            },
            {
              label: 'Cancel',
              action: () => dispatch(clearWalletError(chainId))
            }
          ]
        };
        
      case 'TRANSACTION_FAILED':
        return {
          icon: '💥',
          title: 'Transaction Failed',
          message: error.message || 'The transaction failed to execute.',
          severity: 'error',
          actions: [
            {
              label: 'Try Again',
              action: () => dispatch(retryConnection(chainId, error.walletType)),
              primary: true
            },
            {
              label: 'View Details',
              action: () => error.txHash && window.open(getExplorerUrl(chainId, error.txHash), '_blank')
            }
          ]
        };
        
      case 'RPC_ERROR':
        return {
          icon: '🌐',
          title: 'Network Error',
          message: 'Unable to connect to the blockchain network. Please try again.',
          severity: 'error',
          actions: [
            {
              label: 'Retry',
              action: () => dispatch(retryConnection(chainId, error.walletType)),
              primary: true
            },
            {
              label: 'Check Network Status',
              action: () => window.open(getNetworkStatusUrl(chainId), '_blank')
            }
          ]
        };
        
      case 'TIMEOUT':
        return {
          icon: '⏰',
          title: 'Connection Timeout',
          message: 'The connection request timed out. Please try again.',
          severity: 'warning',
          actions: [
            {
              label: 'Try Again',
              action: () => dispatch(retryConnection(chainId, error.walletType)),
              primary: true
            },
            {
              label: 'Cancel',
              action: () => dispatch(clearWalletError(chainId))
            }
          ]
        };
        
      default:
        return {
          icon: '❗',
          title: 'Something Went Wrong',
          message: error.message || 'An unexpected error occurred.',
          severity: 'error',
          actions: [
            {
              label: 'Try Again',
              action: () => dispatch(retryConnection(chainId, error.walletType)),
              primary: true
            },
            {
              label: 'Get Help',
              action: () => window.open('https://support.dbx.com', '_blank')
            }
          ]
        };
    }
  };
  
  const getWalletDownloadUrl = (walletType) => {
    const urls = {
      metamask: 'https://metamask.io/download/',
      phantom: 'https://phantom.app/',
      xumm: 'https://xumm.app/',
      freighter: 'https://freighter.app/',
      solflare: 'https://solflare.com/',
      walletconnect: 'https://walletconnect.com/'
    };
    return urls[walletType] || 'https://ethereum.org/en/wallets/';
  };
  
  const getTokenFaucetUrl = (chainId) => {
    const faucets = {
      XDC: 'https://faucet.xinfin.network/',
      AVALANCHE: 'https://faucet.avax.network/',
      POLYGON: 'https://faucet.polygon.technology/',
      BSC: 'https://testnet.binance.org/faucet-smart'
    };
    return faucets[chainId] || '#';
  };
  
  const getExplorerUrl = (chainId, txHash) => {
    const explorers = {
      XDC: `https://explorer.xinfin.network/tx/${txHash}`,
      AVALANCHE: `https://snowtrace.io/tx/${txHash}`,
      POLYGON: `https://polygonscan.com/tx/${txHash}`,
      BSC: `https://bscscan.com/tx/${txHash}`,
      SOLANA: `https://explorer.solana.com/tx/${txHash}`,
      STELLAR: `https://stellar.expert/explorer/public/tx/${txHash}`,
      XRP: `https://xrpscan.com/tx/${txHash}`
    };
    return explorers[chainId] || '#';
  };
  
  const getNetworkStatusUrl = (chainId) => {
    const statusPages = {
      XDC: 'https://status.xinfin.network/',
      AVALANCHE: 'https://status.avax.network/',
      POLYGON: 'https://status.polygon.technology/',
      BSC: 'https://status.binance.org/'
    };
    return statusPages[chainId] || 'https://status.dbx.com';
  };
  
  const addNetworkToWallet = async (chainId) => {
    if (!networkConfig) return;
    
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${parseInt(networkConfig.chainId).toString(16)}`,
            chainName: networkConfig.name,
            nativeCurrency: {
              name: networkConfig.symbol,
              symbol: networkConfig.symbol,
              decimals: networkConfig.decimals
            },
            rpcUrls: networkConfig.rpcUrls,
            blockExplorerUrls: networkConfig.blockExplorerUrls
          }]
        });
      }
    } catch (error) {
      console.error('Failed to add network:', error);
    }
  };
  
  const handleDismiss = () => {
    dispatch(clearWalletError(chainId));
    if (onDismiss) onDismiss();
  };
  
  const errorInfo = getErrorInfo(error);
  
  if (showInline) {
    return (
      <div className={`error-handler error-handler--inline error-handler--${errorInfo.severity}`}>
        <div className="error-handler__content">
          <div className="error-handler__header">
            <span className="error-handler__icon">{errorInfo.icon}</span>
            <div className="error-handler__text">
              <h4 className="error-handler__title">{errorInfo.title}</h4>
              <p className="error-handler__message">{errorInfo.message}</p>
            </div>
            <button 
              className="error-handler__dismiss"
              onClick={handleDismiss}
              aria-label="Dismiss error"
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </button>
          </div>
          
          {errorInfo.actions && errorInfo.actions.length > 0 && (
            <div className="error-handler__actions">
              {errorInfo.actions.map((action, index) => (
                <button
                  key={index}
                  className={`error-handler__action ${
                    action.primary ? 'error-handler__action--primary' : 'error-handler__action--secondary'
                  }`}
                  onClick={action.action}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="error-handler__overlay">
      <div className={`error-handler error-handler--modal error-handler--${errorInfo.severity}`}>
        <div className="error-handler__modal-content">
          <div className="error-handler__modal-header">
            <span className="error-handler__icon error-handler__icon--large">
              {errorInfo.icon}
            </span>
            <h3 className="error-handler__title">{errorInfo.title}</h3>
            <p className="error-handler__message">{errorInfo.message}</p>
          </div>
          
          {networkConfig && (
            <div className="error-handler__network-info">
              <span className="error-handler__network-icon" style={{ color: networkConfig.color }}>
                {networkConfig.icon}
              </span>
              <span>Network: {networkConfig.name}</span>
            </div>
          )}
          
          {errorInfo.actions && errorInfo.actions.length > 0 && (
            <div className="error-handler__modal-actions">
              {errorInfo.actions.map((action, index) => (
                <button
                  key={index}
                  className={`error-handler__action ${
                    action.primary ? 'error-handler__action--primary' : 'error-handler__action--secondary'
                  }`}
                  onClick={action.action}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
          
          <button 
            className="error-handler__close"
            onClick={handleDismiss}
            aria-label="Close error dialog"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;

