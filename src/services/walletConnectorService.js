/**
 * DBX Wallet Connector Service
 * Handles wallet connections and multi-network address validation
 * 
 * @version 5.0.0
 * @author DBX Development Team
 */

class WalletConnectorService {
  constructor() {
    this.connectedWallets = new Map();
    this.supportedNetworks = {
      BTC: {
        name: 'Bitcoin',
        addressFormats: ['legacy', 'segwit', 'bech32'],
        addressRegex: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
        walletTypes: ['electrum', 'ledger', 'trezor']
      },
      ETH: {
        name: 'Ethereum',
        addressFormats: ['hex'],
        addressRegex: /^0x[a-fA-F0-9]{40}$/,
        walletTypes: ['metamask', 'walletconnect', 'coinbase']
      },
      BNB: {
        name: 'BNB Chain',
        addressFormats: ['hex'],
        addressRegex: /^0x[a-fA-F0-9]{40}$/,
        walletTypes: ['metamask', 'trustwallet', 'binance']
      },
      AVAX: {
        name: 'Avalanche',
        addressFormats: ['hex', 'bech32'],
        addressRegex: /^0x[a-fA-F0-9]{40}$|^avax1[a-z0-9]{38}$/,
        walletTypes: ['metamask', 'avalanche']
      },
      MATIC: {
        name: 'Polygon',
        addressFormats: ['hex'],
        addressRegex: /^0x[a-fA-F0-9]{40}$/,
        walletTypes: ['metamask', 'walletconnect']
      },
      SOL: {
        name: 'Solana',
        addressFormats: ['base58'],
        addressRegex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
        walletTypes: ['phantom', 'solflare', 'sollet']
      },
      XDC: {
        name: 'XDC Network',
        addressFormats: ['xdc'],
        addressRegex: /^xdc[a-fA-F0-9]{40}$/,
        walletTypes: ['xdcpay', 'metamask']
      },
      XRP: {
        name: 'XRP Ledger',
        addressFormats: ['classic', 'x-address'],
        addressRegex: /^r[1-9A-HJ-NP-Za-km-z]{25,34}$|^X[1-9A-HJ-NP-Za-km-z]{46,47}$/,
        walletTypes: ['xumm', 'ledger', 'toast']
      },
      XLM: {
        name: 'Stellar',
        addressFormats: ['stellar'],
        addressRegex: /^G[A-Z2-7]{55}$/,
        walletTypes: ['albedo', 'freighter', 'ledger']
      }
    };
    
    this.connectionStatus = {
      isConnecting: false,
      isConnected: false,
      error: null,
      lastConnected: null
    };
    
    this.eventListeners = new Map();
  }

  /**
   * Connect to a wallet for a specific network
   */
  async connectWallet(network, walletType, options = {}) {
    try {
      this.connectionStatus.isConnecting = true;
      this.connectionStatus.error = null;
      this.emit('connecting', { network, walletType });

      const networkConfig = this.supportedNetworks[network];
      if (!networkConfig) {
        throw new Error(`Unsupported network: ${network}`);
      }

      if (!networkConfig.walletTypes.includes(walletType)) {
        throw new Error(`Wallet ${walletType} not supported for ${network}`);
      }

      let walletConnection;

      switch (walletType) {
        case 'metamask':
          walletConnection = await this.connectMetaMask(network, options);
          break;
        case 'walletconnect':
          walletConnection = await this.connectWalletConnect(network, options);
          break;
        case 'phantom':
          walletConnection = await this.connectPhantom(options);
          break;
        case 'xumm':
          walletConnection = await this.connectXumm(options);
          break;
        default:
          // Mock connection for other wallet types
          walletConnection = await this.mockWalletConnection(network, walletType, options);
      }

      this.connectedWallets.set(network, {
        ...walletConnection,
        network,
        walletType,
        connectedAt: new Date().toISOString()
      });

      this.connectionStatus.isConnected = true;
      this.connectionStatus.lastConnected = new Date().toISOString();
      this.emit('connected', { network, walletType, address: walletConnection.address });

      return walletConnection;
    } catch (error) {
      this.connectionStatus.error = error.message;
      this.emit('error', { network, walletType, error: error.message });
      throw error;
    } finally {
      this.connectionStatus.isConnecting = false;
    }
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectMetaMask(network, options = {}) {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected. Please install MetaMask.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      const address = accounts[0];
      
      // Validate address format
      if (!this.validateAddress(address, network)) {
        throw new Error(`Invalid address format for ${network}`);
      }

      // Get network information
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      return {
        address,
        chainId,
        balance: parseInt(balance, 16) / Math.pow(10, 18), // Convert from wei
        provider: window.ethereum,
        isConnected: true
      };
    } catch (error) {
      throw new Error(`MetaMask connection failed: ${error.message}`);
    }
  }

