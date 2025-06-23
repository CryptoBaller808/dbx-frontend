/**
 * DBX Token Database
 * Comprehensive token lists with metadata for all supported networks
 * 
 * @version 4.0.0
 * @author DBX Development Team
 */

// Token metadata structure
export const TOKEN_METADATA_SCHEMA = {
  symbol: 'string',      // Token symbol (e.g., 'BTC', 'ETH')
  name: 'string',        // Full token name (e.g., 'Bitcoin', 'Ethereum')
  decimals: 'number',    // Token decimals (e.g., 18, 8)
  address: 'string',     // Contract address (null for native tokens)
  logoURI: 'string',     // Token icon URL
  coingeckoId: 'string', // CoinGecko API ID for price feeds
  isNative: 'boolean',   // Whether this is the native token of the network
  isStablecoin: 'boolean', // Whether this is a stablecoin
  category: 'string'     // Token category (native, stablecoin, defi, etc.)
};

// Bitcoin Network Tokens
export const BITCOIN_TOKENS = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    address: null, // Native token
    logoURI: '/images/tokens/btc.png',
    coingeckoId: 'bitcoin',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  }
};

// Ethereum Network Tokens
export const ETHEREUM_TOKENS = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: null, // Native token
    logoURI: '/images/tokens/eth.png',
    coingeckoId: 'ethereum',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    logoURI: '/images/tokens/usdt.png',
    coingeckoId: 'tether',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0xA0b86a33E6441c8C0c6b8C7C4b5C0c8C0c6b8C7C',
    logoURI: '/images/tokens/usdc.png',
    coingeckoId: 'usd-coin',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    logoURI: '/images/tokens/wbtc.png',
    coingeckoId: 'wrapped-bitcoin',
    isNative: false,
    isStablecoin: false,
    category: 'wrapped'
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    logoURI: '/images/tokens/dai.png',
    coingeckoId: 'dai',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  }
};

// BNB Smart Chain Tokens
export const BNB_TOKENS = {
  BNB: {
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    address: null, // Native token
    logoURI: '/images/tokens/bnb.png',
    coingeckoId: 'binancecoin',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 18,
    address: '0x55d398326f99059fF775485246999027B3197955',
    logoURI: '/images/tokens/usdt.png',
    coingeckoId: 'tether',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    logoURI: '/images/tokens/usdc.png',
    coingeckoId: 'usd-coin',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  },
  BTCB: {
    symbol: 'BTCB',
    name: 'Bitcoin BEP2',
    decimals: 18,
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    logoURI: '/images/tokens/btcb.png',
    coingeckoId: 'bitcoin-bep2',
    isNative: false,
    isStablecoin: false,
    category: 'wrapped'
  }
};

// Avalanche Network Tokens
export const AVALANCHE_TOKENS = {
  AVAX: {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    address: null, // Native token
    logoURI: '/images/tokens/avax.png',
    coingeckoId: 'avalanche-2',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  },
  'USDT.e': {
    symbol: 'USDT.e',
    name: 'Tether USD (Ethereum)',
    decimals: 6,
    address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    logoURI: '/images/tokens/usdt.png',
    coingeckoId: 'tether',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  },
  'USDC.e': {
    symbol: 'USDC.e',
    name: 'USD Coin (Ethereum)',
    decimals: 6,
    address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    logoURI: '/images/tokens/usdc.png',
    coingeckoId: 'usd-coin',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  }
};

// Polygon Network Tokens
export const POLYGON_TOKENS = {
  MATIC: {
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    address: null, // Native token
    logoURI: '/images/tokens/matic.png',
    coingeckoId: 'matic-network',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    logoURI: '/images/tokens/usdt.png',
    coingeckoId: 'tether',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    logoURI: '/images/tokens/usdc.png',
    coingeckoId: 'usd-coin',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  }
};

// Solana Network Tokens
export const SOLANA_TOKENS = {
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    address: null, // Native token
    logoURI: '/images/tokens/sol.png',
    coingeckoId: 'solana',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    logoURI: '/images/tokens/usdt.png',
    coingeckoId: 'tether',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    logoURI: '/images/tokens/usdc.png',
    coingeckoId: 'usd-coin',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  }
};

