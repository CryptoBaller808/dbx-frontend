/**
 * Multi-Chain Wallet Redux Reducer
 * Manages state for all blockchain wallet connections and operations
 */

import { WALLET_ACTIONS } from './actions';

// Initial State
const initialState = {
  // Wallet Discovery and Connection
  availableWallets: [],
  isLoading: false,
  loadingOperation: null,
  error: null,
  errors: {}, // Chain-specific errors
  
  // Multi-Chain Connections
  connections: {}, // { chainId: connectionData }
  activeNetwork: null,
  isNetworkSwitching: false,
  targetNetwork: null,
  supportedNetworks: [
    'XRP',
    'STELLAR', 
    'XDC',
    'SOLANA',
    'AVALANCHE',
    'POLYGON',
    'BSC'
  ],
  
  // Balances and Account Data
  balances: {}, // { chainId: balanceData }
  lastBalanceUpdate: null,
  
  // Transaction State
  pendingTransactions: [],
  transactionHistory: {},
  
  // Real-time Updates
  isRealTimeConnected: false,
  lastUpdate: null,
  
  // UI State
  walletModalOpen: false,
  selectedChainForConnection: null,
  
  // Network Configurations
  networkConfigs: {
    XRP: {
      name: 'XRP Ledger',
      symbol: 'XRP',
      decimals: 6,
      color: '#23292F',
      icon: '🔷',
      walletTypes: ['xumm'],
      isEVM: false
    },
    STELLAR: {
      name: 'Stellar',
      symbol: 'XLM',
      decimals: 7,
      color: '#7B73FF',
      icon: '⭐',
      walletTypes: ['freighter'],
      isEVM: false
    },
    XDC: {
      name: 'XDC Network',
      symbol: 'XDC',
      decimals: 18,
      color: '#F7931A',
      icon: '🟦',
      walletTypes: ['metamask', 'walletconnect'],
      isEVM: true,
      chainId: 50
    },
    SOLANA: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9,
      color: '#9945FF',
      icon: '🟣',
      walletTypes: ['phantom', 'solflare'],
      isEVM: false
    },
    AVALANCHE: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
      color: '#E84142',
      icon: '🔴',
      walletTypes: ['metamask', 'walletconnect'],
      isEVM: true,
      chainId: 43114
    },
    POLYGON: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      color: '#8247E5',
      icon: '🟣',
      walletTypes: ['metamask', 'walletconnect'],
      isEVM: true,
      chainId: 137
    },
    BSC: {
      name: 'Binance Smart Chain',
      symbol: 'BNB',
      decimals: 18,
      color: '#F3BA2F',
      icon: '🟡',
      walletTypes: ['metamask', 'walletconnect'],
      isEVM: true,
      chainId: 56
    }
  }
};

// Helper Functions
const updateConnectionState = (state, chainId, connectionData) => {
  return {
    ...state,
    connections: {
      ...state.connections,
      [chainId]: {
        ...connectionData,
        connectedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }
    }
  };
};

const removeConnectionState = (state, chainId) => {
  const newConnections = { ...state.connections };
  delete newConnections[chainId];
  
  const newBalances = { ...state.balances };
  delete newBalances[chainId];
  
  const newErrors = { ...state.errors };
  delete newErrors[chainId];
  
  return {
    ...state,
    connections: newConnections,
    balances: newBalances,
    errors: newErrors
  };
};

const updateBalanceState = (state, chainId, balanceData) => {
  return {
    ...state,
    balances: {
      ...state.balances,
      [chainId]: {
        ...balanceData,
        lastUpdated: new Date().toISOString()
      }
    },
    lastBalanceUpdate: new Date().toISOString()
  };
};

const updateTransactionState = (state, txHash, status, details) => {
  return {
    ...state,
    pendingTransactions: state.pendingTransactions.map(tx =>
      tx.hash === txHash
        ? { ...tx, status, details, lastUpdated: new Date().toISOString() }
        : tx
    )
  };
};

