/**
 * DBX Multi-Chain Network Configuration
 * 
 * Comprehensive configuration for all supported blockchain networks
 * Designed for scalability and easy addition of new networks
 * 
 * @version 1.0.0
 * @author DBX Development Team
 */

// Network Types
export const NETWORK_TYPES = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  DEVNET: 'devnet'
};

// Network Categories
export const NETWORK_CATEGORIES = {
  EVM: 'evm',           // Ethereum Virtual Machine compatible
  UTXO: 'utxo',         // Bitcoin-like UTXO model
  ACCOUNT: 'account',   // Account-based model (XRP, Stellar)
  SOLANA: 'solana',     // Solana-specific
  OTHER: 'other'        // Other consensus mechanisms
};

// Wallet Types
export const WALLET_TYPES = {
  METAMASK: 'metamask',
  WALLETCONNECT: 'walletconnect',
  PHANTOM: 'phantom',
  SOLFLARE: 'solflare',
  XUMM: 'xumm',
  FREIGHTER: 'freighter',
  LEDGER: 'ledger',
  TREZOR: 'trezor',
  COINBASE: 'coinbase',
  TRUST: 'trust',
  EXODUS: 'exodus',
  ATOMIC: 'atomic'
};

/**
 * Master Network Configuration
 * Each network includes comprehensive configuration for UI, API, and wallet integration
 */
