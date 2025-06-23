/**
 * DBX Phantom Wallet Adapter
 * Handles Phantom wallet integration for Solana blockchain
 * 
 * @version 2.1.0
 * @author DBX Development Team
 */

import { SUPPORTED_NETWORKS } from '../config/networks';

class PhantomAdapter {
  constructor() {
    this.provider = null;
    this.publicKey = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.network = 'mainnet'; // mainnet, testnet, devnet
  }

  /**
   * Check if Phantom is installed
   */
  isInstalled() {
    return typeof window !== 'undefined' && 
           typeof window.solana !== 'undefined' && 
           window.solana.isPhantom;
  }

  /**
   * Get Phantom provider
   */
  getProvider() {
    if (!this.isInstalled()) {
      throw new Error('Phantom wallet is not installed');
    }
    
    if (!this.provider) {
      this.provider = window.solana;
      this.setupEventListeners();
    }
    
    return this.provider;
  }

  /**
   * Connect to Phantom wallet
   */
  async connect() {
    try {
      const provider = this.getProvider();
      
      const response = await provider.connect();
      
      if (!response.publicKey) {
        throw new Error('Failed to connect to Phantom wallet');
      }
      
      this.publicKey = response.publicKey;
      this.isConnected = true;
      
      this.emit('connect', { 
        publicKey: this.publicKey.toString(),
        address: this.publicKey.toString()
      });
      
      return {
        publicKey: this.publicKey.toString(),
        address: this.publicKey.toString(),
        provider: this.provider
      };
    } catch (error) {
      console.error('Phantom connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Phantom wallet
   */
  async disconnect() {
    try {
      if (this.provider && this.isConnected) {
        await this.provider.disconnect();
      }
      
      this.publicKey = null;
      this.isConnected = false;
      this.emit('disconnect');
    } catch (error) {
      console.error('Phantom disconnect failed:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address = null) {
    try {
      const targetAddress = address || (this.publicKey ? this.publicKey.toString() : null);
      
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      // Get network configuration
      const solanaNetwork = SUPPORTED_NETWORKS.find(n => n.symbol === 'SOL');
      if (!solanaNetwork) {
        throw new Error('Solana network configuration not found');
      }

      // Use the RPC URL from network configuration
      const rpcUrl = this.network === 'testnet' 
        ? solanaNetwork.testnetRpcUrl 
        : solanaNetwork.rpcUrl;

      // Make RPC call to get balance
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [targetAddress]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Convert from lamports to SOL (1 SOL = 1,000,000,000 lamports)
      const balanceInLamports = data.result.value;
      const balanceInSOL = balanceInLamports / 1000000000;
      
      return {
        raw: balanceInLamports.toString(),
        formatted: balanceInSOL.toFixed(6),
        symbol: 'SOL',
        lamports: balanceInLamports
      };
    } catch (error) {
      console.error('Get balance failed:', error);
      throw error;
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(transaction) {
    try {
      const provider = this.getProvider();
      
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      const signedTransaction = await provider.signAndSendTransaction(transaction);
      
      return signedTransaction.signature;
    } catch (error) {
      console.error('Send transaction failed:', error);
      throw error;
    }
  }

  /**
   * Sign transaction
   */
  async signTransaction(transaction) {
    try {
      const provider = this.getProvider();
      
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      const signedTransaction = await provider.signTransaction(transaction);
      
      return signedTransaction;
    } catch (error) {
      console.error('Sign transaction failed:', error);
      throw error;
    }
  }

  /**
   * Sign message
   */
  async signMessage(message) {
    try {
      const provider = this.getProvider();
      
      if (!this.isConnected) {
        throw new Error('Wallet not connected');
      }

      // Convert message to Uint8Array if it's a string
      const messageBytes = typeof message === 'string' 
        ? new TextEncoder().encode(message)
        : message;

      const signedMessage = await provider.signMessage(messageBytes, 'utf8');
      
      return {
        signature: signedMessage.signature,
        publicKey: signedMessage.publicKey.toString()
      };
    } catch (error) {
      console.error('Sign message failed:', error);
      throw error;
    }
  }

  /**
   * Switch network (mainnet/testnet/devnet)
   */
  async switchNetwork(networkType) {
    try {
      if (!['mainnet', 'testnet', 'devnet'].includes(networkType)) {
        throw new Error('Invalid network type. Use: mainnet, testnet, or devnet');
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
   * Get current network
   */
  getCurrentNetwork() {
    return this.network;
  }

  /**
   * Get account info
   */
  async getAccountInfo(address = null) {
    try {
      const targetAddress = address || (this.publicKey ? this.publicKey.toString() : null);
      
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const solanaNetwork = SUPPORTED_NETWORKS.find(n => n.symbol === 'SOL');
      const rpcUrl = this.network === 'testnet' 
        ? solanaNetwork.testnetRpcUrl 
        : solanaNetwork.rpcUrl;

      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getAccountInfo',
          params: [
            targetAddress,
            { encoding: 'base64' }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.result;
    } catch (error) {
      console.error('Get account info failed:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.provider) return;

    // Account changed
    this.provider.on('accountChanged', (publicKey) => {
      if (publicKey) {
        this.publicKey = publicKey;
        this.emit('accountChanged', { 
          publicKey: publicKey.toString(),
          address: publicKey.toString()
        });
      } else {
        this.disconnect();
      }
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
      publicKey: this.publicKey ? this.publicKey.toString() : null,
      address: this.publicKey ? this.publicKey.toString() : null,
      network: this.network,
      isInstalled: this.isInstalled()
    };
  }

  /**
   * Get installation URL
   */
  getInstallationUrl() {
    return 'https://phantom.app/';
  }
}

// Export singleton instance
export default new PhantomAdapter();

