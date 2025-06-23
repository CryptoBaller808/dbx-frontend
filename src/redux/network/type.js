/**
 * DBX Multi-Chain Network Redux Action Types
 * 
 * Action types for managing multiple blockchain networks
 * 
 * @version 2.0.0
 * @author DBX Development Team
 */

// Core network actions
export const SET_NETWORK = "SET_NETWORK";
export const SET_NETWORK_TYPE = "SET_NETWORK_TYPE";

// Network connection management
export const SET_CONNECTED_NETWORKS = "SET_CONNECTED_NETWORKS";
export const ADD_CONNECTED_NETWORK = "ADD_CONNECTED_NETWORK";
export const REMOVE_CONNECTED_NETWORK = "REMOVE_CONNECTED_NETWORK";

// Network data management
export const SET_NETWORK_BALANCES = "SET_NETWORK_BALANCES";
export const SET_NETWORK_STATUS = "SET_NETWORK_STATUS";

// Network state management
export const RESET_NETWORK_STATE = "RESET_NETWORK_STATE";

// Legacy support
export const SET_TOKEN = "SET_TOKEN";