// XDC Network Tokens
export const XDC_TOKENS = {
  XDC: {
    symbol: 'XDC',
    name: 'XDC Network',
    decimals: 18,
    address: null, // Native token
    logoURI: '/images/tokens/xdc.png',
    coingeckoId: 'xdce-crowd-sale',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: 'xdc0D4B5cc70b1c1B24e435Fc4d7971138B6b3a4b4b',
    logoURI: '/images/tokens/usdt.png',
    coingeckoId: 'tether',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  }
};

// XRP Ledger Tokens
export const XRP_TOKENS = {
  XRP: {
    symbol: 'XRP',
    name: 'XRP',
    decimals: 6,
    address: null, // Native token
    logoURI: '/images/tokens/xrp.png',
    coingeckoId: 'ripple',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  },
  USD: {
    symbol: 'USD',
    name: 'US Dollar',
    decimals: 6,
    address: 'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq', // Bitstamp USD gateway
    logoURI: '/images/tokens/usd.png',
    coingeckoId: null,
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  }
};

// Stellar Network Tokens
export const STELLAR_TOKENS = {
  XLM: {
    symbol: 'XLM',
    name: 'Stellar Lumens',
    decimals: 7,
    address: null, // Native token
    logoURI: '/images/tokens/xlm.png',
    coingeckoId: 'stellar',
    isNative: true,
    isStablecoin: false,
    category: 'native'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 7,
    address: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    logoURI: '/images/tokens/usdc.png',
    coingeckoId: 'usd-coin',
    isNative: false,
    isStablecoin: true,
    category: 'stablecoin'
  }
};

// Master token database
export const TOKEN_DATABASE = {
  BTC: BITCOIN_TOKENS,
  ETH: ETHEREUM_TOKENS,
  BNB: BNB_TOKENS,
  AVAX: AVALANCHE_TOKENS,
  MATIC: POLYGON_TOKENS,
  SOL: SOLANA_TOKENS,
  XDC: XDC_TOKENS,
  XRP: XRP_TOKENS,
  XLM: STELLAR_TOKENS
};

// Utility functions
export const getTokensForNetwork = (networkSymbol) => {
  return TOKEN_DATABASE[networkSymbol?.toUpperCase()] || {};
};

export const getTokenMetadata = (networkSymbol, tokenSymbol) => {
  const networkTokens = getTokensForNetwork(networkSymbol);
  return networkTokens[tokenSymbol] || null;
};

export const getAllNativeTokens = () => {
  const nativeTokens = {};
  Object.entries(TOKEN_DATABASE).forEach(([network, tokens]) => {
    Object.entries(tokens).forEach(([symbol, token]) => {
      if (token.isNative) {
        nativeTokens[symbol] = { ...token, network };
      }
    });
  });
  return nativeTokens;
};

export const getAllStablecoins = () => {
  const stablecoins = {};
  Object.entries(TOKEN_DATABASE).forEach(([network, tokens]) => {
    Object.entries(tokens).forEach(([symbol, token]) => {
      if (token.isStablecoin) {
        const key = `${symbol}_${network}`;
        stablecoins[key] = { ...token, network };
      }
    });
  });
  return stablecoins;
};

export const searchTokens = (query, networkSymbol = null) => {
  const results = [];
  const searchQuery = query.toLowerCase();
  
  const networksToSearch = networkSymbol 
    ? [networkSymbol.toUpperCase()] 
    : Object.keys(TOKEN_DATABASE);
  
  networksToSearch.forEach(network => {
    const tokens = TOKEN_DATABASE[network] || {};
    Object.entries(tokens).forEach(([symbol, token]) => {
      if (
        symbol.toLowerCase().includes(searchQuery) ||
        token.name.toLowerCase().includes(searchQuery)
      ) {
        results.push({
          ...token,
          network,
          searchScore: symbol.toLowerCase() === searchQuery ? 100 : 50
        });
      }
    });
  });
  
  return results.sort((a, b) => b.searchScore - a.searchScore);
};

export default TOKEN_DATABASE;

