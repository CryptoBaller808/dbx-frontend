/**
 * DBX XDC Wallet Adapter
 * Handles XDC Network wallet integration (XDCPay and MetaMask)
 * 
 * @version 2.1.0
 * @author DBX Development Team
 */

import { SUPPORTED_NETWORKS } from '../config/networks';

class XDCAdapter {
  constructor() {
    this.provider = null;
    this.account = null;
    this.chainId = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.walletType = null; // 'xdcpay' or 'metamask'
  }

  /**
   * Check if XDCPay is installed
   */
  isXDCPayInstalled() {
    return typeof window !== 'undefined' && 
           typeof window.xdc !== 'undefined';
  }

  /**
   * Check if MetaMask is installed (for XDC custom network)
   */
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           window.ethereum.isMetaMask;
  }

  /**
   * Get available wallet options
   */
  getAvailableWallets() {
    const wallets = [];
    
    if (this.isXDCPayInstalled()) {
      wallets.push({
        type: 'xdcpay',
        name: 'XDCPay',
        icon: '/images/wallets/xdcpay.png',
        installed: true
      });
    }
    
    if (this.isMetaMaskInstalled()) {
      wallets.push({
        type: 'metamask',
        name: 'MetaMask (XDC Network)',
        icon: '/images/wallets/metamask.png',
        installed: true
      });
    }

    // Add installation options for missing wallets
    if (!this.isXDCPayInstalled()) {
      wallets.push({
        type: 'xdcpay',
        name: 'XDCPay',
        icon: '/images/wallets/xdcpay.png',
        installed: false,
        installUrl: 'https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo'
      });
    }

    return wallets;
  }

  /**
   * Get provider based on wallet type
   */
  getProvider(walletType = 'xdcpay') {
    if (walletType === 'xdcpay' && this.isXDCPayInstalled()) {
      this.provider = window.xdc;
      this.walletType = 'xdcpay';
    } else if (walletType === 'metamask' && this.isMetaMaskInstalled()) {
      this.provider = window.ethereum;
      this.walletType = 'metamask';
    } else {
      throw new Error(`${walletType} wallet is not installed`);
    }
    
    this.setupEventListeners();
    return this.provider;
  }

  /**
   * Connect to XDC wallet
   */
  async connect(walletType = 'xdcpay') {
    try {
      const provider = this.getProvider(walletType);
      
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
      
      // If using MetaMask, ensure we're on XDC network
      if (walletType === 'metamask') {
        await this.ensureXDCNetwork();
      }
      
      this.emit('connect', { 
        account: this.account, 
        chainId: this.chainId,
        walletType: this.walletType
      });
      
      return {
        account: this.account,
        chainId: this.chainId,
        provider: this.provider,
        walletType: this.walletType
      };
    } catch (error) {
      console.error('XDC wallet connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from XDC wallet
   */
  async disconnect() {
    this.account = null;
    this.chainId = null;
    this.isConnected = false;
    this.walletType = null;
    this.emit('disconnect');
  }

  /**
   * Ensure MetaMask is connected to XDC network
   */
  async ensureXDCNetwork() {
    try {
      const xdcNetwork = SUPPORTED_NETWORKS.find(n => n.symbol === 'XDC');
      if (!xdcNetwork) {
        throw new Error('XDC network configuration not found');
      }

      const targetChainId = `0x${xdcNetwork.chainId.toString(16)}`;

      try {
        // Try to switch to XDC network
        await this.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }]
        });
      } catch (switchError) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await this.addXDCNetwork();
        } else {
          throw switchError;
        }
      }

      this.chainId = targetChainId;
      return true;
    } catch (error) {
      console.error('Ensure XDC network failed:', error);
      throw error;
    }
  }

  /**
   * Add XDC network to MetaMask
   */
  async addXDCNetwork() {
    try {
      const xdcNetwork = SUPPORTED_NETWORKS.find(n => n.symbol === 'XDC');
      
      await this.provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${xdcNetwork.chainId.toString(16)}`,
          chainName: xdcNetwork.name,
          nativeCurrency: {
            name: xdcNetwork.nativeCurrency.name,
            symbol: xdcNetwork.nativeCurrency.symbol,
            decimals: xdcNetwork.nativeCurrency.decimals
          },
          rpcUrls: [xdcNetwork.rpcUrl],
          blockExplorerUrls: [xdcNetwork.explorerUrl]
        }]
      });
      
      return true;
    } catch (error) {
      console.error('Add XDC network failed:', error);
      throw error;
    }
  }

  /**
   * Switch network (mainnet/testnet)
   */
  async switchNetwork(networkType = 'mainnet') {
    try {
      const xdcNetwork = SUPPORTED_NETWORKS.find(n => n.symbol === 'XDC');
      if (!xdcNetwork) {
        throw new Error('XDC network configuration not found');
      }

      const rpcUrl = networkType === 'testnet' 
        ? xdcNetwork.testnetRpcUrl 
        : xdcNetwork.rpcUrl;
      
      const explorerUrl = networkType === 'testnet'
        ? xdcNetwork.testnetExplorerUrl
        : xdcNetwork.explorerUrl;

      const chainId = networkType === 'testnet' ? 51 : 50; // XDC Apothem testnet: 51, mainnet: 50
      const targetChainId = `0x${chainId.toString(16)}`;

      if (this.walletType === 'metamask') {
        try {
          await this.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }]
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            // Add the network if it doesn't exist
            await this.provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: targetChainId,
                chainName: networkType === 'testnet' ? 'XDC Apothem Network' : 'XDC Network',
                nativeCurrency: {
                  name: 'XDC',
                  symbol: 'XDC',
                  decimals: 18
                },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: [explorerUrl]
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      this.chainId = targetChainId;
      this.emit('networkChanged', { chainId: targetChainId, networkType });
      
      return true;
    } catch (error) {
      console.error('Network switch failed:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address = null) {
    try {
      if (!this.provider) {
        throw new Error('No provider available');
      }
      
      const account = address || this.account;
      
      if (!account) {
        throw new Error('No account connected');
      }
      
      const balance = await this.provider.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      
      // Convert from wei to XDC
      const balanceInXDC = parseInt(balance, 16) / Math.pow(10, 18);
      
      return {
        raw: balance,
        formatted: balanceInXDC.toFixed(6),
        symbol: 'XDC'
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
      if (!this.provider) {
        throw new Error('No provider available');
      }
      
      const txHash = await this.provider.request({
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
      if (!this.provider) {
        throw new Error('No provider available');
      }
      
      const signature = await this.provider.request({
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
      walletType: this.walletType,
      availableWallets: this.getAvailableWallets()
    };
  }
}

// Export singleton instance
export default new XDCAdapter();

