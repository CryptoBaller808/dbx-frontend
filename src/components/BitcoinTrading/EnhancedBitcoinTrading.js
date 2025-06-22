/**
 * Enhanced Bitcoin Trading Interface
 * Optimized with improved responsiveness, real-time updates, and better UX
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Zap, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  Target,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatBTC, formatPercentage } from '../../utils/formatters';

const EnhancedBitcoinTrading = ({ userId }) => {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [priceChange, setPriceChange] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [orderProgress, setOrderProgress] = useState(0);

  const tradingPairs = useMemo(() => [
    { pair: 'BTC/USDT', baseAsset: 'BTC', quoteAsset: 'USDT', price: 45000, change: 2.5 },
    { pair: 'BTC/ETH', baseAsset: 'BTC', quoteAsset: 'ETH', price: 18.5, change: -1.2 },
    { pair: 'BTC/XRP', baseAsset: 'BTC', quoteAsset: 'XRP', price: 75000, change: 3.8 },
    { pair: 'BTC/SOL', baseAsset: 'BTC', quoteAsset: 'SOL', price: 450, change: 1.9 },
    { pair: 'BTC/AVAX', baseAsset: 'BTC', quoteAsset: 'AVAX', price: 1250, change: -0.8 },
    { pair: 'BTC/MATIC', baseAsset: 'BTC', quoteAsset: 'MATIC', price: 45000, change: 4.2 }
  ], []);

  // WebSocket connection for real-time data
  useEffect(() => {
    const ws = new WebSocket(`wss://api.digitalblock.exchange/ws/bitcoin/${selectedPair.replace('/', '')}`);
    
    ws.onopen = () => {
      setWsConnected(true);
      console.log('Bitcoin trading WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'price_update':
          setMarketData(prev => ({ ...prev, ...data.data }));
          setPriceChange(data.data.change);
          break;
        case 'orderbook_update':
          setOrderBook(data.data);
          break;
        case 'trade_update':
          setRecentTrades(prev => [data.data, ...prev.slice(0, 19)]);
          break;
        case 'user_order_update':
          setUserOrders(prev => 
            prev.map(order => 
              order.id === data.data.id ? { ...order, ...data.data } : order
            )
          );
          break;
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
      console.log('Bitcoin trading WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [selectedPair]);

  // Auto-calculate total when amount or price changes
  useEffect(() => {
    if (amount && price) {
      const calculatedTotal = parseFloat(amount) * parseFloat(price);
      setTotal(calculatedTotal.toFixed(6));
    } else {
      setTotal('');
    }
  }, [amount, price]);

  // Enhanced order placement
  const placeOrder = async () => {
    if (!amount || (orderType === 'limit' && !price)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setOrderProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setOrderProgress(prev => Math.min(prev + 20, 90));
      }, 100);

      const orderData = {
        pair: selectedPair,
        type: orderType,
        side: side,
        amount: parseFloat(amount),
        ...(orderType === 'limit' && { price: parseFloat(price) }),
        userId: userId
      };

      const response = await fetch('/api/bitcoin/trading/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      clearInterval(progressInterval);
      setOrderProgress(100);

      if (response.ok) {
        const result = await response.json();
        
        toast.success(
          `${orderType === 'market' ? 'Order executed' : 'Order placed'} successfully!`,
          { duration: 4000 }
        );

        // Reset form
        setAmount('');
        setPrice('');
        setTotal('');
        setOrderProgress(0);

        // Refresh user orders
        fetchUserOrders();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      toast.error(`Order failed: ${error.message}`);
      setOrderProgress(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      const response = await fetch(`/api/bitcoin/trading/orders/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUserOrders(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/bitcoin/trading/cancel-order/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Order cancelled successfully');
        fetchUserOrders();
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error('Failed to cancel order');
    }
  };

  // Set price from order book
  const setPriceFromOrderBook = (orderPrice) => {
    setPrice(orderPrice.toString());
    setOrderType('limit');
  };

  // Set max amount based on balance
  const setMaxAmount = () => {
    // This would be calculated based on user's balance
    const maxAmount = side === 'buy' ? 1000 / (parseFloat(price) || 45000) : 0.5;
    setAmount(maxAmount.toFixed(8));
  };

  const currentPairData = tradingPairs.find(p => p.pair === selectedPair);

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bitcoin className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Bitcoin Trading</CardTitle>
                <p className="text-orange-100 text-sm">Professional trading interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-xs">{wsConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Pairs & Market Data */}
        <div className="lg:col-span-1 space-y-4">
          {/* Pair Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Trading Pairs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tradingPairs.map((pair) => (
                <Button
                  key={pair.pair}
                  variant={selectedPair === pair.pair ? "default" : "ghost"}
                  className="w-full justify-between text-left"
                  onClick={() => setSelectedPair(pair.pair)}
                >
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{pair.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {formatCurrency(pair.price)}
                    </div>
                    <div className={`text-xs ${pair.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {pair.change >= 0 ? '+' : ''}{formatPercentage(pair.change)}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Market Stats */}
          {currentPairData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Market Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">24h High</p>
                    <p className="font-semibold">{formatCurrency(currentPairData.price * 1.05)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">24h Low</p>
                    <p className="font-semibold">{formatCurrency(currentPairData.price * 0.95)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">24h Volume</p>
                    <p className="font-semibold">1,234.56 BTC</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">24h Change</p>
                    <p className={`font-semibold ${currentPairData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currentPairData.change >= 0 ? '+' : ''}{formatPercentage(currentPairData.change)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Book & Recent Trades */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Order Book</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="book" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="book">Order Book</TabsTrigger>
                  <TabsTrigger value="trades">Recent Trades</TabsTrigger>
                </TabsList>
                
                <TabsContent value="book" className="space-y-2">
                  {/* Asks */}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 mb-2">Asks (Sell Orders)</p>
                    {[...Array(5)].map((_, i) => {
                      const price = (currentPairData?.price || 45000) + (i + 1) * 10;
                      const amount = Math.random() * 2;
                      return (
                        <div 
                          key={i} 
                          className="flex justify-between text-xs cursor-pointer hover:bg-red-50 p-1 rounded"
                          onClick={() => setPriceFromOrderBook(price)}
                        >
                          <span className="text-red-600">{formatCurrency(price)}</span>
                          <span>{formatBTC(amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Current Price */}
                  <div className="border-t border-b py-2 my-2">
                    <div className="text-center">
                      <span className={`font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(currentPairData?.price || 45000)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Bids */}
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 mb-2">Bids (Buy Orders)</p>
                    {[...Array(5)].map((_, i) => {
                      const price = (currentPairData?.price || 45000) - (i + 1) * 10;
                      const amount = Math.random() * 2;
                      return (
                        <div 
                          key={i} 
                          className="flex justify-between text-xs cursor-pointer hover:bg-green-50 p-1 rounded"
                          onClick={() => setPriceFromOrderBook(price)}
                        >
                          <span className="text-green-600">{formatCurrency(price)}</span>
                          <span>{formatBTC(amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
                
                <TabsContent value="trades" className="space-y-1">
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {[...Array(10)].map((_, i) => {
                      const isBuy = Math.random() > 0.5;
                      const price = (currentPairData?.price || 45000) + (Math.random() - 0.5) * 100;
                      const amount = Math.random() * 0.5;
                      return (
                        <div key={i} className="flex justify-between text-xs">
                          <span className={isBuy ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(price)}
                          </span>
                          <span>{formatBTC(amount)}</span>
                          <span className="text-gray-500">
                            {new Date(Date.now() - i * 60000).toLocaleTimeString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Trading Interface */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Place Order</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Type */}
              <Tabs value={orderType} onValueChange={setOrderType}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="market">Market</TabsTrigger>
                  <TabsTrigger value="limit">Limit</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Buy/Sell Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={side === 'buy' ? 'default' : 'outline'}
                  onClick={() => setSide('buy')}
                  className={side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50'}
                >
                  Buy BTC
                </Button>
                <Button
                  variant={side === 'sell' ? 'default' : 'outline'}
                  onClick={() => setSide('sell')}
                  className={side === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50'}
                >
                  Sell BTC
                </Button>
              </div>

              {/* Price Input (for limit orders) */}
              {orderType === 'limit' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price ({currentPairData?.quoteAsset})</label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pr-16"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs text-gray-500">{currentPairData?.quoteAsset}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Amount (BTC)</label>
                  <Button variant="ghost" size="sm" onClick={setMaxAmount} className="text-xs">
                    MAX
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.00000001"
                    placeholder="0.00000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-12"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500">BTC</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Total ({currentPairData?.quoteAsset})</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    className="pr-16"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500">{currentPairData?.quoteAsset}</span>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium">Advanced Options</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">Stop Loss</Button>
                    <Button variant="outline" size="sm">Take Profit</Button>
                  </div>
                </div>
              )}

              {/* Order Progress */}
              {loading && (
                <div className="space-y-2">
                  <Progress value={orderProgress} className="h-2" />
                  <p className="text-xs text-center text-gray-500">
                    Processing order... {orderProgress}%
                  </p>
                </div>
              )}

              {/* Place Order Button */}
              <Button
                onClick={placeOrder}
                disabled={loading || !amount || (orderType === 'limit' && !price)}
                className={`w-full font-semibold py-3 ${
                  side === 'buy' 
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
                    <Target className="h-4 w-4 mr-2" />
                    {side === 'buy' ? 'Buy' : 'Sell'} BTC
                  </>
                )}
              </Button>

              {/* Order Summary */}
              {amount && (orderType === 'market' || price) && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Order Type:</span>
                    <span className="font-medium capitalize">{orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Side:</span>
                    <span className={`font-medium capitalize ${side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {side}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{formatBTC(parseFloat(amount))} BTC</span>
                  </div>
                  {orderType === 'limit' && (
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(price))}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span>Estimated Total:</span>
                    <span className="font-bold">
                      {formatCurrency(parseFloat(total))} {currentPairData?.quoteAsset}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {userOrders.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No active orders</p>
                ) : (
                  userOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                      <div>
                        <span className={`font-medium ${order.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {order.side.toUpperCase()}
                        </span>
                        <span className="ml-2">{formatBTC(order.amount)} BTC</span>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(order.price)}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelOrder(order.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBitcoinTrading;

