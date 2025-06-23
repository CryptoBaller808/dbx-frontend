/**
 * DBX Multi-Chain Network Redux Store
 * 
 * Enhanced Redux store to manage multiple blockchain networks
 * Supports network switching, connection status, and network-specific data
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
  RESET_NETWORK_STATE
} from "./type";

import { DEFAULT_NETWORK, DEFAULT_NETWORK_TYPE, NETWORK_TYPES } from "../../config/networks";

/**
 * Initial Redux State for Multi-Chain Networks
 */
const defaultReducer = {
  // Current active network
  activeNetwork: DEFAULT_NETWORK,
  
  // Network environment (mainnet/testnet)
  networkType: DEFAULT_NETWORK_TYPE,
  
  // Connected networks with wallet status
  connectedNetworks: {},
  
  // Network balances for all connected networks
  networkBalances: {},
  
  // Network connection status
  networkStatus: {},
  
  // Network switching state
  isSwitching: false,
  
  // Last selected networks for quick access
  recentNetworks: [DEFAULT_NETWORK],
  
  // Network preferences
  preferences: {
    autoConnect: true,
    showTestnets: false,
    defaultGasSettings: {},
    favoriteNetworks: [DEFAULT_NETWORK]
  },
  
  // Error states
  errors: {},
  
  // Loading states
  loading: {
    switching: false,
    connecting: false,
    balances: false
  }
};

/**
 * Multi-Chain Network Reducer
 */
const networkReducer = (state = defaultReducer, action) => {
  const { type, payload } = action;
  
  switch (type) {
    // Set active network
    case SET_NETWORK: {
      return {
        ...state,
        activeNetwork: payload.network,
        recentNetworks: [
          payload.network,
          ...state.recentNetworks.filter(n => n !== payload.network)
        ].slice(0, 5), // Keep only 5 recent networks
        errors: {
          ...state.errors,
          [payload.network]: null // Clear errors for this network
        }
      };
    }

    // Set network type (mainnet/testnet)
    case SET_NETWORK_TYPE: {
      return {
        ...state,
        networkType: payload.networkType,
        // Clear balances when switching network types
        networkBalances: {},
        networkStatus: {}
      };
    }

    // Set all connected networks
    case SET_CONNECTED_NETWORKS: {
      return {
        ...state,
        connectedNetworks: payload.networks
      };
    }

    // Add a connected network
    case ADD_CONNECTED_NETWORK: {
      return {
        ...state,
        connectedNetworks: {
          ...state.connectedNetworks,
          [payload.network]: {
            connected: true,
            walletType: payload.walletType,
            address: payload.address,
            connectedAt: new Date().toISOString(),
            ...payload.metadata
          }
        },
        networkStatus: {
          ...state.networkStatus,
          [payload.network]: 'connected'
        }
      };
    }

    // Remove a connected network
    case REMOVE_CONNECTED_NETWORK: {
      const { [payload.network]: removed, ...remainingNetworks } = state.connectedNetworks;
      const { [payload.network]: removedBalances, ...remainingBalances } = state.networkBalances;
      const { [payload.network]: removedStatus, ...remainingStatus } = state.networkStatus;
      
      return {
        ...state,
        connectedNetworks: remainingNetworks,
        networkBalances: remainingBalances,
        networkStatus: remainingStatus
      };
    }

    // Set network balances
    case SET_NETWORK_BALANCES: {
      return {
        ...state,
        networkBalances: {
          ...state.networkBalances,
          [payload.network]: payload.balances
        },
        loading: {
          ...state.loading,
          balances: false
        }
      };
    }

    // Set network status
    case SET_NETWORK_STATUS: {
      return {
        ...state,
        networkStatus: {
          ...state.networkStatus,
          [payload.network]: payload.status
        },
        errors: {
          ...state.errors,
          [payload.network]: payload.status === 'error' ? payload.error : null
        }
      };
    }

    // Reset network state
    case RESET_NETWORK_STATE: {
      return {
        ...defaultReducer,
        preferences: state.preferences // Keep user preferences
      };
    }

    // Legacy support for existing code
    case 'SET_TOKEN': {
      return {
        ...state,
        activeNetwork: payload.toUpperCase(),
        token: payload // Maintain backward compatibility
      };
    }

    default: {
      return state;
    }
  }
};

export default networkReducer;
