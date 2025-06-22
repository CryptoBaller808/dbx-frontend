import { httpClient } from "../client/CommonApi";

/**
 * Cross-Chain Transaction API Service
 * Provides comprehensive cross-chain transaction functionality
 */

/**
 * Get available cross-chain routes between networks
 * @param {string} fromChain - Source blockchain network
 * @param {string} toChain - Destination blockchain network
 * @param {string} asset - Asset to transfer
 */
export const getCrossChainRoutes = async (fromChain, toChain, asset) => {
  try {
    const response = await httpClient.get(`/api/cross-chain/routes?from=${fromChain}&to=${toChain}&asset=${asset}`);
    return response;
  } catch (error) {
    console.error('Error fetching cross-chain routes:', error);
    throw error;
  }
};

/**
 * Get quote for cross-chain transfer
 * @param {string} fromChain - Source blockchain network
 * @param {string} toChain - Destination blockchain network
 * @param {string} asset - Asset to transfer
 * @param {string} amount - Amount to transfer
 * @param {string} recipient - Recipient address
 */
export const getCrossChainQuote = async (fromChain, toChain, asset, amount, recipient) => {
  try {
    const response = await httpClient.post('/api/cross-chain/quote', {
      fromChain,
      toChain,
      asset,
      amount,
      recipient
    });
    return response;
  } catch (error) {
    console.error('Error getting cross-chain quote:', error);
    throw error;
  }
};

/**
 * Execute cross-chain transfer
 * @param {object} transferData - Transfer parameters
 */
export const executeCrossChainTransfer = async (transferData) => {
  try {
    const response = await httpClient.post('/api/cross-chain/transfer', transferData);
    return response;
  } catch (error) {
    console.error('Error executing cross-chain transfer:', error);
    throw error;
  }
};

/**
 * Get cross-chain transfer status
 * @param {string} transferId - Transfer ID
 */
export const getCrossChainTransferStatus = async (transferId) => {
  try {
    const response = await httpClient.get(`/api/cross-chain/transfer/${transferId}/status`);
    return response;
  } catch (error) {
    console.error('Error fetching transfer status:', error);
    throw error;
  }
};

/**
 * Get user's cross-chain transfer history
 * @param {object} filters - Filter options (page, limit, status, etc.)
 */
export const getCrossChainHistory = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await httpClient.get(`/api/cross-chain/history?${queryParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching cross-chain history:', error);
    throw error;
  }
};

/**
 * Get supported bridge providers
 */
export const getBridgeProviders = async () => {
  try {
    const response = await httpClient.get('/api/cross-chain/bridges');
    return response;
  } catch (error) {
    console.error('Error fetching bridge providers:', error);
    throw error;
  }
};

/**
 * Get atomic swap quote
 * @param {string} fromChain - Source blockchain network
 * @param {string} toChain - Destination blockchain network
 * @param {string} fromAsset - Source asset
 * @param {string} toAsset - Destination asset
 * @param {string} amount - Amount to swap
 */
export const getAtomicSwapQuote = async (fromChain, toChain, fromAsset, toAsset, amount) => {
  try {
    const response = await httpClient.post('/api/cross-chain/atomic-swap/quote', {
      fromChain,
      toChain,
      fromAsset,
      toAsset,
      amount
    });
    return response;
  } catch (error) {
    console.error('Error getting atomic swap quote:', error);
    throw error;
  }
};

/**
 * Execute atomic swap
 * @param {object} swapData - Swap parameters
 */
export const executeAtomicSwap = async (swapData) => {
  try {
    const response = await httpClient.post('/api/cross-chain/atomic-swap/execute', swapData);
    return response;
  } catch (error) {
    console.error('Error executing atomic swap:', error);
    throw error;
  }
};

/**
 * Get cross-chain statistics and metrics
 */
export const getCrossChainStats = async () => {
  try {
    const response = await httpClient.get('/api/cross-chain/stats');
    return response;
  } catch (error) {
    console.error('Error fetching cross-chain stats:', error);
    throw error;
  }
};

/**
 * Blockchain Transaction API Service
 * Provides transaction functionality for all supported networks
 */

/**
 * Get transaction history for a specific chain
 * @param {string} chainId - Blockchain network ID
 * @param {object} filters - Filter options (page, limit, address, etc.)
 */
export const getTransactionHistory = async (chainId, filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await httpClient.get(`/api/transactions/${chainId}/history?${queryParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};

/**
 * Get transaction details
 * @param {string} chainId - Blockchain network ID
 * @param {string} txHash - Transaction hash
 */
export const getTransactionDetails = async (chainId, txHash) => {
  try {
    const response = await httpClient.get(`/api/transactions/${chainId}/${txHash}`);
    return response;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
};

/**
 * Submit a transaction to the blockchain
 * @param {string} chainId - Blockchain network ID
 * @param {object} transaction - Transaction object
 */
export const submitTransaction = async (chainId, transaction) => {
  try {
    const response = await httpClient.post(`/api/transactions/${chainId}/submit`, {
      transaction
    });
    return response;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    throw error;
  }
};

/**
 * Estimate transaction fees
 * @param {string} chainId - Blockchain network ID
 * @param {object} transaction - Transaction object
 */
export const estimateTransactionFees = async (chainId, transaction) => {
  try {
    const response = await httpClient.post(`/api/transactions/${chainId}/estimate-fees`, {
      transaction
    });
    return response;
  } catch (error) {
    console.error('Error estimating transaction fees:', error);
    throw error;
  }
};

/**
 * Get pending transactions for user
 */
export const getPendingTransactions = async () => {
  try {
    const response = await httpClient.get('/api/transactions/pending');
    return response;
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    throw error;
  }
};

/**
 * Cancel a pending transaction (if supported by network)
 * @param {string} chainId - Blockchain network ID
 * @param {string} txHash - Transaction hash
 */
export const cancelTransaction = async (chainId, txHash) => {
  try {
    const response = await httpClient.post(`/api/transactions/${chainId}/${txHash}/cancel`);
    return response;
  } catch (error) {
    console.error('Error canceling transaction:', error);
    throw error;
  }
};

/**
 * Speed up a pending transaction (if supported by network)
 * @param {string} chainId - Blockchain network ID
 * @param {string} txHash - Transaction hash
 * @param {number} newFeeRate - New fee rate
 */
export const speedUpTransaction = async (chainId, txHash, newFeeRate) => {
  try {
    const response = await httpClient.post(`/api/transactions/${chainId}/${txHash}/speed-up`, {
      newFeeRate
    });
    return response;
  } catch (error) {
    console.error('Error speeding up transaction:', error);
    throw error;
  }
};

