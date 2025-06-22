/**
 * Bitcoin Trading Interface Component
 * Advanced trading interface for Bitcoin pairs with real-time data
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Zap,
  ArrowUpDown,
  RefreshCw,
  Target,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatBTC, formatPercentage } from '../../utils/formatters';
import BitcoinChart from './BitcoinChart';
import OrderBook from './OrderBook';
import TradeHistory from './TradeHistory';

const BitcoinTrading = ({ userId, selectedPair = 'BTC/USDT' }) => {
  const [marketData, setMarketData] = useState({
    price: 0,
    change24h: 0,
    volume24h: 0,
    high24h: 0,
    low24h: 0,
    marketCap: 0
  });
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [tradingPairs, setTradingPairs] = useState([]);
  const [activeOrder, setActiveOrder] = useState({
    type: 'market', // market, limit
    side: 'buy', // buy, sell
    amount: '',
    price: '',
    total: ''
  });
  const [userBalance, setUserBalance] = useState({ BTC: 0, USDT: 0 });
  const [loading, setLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);

  // Initialize trading interface
  useEffect(() => {
    initializeTradingData();
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [selectedPair]);

  // Auto-refresh market data
  useEffect(() => {
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  const initializeTradingData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTradingPairs(),
        fetchMarketData(),
        fetchOrderBook(),
        fetchRecentTrades(),
        fetchUserBalance()
      ]);
    } catch (error) {
      console.error('Failed to initialize trading data:', error);
      toast.error('Failed to load trading data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTradingPairs = async () => {
    try {
      const response = await fetch('/api/bitcoin/trading/pairs');
      if (response.ok) {
        const result = await response.json();
        setTradingPairs(result.data.pairs);
      }
    } catch (error) {
      console.error('Failed to fetch trading pairs:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/bitcoin/trading/market-data');
      if (response.ok) {
        const result = await response.json();
        setMarketData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  };

  const fetchOrderBook = async () => {
    try {
      const response = await fetch(`/api/bitcoin/trading/orderbook/${selectedPair}?depth=20`);
      if (response.ok) {
        const result = await response.json();
        setOrderBook(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch order book:', error);
    }
  };

  const fetchRecentTrades = async () => {
    try {
      const response = await fetch(`/api/bitcoin/trading/history/${userId}?limit=20`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const result = await response.json();
        setRecentTrades(result.data.trades);
      }
    } catch (error) {
      console.error('Failed to fetch recent trades:', error);
    }
  };

  const fetchUserBalance = async () => {
    try {
      // This would fetch user's balance for both assets in the pair
      // For now, we'll use mock data
      setUserBalance({ BTC: 0.5, USDT: 10000 });
    } catch (error) {
      console.error('Failed to fetch user balance:', error);
    }
  };

  const connectWebSocket = () => {
    try {
      const wsUrl = `wss://api.digitalblockexchange.com/ws/bitcoin/${selectedPair}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setWsConnected(true);
        console.log('Bitcoin trading WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      wsRef.current.onclose = () => {
        setWsConnected(false);
        console.log('Bitcoin trading WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('Bitcoin trading WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'price_update':
        setMarketData(prev => ({ ...prev, ...data.data }));
        break;
      case 'orderbook_update':
        setOrderBook(data.data);
        break;
      case 'trade_update':
        setRecentTrades(prev => [data.data, ...prev.slice(0, 19)]);
        break;
      default:
        break;
    }
  };

  const calculateTotal = () => {
    const amount = parseFloat(activeOrder.amount) || 0;
    const price = activeOrder.type === 'market' ? marketData.price : (parseFloat(activeOrder.price) || 0);
    return amount * price;
  };

  const calculateMaxAmount = () => {
    if (activeOrder.side === 'buy') {
      const price = activeOrder.type === 'market' ? marketData.price : (parseFloat(activeOrder.price) || marketData.price);
      return userBalance.USDT / price;
    } else {
      return userBalance.BTC;
    }
  };

  const handleOrderSubmit = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        pair: selectedPair,
        type: activeOrder.type,
        side: activeOrder.side,
        amount: parseFloat(activeOrder.amount),
        price: activeOrder.type === 'limit' ? parseFloat(activeOrder.price) : undefined
      };

      const response = await fetch('/api/bitcoin/trading/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${activeOrder.side.toUpperCase()} order placed successfully!`);
        setActiveOrder({ type: 'market', side: 'buy', amount: '', price: '', total: '' });
        await fetchUserBalance();
        await fetchRecentTrades();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    const maxAmount = calculateMaxAmount();
    setActiveOrder(prev => ({ ...prev, amount: maxAmount.toString() }));
  };

  const [baseAsset, quoteAsset] = selectedPair.split('/');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Bitcoin Trading Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bitcoin className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">{selectedPair} Trading</CardTitle>
                <p className="text-orange-100">Professional Bitcoin Trading Interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-3xl font-bold">${formatCurrency(marketData.price)}</p>
                <div className="flex items-center space-x-1">
                  {marketData.change24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-300" />
                  )}
                  <span className={`${marketData.change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {formatPercentage(marketData.change24h)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm">{wsConnected ? 'Live' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-orange-200 text-sm">24h High</p>
              <p className="text-lg font-semibold">${formatCurrency(marketData.high24h)}</p>
            </div>
            <div>
              <p className="text-orange-200 text-sm">24h Low</p>
              <p className="text-lg font-semibold">${formatCurrency(marketData.low24h)}</p>
            </div>
            <div>
              <p className="text-orange-200 text-sm">24h Volume</p>
              <p className="text-lg font-semibold">{formatBTC(marketData.volume24h)} BTC</p>
            </div>
            <div>
              <p className="text-orange-200 text-sm">Market Cap</p>
              <p className="text-lg font-semibold">${formatCurrency(marketData.marketCap / 1e9)}B</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>{selectedPair} Price Chart</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BitcoinChart pair={selectedPair} />
            </CardContent>
          </Card>

          {/* Order Book and Recent Trades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Order Book</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrderBook 
                  orderBook={orderBook} 
                  onPriceClick={(price) => setActiveOrder(prev => ({ ...prev, price: price.toString() }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Trades</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TradeHistory trades={recentTrades} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          {/* Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>{baseAsset}</span>
                <span className="font-semibold">{formatBTC(userBalance.BTC)}</span>
              </div>
              <div className="flex justify-between">
                <span>{quoteAsset}</span>
                <span className="font-semibold">{formatCurrency(userBalance.USDT)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Trading Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Place Order</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Type */}
              <Tabs value={activeOrder.type} onValueChange={(value) => setActiveOrder(prev => ({ ...prev, type: value }))}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="market">Market</TabsTrigger>
                  <TabsTrigger value="limit">Limit</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={activeOrder.side === 'buy' ? 'default' : 'outline'}
                  onClick={() => setActiveOrder(prev => ({ ...prev, side: 'buy' }))}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Buy {baseAsset}
                </Button>
                <Button
                  variant={activeOrder.side === 'sell' ? 'default' : 'outline'}
                  onClick={() => setActiveOrder(prev => ({ ...prev, side: 'sell' }))}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Sell {baseAsset}
                </Button>
              </div>

              {/* Price Input (for limit orders) */}
              {activeOrder.type === 'limit' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Price ({quoteAsset})</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={activeOrder.price}
                    onChange={(e) => setActiveOrder(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              )}

              {/* Amount Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Amount ({baseAsset})</label>
                  <Button variant="ghost" size="sm" onClick={setMaxAmount}>
                    Max
                  </Button>
                </div>
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.00000000"
                  value={activeOrder.amount}
                  onChange={(e) => setActiveOrder(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              {/* Total */}
              <div>
                <label className="block text-sm font-medium mb-2">Total ({quoteAsset})</label>
                <div className="bg-gray-50 p-3 rounded border">
                  <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleOrderSubmit}
                disabled={loading || !activeOrder.amount || (activeOrder.type === 'limit' && !activeOrder.price)}
                className={`w-full ${
                  activeOrder.side === 'buy' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    {activeOrder.side === 'buy' ? 'Buy' : 'Sell'} {baseAsset}
                  </>
                )}
              </Button>

              {/* Order Summary */}
              {activeOrder.amount && (
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Est. Fee:</span>
                    <span>{formatCurrency(calculateTotal() * 0.001)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Total:</span>
                    <span>{formatCurrency(calculateTotal() * 1.001)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowUpDown className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Swap to {baseAsset}
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Target className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BitcoinTrading;

