/**
 * Multi-Chain Wallet Redux Actions
 * Manages state for all blockchain wallet connections and operations
 */

// Action Types
export const WALLET_ACTIONS = {
  // Wallet Discovery and Connection
  SET_AVAILABLE_WALLETS: 'SET_AVAILABLE_WALLETS',
  SET_WALLET_LOADING: 'SET_WALLET_LOADING',
  SET_WALLET_ERROR: 'SET_WALLET_ERROR',
  CLEAR_WALLET_ERROR: 'CLEAR_WALLET_ERROR',
  
  // Multi-Chain Connections
  SET_WALLET_CONNECTION: 'SET_WALLET_CONNECTION',
  REMOVE_WALLET_CONNECTION: 'REMOVE_WALLET_CONNECTION',
  SET_ALL_WALLET_CONNECTIONS: 'SET_ALL_WALLET_CONNECTIONS',
  CLEAR_ALL_WALLET_CONNECTIONS: 'CLEAR_ALL_WALLET_CONNECTIONS',
  
  // Balances and Account Data
  SET_CHAIN_BALANCE: 'SET_CHAIN_BALANCE',
  SET_ALL_BALANCES: 'SET_ALL_BALANCES',
  UPDATE_BALANCE: 'UPDATE_BALANCE',
  CLEAR_BALANCES: 'CLEAR_BALANCES',
  
  // Network Management
  SET_ACTIVE_NETWORK: 'SET_ACTIVE_NETWORK',
  SET_NETWORK_SWITCHING: 'SET_NETWORK_SWITCHING',
  SET_SUPPORTED_NETWORKS: 'SET_SUPPORTED_NETWORKS',
  
  // Transaction State
  SET_PENDING_TRANSACTIONS: 'SET_PENDING_TRANSACTIONS',
  ADD_PENDING_TRANSACTION: 'ADD_PENDING_TRANSACTION',
  UPDATE_TRANSACTION_STATUS: 'UPDATE_TRANSACTION_STATUS',
  REMOVE_PENDING_TRANSACTION: 'REMOVE_PENDING_TRANSACTION',
  
  // Real-time Updates
  SET_REAL_TIME_CONNECTED: 'SET_REAL_TIME_CONNECTED',
  SET_LAST_UPDATE: 'SET_LAST_UPDATE'
};

// Action Creators

/**
 * Wallet Discovery and Connection Actions
 */
export const setAvailableWallets = (wallets) => ({
  type: WALLET_ACTIONS.SET_AVAILABLE_WALLETS,
  payload: wallets
});

export const setWalletLoading = (isLoading, operation = null) => ({
  type: WALLET_ACTIONS.SET_WALLET_LOADING,
  payload: { isLoading, operation }
});

export const setWalletError = (error, chainId = null) => ({
  type: WALLET_ACTIONS.SET_WALLET_ERROR,
  payload: { error, chainId, timestamp: new Date().toISOString() }
});

export const clearWalletError = (chainId = null) => ({
  type: WALLET_ACTIONS.CLEAR_WALLET_ERROR,
  payload: { chainId }
});

/**
 * Multi-Chain Connection Actions
 */
export const setWalletConnection = (chainId, connectionData) => ({
  type: WALLET_ACTIONS.SET_WALLET_CONNECTION,
  payload: { chainId, connectionData }
});

export const removeWalletConnection = (chainId) => ({
  type: WALLET_ACTIONS.REMOVE_WALLET_CONNECTION,
  payload: { chainId }
});

export const setAllWalletConnections = (connections) => ({
  type: WALLET_ACTIONS.SET_ALL_WALLET_CONNECTIONS,
  payload: connections
});

export const clearAllWalletConnections = () => ({
  type: WALLET_ACTIONS.CLEAR_ALL_WALLET_CONNECTIONS
});

/**
 * Balance and Account Data Actions
 */
export const setChainBalance = (chainId, balanceData) => ({
  type: WALLET_ACTIONS.SET_CHAIN_BALANCE,
  payload: { chainId, balanceData }
});

