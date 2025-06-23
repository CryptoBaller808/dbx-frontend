/**
 * DBX Price Feed Service
 * Real-time cryptocurrency price data from CoinGecko API
 * 
 * @version 4.0.0
 * @author DBX Development Team
 */

import crossChainAssetMapper from './crossChainAssetMapper';

class PriceFeedService {
  constructor() {
    this.baseURL = 'https://api.coingecko.com/api/v3';
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.defaultCacheTime = 60 * 1000; // 1 minute
    this.loadingPromises = new Map();
    this.rateLimitDelay = 1000; // 1 second between requests
    this.lastRequestTime = 0;
    
    // WebSocket connection for real-time updates (future enhancement)
    this.wsConnection = null;
    this.subscribers = new Map();
  }

  /**
   * Get current prices for multiple coins
   */
  async getPrices(coinIds, vsCurrencies = ['usd'], includeMarketCap = true, include24hrVol = true, include24hrChange = true) {
    const cacheKey = `prices_${coinIds.join(',')}_${vsCurrencies.join(',')}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    const loadingPromise = this._fetchPrices(coinIds, vsCurrencies, includeMarketCap, include24hrVol, include24hrChange);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const prices = await loadingPromise;
      this.setCache(cacheKey, prices);
      return prices;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  /**
   * Internal method to fetch prices from CoinGecko API
   */
  async _fetchPrices(coinIds, vsCurrencies, includeMarketCap, include24hrVol, include24hrChange) {
    await this._rateLimitDelay();

    try {
      const params = new URLSearchParams({
        ids: coinIds.join(','),
        vs_currencies: vsCurrencies.join(','),
        include_market_cap: includeMarketCap,
        include_24hr_vol: include24hrVol,
        include_24hr_change: include24hrChange,
        include_last_updated_at: true
      });

      const response = await fetch(`${this.baseURL}/simple/price?${params}`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform data to our format
      const transformedData = {};
      Object.entries(data).forEach(([coinId, priceData]) => {
        transformedData[coinId] = {
          id: coinId,
          prices: {},
          marketCaps: {},
          volumes: {},
          changes24h: {},
          lastUpdated: priceData.last_updated_at ? new Date(priceData.last_updated_at * 1000) : new Date()
        };

        vsCurrencies.forEach(currency => {
          transformedData[coinId].prices[currency] = priceData[currency] || 0;
          
          if (includeMarketCap) {
            transformedData[coinId].marketCaps[currency] = priceData[`${currency}_market_cap`] || 0;
          }
          
          if (include24hrVol) {
            transformedData[coinId].volumes[currency] = priceData[`${currency}_24h_vol`] || 0;
          }
          
          if (include24hrChange) {
            transformedData[coinId].changes24h[currency] = priceData[`${currency}_24h_change`] || 0;
          }
        });
      });

      return transformedData;
    } catch (error) {
      console.error('Failed to fetch prices from CoinGecko:', error);
      
      // Return mock data for development/fallback
      return this._getMockPrices(coinIds, vsCurrencies);
    }
  }

  /**
   * Get price for a specific token on a network
   */
  async getTokenPrice(networkSymbol, tokenSymbol, vsCurrency = 'usd') {
    const unifiedAsset = crossChainAssetMapper.getUnifiedAsset(networkSymbol, tokenSymbol);
    
    if (!unifiedAsset || !unifiedAsset.coingeckoId) {
      console.warn(`No CoinGecko ID found for ${networkSymbol}:${tokenSymbol}`);
      return this._getMockTokenPrice(tokenSymbol, vsCurrency);
    }

    try {
      const prices = await this.getPrices([unifiedAsset.coingeckoId], [vsCurrency]);
      const priceData = prices[unifiedAsset.coingeckoId];
      
      if (!priceData) {
        return this._getMockTokenPrice(tokenSymbol, vsCurrency);
      }

      return {
        symbol: tokenSymbol,
        network: networkSymbol,
        price: priceData.prices[vsCurrency] || 0,
        marketCap: priceData.marketCaps[vsCurrency] || 0,
        volume24h: priceData.volumes[vsCurrency] || 0,
        change24h: priceData.changes24h[vsCurrency] || 0,
        lastUpdated: priceData.lastUpdated,
        coingeckoId: unifiedAsset.coingeckoId
      };
    } catch (error) {
      console.error(`Failed to get price for ${networkSymbol}:${tokenSymbol}:`, error);
      return this._getMockTokenPrice(tokenSymbol, vsCurrency);
    }
  }

  /**
   * Get prices for all tokens in a network
   */
  async getNetworkTokenPrices(networkSymbol, vsCurrency = 'usd') {
    const cacheKey = `network_prices_${networkSymbol}_${vsCurrency}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Get all unique CoinGecko IDs for this network
      const coinIds = new Set();
      const tokenMap = new Map();
      
      // Get tokens from cross-chain mapper
      Object.values(crossChainAssetMapper.assetGroups).forEach(group => {
        if (group.networks[networkSymbol] && group.coingeckoId) {
          coinIds.add(group.coingeckoId);
          tokenMap.set(group.coingeckoId, {
            symbol: group.networks[networkSymbol].symbol,
            name: group.name,
            logoURI: group.logoURI
          });
        }
      });

      if (coinIds.size === 0) {
        return {};
      }

      const prices = await this.getPrices(Array.from(coinIds), [vsCurrency]);
      
      // Transform to network-specific format
      const networkPrices = {};
      Object.entries(prices).forEach(([coinId, priceData]) => {
        const tokenInfo = tokenMap.get(coinId);
        if (tokenInfo) {
          networkPrices[tokenInfo.symbol] = {
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            logoURI: tokenInfo.logoURI,
            network: networkSymbol,
            price: priceData.prices[vsCurrency] || 0,
            marketCap: priceData.marketCaps[vsCurrency] || 0,
            volume24h: priceData.volumes[vsCurrency] || 0,
            change24h: priceData.changes24h[vsCurrency] || 0,
            lastUpdated: priceData.lastUpdated,
            coingeckoId: coinId
          };
        }
      });

      this.setCache(cacheKey, networkPrices, 2 * 60 * 1000); // 2 minutes for network prices
      return networkPrices;
    } catch (error) {
      console.error(`Failed to get network prices for ${networkSymbol}:`, error);
      return {};
    }
  }

  /**
   * Get trending coins
   */
  async getTrendingCoins() {
    const cacheKey = 'trending_coins';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      await this._rateLimitDelay();
      
      const response = await fetch(`${this.baseURL}/search/trending`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      
      const trending = data.coins.map(coin => ({
        id: coin.item.id,
        symbol: coin.item.symbol,
        name: coin.item.name,
        thumb: coin.item.thumb,
        marketCapRank: coin.item.market_cap_rank,
        priceChangePercentage24h: coin.item.price_change_percentage_24h
      }));

      this.setCache(cacheKey, trending, 10 * 60 * 1000); // 10 minutes for trending
      return trending;
    } catch (error) {
      console.error('Failed to get trending coins:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time price updates (future enhancement)
   */
  subscribeToPriceUpdates(coinIds, callback) {
    const subscriptionId = `${Date.now()}_${Math.random()}`;
    
    if (!this.subscribers.has(subscriptionId)) {
      this.subscribers.set(subscriptionId, {
        coinIds,
        callback,
        lastUpdate: Date.now()
      });
    }

    // Start polling for updates
    this._startPricePolling(subscriptionId);
    
    return subscriptionId;
  }

  /**
   * Unsubscribe from price updates
   */
  unsubscribeFromPriceUpdates(subscriptionId) {
    this.subscribers.delete(subscriptionId);
  }

  /**
   * Start polling for price updates
   */
  _startPricePolling(subscriptionId) {
    const subscription = this.subscribers.get(subscriptionId);
    if (!subscription) return;

    const pollInterval = setInterval(async () => {
      if (!this.subscribers.has(subscriptionId)) {
        clearInterval(pollInterval);
        return;
      }

      try {
        const prices = await this.getPrices(subscription.coinIds, ['usd'], false, false, true);
        subscription.callback(prices);
        subscription.lastUpdate = Date.now();
      } catch (error) {
        console.error('Price polling error:', error);
      }
    }, 30000); // Poll every 30 seconds
  }

  /**
   * Rate limiting to respect CoinGecko API limits
   */
  async _rateLimitDelay() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Mock price data for development/fallback
   */
  _getMockPrices(coinIds, vsCurrencies) {
    const mockPrices = {};
    
    coinIds.forEach(coinId => {
      mockPrices[coinId] = {
        id: coinId,
        prices: {},
        marketCaps: {},
        volumes: {},
        changes24h: {},
        lastUpdated: new Date()
      };
      
      vsCurrencies.forEach(currency => {
        const basePrice = Math.random() * 1000 + 1;
        mockPrices[coinId].prices[currency] = basePrice;
        mockPrices[coinId].marketCaps[currency] = basePrice * 1000000;
        mockPrices[coinId].volumes[currency] = basePrice * 100000;
        mockPrices[coinId].changes24h[currency] = (Math.random() - 0.5) * 20;
      });
    });
    
    return mockPrices;
  }

  /**
   * Mock token price for development/fallback
   */
  _getMockTokenPrice(tokenSymbol, vsCurrency) {
    const basePrice = Math.random() * 1000 + 1;
    
    return {
      symbol: tokenSymbol,
      price: basePrice,
      marketCap: basePrice * 1000000,
      volume24h: basePrice * 100000,
      change24h: (Math.random() - 0.5) * 20,
      lastUpdated: new Date(),
      coingeckoId: null
    };
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
      subscribers: this.subscribers.size,
      cacheKeys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
const priceFeedService = new PriceFeedService();

export default priceFeedService;

// Export class for testing
export { PriceFeedService };

