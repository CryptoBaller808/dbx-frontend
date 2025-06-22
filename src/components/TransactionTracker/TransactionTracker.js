import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectPendingTransactions,
  selectCompletedTransactions,
  selectTransactionById,
  selectActiveNetwork
} from '../../redux/multiChainWallet/reducer';
import { 
  updateTransactionStatus,
  removeTransaction,
  retryTransaction
} from '../../redux/multiChainWallet/actions';
import './TransactionTracker.css';

/**
 * Real-Time Transaction Tracker Component
 * Live progress tracking with beautiful animations and Socket.io integration
 */
const TransactionTracker = ({ 
  showHistory = true,
  maxVisible = 5,
  position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  compact = false
}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  
  const pendingTransactions = useSelector(selectPendingTransactions);
  const completedTransactions = useSelector(selectCompletedTransactions);
  const activeNetwork = useSelector(selectActiveNetwork);
  
  // Combine and sort transactions
  const allTransactions = [...pendingTransactions, ...completedTransactions]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, showHistory ? 50 : maxVisible);
  
  const visibleTransactions = isExpanded ? allTransactions : allTransactions.slice(0, maxVisible);
  
  useEffect(() => {
    // Initialize Socket.io connection for real-time updates
    initializeSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  
  useEffect(() => {
    // Show notifications for transaction status changes
    pendingTransactions.forEach(tx => {
      if (tx.status === 'confirmed' && !notifications.find(n => n.id === tx.id)) {
        showNotification({
          id: tx.id,
          type: 'success',
          title: 'Transaction Confirmed',
          message: `${tx.type} transaction completed successfully`,
          duration: 5000
        });
      }
    });
  }, [pendingTransactions, notifications]);
  
  const initializeSocket = () => {
    try {
      // Initialize Socket.io connection
      const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        transports: ['websocket', 'polling']
      });
      
      socketRef.current = socket;
      
      socket.on('connect', () => {
        console.log('Connected to transaction tracking socket');
      });
      
      socket.on('transaction_update', (data) => {
        handleTransactionUpdate(data);
      });
      
      socket.on('transaction_confirmed', (data) => {
        handleTransactionConfirmed(data);
      });
      
      socket.on('transaction_failed', (data) => {
        handleTransactionFailed(data);
      });
      
      socket.on('disconnect', () => {
        console.log('Disconnected from transaction tracking socket');
      });
      
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
    }
  };
  
  const handleTransactionUpdate = (data) => {
    dispatch(updateTransactionStatus({
      id: data.transactionId,
      status: data.status,
      confirmations: data.confirmations,
      blockHash: data.blockHash,
      gasUsed: data.gasUsed
    }));
  };
  
  const handleTransactionConfirmed = (data) => {
    dispatch(updateTransactionStatus({
      id: data.transactionId,
      status: 'confirmed',
      confirmations: data.confirmations,
      blockHash: data.blockHash,
      finalGasUsed: data.gasUsed
    }));
    
    showNotification({
      id: `confirmed_${data.transactionId}`,
      type: 'success',
      title: 'Transaction Confirmed',
      message: `Transaction completed in block ${data.blockNumber}`,
      duration: 5000
    });
  };
  
  const handleTransactionFailed = (data) => {
    dispatch(updateTransactionStatus({
      id: data.transactionId,
      status: 'failed',
      error: data.error,
      reason: data.reason
    }));
    
    showNotification({
      id: `failed_${data.transactionId}`,
      type: 'error',
      title: 'Transaction Failed',
      message: data.reason || 'Transaction failed to execute',
      duration: 8000
    });
  };
  
  const showNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    
    if (notification.duration) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, notification.duration);
    }
  };
  
  const getTransactionIcon = (type, status) => {
    const icons = {
      send: '📤',
      receive: '📥',
      swap: '🔄',
      bridge: '🌉',
      approve: '✅',
      stake: '🔒',
      unstake: '🔓',
      mint: '🎨',
      burn: '🔥'
    };
    
    if (status === 'pending') return '⏳';
    if (status === 'failed') return '❌';
    if (status === 'confirmed') return '✅';
    
    return icons[type] || '📋';
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ed8936';
      case 'confirmed': return '#38a169';
      case 'failed': return '#e53e3e';
      default: return '#718096';
    }
  };
  
  const getProgressPercentage = (tx) => {
    if (tx.status === 'confirmed') return 100;
    if (tx.status === 'failed') return 0;
    
    const requiredConfirmations = tx.requiredConfirmations || 12;
    const currentConfirmations = tx.confirmations || 0;
    
    return Math.min((currentConfirmations / requiredConfirmations) * 100, 95);
  };
  
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  const handleRetryTransaction = (tx) => {
    dispatch(retryTransaction(tx.id));
  };
  
  const handleRemoveTransaction = (tx) => {
    dispatch(removeTransaction(tx.id));
  };
  
  const TransactionItem = ({ transaction }) => {
    const progress = getProgressPercentage(transaction);
    
    return (
      <div className={`transaction-item transaction-item--${transaction.status}`}>
        <div className="transaction-item__header">
          <div className="transaction-item__info">
            <span className="transaction-item__icon">
              {getTransactionIcon(transaction.type, transaction.status)}
            </span>
            <div className="transaction-item__details">
              <span className="transaction-item__type">
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </span>
              <span className="transaction-item__amount">
                {transaction.amount} {transaction.symbol}
              </span>
            </div>
          </div>
          
          <div className="transaction-item__status">
            <span 
              className="transaction-item__status-text"
              style={{ color: getStatusColor(transaction.status) }}
            >
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
            <span className="transaction-item__time">
              {formatTimeAgo(transaction.timestamp)}
            </span>
          </div>
        </div>
        
        {transaction.status === 'pending' && (
          <div className="transaction-item__progress">
            <div className="transaction-item__progress-bar">
              <div 
                className="transaction-item__progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="transaction-item__progress-text">
              {transaction.confirmations || 0}/{transaction.requiredConfirmations || 12} confirmations
            </span>
          </div>
        )}
        
        {transaction.hash && (
          <div className="transaction-item__hash">
            <span className="transaction-item__hash-label">Hash:</span>
            <span className="transaction-item__hash-value">
              {`${transaction.hash.slice(0, 10)}...${transaction.hash.slice(-8)}`}
            </span>
            <button 
              className="transaction-item__view-btn"
              onClick={() => window.open(getExplorerUrl(transaction.chainId, transaction.hash), '_blank')}
            >
              View
            </button>
          </div>
        )}
        
        {transaction.status === 'failed' && (
          <div className="transaction-item__actions">
            <button 
              className="transaction-item__retry-btn"
              onClick={() => handleRetryTransaction(transaction)}
            >
              Retry
            </button>
            <button 
              className="transaction-item__remove-btn"
              onClick={() => handleRemoveTransaction(transaction)}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  };
  
  const getExplorerUrl = (chainId, hash) => {
    const explorers = {
      XDC: `https://explorer.xinfin.network/tx/${hash}`,
      AVALANCHE: `https://snowtrace.io/tx/${hash}`,
      POLYGON: `https://polygonscan.com/tx/${hash}`,
      BSC: `https://bscscan.com/tx/${hash}`,
      SOLANA: `https://explorer.solana.com/tx/${hash}`,
      STELLAR: `https://stellar.expert/explorer/public/tx/${hash}`,
      XRP: `https://xrpscan.com/tx/${hash}`
    };
    return explorers[chainId] || '#';
  };
  
  if (compact) {
    return (
      <div className={`transaction-tracker transaction-tracker--compact transaction-tracker--${position}`}>
        {pendingTransactions.length > 0 && (
          <div className="transaction-tracker__compact-indicator">
            <span className="transaction-tracker__compact-icon">⏳</span>
            <span className="transaction-tracker__compact-count">
              {pendingTransactions.length}
            </span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <>
      <div className={`transaction-tracker transaction-tracker--${position}`}>
        <div className="transaction-tracker__header">
          <h3 className="transaction-tracker__title">
            Transactions
            {pendingTransactions.length > 0 && (
              <span className="transaction-tracker__pending-count">
                {pendingTransactions.length} pending
              </span>
            )}
          </h3>
          
          {allTransactions.length > maxVisible && (
            <button 
              className="transaction-tracker__expand-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : `Show All (${allTransactions.length})`}
            </button>
          )}
        </div>
        
        <div className="transaction-tracker__list">
          {visibleTransactions.length > 0 ? (
            visibleTransactions.map(transaction => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
              />
            ))
          ) : (
            <div className="transaction-tracker__empty">
              <span className="transaction-tracker__empty-icon">📋</span>
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Notifications */}
      <div className="transaction-notifications">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`transaction-notification transaction-notification--${notification.type}`}
          >
            <div className="transaction-notification__content">
              <h4 className="transaction-notification__title">
                {notification.title}
              </h4>
              <p className="transaction-notification__message">
                {notification.message}
              </p>
            </div>
            <button 
              className="transaction-notification__close"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default TransactionTracker;

