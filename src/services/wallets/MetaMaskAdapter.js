/**
 * DBX MetaMask Wallet Adapter
 * Handles MetaMask integration for all EVM-compatible chains
 * Supports: ETH, BNB, AVAX, MATIC, XDC
 * 
 * @version 2.1.0
 * @author DBX Development Team
 */

import { SUPPORTED_NETWORKS } from '../../config/networks';

class MetaMaskAdapter {
  constructor() {
    this.provider = null;
    this.account = null;
    this.chainId = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  /**
   * Check if MetaMask is installed
   */
  isInstalled() {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           window.ethereum.isMetaMask;
  }

  /**
   * Get MetaMask provider
   */
  getProvider() {
    if (!this.isInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    
    if (!this.provider) {
      this.provider = window.ethereum;
      this.setupEventListeners();
    }
    
    return this.provider;
  }

  /**
   * Connect to MetaMask
   */
  async connect() {
    try {
      const provider = this.getProvider();
      
      // Request account access
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      this.account = accounts[0];
      this.chainId = await provider.request({ method: 'eth_chainId' });
      this.isConnected = true;
      
      this.emit('connect', { account: this.account, chainId: this.chainId });
      
      return {
        account: this.account,
        chainId: this.chainId,
        provider: this.provider
      };
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MetaMask
   */
  async disconnect() {
    this.account = null;
    this.chainId = null;
    this.isConnected = false;
    this.emit('disconnect');
  }

  /**
   * Switch to a specific network
   */
  async switchNetwork(networkSymbol) {
    try {
      const network = SUPPORTED_NETWORKS.find(n => n.symbol === networkSymbol);
      if (!network || network.category !== 'EVM') {
        throw new Error(`Network ${networkSymbol} is not supported by MetaMask`);
      }

      const provider = this.getProvider();
      const targetChainId = `0x${network.chainId.toString(16)}`;

      try {
        // Try to switch to the network
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }]
        });
      } catch (switchError) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await this.addNetwork(network);
        } else {
          throw switchError;
        }
      }

      this.chainId = targetChainId;
      this.emit('networkChanged', { chainId: targetChainId, network });
      
      return true;
    } catch (error) {
      console.error('Network switch failed:', error);
      throw error;
    }
  }

  /**
   * Add a new network to MetaMask
   */
  async addNetwork(network) {
    try {
      const provider = this.getProvider();
      
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${network.chainId.toString(16)}`,
          chainName: network.name,
          nativeCurrency: {
            name: network.nativeCurrency.name,
            symbol: network.nativeCurrency.symbol,
            decimals: network.nativeCurrency.decimals
          },
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.explorerUrl]
        }]
      });
      
      return true;
    } catch (error) {
      console.error('Add network failed:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address = null) {
    try {
      const provider = this.getProvider();
      const account = address || this.account;
      
      if (!account) {
        throw new Error('No account connected');
      }
      
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      
      // Convert from wei to ether
      const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
      
      return {
        raw: balance,
        formatted: balanceInEther.toFixed(6),
        symbol: this.getCurrentNetworkSymbol()
      };
    } catch (error) {
      console.error('Get balance failed:', error);
      throw error;
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(params) {
    try {
      const provider = this.getProvider();
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [params]
      });
      
      return txHash;
    } catch (error) {
      console.error('Send transaction failed:', error);
      throw error;
    }
  }

  /**
   * Sign message
   */
  async signMessage(message) {
    try {
      const provider = this.getProvider();
      
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, this.account]
      });
      
      return signature;
    } catch (error) {
      console.error('Sign message failed:', error);
      throw error;
    }
  }

  /**
   * Get current network symbol
   */
  getCurrentNetworkSymbol() {
    if (!this.chainId) return null;
    
    const chainIdDecimal = parseInt(this.chainId, 16);
    const network = SUPPORTED_NETWORKS.find(n => n.chainId === chainIdDecimal);
    
    return network ? network.symbol : null;
  }

  /**
   * Check if current network is supported
   */
  isNetworkSupported() {
    return this.getCurrentNetworkSymbol() !== null;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.provider) return;

    // Account changed
    this.provider.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.account = accounts[0];
        this.emit('accountChanged', { account: this.account });
      }
    });

    // Chain changed
    this.provider.on('chainChanged', (chainId) => {
      this.chainId = chainId;
      this.emit('chainChanged', { chainId });
    });

    // Disconnect
    this.provider.on('disconnect', () => {
      this.disconnect();
    });
  }

  /**
   * Event emitter methods
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      account: this.account,
      chainId: this.chainId,
      networkSymbol: this.getCurrentNetworkSymbol(),
      isNetworkSupported: this.isNetworkSupported()
    };
  }
}

// Export singleton instance
export default new MetaMaskAdapter();