export const setAllBalances = (balances) => ({
  type: WALLET_ACTIONS.SET_ALL_BALANCES,
  payload: balances
});

export const updateBalance = (chainId, address, newBalance) => ({
  type: WALLET_ACTIONS.UPDATE_BALANCE,
  payload: { chainId, address, newBalance, timestamp: new Date().toISOString() }
});

export const clearBalances = (chainId = null) => ({
  type: WALLET_ACTIONS.CLEAR_BALANCES,
  payload: { chainId }
});

/**
 * Network Management Actions
 */
export const setActiveNetwork = (chainId) => ({
  type: WALLET_ACTIONS.SET_ACTIVE_NETWORK,
  payload: { chainId, timestamp: new Date().toISOString() }
});

export const setNetworkSwitching = (isLoading, targetChainId = null) => ({
  type: WALLET_ACTIONS.SET_NETWORK_SWITCHING,
  payload: { isLoading, targetChainId }
});

export const setSupportedNetworks = (networks) => ({
  type: WALLET_ACTIONS.SET_SUPPORTED_NETWORKS,
  payload: networks
});

/**
 * Transaction State Actions
 */
export const setPendingTransactions = (transactions) => ({
  type: WALLET_ACTIONS.SET_PENDING_TRANSACTIONS,
  payload: transactions
});

export const addPendingTransaction = (transaction) => ({
  type: WALLET_ACTIONS.ADD_PENDING_TRANSACTION,
  payload: { ...transaction, timestamp: new Date().toISOString() }
});

export const updateTransactionStatus = (txHash, status, details = null) => ({
  type: WALLET_ACTIONS.UPDATE_TRANSACTION_STATUS,
  payload: { txHash, status, details, timestamp: new Date().toISOString() }
});

export const removePendingTransaction = (txHash) => ({
  type: WALLET_ACTIONS.REMOVE_PENDING_TRANSACTION,
  payload: { txHash }
});

/**
 * Real-time Update Actions
 */
export const setRealTimeConnected = (isConnected) => ({
  type: WALLET_ACTIONS.SET_REAL_TIME_CONNECTED,
  payload: { isConnected, timestamp: new Date().toISOString() }
});

export const setLastUpdate = (updateType, data = null) => ({
  type: WALLET_ACTIONS.SET_LAST_UPDATE,
  payload: { updateType, data, timestamp: new Date().toISOString() }
});

/**
 * Async Action Creators (Thunks)
 */

/**
 * Initialize wallet system and discover available wallets
 */
export const initializeWalletSystem = () => async (dispatch) => {
  try {
    dispatch(setWalletLoading(true, 'initialization'));
    
    // Import wallet API functions
    const { getAvailableWallets, getWalletStatus } = await import('../../api/executers/wallet');
    
    // Get available wallets
    const walletsResponse = await getAvailableWallets();
    if (walletsResponse.success) {
      dispatch(setAvailableWallets(walletsResponse.data.wallets));
    }
    
    // Get current wallet status
    const statusResponse = await getWalletStatus();
    if (statusResponse.success) {
      dispatch(setAllWalletConnections(statusResponse.data.connections));
    }
    
    dispatch(setWalletLoading(false));
  } catch (error) {
    console.error('Failed to initialize wallet system:', error);
    dispatch(setWalletError(error.message));
    dispatch(setWalletLoading(false));
  }
};

/**
 * Connect to a specific wallet
 */
