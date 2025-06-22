/**
 * Bitcoin Swap Component
 * One-click Bitcoin swap interface with cross-chain support
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  ArrowUpDown, 
  Bitcoin, 
  Zap, 
  Settings, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatBTC, formatPercentage } from '../../utils/formatters';

const BitcoinSwap = ({ userId, onSwapComplete }) => {
  const [fromToken, setFromToken] = useState({ symbol: 'BTC', balance: 0, decimals: 8 });
  const [toToken, setToToken] = useState({ symbol: 'USDT', balance: 0, decimals: 6 });
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [swapRoute, setSwapRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [swapStatus, setSwapStatus] = useState(null);

  const supportedTokens = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'orange', balance: 0.5 },
    { symbol: 'USDT', name: 'Tether USD', icon: '₮', color: 'green', balance: 10000 },
    { symbol: 'USDC', name: 'USD Coin', icon: '$', color: 'blue', balance: 5000 },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'purple', balance: 2.5 },
    { symbol: 'XRP', name: 'XRP', icon: '◉', color: 'blue', balance: 1000 },
    { symbol: 'XLM', name: 'Stellar', icon: '✦', color: 'cyan', balance: 500 },
    { symbol: 'AVAX', name: 'Avalanche', icon: '▲', color: 'red', balance: 10 },
    { symbol: 'MATIC', name: 'Polygon', icon: '⬟', color: 'purple', balance: 100 },
    { symbol: 'SOL', name: 'Solana', icon: '◎', color: 'gradient', balance: 5 },
    { symbol: 'XDC', name: 'XDC Network', icon: '◈', color: 'blue', balance: 1000 }
  ];

  // Auto-quote when amounts change
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      getSwapQuote();
    } else {
      setToAmount('');
      setSwapRoute(null);
    }
  }, [fromAmount, fromToken.symbol, toToken.symbol, slippage]);

  const getSwapQuote = async () => {
    try {
      setQuoting(true);
      
      const response = await fetch('/api/bitcoin/trading/calculate-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fromAsset: fromToken.symbol,
          toAsset: toToken.symbol,
          amount: parseFloat(fromAmount)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSwapRoute(result.data);
        setToAmount(result.data.estimatedOutput.toString());
      } else {
        throw new Error('Failed to get quote');
      }
    } catch (error) {
      console.error('Failed to get swap quote:', error);
      toast.error('Failed to get swap quote');
    } finally {
      setQuoting(false);
    }
  };

  const executeSwap = async () => {
    if (!fromAmount || !toAmount || !swapRoute) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setSwapStatus('pending');

      const response = await fetch('/api/bitcoin/trading/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fromWalletId: `${userId}_${fromToken.symbol}`,
          toWalletId: `${userId}_${toToken.symbol}`,
          fromAmount: parseFloat(fromAmount),
          toPair: `${fromToken.symbol}/${toToken.symbol}`,
          slippage
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSwapStatus('completed');
        toast.success(`Swap completed! Received ${formatCurrency(result.data.toAmount)} ${toToken.symbol}`);
        
        // Reset form
        setFromAmount('');
        setToAmount('');
        setSwapRoute(null);
        
        if (onSwapComplete) {
          onSwapComplete(result.data);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Swap failed:', error);
      setSwapStatus('failed');
      toast.error(`Swap failed: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setSwapStatus(null), 3000);
    }
  };

  const swapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const setMaxAmount = () => {
    const maxAmount = fromToken.balance * 0.99; // Leave 1% for fees
    setFromAmount(maxAmount.toString());
  };

  const getTokenIcon = (token) => {
    const tokenData = supportedTokens.find(t => t.symbol === token.symbol);
    return tokenData?.icon || '?';
  };

  const getTokenColor = (token) => {
    const tokenData = supportedTokens.find(t => t.symbol === token.symbol);
    return tokenData?.color || 'gray';
  };

  const slippageOptions = [0.1, 0.5, 1.0, 2.0];

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Bitcoin Swap Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bitcoin className="h-6 w-6" />
              <CardTitle className="text-lg">Bitcoin Swap</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-orange-100 text-sm">Instant cross-chain swaps</p>
        </CardHeader>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Swap Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Slippage Tolerance</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {slippageOptions.map((option) => (
                  <Button
                    key={option}
                    variant={slippage === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlippage(option)}
                  >
                    {option}%
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                className="text-sm"
                placeholder="Custom %"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Swap Interface */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">From</label>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Wallet className="h-3 w-3" />
                <span>Balance: {formatBTC(fromToken.balance)} {fromToken.symbol}</span>
              </div>
            </div>
            
            <div className="relative">
              <Input
                type="number"
                step="0.00000001"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="pr-24 text-lg font-semibold"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={setMaxAmount}>
                  MAX
                </Button>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded bg-${getTokenColor(fromToken)}-100`}>
                  <span className="text-lg">{getTokenIcon(fromToken)}</span>
                  <span className="font-semibold">{fromToken.symbol}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapTokens}
              className="rounded-full p-2 border-2 hover:bg-gray-50"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">To</label>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Wallet className="h-3 w-3" />
                <span>Balance: {formatCurrency(toToken.balance)} {toToken.symbol}</span>
              </div>
            </div>
            
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="pr-20 text-lg font-semibold bg-gray-50"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded bg-${getTokenColor(toToken)}-100`}>
                  <span className="text-lg">{getTokenIcon(toToken)}</span>
                  <span className="font-semibold">{toToken.symbol}</span>
                </div>
              </div>
              
              {quoting && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Swap Details */}
          {swapRoute && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate</span>
                <span className="font-semibold">
                  1 {fromToken.symbol} = {formatCurrency(swapRoute.estimatedOutput / parseFloat(fromAmount))} {toToken.symbol}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="font-semibold">
                  {swapRoute.route.join(' → ')} ({swapRoute.hops} hop{swapRoute.hops > 1 ? 's' : ''})
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Price Impact</span>
                <span className={`font-semibold ${swapRoute.priceImpact > 1 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatPercentage(swapRoute.priceImpact)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Fee</span>
                <span className="font-semibold">{formatPercentage(swapRoute.fee)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Received</span>
                <span className="font-semibold">
                  {formatCurrency(swapRoute.estimatedOutput * (1 - slippage / 100))} {toToken.symbol}
                </span>
              </div>
            </div>
          )}

          {/* Swap Status */}
          {swapStatus && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              swapStatus === 'pending' ? 'bg-yellow-50 text-yellow-800' :
              swapStatus === 'completed' ? 'bg-green-50 text-green-800' :
              'bg-red-50 text-red-800'
            }`}>
              {swapStatus === 'pending' && <Clock className="h-4 w-4 animate-pulse" />}
              {swapStatus === 'completed' && <CheckCircle className="h-4 w-4" />}
              {swapStatus === 'failed' && <AlertTriangle className="h-4 w-4" />}
              <span className="text-sm font-medium">
                {swapStatus === 'pending' && 'Swap in progress...'}
                {swapStatus === 'completed' && 'Swap completed successfully!'}
                {swapStatus === 'failed' && 'Swap failed. Please try again.'}
              </span>
            </div>
          )}

          {/* Swap Button */}
          <Button 
            onClick={executeSwap}
            disabled={loading || !fromAmount || !toAmount || !swapRoute || quoting}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Swapping...
              </>
            ) : quoting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Getting Quote...
              </>
            ) : !fromAmount || parseFloat(fromAmount) === 0 ? (
              'Enter Amount'
            ) : !swapRoute ? (
              'No Route Found'
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Swap {fromToken.symbol} to {toToken.symbol}
              </>
            )}
          </Button>

          {/* Warnings */}
          {swapRoute && swapRoute.priceImpact > 3 && (
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                High price impact ({formatPercentage(swapRoute.priceImpact)}). Consider reducing swap amount.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Swap Pairs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Popular Bitcoin Pairs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {['BTC/USDT', 'BTC/ETH', 'BTC/XRP', 'BTC/SOL'].map((pair) => {
              const [base, quote] = pair.split('/');
              return (
                <Button
                  key={pair}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFromToken({ symbol: base, balance: supportedTokens.find(t => t.symbol === base)?.balance || 0 });
                    setToToken({ symbol: quote, balance: supportedTokens.find(t => t.symbol === quote)?.balance || 0 });
                  }}
                  className="flex items-center space-x-1"
                >
                  <span className="text-xs">{getTokenIcon({ symbol: base })}</span>
                  <span className="text-xs">{getTokenIcon({ symbol: quote })}</span>
                  <span className="text-xs font-semibold">{pair}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BitcoinSwap;

