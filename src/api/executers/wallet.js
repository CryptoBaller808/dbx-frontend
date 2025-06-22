import { httpClient } from "../client/CommonApi";

/**
 * Enhanced Multi-Chain Wallet API Service
 * Provides comprehensive wallet integration for all supported blockchain networks
 */

/**
 * Get available wallets for the current environment
 */
export const getAvailableWallets = async () => {
  try {
    const response = await httpClient.get('/api/wallets/available');
    return response;
  } catch (error) {
    console.error('Error fetching available wallets:', error);
    throw error;
  }
};

/**
 * Connect to a wallet for a specific blockchain
 * @param {string} chainId - Blockchain network ID (XRP, STELLAR, XDC, SOLANA, AVALANCHE, POLYGON, BSC)
 * @param {string} walletType - Wallet type (metamask, phantom, xumm, freighter, solflare, walletconnect)
 * @param {object} options - Additional connection options
 */
export const connectWallet = async (chainId, walletType, options = {}) => {
  try {
    const response = await httpClient.post('/api/wallets/connect', {
      chainId,
      walletType,
      options
    });
    return response;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

/**
 * Disconnect from a wallet for a specific blockchain
 * @param {string} chainId - Blockchain network ID
 */
export const disconnectWallet = async (chainId) => {
  try {
    const response = await httpClient.post('/api/wallets/disconnect', {
      chainId
    });
    return response;
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
};

/**
 * Disconnect from all connected wallets
 */
export const disconnectAllWallets = async () => {
  try {
    const response = await httpClient.post('/api/wallets/disconnect-all');
    return response;
  } catch (error) {
    console.error('Error disconnecting all wallets:', error);
    throw error;
  }
};

/**
 * Get wallet connection status for all networks
 */
export const getWalletStatus = async () => {
  try {
    const response = await httpClient.get('/api/wallets/status');
    return response;
  } catch (error) {
    console.error('Error fetching wallet status:', error);
    throw error;
  }
};

/**
 * Get wallet connection details for a specific blockchain
 * @param {string} chainId - Blockchain network ID
 */
export const getWalletConnection = async (chainId) => {
  try {
    const response = await httpClient.get(`/api/wallets/connection/${chainId}`);
    return response;
  } catch (error) {
    console.error('Error fetching wallet connection:', error);
    throw error;
  }
};

/**
 * Get balances for all connected wallets
 * @param {boolean} includeTokens - Whether to include token balances
 */
export const getAllBalances = async (includeTokens = true) => {
  try {
    const response = await httpClient.get(`/api/wallets/balance?includeTokens=${includeTokens}`);
    return response;
  } catch (error) {
    console.error('Error fetching all balances:', error);
    throw error;
  }
};

/**
 * Get balance for a specific blockchain network
 * @param {string} chainId - Blockchain network ID
 * @param {boolean} includeTokens - Whether to include token balances
 */
export const getChainBalance = async (chainId, includeTokens = true) => {
  try {
    const response = await httpClient.get(`/api/wallets/balance/${chainId}?includeTokens=${includeTokens}`);
    return response;
  } catch (error) {
    console.error('Error fetching chain balance:', error);
    throw error;
  }
};

/**
 * Switch network for EVM-compatible wallets
 * @param {string} chainId - Target blockchain network ID
 * @param {object} networkConfig - Network configuration (optional)
 */
export const switchNetwork = async (chainId, networkConfig = null) => {
  try {
    const response = await httpClient.post('/api/wallets/switch-network', {
      chainId,
      networkConfig
    });
    return response;
  } catch (error) {
    console.error('Error switching network:', error);
    throw error;
  }
};

/**
 * Sign a transaction with the connected wallet
 * @param {string} chainId - Blockchain network ID
 * @param {object} transaction - Transaction object to sign
 */
export const signTransaction = async (chainId, transaction) => {
  try {
    const response = await httpClient.post('/api/wallets/sign-transaction', {
      chainId,
      transaction
    });
    return response;
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw error;
  }
};

/**
 * Get wallet recommendations based on user preferences and available wallets
 */
export const getWalletRecommendations = async () => {
  try {
    const response = await httpClient.get('/api/wallets/recommendations');
    return response;
  } catch (error) {
    console.error('Error fetching wallet recommendations:', error);
    throw error;
  }
};

/**
 * Get wallet health status and performance metrics
 */
export const getWalletHealth = async () => {
  try {
    const response = await httpClient.get('/api/wallets/health');
    return response;
  } catch (error) {
    console.error('Error fetching wallet health:', error);
    throw error;
  }
};

// Legacy wallet function for backward compatibility
export const addWalletData = async (params) => {
  return await httpClient.post(`/admindashboard/user/addWallet`, params);
};

