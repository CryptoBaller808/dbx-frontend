/**
 * DBX Bitcoin Wallet Adapter
 * Handles Bitcoin wallet integration (Unisat and compatible wallets)
 * 
 * @version 2.1.0
 * @author DBX Development Team
 */

import { SUPPORTED_NETWORKS } from '../config/networks';

class BitcoinAdapter {
  constructor() {
    this.provider = null;
    this.address = null;
    this.publicKey = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.walletType = null; // 'unisat', 'okx', 'xverse'
    this.network = 'mainnet'; // mainnet, testnet
  }

  /**
   * Check if Unisat wallet is installed
   */
  isUnisatInstalled() {
    return typeof window !== 'undefined' && 
           typeof window.unisat !== 'undefined';
  }

  /**
   * Check if OKX wallet is installed
   */
  isOKXInstalled() {
    return typeof window !== 'undefined' && 
           typeof window.okxwallet !== 'undefined' &&
           typeof window.okxwallet.bitcoin !== 'undefined';
  }

  /**
   * Check if Xverse wallet is installed
   */
  isXverseInstalled() {
    return typeof window !== 'undefined' && 
           typeof window.XverseProviders !== 'undefined';
  }

  /**
   * Get available wallet options
   */
  getAvailableWallets() {
    const wallets = [];
    
    if (this.isUnisatInstalled()) {
      wallets.push({
        type: 'unisat',
        name: 'Unisat Wallet',
        icon: '/images/wallets/unisat.png',
        installed: true
      });
    }
    
    if (this.isOKXInstalled()) {
      wallets.push({
        type: 'okx',
        name: 'OKX Wallet',
        icon: '/images/wallets/okx.png',
        installed: true
      });
    }

    if (this.isXverseInstalled()) {
      wallets.push({
        type: 'xverse',
        name: 'Xverse Wallet',
        icon: '/images/wallets/xverse.png',
        installed: true
      });
    }

    // Add installation options for missing wallets
    if (!this.isUnisatInstalled()) {
      wallets.push({
        type: 'unisat',
        name: 'Unisat Wallet',
        icon: '/images/wallets/unisat.png',
        installed: false,
        installUrl: 'https://unisat.io/'
      });
    }

    return wallets;
  }

  /**
   * Get provider based on wallet type
   */
  getProvider(walletType = 'unisat') {
    if (walletType === 'unisat' && this.isUnisatInstalled()) {
      this.provider = window.unisat;
      this.walletType = 'unisat';
    } else if (walletType === 'okx' && this.isOKXInstalled()) {
      this.provider = window.okxwallet.bitcoin;
      this.walletType = 'okx';
    } else if (walletType === 'xverse' && this.isXverseInstalled()) {
      this.provider = window.XverseProviders?.BitcoinProvider;
      this.walletType = 'xverse';
    } else {
      throw new Error(`${walletType} wallet is not installed`);
    }
    
    this.setupEventListeners();
    return this.provider;
  }

