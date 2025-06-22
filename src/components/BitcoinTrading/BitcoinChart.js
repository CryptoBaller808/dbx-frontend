/**
 * Bitcoin Chart Component
 * Interactive price chart for Bitcoin with multiple timeframes
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatBTC, formatPercentage } from '../../utils/formatters';

const BitcoinChart = ({ pair = 'BTC/USDT', height = 400 }) => {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('1D');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    change: 0
  });
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const timeframes = [
    { label: '1H', value: '1H', interval: '1m' },
    { label: '4H', value: '4H', interval: '5m' },
    { label: '1D', value: '1D', interval: '1h' },
    { label: '1W', value: '1W', interval: '4h' },
    { label: '1M', value: '1M', interval: '1d' }
  ];

  useEffect(() => {
    fetchChartData();
  }, [pair, timeframe]);

  useEffect(() => {
    if (chartData.length > 0) {
      drawChart();
    }
  }, [chartData, height]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from your API
      // For now, we'll generate mock data
      const mockData = generateMockChartData();
      setChartData(mockData);
      
      // Calculate stats
      if (mockData.length > 0) {
        const latest = mockData[mockData.length - 1];
        const first = mockData[0];
        const high = Math.max(...mockData.map(d => d.high));
        const low = Math.min(...mockData.map(d => d.low));
        const volume = mockData.reduce((sum, d) => sum + d.volume, 0);
        const change = ((latest.close - first.open) / first.open) * 100;

        setStats({
          open: first.open,
          high,
          low,
          close: latest.close,
          volume,
          change
        });
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockChartData = () => {
    const now = Date.now();
    const intervals = {
      '1H': { count: 60, step: 60000 },
      '4H': { count: 48, step: 300000 },
      '1D': { count: 24, step: 3600000 },
      '1W': { count: 168, step: 3600000 },
      '1M': { count: 30, step: 86400000 }
    };

    const { count, step } = intervals[timeframe];
    const data = [];
    let price = 45000 + Math.random() * 10000; // Base price around $45-55k

    for (let i = 0; i < count; i++) {
      const timestamp = now - (count - i) * step;
      const volatility = 0.02; // 2% volatility
      
      const open = price;
      const change = (Math.random() - 0.5) * volatility * price;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 0.01 * price;
      const low = Math.min(open, close) - Math.random() * 0.01 * price;
      const volume = Math.random() * 100 + 50;

      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume
      });

      price = close;
    }

    return data;
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || chartData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = height - padding * 2;

    // Calculate price range
    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (chartWidth / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Draw candlesticks
    const candleWidth = chartWidth / chartData.length * 0.8;
    
    chartData.forEach((candle, index) => {
      const x = padding + (chartWidth / chartData.length) * index + (chartWidth / chartData.length - candleWidth) / 2;
      const openY = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      const highY = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

      const isGreen = candle.close > candle.open;
      
      // Draw wick
      ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Draw body
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillRect(x, bodyTop, candleWidth, Math.max(bodyHeight, 1));
    });

    // Draw price labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (priceRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(`$${formatCurrency(price)}`, padding - 5, y + 4);
    }

    // Draw time labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= 6; i++) {
      const dataIndex = Math.floor((chartData.length - 1) / 6 * i);
      if (chartData[dataIndex]) {
        const x = padding + (chartWidth / 6) * i;
        const time = new Date(chartData[dataIndex].timestamp);
        const label = timeframe === '1H' || timeframe === '4H' 
          ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.fillText(label, x, height - 10);
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          <span className="font-semibold">{pair}</span>
          <Badge variant={stats.change >= 0 ? "success" : "destructive"}>
            {stats.change >= 0 ? '+' : ''}{formatPercentage(stats.change)}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf.value)}
              >
                {tf.label}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={fetchChartData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="outline" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Open</p>
          <p className="font-semibold">${formatCurrency(stats.open)}</p>
        </div>
        <div>
          <p className="text-gray-500">High</p>
          <p className="font-semibold text-green-600">${formatCurrency(stats.high)}</p>
        </div>
        <div>
          <p className="text-gray-500">Low</p>
          <p className="font-semibold text-red-600">${formatCurrency(stats.low)}</p>
        </div>
        <div>
          <p className="text-gray-500">Close</p>
          <p className="font-semibold">${formatCurrency(stats.close)}</p>
        </div>
        <div>
          <p className="text-gray-500">Volume</p>
          <p className="font-semibold">{formatBTC(stats.volume)} BTC</p>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative bg-white border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ height: `${height}px` }}
        />
        
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin text-orange-500" />
              <span>Loading chart data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Price Up</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Price Down</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-1 bg-gray-400 rounded"></div>
          <span>Wick (High/Low)</span>
        </div>
      </div>
    </div>
  );
};

export default BitcoinChart;