  /**
   * Connect to WalletConnect
   */
  async connectWalletConnect(network, options = {}) {
    // Mock WalletConnect implementation
    // In real implementation, this would use @walletconnect/client
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAddress = this.generateMockAddress(network);
        resolve({
          address: mockAddress,
          chainId: this.getNetworkChainId(network),
          balance: Math.random() * 10,
          provider: 'walletconnect',
          isConnected: true
        });
      }, 2000);
    });
  }

  /**
   * Connect to Phantom wallet (Solana)
   */
  async connectPhantom(options = {}) {
    if (typeof window === 'undefined' || !window.solana?.isPhantom) {
      throw new Error('Phantom wallet not detected. Please install Phantom.');
    }

    try {
      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      
      // Get balance
      const connection = new window.solanaWeb3.Connection(
        window.solanaWeb3.clusterApiUrl('mainnet-beta')
      );
      const balance = await connection.getBalance(response.publicKey);

      return {
        address,
        balance: balance / window.solanaWeb3.LAMPORTS_PER_SOL,
        provider: window.solana,
        isConnected: true
      };
    } catch (error) {
      throw new Error(`Phantom connection failed: ${error.message}`);
    }
  }

  /**
   * Connect to XUMM wallet (XRP)
   */
  async connectXumm(options = {}) {
    // Mock XUMM implementation
    // In real implementation, this would use xumm-sdk
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          address: this.generateMockAddress('XRP'),
          balance: Math.random() * 1000,
          provider: 'xumm',
          isConnected: true
        });
      }, 3000);
    });
  }

  /**
   * Mock wallet connection for testing
   */
  async mockWalletConnection(network, walletType, options = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          address: this.generateMockAddress(network),
          balance: Math.random() * 100,
          provider: walletType,
          isConnected: true
        });
      }, 1500);
    });
  }

  /**
   * Disconnect wallet for a specific network
   */
  async disconnectWallet(network) {
    const wallet = this.connectedWallets.get(network);
    if (!wallet) {
      throw new Error(`No wallet connected for ${network}`);
    }

    try {
      // Perform wallet-specific disconnection
      if (wallet.provider && typeof wallet.provider.disconnect === 'function') {
        await wallet.provider.disconnect();
      }

      this.connectedWallets.delete(network);
      
      // Update connection status
      if (this.connectedWallets.size === 0) {
        this.connectionStatus.isConnected = false;
      }

      this.emit('disconnected', { network, walletType: wallet.walletType });
      return true;
    } catch (error) {
      this.emit('error', { network, error: error.message });
      throw error;
    }
  }

  /**
   * Disconnect all wallets
   */
  async disconnectAllWallets() {
    const networks = Array.from(this.connectedWallets.keys());
    const disconnectPromises = networks.map(network => this.disconnectWallet(network));
    
    try {
      await Promise.all(disconnectPromises);
      this.connectionStatus.isConnected = false;
      this.emit('allDisconnected');
      return true;
    } catch (error) {
      throw new Error(`Failed to disconnect all wallets: ${error.message}`);
    }
  }

  /**
   * Get connected wallet for a network
   */
  getConnectedWallet(network) {
    return this.connectedWallets.get(network) || null;
  }

  /**
   * Get all connected wallets
   */
  getAllConnectedWallets() {
    return Object.fromEntries(this.connectedWallets);
  }

  /**
   * Check if wallet is connected for a network
   */
  isWalletConnected(network) {
    return this.connectedWallets.has(network);
  }

  /**
   * Validate address format for a specific network
   */
  validateAddress(address, network) {
    const networkConfig = this.supportedNetworks[network];
    if (!networkConfig) {
      return false;
    }

    return networkConfig.addressRegex.test(address);
  }

  /**
   * Format address for display
   */
  formatAddress(address, network, options = {}) {
    if (!address) return '';
    
    const { truncate = true, length = 6 } = options;
    
    if (!truncate) return address;
    
    if (address.length <= length * 2) return address;
    
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }

  /**
   * Get wallet balance for a network
   */
  async getWalletBalance(network, refresh = false) {
    const wallet = this.connectedWallets.get(network);
    if (!wallet) {
      throw new Error(`No wallet connected for ${network}`);
    }

    if (!refresh && wallet.balance !== undefined) {
      return wallet.balance;
    }

    try {
      let balance;
      
      switch (network) {
        case 'ETH':
        case 'BNB':
        case 'MATIC':
          if (wallet.provider && wallet.provider.request) {
            const balanceHex = await wallet.provider.request({
              method: 'eth_getBalance',
              params: [wallet.address, 'latest']
            });
            balance = parseInt(balanceHex, 16) / Math.pow(10, 18);
          }
          break;
        case 'SOL':
          if (wallet.provider && window.solanaWeb3) {
            const connection = new window.solanaWeb3.Connection(
              window.solanaWeb3.clusterApiUrl('mainnet-beta')
            );
            const publicKey = new window.solanaWeb3.PublicKey(wallet.address);
            const balanceLamports = await connection.getBalance(publicKey);
            balance = balanceLamports / window.solanaWeb3.LAMPORTS_PER_SOL;
          }
          break;
        default:
          // Mock balance for other networks
          balance = Math.random() * 100;
      }

      // Update cached balance
      wallet.balance = balance;
      this.connectedWallets.set(network, wallet);

      return balance;
    } catch (error) {
      console.error(`Failed to get balance for ${network}:`, error);
      return wallet.balance || 0;
    }
  }

  /**
   * Generate mock address for testing
   */
  generateMockAddress(network) {
    const mockAddresses = {
      BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      ETH: '0x742d35Cc6634C0532925a3b8D4C9db96590c4C5d',
      BNB: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
      AVAX: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      MATIC: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
      SOL: '11111111111111111111111111111112',
      XDC: 'xdc742d35Cc6634C0532925a3b8D4C9db96590c4C5d',
      XRP: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      XLM: 'GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A'
    };

    return mockAddresses[network] || mockAddresses.ETH;
  }

  /**
   * Get network chain ID
   */
  getNetworkChainId(network) {
    const chainIds = {
      ETH: '0x1',
      BNB: '0x38',
      AVAX: '0xa86a',
      MATIC: '0x89',
      XDC: '0x32'
    };

    return chainIds[network] || '0x1';
  }

  /**
   * Event listener management
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.eventListeners.has(event)) return;
    
    const listeners = this.eventListeners.get(event);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.eventListeners.has(event)) return;
    
    this.eventListeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      ...this.connectionStatus,
      connectedNetworks: Array.from(this.connectedWallets.keys()),
      totalConnected: this.connectedWallets.size
    };
  }

  /**
   * Switch network for MetaMask-compatible wallets
   */
  async switchNetwork(network, walletType = 'metamask') {
    if (walletType !== 'metamask' || !window.ethereum) {
      throw new Error('Network switching only supported for MetaMask');
    }

    const chainId = this.getNetworkChainId(network);
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });

      this.emit('networkSwitched', { network, chainId });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        throw new Error(`${network} network not added to MetaMask. Please add it manually.`);
      }
      throw error;
    }
  }

  /**
   * Get supported wallet types for a network
   */
  getSupportedWallets(network) {
    const networkConfig = this.supportedNetworks[network];
    return networkConfig ? networkConfig.walletTypes : [];
  }

  /**
   * Check if wallet type is available in browser
   */
  isWalletAvailable(walletType) {
    if (typeof window === 'undefined') return false;

    const walletChecks = {
      metamask: () => window.ethereum?.isMetaMask,
      phantom: () => window.solana?.isPhantom,
      coinbase: () => window.ethereum?.isCoinbaseWallet,
      trustwallet: () => window.ethereum?.isTrust
    };

    const check = walletChecks[walletType];
    return check ? check() : false;
  }

  /**
   * Get wallet installation URL
   */
  getWalletInstallUrl(walletType) {
    const installUrls = {
      metamask: 'https://metamask.io/download/',
      phantom: 'https://phantom.app/',
      coinbase: 'https://www.coinbase.com/wallet',
      trustwallet: 'https://trustwallet.com/',
      xumm: 'https://xumm.app/',
      albedo: 'https://albedo.link/',
      freighter: 'https://www.freighter.app/'
    };

    return installUrls[walletType] || '#';
  }
}

// Create singleton instance
const walletConnectorService = new WalletConnectorService();

export default walletConnectorService;