  /**
   * Connect to Bitcoin wallet
   */
  async connect(walletType = 'unisat') {
    try {
      const provider = this.getProvider(walletType);
      
      let result;
      
      if (walletType === 'unisat') {
        result = await provider.requestAccounts();
        if (result.length === 0) {
          throw new Error('No accounts found');
        }
        this.address = result[0];
        
        // Get public key
        try {
          this.publicKey = await provider.getPublicKey();
        } catch (error) {
          console.warn('Could not get public key:', error);
        }
        
      } else if (walletType === 'okx') {
        result = await provider.connect();
        this.address = result.address;
        this.publicKey = result.publicKey;
        
      } else if (walletType === 'xverse') {
        result = await provider.request('getAccounts', null);
        if (result.length === 0) {
          throw new Error('No accounts found');
        }
        this.address = result[0].address;
        this.publicKey = result[0].publicKey;
      }
      
      this.isConnected = true;
      
      this.emit('connect', { 
        address: this.address,
        publicKey: this.publicKey,
        walletType: this.walletType
      });
      
      return {
        address: this.address,
        publicKey: this.publicKey,
        provider: this.provider,
        walletType: this.walletType
      };
    } catch (error) {
      console.error('Bitcoin wallet connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Bitcoin wallet
   */
  async disconnect() {
    this.address = null;
    this.publicKey = null;
    this.isConnected = false;
    this.walletType = null;
    this.emit('disconnect');
  }

  /**
   * Switch network (mainnet/testnet)
   */
  async switchNetwork(networkType = 'mainnet') {
    try {
      if (!['mainnet', 'testnet'].includes(networkType)) {
        throw new Error('Invalid network type. Use: mainnet or testnet');
      }

      if (this.walletType === 'unisat' && this.provider) {
        await this.provider.switchNetwork(networkType);
      }

      this.network = networkType;
      this.emit('networkChanged', { network: networkType });
      
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
      const targetAddress = address || this.address;
      
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      if (this.walletType === 'unisat' && this.provider) {
        const balance = await this.provider.getBalance();
        
        return {
          confirmed: balance.confirmed,
          unconfirmed: balance.unconfirmed,
          total: balance.total,
          formatted: (balance.total / 100000000).toFixed(8), // Convert satoshis to BTC
          symbol: 'BTC'
        };
      } else {
        // Fallback to API call
        return await this.getBalanceFromAPI(targetAddress);
      }
    } catch (error) {
      console.error('Get balance failed:', error);
      throw error;
    }
  }

  /**
   * Get balance from external API
   */
  async getBalanceFromAPI(address) {
    try {
      const btcNetwork = SUPPORTED_NETWORKS.find(n => n.symbol === 'BTC');
      if (!btcNetwork) {
        throw new Error('Bitcoin network configuration not found');
      }

      const apiUrl = this.network === 'testnet' 
        ? `${btcNetwork.testnetRpcUrl}/address/${address}`
        : `${btcNetwork.rpcUrl}/address/${address}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      const balanceInSatoshis = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      const balanceInBTC = balanceInSatoshis / 100000000;

      return {
        confirmed: balanceInSatoshis,
        unconfirmed: 0,
        total: balanceInSatoshis,
        formatted: balanceInBTC.toFixed(8),
        symbol: 'BTC'
      };
    } catch (error) {
      console.error('Get balance from API failed:', error);
      throw error;
    }
  }

  /**
   * Send Bitcoin transaction
   */
  async sendBitcoin(toAddress, amount) {
    try {
      if (!this.provider) {
        throw new Error('No provider available');
      }

      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      let txHash;

      if (this.walletType === 'unisat') {
        txHash = await this.provider.sendBitcoin(toAddress, amount);
      } else if (this.walletType === 'okx') {
        const result = await this.provider.sendBitcoin({
          from: this.address,
          to: toAddress,
          value: amount
        });
        txHash = result.txhash;
      } else {
        throw new Error(`Send transaction not implemented for ${this.walletType}`);
      }

      return txHash;
    } catch (error) {
      console.error('Send Bitcoin failed:', error);
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

      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      let signature;

      if (this.walletType === 'unisat') {
        signature = await this.provider.signMessage(message);
      } else if (this.walletType === 'okx') {
        signature = await this.provider.signMessage(message);
      } else {
        throw new Error(`Sign message not implemented for ${this.walletType}`);
      }

      return signature;
    } catch (error) {
      console.error('Sign message failed:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(address = null) {
    try {
      const targetAddress = address || this.address;
      
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const btcNetwork = SUPPORTED_NETWORKS.find(n => n.symbol === 'BTC');
      const apiUrl = this.network === 'testnet' 
        ? `${btcNetwork.testnetRpcUrl}/address/${targetAddress}/txs`
        : `${btcNetwork.rpcUrl}/address/${targetAddress}/txs`;

      const response = await fetch(apiUrl);
      const transactions = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }

      return transactions.map(tx => ({
        txid: tx.txid,
        confirmations: tx.status.confirmed ? tx.status.block_height : 0,
        value: tx.value,
        fee: tx.fee,
        time: tx.status.block_time
      }));
    } catch (error) {
      console.error('Get transaction history failed:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.provider) return;

    if (this.walletType === 'unisat') {
      // Account changed
      this.provider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.address = accounts[0];
          this.emit('accountChanged', { address: this.address });
        }
      });

      // Network changed
      this.provider.on('networkChanged', (network) => {
        this.network = network;
        this.emit('networkChanged', { network });
      });
    }
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
      address: this.address,
      publicKey: this.publicKey,
      network: this.network,
      walletType: this.walletType,
      availableWallets: this.getAvailableWallets()
    };
  }
}

// Export singleton instance
export default new BitcoinAdapter();

