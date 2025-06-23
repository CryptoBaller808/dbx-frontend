/**
 * DBX Price Indicator Component
 * Real-time price display with change indicators and formatting
 * 
 * @version 4.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Badge, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { TrendingUpIcon, TrendingDownIcon, RefreshIcon, DollarSignIcon } from '../Icons';
import priceFeedService from '../services/priceFeedService';
import './PriceIndicator.css';

const PriceIndicator = ({
  networkSymbol,
  tokenSymbol,
  vsCurrency = 'usd',
  showChange = true,
  showVolume = false,
  showMarketCap = false,
  size = 'md',
  refreshInterval = 30000, // 30 seconds
  className = "",
  onClick = null
}) => {
  const [priceData, setPriceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load initial price data
  useEffect(() => {
    if (!networkSymbol || !tokenSymbol) {
      setPriceData(null);
      setIsLoading(false);
      return;
    }

    const loadPrice = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const price = await priceFeedService.getTokenPrice(networkSymbol, tokenSymbol, vsCurrency);
        setPriceData(price);
        setLastUpdated(new Date());
      } catch (err) {
        setError(`Failed to load price for ${tokenSymbol}`);
        console.error('Price loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrice();
  }, [networkSymbol, tokenSymbol, vsCurrency]);

  // Set up auto-refresh
  useEffect(() => {
    if (!refreshInterval || !networkSymbol || !tokenSymbol) return;

    const interval = setInterval(async () => {
      try {
        const price = await priceFeedService.getTokenPrice(networkSymbol, tokenSymbol, vsCurrency);
        setPriceData(price);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Price refresh error:', err);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [networkSymbol, tokenSymbol, vsCurrency, refreshInterval]);

  // Format price with appropriate decimals
  const formatPrice = useMemo(() => {
    if (!priceData || !priceData.price) return '$0.00';
    
    const price = priceData.price;
    const symbol = vsCurrency === 'usd' ? '$' : vsCurrency.toUpperCase();
    
    if (price >= 1000) {
      return `${symbol}${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `${symbol}${price.toFixed(4)}`;
    } else if (price >= 0.01) {
      return `${symbol}${price.toFixed(6)}`;
    } else {
      return `${symbol}${price.toFixed(8)}`;
    }
  }, [priceData, vsCurrency]);

  // Format market cap
  const formatMarketCap = useMemo(() => {
    if (!priceData || !priceData.marketCap) return 'N/A';
    
    const marketCap = priceData.marketCap;
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else if (marketCap >= 1e3) {
      return `$${(marketCap / 1e3).toFixed(2)}K`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  }, [priceData]);

  // Format volume
  const formatVolume = useMemo(() => {
    if (!priceData || !priceData.volume24h) return 'N/A';
    
    const volume = priceData.volume24h;
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  }, [priceData]);

  // Format 24h change
  const formatChange = useMemo(() => {
    if (!priceData || priceData.change24h === undefined) return null;
    
    const change = priceData.change24h;
    const isPositive = change >= 0;
    const absChange = Math.abs(change);
    
    return {
      value: change,
      formatted: `${isPositive ? '+' : ''}${absChange.toFixed(2)}%`,
      isPositive,
      isNegative: change < 0,
      isNeutral: change === 0
    };
  }, [priceData]);

  // Get size classes
  const sizeClasses = {
    sm: 'price-indicator-sm',
    md: 'price-indicator-md',
    lg: 'price-indicator-lg'
  };

  if (error) {
    return (
      <div className={`price-indicator price-indicator-error ${sizeClasses[size]} ${className}`}>
        <span className="price-error">Price unavailable</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`price-indicator price-indicator-loading ${sizeClasses[size]} ${className}`}>
        <Spinner animation="border" size="sm" className="me-2" />
        <span>Loading price...</span>
      </div>
    );
  }

  const tooltipContent = (
    <div className="price-tooltip">
      <div><strong>{tokenSymbol}</strong> on {networkSymbol}</div>
      {showMarketCap && <div>Market Cap: {formatMarketCap}</div>}
      {showVolume && <div>24h Volume: {formatVolume}</div>}
      {lastUpdated && <div>Updated: {lastUpdated.toLocaleTimeString()}</div>}
      {priceData?.coingeckoId && <div>Source: CoinGecko</div>}
    </div>
  );

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{tooltipContent}</Tooltip>}
    >
      <div 
        className={`price-indicator ${sizeClasses[size]} ${className} ${onClick ? 'clickable' : ''}`}
        onClick={onClick}
      >
        <div className="price-main">
          <DollarSignIcon className="price-icon" />
          <span className="price-value">{formatPrice}</span>
        </div>
        
        {showChange && formatChange && (
          <div className={`price-change ${formatChange.isPositive ? 'positive' : formatChange.isNegative ? 'negative' : 'neutral'}`}>
            {formatChange.isPositive && <TrendingUpIcon className="change-icon" />}
            {formatChange.isNegative && <TrendingDownIcon className="change-icon" />}
            <span className="change-value">{formatChange.formatted}</span>
          </div>
        )}
        
        {(showMarketCap || showVolume) && (
          <div className="price-details">
            {showMarketCap && (
              <Badge bg="secondary" className="detail-badge">
                MC: {formatMarketCap}
              </Badge>
            )}
            {showVolume && (
              <Badge bg="info" className="detail-badge">
                Vol: {formatVolume}
              </Badge>
            )}
          </div>
        )}
        
        {lastUpdated && (
          <div className="price-updated">
            <RefreshIcon className="refresh-icon" />
            <small>{lastUpdated.toLocaleTimeString()}</small>
          </div>
        )}
      </div>
    </OverlayTrigger>
  );
};

export default PriceIndicator;