export const connectToWallet = (chainId, walletType, options = {}) => async (dispatch) => {
  try {
    dispatch(setWalletLoading(true, `connecting_${chainId}`));
    dispatch(clearWalletError(chainId));
    
    // Use frontend-only wallet implementation
    const { connectWallet } = await import('../../api/executers/wallet-frontend');
    
    const response = await connectWallet(chainId, walletType, options);
    
    if (response.success) {
      dispatch(setWalletConnection(chainId, response.data));
      
      // Fetch balance after successful connection (if balance fetching is available)
      try {
        dispatch(fetchChainBalance(chainId));
      } catch (balanceError) {
        console.warn(`Could not fetch balance for ${chainId}:`, balanceError);
        // Don't fail the connection if balance fetching fails
      }
    } else {
      // Handle structured error response
      const errorMessage = response.error?.message || 'Failed to connect wallet';
      dispatch(setWalletError(errorMessage, chainId));
    }
    
    dispatch(setWalletLoading(false));
    return response;
  } catch (error) {
    console.error(`Failed to connect to ${walletType} on ${chainId}:`, error);
    
    // Provide user-friendly error messages
    let userMessage = error.message;
    if (error.message.includes('not installed')) {
      userMessage = `${walletType} wallet is not installed. Please install it to continue.`;
    } else if (error.message.includes('not connected')) {
      userMessage = `Please unlock your ${walletType} wallet and try again.`;
    } else if (error.message.includes('rejected')) {
      userMessage = 'Connection was rejected. Please try again.';
    }
    
    dispatch(setWalletError(userMessage, chainId));
    dispatch(setWalletLoading(false));
    
    // Return error response instead of throwing to prevent crashes
    return {
      success: false,
      error: {
        message: userMessage,
        originalError: error.message
      }
    };
  }
};

/**
 * Disconnect from a specific wallet
 */
export const disconnectFromWallet = (chainId) => async (dispatch) => {
  try {
    dispatch(setWalletLoading(true, `disconnecting_${chainId}`));
    
    const { disconnectWallet } = await import('../../api/executers/wallet');
    
    const response = await disconnectWallet(chainId);
    
    if (response.success) {
      dispatch(removeWalletConnection(chainId));
      dispatch(clearBalances(chainId));
    }
    
    dispatch(setWalletLoading(false));
    return response;
  } catch (error) {
    console.error(`Failed to disconnect from ${chainId}:`, error);
    dispatch(setWalletError(error.message, chainId));
    dispatch(setWalletLoading(false));
    throw error;
  }
};

/**
 * Fetch balance for a specific chain
 */
export const fetchChainBalance = (chainId, includeTokens = true) => async (dispatch) => {
  try {
    const { getChainBalance } = await import('../../api/executers/wallet');
    
    const response = await getChainBalance(chainId, includeTokens);
    
    if (response.success) {
      dispatch(setChainBalance(chainId, response.data));
    }
    
    return response;
  } catch (error) {
    console.error(`Failed to fetch balance for ${chainId}:`, error);
    dispatch(setWalletError(error.message, chainId));
    throw error;
  }
};

/**
 * Fetch balances for all connected wallets
 */
export const fetchAllBalances = (includeTokens = true) => async (dispatch) => {
  try {
    dispatch(setWalletLoading(true, 'fetching_balances'));
    
    const { getAllBalances } = await import('../../api/executers/wallet');
    
    const response = await getAllBalances(includeTokens);
    
    if (response.success) {
      dispatch(setAllBalances(response.data));
    }
    
    dispatch(setWalletLoading(false));
    return response;
  } catch (error) {
    console.error('Failed to fetch all balances:', error);
    dispatch(setWalletError(error.message));
    dispatch(setWalletLoading(false));
    throw error;
  }
};

/**
 * Switch to a different network
 */
export const switchToNetwork = (chainId, networkConfig = null) => async (dispatch) => {
  try {
    dispatch(setNetworkSwitching(true, chainId));
    
    const { switchNetwork } = await import('../../api/executers/wallet');
    
    const response = await switchNetwork(chainId, networkConfig);
    
    if (response.success) {
      dispatch(setActiveNetwork(chainId));
      // Refresh wallet status after network switch
      dispatch(initializeWalletSystem());
    }
    
    dispatch(setNetworkSwitching(false));
    return response;
  } catch (error) {
    console.error(`Failed to switch to network ${chainId}:`, error);
    dispatch(setWalletError(error.message, chainId));
    dispatch(setNetworkSwitching(false));
    throw error;
  }
};

