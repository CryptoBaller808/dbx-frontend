/**
 * Bitcoin Wallet Component
 * React component for Bitcoin wallet management and operations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Wallet, 
  Send, 
  Receive, 
  History, 
  QrCode, 
  Copy, 
  ExternalLink,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import QRCodeDisplay from '../ui/QRCodeDisplay';
import TransactionHistory from '../ui/TransactionHistory';
import { formatCurrency, formatBTC, truncateAddress } from '../../utils/formatters';

const BitcoinWallet = ({ userId, onTransactionUpdate }) => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState({ confirmed: 0, unconfirmed: 0, total: 0 });
  const [price, setPrice] = useState({ price: 0, change24h: 0 });
  const [transactions, setTransactions] = useState([]);
  const [utxos, setUtxos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendForm, setSendForm] = useState({ address: '', amount: '', feeRate: 'standard' });
  const [fees, setFees] = useState({ slow: 1, standard: 5, fast: 10 });
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize Bitcoin wallet
  useEffect(() => {
    if (userId) {
      initializeBitcoinWallet();
      fetchBitcoinPrice();
      const interval = setInterval(fetchBitcoinPrice, 30000); // Update price every 30 seconds
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Auto-refresh wallet data
  useEffect(() => {
    if (wallet) {
      const interval = setInterval(() => {
        syncWalletBalance();
        fetchTransactionHistory();
      }, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [wallet]);

  const initializeBitcoinWallet = async () => {
    try {
      setLoading(true);
      
      // Check if user already has a Bitcoin wallet
      const response = await fetch(`/api/bitcoin/wallet/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const walletData = await response.json();
        setWallet(walletData.data);
        setBalance(walletData.data.balance);
        await fetchTransactionHistory();
        await fetchUTXOs();
      } else {
        // Create new wallet if none exists
        await createBitcoinWallet();
      }
    } catch (error) {
      console.error('Failed to initialize Bitcoin wallet:', error);
      toast.error('Failed to initialize Bitcoin wallet');
    } finally {
      setLoading(false);
    }
  };

  const createBitcoinWallet = async () => {
    try {
      const response = await fetch('/api/bitcoin/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        const result = await response.json();
        setWallet(result.data);
        toast.success('Bitcoin wallet created successfully!');
      } else {
        throw new Error('Failed to create Bitcoin wallet');
      }
    } catch (error) {
      console.error('Failed to create Bitcoin wallet:', error);
      toast.error('Failed to create Bitcoin wallet');
    }
  };

  const syncWalletBalance = async () => {
    if (!wallet) return;

    try {
      const response = await fetch(`/api/bitcoin/wallet/${wallet.walletId}/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const result = await response.json();
        setBalance(result.data.balance);
      }
    } catch (error) {
      console.error('Failed to sync wallet balance:', error);
    }
  };

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('/api/bitcoin/trading/price/USDT');
      if (response.ok) {
        const result = await response.json();
        setPrice(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch Bitcoin price:', error);
    }
  };

  const fetchTransactionHistory = async () => {
    if (!wallet) return;

    try {
      const response = await fetch(`/api/bitcoin/wallet/${wallet.walletId}/transactions?limit=20`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const result = await response.json();
        setTransactions(result.data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    }
  };

  const fetchUTXOs = async () => {
    if (!wallet) return;

    try {
      const response = await fetch(`/api/bitcoin/wallet/${wallet.walletId}/utxos`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const result = await response.json();
        setUtxos(result.data.utxos);
      }
    } catch (error) {
      console.error('Failed to fetch UTXOs:', error);
    }
  };

  const estimateTransactionFees = async () => {
    if (!wallet || !sendForm.address || !sendForm.amount) return;

    try {
      const response = await fetch('/api/bitcoin/transaction/estimate-fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          walletId: wallet.walletId,
          toAddress: sendForm.address,
          amount: parseFloat(sendForm.amount)
        })
      });

      if (response.ok) {
        const result = await response.json();
        setFees(result.data);
      }
    } catch (error) {
      console.error('Failed to estimate fees:', error);
    }
  };

  const sendBitcoin = async () => {
    if (!wallet || !sendForm.address || !sendForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const feeRate = fees[sendForm.feeRate]?.feeRate || fees.standard.feeRate;
      
      const response = await fetch('/api/bitcoin/transaction/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          walletId: wallet.walletId,
          toAddress: sendForm.address,
          amount: parseFloat(sendForm.amount),
          feeRate
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Bitcoin sent successfully! TX: ${result.data.txid.substring(0, 10)}...`);
        setSendForm({ address: '', amount: '', feeRate: 'standard' });
        await syncWalletBalance();
        await fetchTransactionHistory();
        
        if (onTransactionUpdate) {
          onTransactionUpdate(result.data);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Failed to send Bitcoin:', error);
      toast.error(`Failed to send Bitcoin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success('Address copied to clipboard!');
    }
  };

  const generateQRCode = async () => {
    if (!wallet) return;

    try {
      const response = await fetch(`/api/bitcoin/wallet/${wallet.walletId}/qr`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const result = await response.json();
        setShowQR(result.data);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const validateAddress = async (address) => {
    try {
      const response = await fetch('/api/bitcoin/validate-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });

      if (response.ok) {
        const result = await response.json();
        return result.data.isValid;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleAddressChange = async (address) => {
    setSendForm(prev => ({ ...prev, address }));
    
    if (address.length > 25) {
      const isValid = await validateAddress(address);
      if (!isValid) {
        toast.error('Invalid Bitcoin address');
      }
    }
  };

  const handleAmountChange = (amount) => {
    setSendForm(prev => ({ ...prev, amount }));
    
    if (amount && sendForm.address) {
      estimateTransactionFees();
    }
  };

  if (loading && !wallet) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-lg">Initializing Bitcoin wallet...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Bitcoin Wallet Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bitcoin className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">Bitcoin Wallet</CardTitle>
                <p className="text-orange-100">The King of Cryptocurrencies</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={syncWalletBalance}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance */}
            <div className="text-center">
              <p className="text-orange-200 text-sm">Total Balance</p>
              <p className="text-3xl font-bold">{formatBTC(balance.total)} BTC</p>
              <p className="text-orange-200 text-sm">
                ≈ ${formatCurrency(balance.total * price.price)}
              </p>
            </div>
            
            {/* Price */}
            <div className="text-center">
              <p className="text-orange-200 text-sm">Bitcoin Price</p>
              <p className="text-2xl font-bold">${formatCurrency(price.price)}</p>
              <div className="flex items-center justify-center space-x-1">
                {price.change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-300" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-300" />
                )}
                <span className={`text-sm ${price.change24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {price.change24h >= 0 ? '+' : ''}{price.change24h?.toFixed(2)}%
                </span>
              </div>
            </div>
            
            {/* Address */}
            <div className="text-center">
              <p className="text-orange-200 text-sm">Wallet Address</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <code className="text-sm bg-black/20 px-2 py-1 rounded">
                  {wallet?.address ? truncateAddress(wallet.address) : 'Loading...'}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bitcoin Wallet Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
          <TabsTrigger value="receive">Receive</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Balance Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Confirmed</span>
                  <div className="text-right">
                    <p className="font-semibold">{formatBTC(balance.confirmed)} BTC</p>
                    <p className="text-sm text-gray-500">
                      ${formatCurrency(balance.confirmed * price.price)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unconfirmed</span>
                  <div className="text-right">
                    <p className="font-semibold">{formatBTC(balance.unconfirmed)} BTC</p>
                    <p className="text-sm text-gray-500">
                      ${formatCurrency(balance.unconfirmed * price.price)}
                    </p>
                  </div>
                </div>
                <hr />
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <div className="text-right">
                    <p>{formatBTC(balance.total)} BTC</p>
                    <p className="text-sm text-gray-500">
                      ${formatCurrency(balance.total * price.price)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UTXOs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>UTXOs ({utxos.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {utxos.length > 0 ? (
                    utxos.map((utxo, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-mono">
                            {utxo.txid.substring(0, 8)}...:{utxo.vout}
                          </p>
                          <p className="text-xs text-gray-500">
                            {utxo.confirmations} confirmations
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatBTC(utxo.value)} BTC</p>
                          <Badge variant={utxo.spendable ? "success" : "secondary"}>
                            {utxo.spendable ? "Spendable" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No UTXOs found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Send Tab */}
        <TabsContent value="send" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Send Bitcoin</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Address</label>
                <Input
                  placeholder="Enter Bitcoin address (bc1...)"
                  value={sendForm.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amount (BTC)</label>
                <Input
                  type="number"
                  step="0.00000001"
                  placeholder="0.00000000"
                  value={sendForm.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
                {sendForm.amount && (
                  <p className="text-sm text-gray-500 mt-1">
                    ≈ ${formatCurrency(parseFloat(sendForm.amount) * price.price)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Transaction Speed</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(fees).map(([speed, feeData]) => (
                    <Button
                      key={speed}
                      variant={sendForm.feeRate === speed ? "default" : "outline"}
                      onClick={() => setSendForm(prev => ({ ...prev, feeRate: speed }))}
                      className="flex flex-col p-4 h-auto"
                    >
                      <span className="font-semibold capitalize">{speed}</span>
                      <span className="text-xs">{feeData.feeRate} sat/vB</span>
                      <span className="text-xs">≈{feeData.fee} BTC</span>
                      <span className="text-xs text-gray-500">{feeData.estimatedTime}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={sendBitcoin} 
                disabled={loading || !sendForm.address || !sendForm.amount}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Bitcoin
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receive Tab */}
        <TabsContent value="receive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receive className="h-5 w-5" />
                <span>Receive Bitcoin</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Share this address to receive Bitcoin payments
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-mono text-sm break-all">{wallet?.address}</p>
                </div>

                <div className="flex space-x-2 justify-center mb-4">
                  <Button variant="outline" onClick={copyAddress}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Address
                  </Button>
                  <Button variant="outline" onClick={generateQRCode}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>

                {showQR && (
                  <div className="flex justify-center">
                    <QRCodeDisplay 
                      value={showQR.uri}
                      size={200}
                      title="Bitcoin Address"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Transaction History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionHistory 
                transactions={transactions}
                currency="BTC"
                onTransactionClick={(tx) => {
                  window.open(`https://blockstream.info/tx/${tx.txid}`, '_blank');
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BitcoinWallet;