// Reducer
const multiChainWalletReducer = (state = initialState, action) => {
  switch (action.type) {
    // Wallet Discovery and Connection
    case WALLET_ACTIONS.SET_AVAILABLE_WALLETS:
      return {
        ...state,
        availableWallets: action.payload,
        lastUpdate: new Date().toISOString()
      };
      
    case WALLET_ACTIONS.SET_WALLET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
        loadingOperation: action.payload.operation
      };
      
    case WALLET_ACTIONS.SET_WALLET_ERROR:
      const { error, chainId, timestamp } = action.payload;
      return {
        ...state,
        error: chainId ? null : error,
        errors: chainId 
          ? { ...state.errors, [chainId]: { message: error, timestamp } }
          : state.errors,
        isLoading: false
      };
      
    case WALLET_ACTIONS.CLEAR_WALLET_ERROR:
      const { chainId: clearChainId } = action.payload;
      if (clearChainId) {
        const newErrors = { ...state.errors };
        delete newErrors[clearChainId];
        return { ...state, errors: newErrors };
      }
      return { ...state, error: null, errors: {} };
      
    // Multi-Chain Connections
    case WALLET_ACTIONS.SET_WALLET_CONNECTION:
      return updateConnectionState(state, action.payload.chainId, action.payload.connectionData);
      
    case WALLET_ACTIONS.REMOVE_WALLET_CONNECTION:
      return removeConnectionState(state, action.payload.chainId);
      
    case WALLET_ACTIONS.SET_ALL_WALLET_CONNECTIONS:
      return {
        ...state,
        connections: action.payload,
        lastUpdate: new Date().toISOString()
      };
      
    case WALLET_ACTIONS.CLEAR_ALL_WALLET_CONNECTIONS:
      return {
        ...state,
        connections: {},
        balances: {},
        errors: {},
        activeNetwork: null,
        pendingTransactions: []
      };
      
    // Balances and Account Data
    case WALLET_ACTIONS.SET_CHAIN_BALANCE:
      return updateBalanceState(state, action.payload.chainId, action.payload.balanceData);
      
    case WALLET_ACTIONS.SET_ALL_BALANCES:
      return {
        ...state,
        balances: action.payload,
        lastBalanceUpdate: new Date().toISOString()
      };
      
    case WALLET_ACTIONS.UPDATE_BALANCE:
      const { chainId: updateChainId, address, newBalance, timestamp: updateTimestamp } = action.payload;
      const currentChainBalance = state.balances[updateChainId] || {};
      return {
        ...state,
        balances: {
          ...state.balances,
          [updateChainId]: {
            ...currentChainBalance,
            [address]: newBalance,
            lastUpdated: updateTimestamp
          }
        },
        lastBalanceUpdate: updateTimestamp
      };
      
    case WALLET_ACTIONS.CLEAR_BALANCES:
      const { chainId: clearBalanceChainId } = action.payload;
      if (clearBalanceChainId) {
        const newBalances = { ...state.balances };
        delete newBalances[clearBalanceChainId];
        return { ...state, balances: newBalances };
      }
      return { ...state, balances: {} };
      
    // Network Management
    case WALLET_ACTIONS.SET_ACTIVE_NETWORK:
      return {
        ...state,
        activeNetwork: action.payload.chainId,
        lastUpdate: action.payload.timestamp
      };
      
    case WALLET_ACTIONS.SET_NETWORK_SWITCHING:
      return {
        ...state,
        isNetworkSwitching: action.payload.isLoading,
        targetNetwork: action.payload.targetChainId
      };
      
    case WALLET_ACTIONS.SET_SUPPORTED_NETWORKS:
      return {
        ...state,
        supportedNetworks: action.payload
      };
      
    // Transaction State
    case WALLET_ACTIONS.SET_PENDING_TRANSACTIONS:
      return {
        ...state,
        pendingTransactions: action.payload
      };
      
    case WALLET_ACTIONS.ADD_PENDING_TRANSACTION:
      return {
        ...state,
        pendingTransactions: [...state.pendingTransactions, action.payload]
      };
      
    case WALLET_ACTIONS.UPDATE_TRANSACTION_STATUS:
      return updateTransactionState(
        state,
        action.payload.txHash,
        action.payload.status,
        action.payload.details
      );
      
    case WALLET_ACTIONS.REMOVE_PENDING_TRANSACTION:
      return {
        ...state,
        pendingTransactions: state.pendingTransactions.filter(
          tx => tx.hash !== action.payload.txHash
        )
      };
      
    // Real-time Updates
    case WALLET_ACTIONS.SET_REAL_TIME_CONNECTED:
      return {
        ...state,
        isRealTimeConnected: action.payload.isConnected,
        lastUpdate: action.payload.timestamp
      };
      
    case WALLET_ACTIONS.SET_LAST_UPDATE:
      return {
        ...state,
        lastUpdate: action.payload.timestamp
      };
      
    default:
      return state;
  }
};

// Selectors
export const selectAvailableWallets = (state) => state.multiChainWallet.availableWallets;
export const selectIsWalletLoading = (state) => state.multiChainWallet.isLoading;
export const selectWalletError = (state) => state.multiChainWallet.error;
export const selectChainError = (state, chainId) => state.multiChainWallet.errors[chainId];
export const selectWalletConnections = (state) => state.multiChainWallet.connections;
export const selectChainConnection = (state, chainId) => state.multiChainWallet.connections[chainId];
export const selectIsChainConnected = (state, chainId) => !!state.multiChainWallet.connections[chainId];
export const selectActiveNetwork = (state) => state.multiChainWallet.activeNetwork;
export const selectSupportedNetworks = (state) => state.multiChainWallet.supportedNetworks;
export const selectNetworkConfig = (state, chainId) => state.multiChainWallet.networkConfigs[chainId];
export const selectAllBalances = (state) => state.multiChainWallet.balances;
export const selectChainBalance = (state, chainId) => state.multiChainWallet.balances[chainId];
export const selectPendingTransactions = (state) => state.multiChainWallet.pendingTransactions;
export const selectIsNetworkSwitching = (state) => state.multiChainWallet.isNetworkSwitching;
export const selectIsRealTimeConnected = (state) => state.multiChainWallet.isRealTimeConnected;

// Connected chains selector
export const selectConnectedChains = (state) => {
  return Object.keys(state.multiChainWallet.connections);
};

// Total portfolio value selector (would need price data)
export const selectTotalPortfolioValue = (state) => {
  // This would calculate total value across all chains
  // Requires price data integration
  return 0;
};

export default multiChainWalletReducer;

