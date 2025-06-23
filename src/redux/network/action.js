/**
 * DBX Multi-Chain Network Redux Actions
 * 
 * Action creators for managing multiple blockchain networks
 * 
 * @version 2.0.0
 * @author DBX Development Team
 */

import {
  SET_NETWORK,
  SET_NETWORK_TYPE,
  SET_CONNECTED_NETWORKS,
  ADD_CONNECTED_NETWORK,
  REMOVE_CONNECTED_NETWORK,
  SET_NETWORK_BALANCES,
  SET_NETWORK_STATUS,
  RESET_NETWORK_STATE,
  SET_TOKEN
} from "./type";

/**
 * Set active network
 * @param {string} network - Network symbol (e.g., 'BTC', 'ETH', 'XRP')
 */
export const setNetwork = (network) => ({
  type: SET_NETWORK,
  payload: { network: network.toUpperCase() }
});

/**
 * Set network type (mainnet/testnet)
 * @param {string} networkType - Network type ('mainnet' or 'testnet')
 */
export const setNetworkType = (networkType) => ({
  type: SET_NETWORK_TYPE,
  payload: { networkType }
});

/**
 * Set all connected networks
 * @param {object} networks - Object containing all connected networks
 */
export const setConnectedNetworks = (networks) => ({
  type: SET_CONNECTED_NETWORKS,
  payload: { networks }
});

/**
 * Add a connected network
 * @param {string} network - Network symbol
 * @param {string} walletType - Type of wallet used
 * @param {string} address - Wallet address
 * @param {object} metadata - Additional network metadata
 */
export const addConnectedNetwork = (network, walletType, address, metadata = {}) => ({
  type: ADD_CONNECTED_NETWORK,
  payload: { 
    network: network.toUpperCase(), 
    walletType, 
    address, 
    metadata 
  }
});

/**
 * Remove a connected network
 * @param {string} network - Network symbol to disconnect
 */
export const removeConnectedNetwork = (network) => ({
  type: REMOVE_CONNECTED_NETWORK,
  payload: { network: network.toUpperCase() }
});

/**
 * Set network balances
 * @param {string} network - Network symbol
 * @param {object} balances - Balance data for the network
 */
export const setNetworkBalances = (network, balances) => ({
  type: SET_NETWORK_BALANCES,
  payload: { 
    network: network.toUpperCase(), 
    balances 
  }
});

/**
 * Set network status
 * @param {string} network - Network symbol
 * @param {string} status - Network status ('connected', 'disconnected', 'error', 'connecting')
 * @param {string} error - Error message if status is 'error'
 */
export const setNetworkStatus = (network, status, error = null) => ({
  type: SET_NETWORK_STATUS,
  payload: { 
    network: network.toUpperCase(), 
    status, 
    error 
  }
});

/**
 * Reset all network state
 */
export const resetNetworkState = () => ({
  type: RESET_NETWORK_STATE
});

/**
 * Legacy action for backward compatibility
 * @param {string} token - Token/network symbol
 */
export const setToken = (token) => ({
  type: SET_TOKEN,
  payload: token.toLowerCase()
});

// Convenience action creators for common operations

/**
 * Switch to a different network
 * @param {string} network - Target network symbol
 * @param {string} networkType - Network type (optional)
 */
export const switchNetwork = (network, networkType = null) => {
  return (dispatch) => {
    dispatch(setNetwork(network));
    if (networkType) {
      dispatch(setNetworkType(networkType));
    }
  };
};

/**
 * Connect wallet to network
 * @param {string} network - Network symbol
 * @param {string} walletType - Wallet type
 * @param {string} address - Wallet address
 * @param {object} metadata - Additional metadata
 */
export const connectWalletToNetwork = (network, walletType, address, metadata = {}) => {
  return (dispatch) => {
    dispatch(setNetworkStatus(network, 'connecting'));
    dispatch(addConnectedNetwork(network, walletType, address, metadata));
    dispatch(setNetworkStatus(network, 'connected'));
  };
};

/**
 * Disconnect wallet from network
 * @param {string} network - Network symbol
 */
export const disconnectWalletFromNetwork = (network) => {
  return (dispatch) => {
    dispatch(removeConnectedNetwork(network));
    dispatch(setNetworkStatus(network, 'disconnected'));
  };
};

/**
 * Update network balances
 * @param {string} network - Network symbol
 * @param {object} balances - New balance data
 */
export const updateNetworkBalances = (network, balances) => {
  return (dispatch) => {
    dispatch(setNetworkBalances(network, balances));
  };
};