export const SUPPORTED_NETWORKS = {
  // Bitcoin Network
  BTC: {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    displayName: 'Bitcoin',
    category: NETWORK_CATEGORIES.UTXO,
    nativeCurrency: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 8
    },
    ui: {
      color: '#F7931A',
      gradient: 'linear-gradient(135deg, #F7931A 0%, #FF8C00 100%)',
      icon: '/images/networks/btc.png',
      logo: '/images/networks/btc-logo.svg',
      order: 1
    },
    features: {
      trading: true,
      swap: true,
      nft: false,
      staking: false,
      lending: false,
      governance: false
    },
    wallets: [WALLET_TYPES.LEDGER, WALLET_TYPES.TREZOR, WALLET_TYPES.EXODUS],
    explorer: {
      mainnet: 'https://blockstream.info',
      testnet: 'https://blockstream.info/testnet'
    },
    rpc: {
      mainnet: process.env.REACT_APP_BTC_RPC_URL || 'https://blockstream.info/api',
      testnet: process.env.REACT_APP_BTC_TESTNET_RPC_URL || 'https://blockstream.info/testnet/api'
    },
    chainId: {
      mainnet: 'bitcoin-mainnet',
      testnet: 'bitcoin-testnet'
    }
  },

  // Ethereum Network
  ETH: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    displayName: 'Ethereum',
    category: NETWORK_CATEGORIES.EVM,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    ui: {
      color: '#627EEA',
      gradient: 'linear-gradient(135deg, #627EEA 0%, #8A92B2 100%)',
      icon: '/images/networks/eth.png',
      logo: '/images/networks/eth-logo.svg',
      order: 2
    },
    features: {
      trading: true,
      swap: true,
      nft: true,
      staking: true,
      lending: true,
      governance: true
    },
    wallets: [WALLET_TYPES.METAMASK, WALLET_TYPES.WALLETCONNECT, WALLET_TYPES.COINBASE, WALLET_TYPES.LEDGER],
    explorer: {
      mainnet: 'https://etherscan.io',
      testnet: 'https://sepolia.etherscan.io'
    },
    rpc: {
      mainnet: process.env.REACT_APP_ETH_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
      testnet: process.env.REACT_APP_ETH_TESTNET_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    },
    chainId: {
      mainnet: '0x1',
      testnet: '0xaa36a7'
    }
  },

  // BNB Smart Chain
  BNB: {
    id: 'bsc',
    symbol: 'BNB',
    name: 'BNB Smart Chain',
    displayName: 'BNB Chain',
    category: NETWORK_CATEGORIES.EVM,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    ui: {
      color: '#F3BA2F',
      gradient: 'linear-gradient(135deg, #F3BA2F 0%, #FCD535 100%)',
      icon: '/images/networks/bnb.png',
      logo: '/images/networks/bnb-logo.svg',
      order: 3
    },
    features: {
      trading: true,
      swap: true,
      nft: true,
      staking: true,
      lending: true,
      governance: true
    },
    wallets: [WALLET_TYPES.METAMASK, WALLET_TYPES.WALLETCONNECT, WALLET_TYPES.TRUST, WALLET_TYPES.LEDGER],
    explorer: {
      mainnet: 'https://bscscan.com',
      testnet: 'https://testnet.bscscan.com'
    },
    rpc: {
      mainnet: process.env.REACT_APP_BNB_RPC_URL || 'https://bsc-dataseed1.binance.org',
      testnet: process.env.REACT_APP_BNB_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545'
    },
    chainId: {
      mainnet: '0x38',
      testnet: '0x61'
    }
  },

  // Avalanche Network
  AVAX: {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    displayName: 'Avalanche',
    category: NETWORK_CATEGORIES.EVM,
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    ui: {
      color: '#E84142',
      gradient: 'linear-gradient(135deg, #E84142 0%, #FF6B6B 100%)',
      icon: '/images/networks/avax.png',
      logo: '/images/networks/avax-logo.svg',
      order: 4
    },
    features: {
      trading: true,
      swap: true,
      nft: true,
      staking: true,
      lending: true,
      governance: true
    },
    wallets: [WALLET_TYPES.METAMASK, WALLET_TYPES.WALLETCONNECT, WALLET_TYPES.LEDGER],
    explorer: {
      mainnet: 'https://snowtrace.io',
      testnet: 'https://testnet.snowtrace.io'
    },
    rpc: {
      mainnet: process.env.REACT_APP_AVAX_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
      testnet: process.env.REACT_APP_AVAX_TESTNET_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
    },
    chainId: {
      mainnet: '0xa86a',
      testnet: '0xa869'
    }
  },

  // Polygon Network
  MATIC: {
    id: 'polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    displayName: 'Polygon',
    category: NETWORK_CATEGORIES.EVM,
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    ui: {
      color: '#8247E5',
      gradient: 'linear-gradient(135deg, #8247E5 0%, #A855F7 100%)',
      icon: '/images/networks/matic.png',
      logo: '/images/networks/matic-logo.svg',
      order: 5
    },
    features: {
      trading: true,
      swap: true,
      nft: true,
      staking: true,
      lending: true,
      governance: true
    },
    wallets: [WALLET_TYPES.METAMASK, WALLET_TYPES.WALLETCONNECT, WALLET_TYPES.LEDGER],
    explorer: {
      mainnet: 'https://polygonscan.com',
      testnet: 'https://mumbai.polygonscan.com'
    },
    rpc: {
      mainnet: process.env.REACT_APP_MATIC_RPC_URL || 'https://polygon-rpc.com',
      testnet: process.env.REACT_APP_MATIC_TESTNET_RPC_URL || 'https://rpc-mumbai.maticvigil.com'
    },
    chainId: {
      mainnet: '0x89',
      testnet: '0x13881'
    }
  },

  // Solana Network
  SOL: {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    displayName: 'Solana',
    category: NETWORK_CATEGORIES.SOLANA,
    nativeCurrency: {
      name: 'Solana',
      symbol: 'SOL',
      decimals: 9
    },
    ui: {
      color: '#9945FF',
      gradient: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
      icon: '/images/networks/sol.png',
      logo: '/images/networks/sol-logo.svg',
      order: 6
    },
    features: {
      trading: true,
      swap: true,
      nft: true,
      staking: true,
      lending: true,
      governance: true
    },
    wallets: [WALLET_TYPES.PHANTOM, WALLET_TYPES.SOLFLARE, WALLET_TYPES.LEDGER],
    explorer: {
      mainnet: 'https://explorer.solana.com',
      testnet: 'https://explorer.solana.com?cluster=testnet',
      devnet: 'https://explorer.solana.com?cluster=devnet'
    },
    rpc: {
      mainnet: process.env.REACT_APP_SOL_RPC_URL || 'https://api.mainnet-beta.solana.com',
      testnet: process.env.REACT_APP_SOL_TESTNET_RPC_URL || 'https://api.testnet.solana.com',
      devnet: process.env.REACT_APP_SOL_DEVNET_RPC_URL || 'https://api.devnet.solana.com'
    },
    chainId: {
      mainnet: 'solana-mainnet',
      testnet: 'solana-testnet',
      devnet: 'solana-devnet'
    }
  },

  // XDC Network
  XDC: {
    id: 'xdc',
    symbol: 'XDC',
    name: 'XDC Network',
    displayName: 'XDC Network',
    category: NETWORK_CATEGORIES.EVM,
    nativeCurrency: {
      name: 'XDC',
      symbol: 'XDC',
      decimals: 18
    },
    ui: {
      color: '#F7931A',
      gradient: 'linear-gradient(135deg, #F7931A 0%, #FFB347 100%)',
      icon: '/images/networks/xdc.png',
      logo: '/images/networks/xdc-logo.svg',
      order: 7
    },
    features: {
      trading: true,
      swap: true,
      nft: true,
      staking: true,
      lending: true,
      governance: true
    },
    wallets: [WALLET_TYPES.METAMASK, WALLET_TYPES.WALLETCONNECT, WALLET_TYPES.LEDGER],
    explorer: {
      mainnet: 'https://explorer.xinfin.network',
      testnet: 'https://explorer.apothem.network'
    },
    rpc: {
      mainnet: process.env.REACT_APP_XDC_RPC_URL || 'https://rpc.xinfin.network',
      testnet: process.env.REACT_APP_XDC_TESTNET_RPC_URL || 'https://rpc.apothem.network'
    },
    chainId: {
      mainnet: '0x32',
      testnet: '0x33'
    }
  },

  // XRP Ledger (Existing)
  XRP: {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP Ledger',
    displayName: 'XRP Ledger',
    category: NETWORK_CATEGORIES.ACCOUNT,
    nativeCurrency: {
      name: 'XRP',
      symbol: 'XRP',
      decimals: 6
    },
    ui: {
      color: '#23292F',
      gradient: 'linear-gradient(135deg, #23292F 0%, #4A5568 100%)',
      icon: '/images/networks/xrp.png',
      logo: '/images/networks/xrp-logo.svg',
      order: 8
    },
    features: {
      trading: true,
      swap: true,
      nft: true,
      staking: false,
      lending: true,
      governance: false
    },
    wallets: [WALLET_TYPES.XUMM, WALLET_TYPES.LEDGER],
    explorer: {
      mainnet: 'https://livenet.xrpl.org',
      testnet: 'https://testnet.xrpl.org'
    },
    rpc: {
      mainnet: process.env.REACT_APP_XRP_RPC_URL || 'wss://xrplcluster.com',
      testnet: process.env.REACT_APP_XRP_TESTNET_RPC_URL || 'wss://s.altnet.rippletest.net:51233'
    },
    chainId: {
      mainnet: 'xrp-mainnet',
      testnet: 'xrp-testnet'
    }
  },

  // Stellar Network (Existing)
  XLM: {
    id: 'stellar',
    symbol: 'XLM',
    name: 'Stellar',
    displayName: 'Stellar',
    category: NETWORK_CATEGORIES.ACCOUNT,
    nativeCurrency: {
      name: 'Stellar Lumens',
      symbol: 'XLM',
      decimals: 7
    },
    ui: {
      color: '#7B68EE',
      gradient: 'linear-gradient(135deg, #7B68EE 0%, #9370DB 100%)',
      icon: '/images/networks/xlm.png',
      logo: '/images/networks/xlm-logo.svg',
      order: 9
    },
    features: {
      trading: true,
      swap: true,
      nft: false,
      staking: false,
      lending: true,
      governance: false
    },
    wallets: [WALLET_TYPES.FREIGHTER, WALLET_TYPES.LEDGER],
    explorer: {
      mainnet: 'https://stellar.expert/explorer/public',
      testnet: 'https://stellar.expert/explorer/testnet'
    },
    rpc: {
      mainnet: process.env.REACT_APP_XLM_RPC_URL || 'https://horizon.stellar.org',
      testnet: process.env.REACT_APP_XLM_TESTNET_RPC_URL || 'https://horizon-testnet.stellar.org'
    },
    chainId: {
      mainnet: 'stellar-mainnet',
      testnet: 'stellar-testnet'
    }
  }
};

