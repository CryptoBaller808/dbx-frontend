/**
 * DBX Wallet Adapters Index
 * Exports all wallet adapters and manager
 * 
 * @version 2.1.0
 * @author DBX Development Team
 */

export { default as MetaMaskAdapter } from './MetaMaskAdapter';
export { default as PhantomAdapter } from './PhantomAdapter';
export { default as XDCAdapter } from './XDCAdapter';
export { default as BitcoinAdapter } from './BitcoinAdapter';
export { default as WalletManager } from './WalletManager';

// Wallet types constants
export const WALLET_TYPES = {
  METAMASK: 'metamask',
  PHANTOM: 'phantom',
  XDCPAY: 'xdcpay',
  UNISAT: 'unisat',
  OKX: 'okx',
  XVERSE: 'xverse',
  XUMM: 'xumm',
  FREIGHTER: 'freighter'
};

// Network categories
export const NETWORK_CATEGORIES = {
  EVM: 'EVM',
  SOLANA: 'Solana',
  UTXO: 'UTXO',
  ACCOUNT: 'Account'
};

// Wallet installation URLs
export const WALLET_INSTALL_URLS = {
  [WALLET_TYPES.METAMASK]: 'https://metamask.io/',
  [WALLET_TYPES.PHANTOM]: 'https://phantom.app/',
  [WALLET_TYPES.XDCPAY]: 'https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo',
  [WALLET_TYPES.UNISAT]: 'https://unisat.io/',
  [WALLET_TYPES.OKX]: 'https://www.okx.com/web3',
  [WALLET_TYPES.XVERSE]: 'https://www.xverse.app/',
  [WALLET_TYPES.XUMM]: 'https://xumm.app/',
  [WALLET_TYPES.FREIGHTER]: 'https://freighter.app/'
};

