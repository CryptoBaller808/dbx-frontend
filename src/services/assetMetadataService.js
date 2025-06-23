/**
 * DBX Asset Metadata Service
 * Handles dynamic token loading, caching, and metadata management
 * 
 * @version 4.0.0
 * @author DBX Development Team
 */

import { TOKEN_DATABASE, getTokensForNetwork, getTokenMetadata, searchTokens } from '../data/tokenDatabase';

class AssetMetadataService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.defaultCacheTime = 5 * 60 * 1000; // 5 minutes
    this.loadingPromises = new Map();
  }

  /**
   * Get tokens for a specific network with caching
   */
  async getNetworkTokens(networkSymbol, forceRefresh = false) {
    const cacheKey = `network_${networkSymbol}`;
    
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    const loadingPromise = this._loadNetworkTokens(networkSymbol);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const tokens = await loadingPromise;
      this.setCache(cacheKey, tokens);
      return tokens;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * Internal method to load network tokens
   */
  async _loadNetworkTokens(networkSymbol) {
    try {
      // Simulate API delay for realistic loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const tokens = getTokensForNetwork(networkSymbol);
      
      // Convert to array format with additional metadata
      const tokenList = Object.entries(tokens).map(([symbol, token]) => ({
        ...token,
        id: `${networkSymbol}_${symbol}`,
        network: networkSymbol,
        displayName: `${token.name} (${symbol})`,
        searchTerms: [symbol, token.name, token.symbol].filter(Boolean)
      }));

      // Sort tokens: native first, then stablecoins, then others
      tokenList.sort((a, b) => {
        if (a.isNative && !b.isNative) return -1;
        if (!a.isNative && b.isNative) return 1;
        if (a.isStablecoin && !b.isStablecoin) return -1;
        if (!a.isStablecoin && b.isStablecoin) return 1;
        return a.name.localeCompare(b.name);
      });

      return tokenList;
    } catch (error) {
      console.error(`Failed to load tokens for ${networkSymbol}:`, error);
      return [];
    }
  }

  /**
   * Get specific token metadata
   */
  async getTokenMetadata(networkSymbol, tokenSymbol, forceRefresh = false) {
    const cacheKey = `token_${networkSymbol}_${tokenSymbol}`;
    
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const metadata = getTokenMetadata(networkSymbol, tokenSymbol);
      if (metadata) {
        const enrichedMetadata = {
          ...metadata,
          id: `${networkSymbol}_${tokenSymbol}`,
          network: networkSymbol,
          displayName: `${metadata.name} (${tokenSymbol})`
        };
        this.setCache(cacheKey, enrichedMetadata);
        return enrichedMetadata;
      }
      return null;
    } catch (error) {
      console.error(`Failed to get token metadata for ${networkSymbol}:${tokenSymbol}:`, error);
      return null;
    }
  }

  /**
   * Search tokens across networks or within a specific network
   */
  async searchTokens(query, networkSymbol = null, limit = 20) {
    const cacheKey = `search_${query}_${networkSymbol || 'all'}_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const results = searchTokens(query, networkSymbol);
      const limitedResults = results.slice(0, limit);
      
      this.setCache(cacheKey, limitedResults, 2 * 60 * 1000); // 2 minutes for search results
      return limitedResults;
    } catch (error) {
      console.error(`Failed to search tokens for query "${query}":`, error);
      return [];
    }
  }

  /**
   * Get popular tokens across all networks
   */
  async getPopularTokens(limit = 10) {
    const cacheKey = `popular_tokens_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const popularTokens = [];
      
      // Add native tokens first
      Object.entries(TOKEN_DATABASE).forEach(([network, tokens]) => {
        Object.entries(tokens).forEach(([symbol, token]) => {
          if (token.isNative) {
            popularTokens.push({
              ...token,
              id: `${network}_${symbol}`,
              network,
              displayName: `${token.name} (${symbol})`,
              popularity: 100 // Native tokens get highest popularity
            });
          }
        });
      });

      // Add major stablecoins
      const majorStablecoins = ['USDT', 'USDC', 'DAI'];
      Object.entries(TOKEN_DATABASE).forEach(([network, tokens]) => {
        Object.entries(tokens).forEach(([symbol, token]) => {
          if (majorStablecoins.includes(symbol) && token.isStablecoin) {
            popularTokens.push({
              ...token,
              id: `${network}_${symbol}`,
              network,
              displayName: `${token.name} (${symbol})`,
              popularity: 80 // Stablecoins get high popularity
            });
          }
        });
      });

      // Sort by popularity and limit
      const sortedTokens = popularTokens
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, limit);

      this.setCache(cacheKey, sortedTokens, 10 * 60 * 1000); // 10 minutes for popular tokens
      return sortedTokens;
    } catch (error) {
      console.error('Failed to get popular tokens:', error);
      return [];
    }
  }

  /**
   * Get token balance (mock implementation for now)
   */
  async getTokenBalance(networkSymbol, tokenSymbol, walletAddress) {
    const cacheKey = `balance_${networkSymbol}_${tokenSymbol}_${walletAddress}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Mock balance data - replace with actual blockchain calls
      const mockBalance = {
        balance: (Math.random() * 1000).toFixed(6),
        balanceUSD: (Math.random() * 5000).toFixed(2),
        network: networkSymbol,
        token: tokenSymbol,
        walletAddress,
        lastUpdated: new Date().toISOString()
      };

      this.setCache(cacheKey, mockBalance, 30 * 1000); // 30 seconds for balance data
      return mockBalance;
    } catch (error) {
      console.error(`Failed to get balance for ${networkSymbol}:${tokenSymbol}:`, error);
      return null;
    }
  }

  /**
   * Preload tokens for multiple networks
   */
  async preloadNetworks(networkSymbols) {
    const promises = networkSymbols.map(network => 
      this.getNetworkTokens(network).catch(error => {
        console.warn(`Failed to preload ${network}:`, error);
        return [];
      })
    );
    
    return Promise.all(promises);
  }

  /**
   * Cache management methods
   */
  isCacheValid(key) {
    if (!this.cache.has(key)) return false;
    
    const expiry = this.cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return false;
    }
    
    return true;
  }

  setCache(key, value, ttl = this.defaultCacheTime) {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + ttl);
  }

  clearCache() {
    this.cache.clear();
    this.cacheExpiry.clear();
    this.loadingPromises.clear();
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      loadingPromises: this.loadingPromises.size,
      cacheKeys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
const assetMetadataService = new AssetMetadataService();

export default assetMetadataService;

// Export class for testing
export { AssetMetadataService };