/**
 * Network Utility Functions
 */

// Get network by symbol
export const getNetworkBySymbol = (symbol) => {
  return SUPPORTED_NETWORKS[symbol?.toUpperCase()];
};

// Get network by ID
export const getNetworkById = (id) => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.id === id);
};

// Get networks by category
export const getNetworksByCategory = (category) => {
  return Object.values(SUPPORTED_NETWORKS).filter(network => network.category === category);
};

// Get EVM compatible networks
export const getEVMNetworks = () => {
  return getNetworksByCategory(NETWORK_CATEGORIES.EVM);
};

// Get networks with specific feature
export const getNetworksWithFeature = (feature) => {
  return Object.values(SUPPORTED_NETWORKS).filter(network => network.features[feature]);
};

// Get networks sorted by UI order
export const getNetworksSorted = () => {
  return Object.entries(SUPPORTED_NETWORKS)
    .sort(([, a], [, b]) => a.ui.order - b.ui.order)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

// Get network RPC URL based on environment
export const getNetworkRPC = (networkSymbol, networkType = NETWORK_TYPES.MAINNET) => {
  const network = getNetworkBySymbol(networkSymbol);
  return network?.rpc[networkType];
};

// Get network explorer URL
export const getNetworkExplorer = (networkSymbol, networkType = NETWORK_TYPES.MAINNET) => {
  const network = getNetworkBySymbol(networkSymbol);
  return network?.explorer[networkType];
};

// Get supported wallets for network
export const getSupportedWallets = (networkSymbol) => {
  const network = getNetworkBySymbol(networkSymbol);
  return network?.wallets || [];
};

// Check if network supports feature
export const networkSupportsFeature = (networkSymbol, feature) => {
  const network = getNetworkBySymbol(networkSymbol);
  return network?.features[feature] || false;
};

// Get network chain ID
export const getNetworkChainId = (networkSymbol, networkType = NETWORK_TYPES.MAINNET) => {
  const network = getNetworkBySymbol(networkSymbol);
  return network?.chainId[networkType];
};

/**
 * Default Network Configuration
 */
export const DEFAULT_NETWORK = 'XRP';
export const DEFAULT_NETWORK_TYPE = NETWORK_TYPES.MAINNET;

/**
 * Network Environment Configuration
 */
export const getNetworkEnvironment = () => {
  return process.env.REACT_APP_NETWORK_ENVIRONMENT || DEFAULT_NETWORK_TYPE;
};

/**
 * Future Network Placeholders (for easy expansion)
 */
export const FUTURE_NETWORKS = {
  // Algorand
  ALGO: {
    id: 'algorand',
    symbol: 'ALGO',
    name: 'Algorand',
    status: 'planned'
  },
  // TON
  TON: {
    id: 'ton',
    symbol: 'TON',
    name: 'The Open Network',
    status: 'planned'
  },
  // Cardano
  ADA: {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    status: 'planned'
  }
};

export default SUPPORTED_NETWORKS;

