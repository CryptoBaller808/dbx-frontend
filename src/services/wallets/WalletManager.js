/**
 * DBX Wallet Manager
 * Coordinates all wallet adapters and provides unified interface
 * 
 * @version 2.1.0
 * @author DBX Development Team
 */

import MetaMaskAdapter from './MetaMaskAdapter';
import PhantomAdapter from './PhantomAdapter';
import XDCAdapter from './XDCAdapter';
import BitcoinAdapter from './BitcoinAdapter';
import { SUPPORTED_NETWORKS } from '../../config/networks';

class WalletManager {
  constructor() {
    this.adapters = new Map();
    this.activeConnections = new Map();
    this.listeners = new Map();
    
    // Initialize adapters
    this.initializeAdapters();
  }

  /**
   * Initialize all wallet adapters
   */
  initializeAdapters() {
    // EVM chains (MetaMask)
    const evmChains = ['ETH', 'BNB', 'AVAX', 'MATIC'];
    evmChains.forEach(chain => {
      this.adapters.set(chain, MetaMaskAdapter);
    });

    // Solana (Phantom)
    this.adapters.set('SOL', PhantomAdapter);

    // XDC Network
    this.adapters.set('XDC', XDCAdapter);

    // Bitcoin
    this.adapters.set('BTC', BitcoinAdapter);

    // XRP and Stellar (existing implementations)
    // Note: These will be integrated with existing XRP/XLM components
    this.adapters.set('XRP', null); // Will use existing XUMM integration
    this.adapters.set('XLM', null); // Will use existing Freighter integration
  }

  /**
   * Get available wallets for a specific network
   */
  getAvailableWallets(networkSymbol) {
    const network = SUPPORTED_NETWORKS.find(n => n.symbol === networkSymbol);
    if (!network) {
      throw new Error(`Network ${networkSymbol} not supported`);
    }

    const wallets = [];

    switch (network.category) {
      case 'EVM':
        if (MetaMaskAdapter.isInstalled()) {
          wallets.push({
            type: 'metamask',
            name: 'MetaMask',
            icon: '/images/wallets/metamask.png',
            installed: true,
            networks: ['ETH', 'BNB', 'AVAX', 'MATIC', 'XDC']
          });
        } else {
          wallets.push({
            type: 'metamask',
            name: 'MetaMask',
            icon: '/images/wallets/metamask.png',
            installed: false,
            installUrl: 'https://metamask.io/',
            networks: ['ETH', 'BNB', 'AVAX', 'MATIC', 'XDC']
          });
        }
        break;

      case 'Solana':
        if (PhantomAdapter.isInstalled()) {
          wallets.push({
            type: 'phantom',
            name: 'Phantom',
            icon: '/images/wallets/phantom.png',
            installed: true,
            networks: ['SOL']
          });
        } else {
          wallets.push({
            type: 'phantom',
            name: 'Phantom',
            icon: '/images/wallets/phantom.png',
            installed: false,
            installUrl: PhantomAdapter.getInstallationUrl(),
            networks: ['SOL']
          });
        }
        break;

      case 'UTXO':
        if (networkSymbol === 'BTC') {
          wallets.push(...BitcoinAdapter.getAvailableWallets());
        }
        break;

      case 'Account':
        if (networkSymbol === 'XRP') {
          wallets.push({
            type: 'xumm',
            name: 'XUMM',
            icon: '/images/wallets/xumm.png',
            installed: true, // Web-based
            networks: ['XRP']
          });
        } else if (networkSymbol === 'XLM') {
          wallets.push({
            type: 'freighter',
            name: 'Freighter',
            icon: '/images/wallets/freighter.png',
            installed: typeof window !== 'undefined' && typeof window.freighter !== 'undefined',
            installUrl: 'https://freighter.app/',
            networks: ['XLM']
          });
        }
        break;
    }

    // Add XDC-specific wallets
    if (networkSymbol === 'XDC') {
      wallets.push(...XDCAdapter.getAvailableWallets());
    }

    return wallets;
  }

