/**
 * DBX Cross-Chain Asset Mapping System
 * Handles unified asset representation across multiple blockchain networks
 * 
 * @version 4.0.0
 * @author DBX Development Team
 */

// Cross-chain asset groups - tokens that represent the same underlying asset
export const CROSS_CHAIN_ASSET_GROUPS = {
  // Bitcoin representations across networks
  BITCOIN: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    category: 'native',
    coingeckoId: 'bitcoin',
    logoURI: '/images/tokens/btc.png',
    networks: {
      BTC: { symbol: 'BTC', address: null, decimals: 8, isNative: true },
      ETH: { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, isNative: false },
      BNB: { symbol: 'BTCB', address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', decimals: 18, isNative: false }
    }
  },

  // Ethereum representations
  ETHEREUM: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    category: 'native',
    coingeckoId: 'ethereum',
    logoURI: '/images/tokens/eth.png',
    networks: {
      ETH: { symbol: 'ETH', address: null, decimals: 18, isNative: true },
      BNB: { symbol: 'ETH', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18, isNative: false },
      MATIC: { symbol: 'ETH', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18, isNative: false }
    }
  },

  // USDT across all networks
  USDT: {
    id: 'tether',
    name: 'Tether USD',
    symbol: 'USDT',
    category: 'stablecoin',
    coingeckoId: 'tether',
    logoURI: '/images/tokens/usdt.png',
    networks: {
      ETH: { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, isNative: false },
      BNB: { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, isNative: false },
      MATIC: { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, isNative: false },
      AVAX: { symbol: 'USDT.e', address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118', decimals: 6, isNative: false },
      SOL: { symbol: 'USDT', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6, isNative: false },
      XDC: { symbol: 'USDT', address: 'xdc0D4B5cc70b1c1B24e435Fc4d7971138B6b3a4b4b', decimals: 6, isNative: false }
    }
  },

  // USDC across networks
  USDC: {
    id: 'usd-coin',
    name: 'USD Coin',
    symbol: 'USDC',
    category: 'stablecoin',
    coingeckoId: 'usd-coin',
    logoURI: '/images/tokens/usdc.png',
    networks: {
      ETH: { symbol: 'USDC', address: '0xA0b86a33E6441c8C0c6b8C7C4b5C0c8C0c6b8C7C', decimals: 6, isNative: false },
      BNB: { symbol: 'USDC', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, isNative: false },
      MATIC: { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, isNative: false },
      AVAX: { symbol: 'USDC.e', address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', decimals: 6, isNative: false },
      SOL: { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6, isNative: false },
      XLM: { symbol: 'USDC', address: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', decimals: 7, isNative: false }
    }
  },

  // Native network tokens
  BNB: {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    category: 'native',
    coingeckoId: 'binancecoin',
    logoURI: '/images/tokens/bnb.png',
    networks: {
      BNB: { symbol: 'BNB', address: null, decimals: 18, isNative: true }
    }
  },

  AVALANCHE: {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    category: 'native',
    coingeckoId: 'avalanche-2',
    logoURI: '/images/tokens/avax.png',
    networks: {
      AVAX: { symbol: 'AVAX', address: null, decimals: 18, isNative: true }
    }
  },

  POLYGON: {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    category: 'native',
    coingeckoId: 'matic-network',
    logoURI: '/images/tokens/matic.png',
    networks: {
      MATIC: { symbol: 'MATIC', address: null, decimals: 18, isNative: true }
    }
  },

  SOLANA: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    category: 'native',
    coingeckoId: 'solana',
    logoURI: '/images/tokens/sol.png',
    networks: {
      SOL: { symbol: 'SOL', address: null, decimals: 9, isNative: true }
    }
  },

  XDC: {
    id: 'xdc-network',
    name: 'XDC Network',
    symbol: 'XDC',
    category: 'native',
    coingeckoId: 'xdce-crowd-sale',
    logoURI: '/images/tokens/xdc.png',
    networks: {
      XDC: { symbol: 'XDC', address: null, decimals: 18, isNative: true }
    }
  },

  XRP: {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    category: 'native',
    coingeckoId: 'ripple',
    logoURI: '/images/tokens/xrp.png',
    networks: {
      XRP: { symbol: 'XRP', address: null, decimals: 6, isNative: true }
    }
  },

  STELLAR: {
    id: 'stellar',
    name: 'Stellar Lumens',
    symbol: 'XLM',
    category: 'native',
    coingeckoId: 'stellar',
    logoURI: '/images/tokens/xlm.png',
    networks: {
      XLM: { symbol: 'XLM', address: null, decimals: 7, isNative: true }
    }
  }
};

// Asset mapping utility class
class CrossChainAssetMapper {
  constructor() {
    this.assetGroups = CROSS_CHAIN_ASSET_GROUPS;
    this.networkToAssetMap = this._buildNetworkToAssetMap();
    this.symbolToGroupMap = this._buildSymbolToGroupMap();
  }

  /**
   * Build reverse mapping from network/symbol to asset group
   */
  _buildNetworkToAssetMap() {
    const map = {};
    
    Object.entries(this.assetGroups).forEach(([groupId, group]) => {
      Object.entries(group.networks).forEach(([network, tokenInfo]) => {
        const key = `${network}_${tokenInfo.symbol}`;
        map[key] = {
          groupId,
          group,
          network,
          tokenInfo
        };
      });
    });
    
    return map;
  }

  /**
   * Build mapping from symbol to possible asset groups
   */
  _buildSymbolToGroupMap() {
    const map = {};
    
    Object.entries(this.assetGroups).forEach(([groupId, group]) => {
      Object.entries(group.networks).forEach(([network, tokenInfo]) => {
        const symbol = tokenInfo.symbol;
        if (!map[symbol]) {
          map[symbol] = [];
        }
        map[symbol].push({
          groupId,
          group,
          network,
          tokenInfo
        });
      });
    });
    
    return map;
  }

  /**
   * Get unified asset representation for a token
   */
  getUnifiedAsset(networkSymbol, tokenSymbol) {
    const key = `${networkSymbol}_${tokenSymbol}`;
    const mapping = this.networkToAssetMap[key];
    
    if (!mapping) {
      return null;
    }
    
    return {
      id: mapping.group.id,
      name: mapping.group.name,
      symbol: mapping.group.symbol,
      category: mapping.group.category,
      coingeckoId: mapping.group.coingeckoId,
      logoURI: mapping.group.logoURI,
      currentNetwork: networkSymbol,
      currentTokenInfo: mapping.tokenInfo,
      availableNetworks: Object.keys(mapping.group.networks),
      crossChainVariants: mapping.group.networks
    };
  }

  /**
   * Get all networks where an asset is available
   */
  getAssetNetworks(assetId) {
    const group = this.assetGroups[assetId];
    if (!group) {
      return [];
    }
    
    return Object.entries(group.networks).map(([network, tokenInfo]) => ({
      network,
      symbol: tokenInfo.symbol,
      address: tokenInfo.address,
      decimals: tokenInfo.decimals,
      isNative: tokenInfo.isNative
    }));
  }

  /**
   * Find equivalent tokens across networks
   */
  findEquivalentTokens(networkSymbol, tokenSymbol) {
    const unifiedAsset = this.getUnifiedAsset(networkSymbol, tokenSymbol);
    if (!unifiedAsset) {
      return [];
    }
    
    return Object.entries(unifiedAsset.crossChainVariants)
      .filter(([network]) => network !== networkSymbol)
      .map(([network, tokenInfo]) => ({
        network,
        symbol: tokenInfo.symbol,
        address: tokenInfo.address,
        decimals: tokenInfo.decimals,
        isNative: tokenInfo.isNative,
        unifiedAsset: {
          id: unifiedAsset.id,
          name: unifiedAsset.name,
          symbol: unifiedAsset.symbol,
          logoURI: unifiedAsset.logoURI
        }
      }));
  }

  /**
   * Check if two tokens represent the same asset
   */
  areTokensEquivalent(network1, symbol1, network2, symbol2) {
    const asset1 = this.getUnifiedAsset(network1, symbol1);
    const asset2 = this.getUnifiedAsset(network2, symbol2);
    
    return asset1 && asset2 && asset1.id === asset2.id;
  }

  /**
   * Get all stablecoins across networks
   */
  getAllStablecoins() {
    return Object.entries(this.assetGroups)
      .filter(([_, group]) => group.category === 'stablecoin')
      .map(([groupId, group]) => ({
        id: group.id,
        name: group.name,
        symbol: group.symbol,
        logoURI: group.logoURI,
        networks: Object.keys(group.networks)
      }));
  }

  /**
   * Get all native tokens
   */
  getAllNativeTokens() {
    return Object.entries(this.assetGroups)
      .filter(([_, group]) => group.category === 'native')
      .map(([groupId, group]) => ({
        id: group.id,
        name: group.name,
        symbol: group.symbol,
        logoURI: group.logoURI,
        networks: Object.keys(group.networks)
      }));
  }

  /**
   * Get cross-chain swap pairs for a token
   */
  getCrossChainSwapPairs(networkSymbol, tokenSymbol) {
    const equivalentTokens = this.findEquivalentTokens(networkSymbol, tokenSymbol);
    
    return equivalentTokens.map(token => ({
      fromNetwork: networkSymbol,
      fromSymbol: tokenSymbol,
      toNetwork: token.network,
      toSymbol: token.symbol,
      unifiedAsset: token.unifiedAsset,
      swapType: 'cross-chain',
      estimatedTime: this._estimateSwapTime(networkSymbol, token.network),
      estimatedFee: this._estimateSwapFee(networkSymbol, token.network)
    }));
  }

  /**
   * Estimate cross-chain swap time (mock implementation)
   */
  _estimateSwapTime(fromNetwork, toNetwork) {
    // Mock estimation based on network characteristics
    const networkSpeeds = {
      BTC: 60, // minutes
      ETH: 15,
      BNB: 3,
      AVAX: 2,
      MATIC: 2,
      SOL: 1,
      XDC: 5,
      XRP: 4,
      XLM: 5
    };
    
    const fromSpeed = networkSpeeds[fromNetwork] || 10;
    const toSpeed = networkSpeeds[toNetwork] || 10;
    
    return Math.max(fromSpeed, toSpeed) + 5; // Add bridge time
  }

  /**
   * Estimate cross-chain swap fee (mock implementation)
   */
  _estimateSwapFee(fromNetwork, toNetwork) {
    // Mock fee estimation
    const baseFees = {
      BTC: 0.0005,
      ETH: 0.003,
      BNB: 0.0005,
      AVAX: 0.001,
      MATIC: 0.0001,
      SOL: 0.00025,
      XDC: 0.0001,
      XRP: 0.00001,
      XLM: 0.00001
    };
    
    const fromFee = baseFees[fromNetwork] || 0.001;
    const toFee = baseFees[toNetwork] || 0.001;
    
    return fromFee + toFee + 0.001; // Add bridge fee
  }
}

// Create singleton instance
const crossChainAssetMapper = new CrossChainAssetMapper();

export default crossChainAssetMapper;

// Export class for testing
export { CrossChainAssetMapper };

