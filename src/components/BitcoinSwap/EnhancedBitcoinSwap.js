/**
 * Enhanced Bitcoin Swap Component
 * Optimized with improved responsiveness, animations, and user experience
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
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
  Wallet,
  Info,
  ExternalLink,
  Shield,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatBTC, formatPercentage } from '../../utils/formatters';

const EnhancedBitcoinSwap = ({ userId, onSwapComplete }) => {
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
  const [swapProgress, setSwapProgress] = useState(0);
  const [networkFees, setNetworkFees] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const supportedTokens = useMemo(() => [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'orange', balance: 0.5, network: 'Bitcoin' },
    { symbol: 'USDT', name: 'Tether USD', icon: '₮', color: 'green', balance: 10000, network: 'Multi-chain' },
    { symbol: 'USDC', name: 'USD Coin', icon: '$', color: 'blue', balance: 5000, network: 'Multi-chain' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'purple', balance: 2.5, network: 'Ethereum' },
    { symbol: 'XRP', name: 'XRP', icon: '◉', color: 'blue', balance: 1000, network: 'XRP Ledger' },
    { symbol: 'XLM', name: 'Stellar', icon: '✦', color: 'cyan', balance: 500, network: 'Stellar' },
    { symbol: 'AVAX', name: 'Avalanche', icon: '▲', color: 'red', balance: 10, network: 'Avalanche' },
    { symbol: 'MATIC', name: 'Polygon', icon: '⬟', color: 'purple', balance: 100, network: 'Polygon' },
    { symbol: 'SOL', name: 'Solana', icon: '◎', color: 'gradient', balance: 5, network: 'Solana' },
    { symbol: 'XDC', name: 'XDC Network', icon: '◈', color: 'blue', balance: 1000, network: 'XDC' }
  ], []);

  // Debounced quote fetching
  const debouncedGetQuote = useCallback(
    debounce(() => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        getSwapQuote();
      }
    }, 500),
    [fromAmount, fromToken.symbol, toToken.symbol, slippage]
  );

  useEffect(() => {
    debouncedGetQuote();
    return debouncedGetQuote.cancel;
  }, [debouncedGetQuote]);

  // Enhanced quote fetching with network fee estimation
  const getSwapQuote = async () => {
    try {
      setQuoting(true);
      
      // Parallel requests for quote and network fees
      const [quoteResponse, feesResponse] = await Promise.all([
        fetch('/api/bitcoin/trading/calculate-route', {
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
        }),
        fetch('/api/bitcoin/fees/estimate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (quoteResponse.ok && feesResponse.ok) {
        const [quoteResult, feesResult] = await Promise.all([
          quoteResponse.json(),
          feesResponse.json()
        ]);
        
        setSwapRoute(quoteResult.data);
        setNetworkFees(feesResult.data);
        setToAmount(quoteResult.data.estimatedOutput.toString());
        
        // Add smooth animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      } else {
        throw new Error('Failed to get quote or fees');
      }
    } catch (error) {
      console.error('Failed to get swap quote:', error);
      toast.error('Failed to get swap quote');
      setSwapRoute(null);
      setToAmount('');
    } finally {
      setQuoting(false);
    }
  };

  // Enhanced swap execution with progress tracking
  const executeSwap = async () => {
    if (!fromAmount || !toAmount || !swapRoute) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setSwapStatus('pending');
      setSwapProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSwapProgress(prev => Math.min(prev + 10, 90));
      }, 200);

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
          slippage,
          networkFees: networkFees
        })
      });

      clearInterval(progressInterval);
      setSwapProgress(100);

      if (response.ok) {
        const result = await response.json();
        setSwapStatus('completed');
        
        // Enhanced success notification
        toast.success(
          `🎉 Swap completed! Received ${formatCurrency(result.data.toAmount)} ${toToken.symbol}`,
          { duration: 5000 }
        );
        
        // Reset form with animation
        setTimeout(() => {
          setFromAmount('');
          setToAmount('');
          setSwapRoute(null);
          setNetworkFees(null);
          setSwapProgress(0);
        }, 2000);
        
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
      setSwapProgress(0);
      toast.error(`Swap failed: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setSwapStatus(null), 5000);
    }
  };

  // Enhanced token swapping with animation
  const swapTokens = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      const tempToken = fromToken;
      setFromToken(toToken);
      setToToken(tempToken);
      setFromAmount(toAmount);
      setToAmount(fromAmount);
      setIsAnimating(false);
    }, 150);
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

  const getTokenNetwork = (token) => {
    const tokenData = supportedTokens.find(t => t.symbol === token.symbol);
    return tokenData?.network || 'Unknown';
  };

  const slippageOptions = [0.1, 0.5, 1.0, 2.0];

  // Calculate price impact color
  const getPriceImpactColor = (impact) => {
    if (impact < 1) return 'text-green-600';
    if (impact < 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Format network fee display
  const formatNetworkFee = (fees) => {
    if (!fees) return 'Calculating...';
    
    if (fromToken.symbol === 'BTC') {
      return `${formatBTC(fees.bitcoin)} BTC (~$${formatCurrency(fees.bitcoin * 45000)})`;
    }
    
    return `~$${formatCurrency(fees.estimated)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Enhanced Bitcoin Swap Header */}
      <Card className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 animate-pulse"></div>
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bitcoin className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>Bitcoin Swap</span>
                  <Sparkles className="h-4 w-4" />
                </CardTitle>
                <p className="text-orange-100 text-xs">Lightning-fast cross-chain swaps</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:bg-white/20 transition-all duration-200"
            >
              <Settings className={`h-4 w-4 transition-transform duration-200 ${showSettings ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Settings Panel */}
      {showSettings && (
        <Card className="animate-in slide-in-from-top-2 duration-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Advanced Settings</span>
            </CardTitle>
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
                    className="transition-all duration-200 hover:scale-105"
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
                className="text-sm transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                placeholder="Custom %"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher slippage = faster execution, but potentially worse price
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Swap Interface */}
      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">From</label>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Wallet className="h-3 w-3" />
                <span>Balance: {formatBTC(fromToken.balance)} {fromToken.symbol}</span>
                <Badge variant="outline" className="text-xs">
                  {getTokenNetwork(fromToken)}
                </Badge>
              </div>
            </div>
            
            <div className={`relative transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}>
              <Input
                type="number"
                step="0.00000001"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="pr-32 text-lg font-semibold transition-all duration-200 focus:ring-2 focus:ring-orange-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={setMaxAmount}
                  className="text-xs hover:bg-orange-100 transition-colors duration-200"
                >
                  MAX
                </Button>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded bg-${getTokenColor(fromToken)}-100 transition-all duration-200`}>
                  <span className="text-lg">{getTokenIcon(fromToken)}</span>
                  <span className="font-semibold text-sm">{fromToken.symbol}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapTokens}
              className="rounded-full p-3 border-2 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:scale-110"
            >
              <ArrowUpDown className={`h-4 w-4 transition-transform duration-200 ${isAnimating ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">To</label>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Wallet className="h-3 w-3" />
                <span>Balance: {formatCurrency(toToken.balance)} {toToken.symbol}</span>
                <Badge variant="outline" className="text-xs">
                  {getTokenNetwork(toToken)}
                </Badge>
              </div>
            </div>
            
            <div className={`relative transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}>
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="pr-24 text-lg font-semibold bg-gray-50 transition-all duration-200"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded bg-${getTokenColor(toToken)}-100 transition-all duration-200`}>
                  <span className="text-lg">{getTokenIcon(toToken)}</span>
                  <span className="font-semibold text-sm">{toToken.symbol}</span>
                </div>
              </div>
              
              {quoting && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <RefreshCw className="h-4 w-4 animate-spin text-orange-500" />
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Swap Details */}
          {swapRoute && (
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg p-4 space-y-3 text-sm border border-orange-100 transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Exchange Rate</span>
                </span>
                <span className="font-semibold">
                  1 {fromToken.symbol} = {formatCurrency(swapRoute.estimatedOutput / parseFloat(fromAmount))} {toToken.symbol}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Route</span>
                <span className="font-semibold text-xs">
                  {swapRoute.route.join(' → ')} ({swapRoute.hops} hop{swapRoute.hops > 1 ? 's' : ''})
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price Impact</span>
                <span className={`font-semibold ${getPriceImpactColor(swapRoute.priceImpact)}`}>
                  {formatPercentage(swapRoute.priceImpact)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Network Fee</span>
                <span className="font-semibold text-xs">
                  {formatNetworkFee(networkFees)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-semibold">{formatPercentage(swapRoute.fee)}</span>
              </div>
              
              <div className="border-t border-orange-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Minimum Received</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(swapRoute.estimatedOutput * (1 - slippage / 100))} {toToken.symbol}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Swap Status */}
          {swapStatus && (
            <div className={`transition-all duration-300 p-4 rounded-lg ${
              swapStatus === 'pending' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
              swapStatus === 'completed' ? 'bg-green-50 text-green-800 border border-green-200' :
              'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center space-x-3">
                {swapStatus === 'pending' && <Clock className="h-5 w-5 animate-pulse" />}
                {swapStatus === 'completed' && <CheckCircle className="h-5 w-5" />}
                {swapStatus === 'failed' && <AlertTriangle className="h-5 w-5" />}
                <div className="flex-1">
                  <span className="text-sm font-medium block">
                    {swapStatus === 'pending' && 'Processing your swap...'}
                    {swapStatus === 'completed' && 'Swap completed successfully!'}
                    {swapStatus === 'failed' && 'Swap failed. Please try again.'}
                  </span>
                  {swapStatus === 'pending' && (
                    <div className="mt-2">
                      <Progress value={swapProgress} className="h-2" />
                      <span className="text-xs text-yellow-600 mt-1 block">
                        {swapProgress}% complete
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Swap Button */}
          <Button 
            onClick={executeSwap}
            disabled={loading || !fromAmount || !toAmount || !swapRoute || quoting}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-4 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
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

          {/* Enhanced Warnings */}
          {swapRoute && swapRoute.priceImpact > 3 && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 animate-in slide-in-from-top-1">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium block">High Price Impact Warning</span>
                <span className="text-xs">
                  This swap has a {formatPercentage(swapRoute.priceImpact)} price impact. 
                  Consider reducing the swap amount or splitting into smaller trades.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Quick Swap Pairs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <Bitcoin className="h-4 w-4 text-orange-500" />
            <span>Popular Bitcoin Pairs</span>
          </CardTitle>
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
                    setFromToken({ 
                      symbol: base, 
                      balance: supportedTokens.find(t => t.symbol === base)?.balance || 0,
                      decimals: 8 
                    });
                    setToToken({ 
                      symbol: quote, 
                      balance: supportedTokens.find(t => t.symbol === quote)?.balance || 0,
                      decimals: supportedTokens.find(t => t.symbol === quote)?.symbol === 'BTC' ? 8 : 6
                    });
                  }}
                  className="flex items-center space-x-1 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-xs">{getTokenIcon({ symbol: base })}</span>
                  <span className="text-xs">{getTokenIcon({ symbol: quote })}</span>
                  <span className="text-xs font-medium">{pair}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  const debounced = function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  debounced.cancel = function() {
    clearTimeout(timeout);
  };
  
  return debounced;
}

export default EnhancedBitcoinSwap;