  /**
   * Connect to a wallet for a specific network
   */
  async connect(networkSymbol, walletType = null) {
    try {
      const network = SUPPORTED_NETWORKS.find(n => n.symbol === networkSymbol);
      if (!network) {
        throw new Error(`Network ${networkSymbol} not supported`);
      }

      let adapter;
      let result;

      switch (network.category) {
        case 'EVM':
          if (networkSymbol === 'XDC') {
            adapter = XDCAdapter;
            result = await adapter.connect(walletType || 'xdcpay');
          } else {
            adapter = MetaMaskAdapter;
            result = await adapter.connect();
            // Switch to the correct network
            await adapter.switchNetwork(networkSymbol);
          }
          break;

        case 'Solana':
          adapter = PhantomAdapter;
          result = await adapter.connect();
          break;

        case 'UTXO':
          if (networkSymbol === 'BTC') {
            adapter = BitcoinAdapter;
            result = await adapter.connect(walletType || 'unisat');
          }
          break;

        case 'Account':
          if (networkSymbol === 'XRP') {
            // Use existing XUMM integration
            throw new Error('XRP integration should use existing XUMM component');
          } else if (networkSymbol === 'XLM') {
            // Use existing Freighter integration
            throw new Error('XLM integration should use existing Freighter component');
          }
          break;

        default:
          throw new Error(`Unsupported network category: ${network.category}`);
      }

      if (result) {
        this.activeConnections.set(networkSymbol, {
          adapter,
          connection: result,
          timestamp: Date.now()
        });

        this.emit('walletConnected', {
          network: networkSymbol,
          wallet: walletType || adapter.walletType || 'default',
          connection: result
        });
      }

      return result;
    } catch (error) {
      console.error(`Wallet connection failed for ${networkSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from a wallet
   */
  async disconnect(networkSymbol) {
    try {
      const connection = this.activeConnections.get(networkSymbol);
      if (!connection) {
        return;
      }

      await connection.adapter.disconnect();
      this.activeConnections.delete(networkSymbol);

      this.emit('walletDisconnected', { network: networkSymbol });
    } catch (error) {
      console.error(`Wallet disconnect failed for ${networkSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect all wallets
   */
  async disconnectAll() {
    const networks = Array.from(this.activeConnections.keys());
    
    for (const network of networks) {
      try {
        await this.disconnect(network);
      } catch (error) {
        console.error(`Failed to disconnect ${network}:`, error);
      }
    }
  }

  /**
   * Get balance for a connected wallet
   */
  async getBalance(networkSymbol, address = null) {
    try {
      const connection = this.activeConnections.get(networkSymbol);
      if (!connection) {
        throw new Error(`No active connection for ${networkSymbol}`);
      }

      return await connection.adapter.getBalance(address);
    } catch (error) {
      console.error(`Get balance failed for ${networkSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Send transaction
   */
  async sendTransaction(networkSymbol, params) {
    try {
      const connection = this.activeConnections.get(networkSymbol);
      if (!connection) {
        throw new Error(`No active connection for ${networkSymbol}`);
      }

      return await connection.adapter.sendTransaction(params);
    } catch (error) {
      console.error(`Send transaction failed for ${networkSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Sign message
   */
  async signMessage(networkSymbol, message) {
    try {
      const connection = this.activeConnections.get(networkSymbol);
      if (!connection) {
        throw new Error(`No active connection for ${networkSymbol}`);
      }

      return await connection.adapter.signMessage(message);
    } catch (error) {
      console.error(`Sign message failed for ${networkSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Switch network for EVM wallets
   */
  async switchNetwork(networkSymbol) {
    try {
      const network = SUPPORTED_NETWORKS.find(n => n.symbol === networkSymbol);
      if (!network) {
        throw new Error(`Network ${networkSymbol} not supported`);
      }

      if (network.category === 'EVM') {
        const connection = this.activeConnections.get('ETH') || 
                          this.activeConnections.get('BNB') || 
                          this.activeConnections.get('AVAX') || 
                          this.activeConnections.get('MATIC');

        if (connection) {
          await connection.adapter.switchNetwork(networkSymbol);
          
          // Update active connection
          this.activeConnections.delete(connection.network);
          this.activeConnections.set(networkSymbol, {
            ...connection,
            network: networkSymbol
          });
        }
      }

      this.emit('networkSwitched', { network: networkSymbol });
    } catch (error) {
      console.error(`Network switch failed for ${networkSymbol}:`, error);
      throw error;
    }
  }

  /**
   * Get connection status for all networks
   */
  getConnectionStatus() {
    const status = {};
    
    SUPPORTED_NETWORKS.forEach(network => {
      const connection = this.activeConnections.get(network.symbol);
      const adapter = this.adapters.get(network.symbol);
      
      status[network.symbol] = {
        isConnected: !!connection,
        connection: connection ? connection.connection : null,
        adapter: adapter ? adapter.getConnectionStatus() : null,
        availableWallets: this.getAvailableWallets(network.symbol)
      };
    });

    return status;
  }

  /**
   * Get active connections
   */
  getActiveConnections() {
    const connections = {};
    
    this.activeConnections.forEach((connection, network) => {
      connections[network] = {
        ...connection.connection,
        timestamp: connection.timestamp
      };
    });

    return connections;
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
   * Initialize wallet manager
   */
  async initialize() {
    try {
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Check for existing connections
      await this.checkExistingConnections();
      
      console.log('Wallet Manager initialized successfully');
    } catch (error) {
      console.error('Wallet Manager initialization failed:', error);
    }
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Listen to adapter events and forward them
    Object.values(this.adapters).forEach(adapter => {
      if (adapter) {
        adapter.on('connect', (data) => this.emit('walletConnected', data));
        adapter.on('disconnect', (data) => this.emit('walletDisconnected', data));
        adapter.on('accountChanged', (data) => this.emit('accountChanged', data));
        adapter.on('networkChanged', (data) => this.emit('networkChanged', data));
      }
    });
  }

  /**
   * Check for existing wallet connections
   */
  async checkExistingConnections() {
    // Check MetaMask
    if (MetaMaskAdapter.isInstalled()) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          // Auto-reconnect if previously connected
          console.log('Found existing MetaMask connection');
        }
      } catch (error) {
        console.log('No existing MetaMask connection');
      }
    }

    // Check Phantom
    if (PhantomAdapter.isInstalled()) {
      try {
        if (window.solana.isConnected) {
          console.log('Found existing Phantom connection');
        }
      } catch (error) {
        console.log('No existing Phantom connection');
      }
    }
  }
}

// Export singleton instance
export default new WalletManager();

