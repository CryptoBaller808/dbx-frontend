import React, { useState, useEffect, useRef } from 'react';
import './OrderBook.css';

/**
 * Real-Time Order Book Component
 * Displays live bid/ask orders with WebSocket updates
 */
const OrderBook = ({ symbol, depth = 10, className = '' }) => {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (symbol) {
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [symbol]);

  const connectWebSocket = () => {
    try {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('[OrderBook] WebSocket connected');
        setIsConnected(true);
        
        // Subscribe to order book updates
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          data: {
            streams: [`${symbol}@depth${depth}`]
          }
        }));

        // Request initial order book
        wsRef.current.send(JSON.stringify({
          type: 'getOrderBook',
          data: { symbol, depth }
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('[OrderBook] Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('[OrderBook] WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('[OrderBook] WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('[OrderBook] Error connecting WebSocket:', error);
    }
  };

  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleWebSocketMessage = (message) => {
    const { type, data } = message;

    switch (type) {
      case 'orderBook':
        setOrderBook(data);
        setLastUpdate(new Date());
        break;

      case 'orderUpdate':
        // Handle individual order updates
        updateOrderBook(data);
        break;

      default:
        // Ignore other message types
        break;
    }
  };

  const updateOrderBook = (updateData) => {
    // This would handle incremental order book updates
    // For now, we'll request a fresh order book
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'getOrderBook',
        data: { symbol, depth }
      }));
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(6);
  };

  const formatQuantity = (quantity) => {
    return parseFloat(quantity).toFixed(4);
  };

  const calculateTotal = (orders, index) => {
    return orders.slice(0, index + 1).reduce((total, order) => total + order.quantity, 0);
  };

  const getSpread = () => {
    if (orderBook.bids.length > 0 && orderBook.asks.length > 0) {
      const bestBid = orderBook.bids[0].price;
      const bestAsk = orderBook.asks[0].price;
      return bestAsk - bestBid;
    }
    return 0;
  };

  const getSpreadPercentage = () => {
    if (orderBook.bids.length > 0 && orderBook.asks.length > 0) {
      const bestBid = orderBook.bids[0].price;
      const bestAsk = orderBook.asks[0].price;
      const spread = bestAsk - bestBid;
      const midPrice = (bestBid + bestAsk) / 2;
      return ((spread / midPrice) * 100).toFixed(4);
    }
    return '0.0000';
  };

  return (
    <div className={`order-book ${className}`}>
      <div className="order-book-header">
        <h3>Order Book - {symbol}</h3>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '●' : '○'}
          </span>
          <span className="status-text">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Spread Information */}
      <div className="spread-info">
        <div className="spread-value">
          Spread: {formatPrice(getSpread())} ({getSpreadPercentage()}%)
        </div>
        {lastUpdate && (
          <div className="last-update">
            Last Update: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="order-book-content">
        {/* Asks (Sell Orders) */}
        <div className="asks-section">
          <div className="section-header asks-header">
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
          <div className="orders-list asks-list">
            {orderBook.asks.slice(0, depth).reverse().map((order, index) => (
              <div key={`ask-${index}`} className="order-row ask-row">
                <span className="price ask-price">{formatPrice(order.price)}</span>
                <span className="quantity">{formatQuantity(order.quantity)}</span>
                <span className="total">{formatQuantity(calculateTotal(orderBook.asks, index))}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Price */}
        <div className="current-price">
          <div className="price-display">
            {orderBook.asks.length > 0 ? formatPrice(orderBook.asks[0].price) : '---'}
          </div>
          <div className="price-label">Current Price</div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="bids-section">
          <div className="orders-list bids-list">
            {orderBook.bids.slice(0, depth).map((order, index) => (
              <div key={`bid-${index}`} className="order-row bid-row">
                <span className="price bid-price">{formatPrice(order.price)}</span>
                <span className="quantity">{formatQuantity(order.quantity)}</span>
                <span className="total">{formatQuantity(calculateTotal(orderBook.bids, index))}</span>
              </div>
            ))}
          </div>
          <div className="section-header bids-header">
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!isConnected && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Connecting to market data...</div>
        </div>
      )}
    </div>
  );
};

export default OrderBook;

