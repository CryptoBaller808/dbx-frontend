/**
 * DBX Blockchain Tooltip Component
 * Educational tooltips explaining blockchain networks and assets
 * 
 * @version 3.0.0
 * @author DBX Development Team
 */

import React, { useState } from 'react';
import { OverlayTrigger, Tooltip, Badge, Modal, Button } from 'react-bootstrap';
import { InfoCircleOutlined, QuestionCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { SUPPORTED_NETWORKS } from '../config/networks';
import './BlockchainTooltips.css';

// Network Information Database
const NETWORK_INFO = {
  'BTC': {
    name: 'Bitcoin',
    description: 'The first and most well-known cryptocurrency, Bitcoin is a decentralized digital currency that operates on a peer-to-peer network.',
    type: 'Layer 1 Blockchain',
    consensus: 'Proof of Work (PoW)',
    blockTime: '~10 minutes',
    features: ['Digital Gold', 'Store of Value', 'Peer-to-Peer Payments'],
    useCases: ['Digital payments', 'Store of value', 'Hedge against inflation'],
    pros: ['Most secure network', 'Highest liquidity', 'Widely accepted'],
    cons: ['High transaction fees', 'Slow transaction times', 'Energy intensive'],
    website: 'https://bitcoin.org',
    explorer: 'https://blockstream.info',
    whitepaper: 'https://bitcoin.org/bitcoin.pdf'
  },
  'ETH': {
    name: 'Ethereum',
    description: 'A decentralized platform that enables smart contracts and decentralized applications (DApps) to be built and run without downtime, fraud, or interference.',
    type: 'Layer 1 Blockchain',
    consensus: 'Proof of Stake (PoS)',
    blockTime: '~12 seconds',
    features: ['Smart Contracts', 'DApps', 'DeFi Ecosystem'],
    useCases: ['DeFi protocols', 'NFT marketplace', 'Smart contracts', 'DApps'],
    pros: ['Largest DeFi ecosystem', 'Smart contract capability', 'Strong developer community'],
    cons: ['High gas fees', 'Network congestion', 'Complexity'],
    website: 'https://ethereum.org',
    explorer: 'https://etherscan.io',
    whitepaper: 'https://ethereum.org/en/whitepaper/'
  },
  'BNB': {
    name: 'BNB Smart Chain',
    description: 'A blockchain network built for running smart contract-based applications with fast transaction speeds and low fees.',
    type: 'Layer 1 Blockchain',
    consensus: 'Proof of Staked Authority (PoSA)',
    blockTime: '~3 seconds',
    features: ['Fast Transactions', 'Low Fees', 'EVM Compatible'],
    useCases: ['DeFi trading', 'Gaming', 'NFTs', 'Cross-chain bridges'],
    pros: ['Very low fees', 'Fast transactions', 'Ethereum compatibility'],
    cons: ['More centralized', 'Newer ecosystem', 'Validator concentration'],
    website: 'https://www.bnbchain.org',
    explorer: 'https://bscscan.com',
    whitepaper: 'https://github.com/bnb-chain/whitepaper'
  },
  'AVAX': {
    name: 'Avalanche',
    description: 'A high-performance blockchain platform for decentralized applications and custom blockchain networks.',
    type: 'Layer 1 Blockchain',
    consensus: 'Avalanche Consensus',
    blockTime: '~1-2 seconds',
    features: ['Sub-second Finality', 'Subnets', 'EVM Compatible'],
    useCases: ['DeFi protocols', 'Enterprise solutions', 'Gaming', 'Custom blockchains'],
    pros: ['Very fast finality', 'Scalable subnets', 'Energy efficient'],
    cons: ['Newer ecosystem', 'Complex architecture', 'Validator requirements'],
    website: 'https://www.avax.network',
    explorer: 'https://snowtrace.io',
    whitepaper: 'https://www.avalabs.org/whitepapers'
  },
  'MATIC': {
    name: 'Polygon',
    description: 'A Layer 2 scaling solution for Ethereum that provides faster and cheaper transactions while maintaining security.',
    type: 'Layer 2 Scaling Solution',
    consensus: 'Proof of Stake (PoS)',
    blockTime: '~2 seconds',
    features: ['Ethereum Scaling', 'Low Fees', 'Fast Transactions'],
    useCases: ['DeFi scaling', 'Gaming', 'NFT marketplaces', 'Micropayments'],
    pros: ['Very low fees', 'Fast transactions', 'Ethereum security'],
    cons: ['Dependent on Ethereum', 'Bridge complexity', 'Centralization concerns'],
    website: 'https://polygon.technology',
    explorer: 'https://polygonscan.com',
    whitepaper: 'https://polygon.technology/papers/'
  },
  'SOL': {
    name: 'Solana',
    description: 'A high-performance blockchain supporting builders around the world creating crypto apps that scale today.',
    type: 'Layer 1 Blockchain',
    consensus: 'Proof of History + Proof of Stake',
    blockTime: '~400ms',
    features: ['High Throughput', 'Low Fees', 'Fast Finality'],
    useCases: ['DeFi protocols', 'NFT marketplaces', 'Gaming', 'Web3 apps'],
    pros: ['Extremely fast', 'Very low fees', 'Growing ecosystem'],
    cons: ['Network outages', 'High hardware requirements', 'Centralization concerns'],
    website: 'https://solana.com',
    explorer: 'https://explorer.solana.com',
    whitepaper: 'https://solana.com/solana-whitepaper.pdf'
  },
  'XDC': {
    name: 'XDC Network',
    description: 'An enterprise-ready hybrid blockchain technology company optimized for international trade and finance.',
    type: 'Layer 1 Blockchain',
    consensus: 'XinFin Delegated Proof of Stake (XDPoS)',
    blockTime: '~2 seconds',
    features: ['Enterprise Focus', 'Trade Finance', 'Interoperability'],
    useCases: ['Trade finance', 'Supply chain', 'Remittances', 'Asset tokenization'],
    pros: ['Enterprise adoption', 'Low energy consumption', 'Regulatory compliance'],
    cons: ['Smaller ecosystem', 'Limited DeFi', 'Less developer activity'],
    website: 'https://xdc.network',
    explorer: 'https://explorer.xdc.network',
    whitepaper: 'https://xdc.network/whitepaper'
  },
  'XRP': {
    name: 'XRP Ledger',
    description: 'A decentralized cryptographic ledger powered by a network of peer-to-peer servers, designed for fast and efficient payments.',
    type: 'Layer 1 Blockchain',
    consensus: 'XRP Ledger Consensus Protocol',
    blockTime: '~3-5 seconds',
    features: ['Fast Payments', 'Low Fees', 'Energy Efficient'],
    useCases: ['Cross-border payments', 'Remittances', 'Central bank digital currencies'],
    pros: ['Very fast settlements', 'Extremely low fees', 'Energy efficient'],
    cons: ['Centralization concerns', 'Limited smart contracts', 'Regulatory uncertainty'],
    website: 'https://xrpl.org',
    explorer: 'https://livenet.xrpl.org',
    whitepaper: 'https://xrpl.org/docs/'
  },
  'XLM': {
    name: 'Stellar',
    description: 'An open network for storing and moving money that connects people, payment systems, and banks.',
    type: 'Layer 1 Blockchain',
    consensus: 'Stellar Consensus Protocol (SCP)',
    blockTime: '~3-5 seconds',
    features: ['Financial Inclusion', 'Asset Tokenization', 'Anchors'],
    useCases: ['Cross-border payments', 'Remittances', 'Micropayments', 'Asset issuance'],
    pros: ['Very low fees', 'Fast transactions', 'Financial inclusion focus'],
    cons: ['Limited smart contracts', 'Smaller ecosystem', 'Anchor dependency'],
    website: 'https://stellar.org',
    explorer: 'https://stellarchain.io',
    whitepaper: 'https://stellar.org/papers/'
  }
};

// Token Information Database
const TOKEN_INFO = {
  'USDC': {
    name: 'USD Coin',
    description: 'A fully collateralized US dollar stablecoin that provides detailed financial reporting and operates within the regulated framework.',
    type: 'Stablecoin',
    backing: 'US Dollar (1:1)',
    issuer: 'Centre (Coinbase & Circle)',
    useCases: ['Stable value storage', 'DeFi protocols', 'Trading pairs', 'Remittances'],
    pros: ['Regulatory compliance', 'Transparent reserves', 'Wide adoption'],
    cons: ['Centralized control', 'Regulatory risk', 'Freezing capability'],
    website: 'https://www.centre.io',
    audit: 'Monthly attestations by Grant Thornton'
  },
  'USDT': {
    name: 'Tether USD',
    description: 'The most widely used stablecoin, designed to maintain a 1:1 peg with the US Dollar.',
    type: 'Stablecoin',
    backing: 'US Dollar and equivalents',
    issuer: 'Tether Limited',
    useCases: ['Trading pairs', 'Value storage', 'Cross-border transfers', 'DeFi'],
    pros: ['Highest liquidity', 'Wide availability', 'First-mover advantage'],
    cons: ['Transparency concerns', 'Regulatory scrutiny', 'Centralized control'],
    website: 'https://tether.to',
    audit: 'Quarterly attestations'
  },
  'DAI': {
    name: 'Dai Stablecoin',
    description: 'A decentralized stablecoin soft-pegged to the US Dollar and backed by crypto collateral.',
    type: 'Decentralized Stablecoin',
    backing: 'Crypto collateral (over-collateralized)',
    issuer: 'MakerDAO (Decentralized)',
    useCases: ['DeFi protocols', 'Decentralized trading', 'Lending/borrowing'],
    pros: ['Decentralized', 'Transparent', 'Crypto-native'],
    cons: ['Complexity', 'Volatility risk', 'Governance dependency'],
    website: 'https://makerdao.com',
    audit: 'Open source and audited'
  },
  'WBTC': {
    name: 'Wrapped Bitcoin',
    description: 'An ERC-20 token backed 1:1 with Bitcoin, bringing Bitcoin liquidity to Ethereum DeFi.',
    type: 'Wrapped Asset',
    backing: 'Bitcoin (1:1)',
    issuer: 'WBTC DAO',
    useCases: ['DeFi protocols', 'Ethereum trading', 'Yield farming'],
    pros: ['Bitcoin exposure in DeFi', 'Ethereum compatibility', 'High liquidity'],
    cons: ['Custodial risk', 'Centralized bridges', 'Additional complexity'],
    website: 'https://wbtc.network',
    audit: 'Regular proof of reserves'
  }
};

// Basic Tooltip Component
export const BasicTooltip = ({ content, children, placement = 'top' }) => (
  <OverlayTrigger
    placement={placement}
    overlay={<Tooltip className="blockchain-tooltip">{content}</Tooltip>}
  >
    {children}
  </OverlayTrigger>
);

// Network Info Tooltip
export const NetworkTooltip = ({ network, children, placement = 'top', showIcon = true }) => {
  const networkInfo = NETWORK_INFO[network];
  
  if (!networkInfo) {
    return children;
  }

  const tooltipContent = (
    <div className="network-tooltip-content">
      <div className="tooltip-header">
        <strong>{networkInfo.name}</strong>
        <Badge bg="secondary" className="ms-2">{networkInfo.type}</Badge>
      </div>
      <div className="tooltip-body">
        <p>{networkInfo.description}</p>
        <div className="tooltip-stats">
          <div><strong>Consensus:</strong> {networkInfo.consensus}</div>
          <div><strong>Block Time:</strong> {networkInfo.blockTime}</div>
        </div>
      </div>
    </div>
  );

  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip className="blockchain-tooltip network-tooltip">{tooltipContent}</Tooltip>}
    >
      <span className="network-tooltip-trigger">
        {children}
        {showIcon && <InfoCircleOutlined className="tooltip-icon ms-1" />}
      </span>
    </OverlayTrigger>
  );
};

// Token Info Tooltip
export const TokenTooltip = ({ token, children, placement = 'top', showIcon = true }) => {
  const tokenInfo = TOKEN_INFO[token];
  
  if (!tokenInfo) {
    return children;
  }

  const tooltipContent = (
    <div className="token-tooltip-content">
      <div className="tooltip-header">
        <strong>{tokenInfo.name}</strong>
        <Badge bg="info" className="ms-2">{tokenInfo.type}</Badge>
      </div>
      <div className="tooltip-body">
        <p>{tokenInfo.description}</p>
        <div className="tooltip-stats">
          <div><strong>Backing:</strong> {tokenInfo.backing}</div>
          <div><strong>Issuer:</strong> {tokenInfo.issuer}</div>
        </div>
      </div>
    </div>
  );

  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip className="blockchain-tooltip token-tooltip">{tooltipContent}</Tooltip>}
    >
      <span className="token-tooltip-trigger">
        {children}
        {showIcon && <InfoCircleOutlined className="tooltip-icon ms-1" />}
      </span>
    </OverlayTrigger>
  );
};

// Detailed Info Modal
export const DetailedInfoModal = ({ type, identifier, show, onHide }) => {
  const info = type === 'network' ? NETWORK_INFO[identifier] : TOKEN_INFO[identifier];
  
  if (!info) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {info.name}
          <Badge bg={type === 'network' ? 'primary' : 'info'} className="ms-2">
            {type === 'network' ? info.type : info.type}
          </Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="detailed-info-content">
          {/* Description */}
          <div className="info-section mb-4">
            <h6>Overview</h6>
            <p>{info.description}</p>
          </div>

          {/* Technical Details */}
          <div className="info-section mb-4">
            <h6>Technical Details</h6>
            <div className="info-grid">
              {type === 'network' ? (
                <>
                  <div className="info-item">
                    <strong>Consensus Mechanism:</strong>
                    <span>{info.consensus}</span>
                  </div>
                  <div className="info-item">
                    <strong>Block Time:</strong>
                    <span>{info.blockTime}</span>
                  </div>
                  <div className="info-item">
                    <strong>Type:</strong>
                    <span>{info.type}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="info-item">
                    <strong>Type:</strong>
                    <span>{info.type}</span>
                  </div>
                  <div className="info-item">
                    <strong>Backing:</strong>
                    <span>{info.backing}</span>
                  </div>
                  <div className="info-item">
                    <strong>Issuer:</strong>
                    <span>{info.issuer}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Features */}
          {info.features && (
            <div className="info-section mb-4">
              <h6>Key Features</h6>
              <div className="feature-tags">
                {info.features.map((feature, index) => (
                  <Badge key={index} bg="outline-primary" className="me-2 mb-2">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Use Cases */}
          <div className="info-section mb-4">
            <h6>Use Cases</h6>
            <ul className="use-cases-list">
              {info.useCases.map((useCase, index) => (
                <li key={index}>{useCase}</li>
              ))}
            </ul>
          </div>

          {/* Pros and Cons */}
          <div className="info-section mb-4">
            <Row>
              <Col md={6}>
                <h6 className="text-success">Advantages</h6>
                <ul className="pros-list">
                  {info.pros.map((pro, index) => (
                    <li key={index} className="text-success">✓ {pro}</li>
                  ))}
                </ul>
              </Col>
              <Col md={6}>
                <h6 className="text-warning">Considerations</h6>
                <ul className="cons-list">
                  {info.cons.map((con, index) => (
                    <li key={index} className="text-warning">⚠ {con}</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </div>

          {/* Links */}
          <div className="info-section">
            <h6>Learn More</h6>
            <div className="info-links">
              <a href={info.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm me-2">
                <LinkOutlined className="me-1" />
                Official Website
              </a>
              {info.explorer && (
                <a href={info.explorer} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm me-2">
                  <LinkOutlined className="me-1" />
                  Block Explorer
                </a>
              )}
              {info.whitepaper && (
                <a href={info.whitepaper} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info btn-sm">
                  <LinkOutlined className="me-1" />
                  Whitepaper
                </a>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Interactive Info Component
export const InteractiveInfo = ({ type, identifier, children }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <span 
        className="interactive-info-trigger"
        onClick={() => setShowModal(true)}
        style={{ cursor: 'pointer' }}
      >
        {children}
        <QuestionCircleOutlined className="info-icon ms-1" />
      </span>
      
      <DetailedInfoModal
        type={type}
        identifier={identifier}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
};

// Help Icon with Tooltip
export const HelpTooltip = ({ content, placement = 'top' }) => (
  <OverlayTrigger
    placement={placement}
    overlay={<Tooltip className="help-tooltip">{content}</Tooltip>}
  >
    <QuestionCircleOutlined className="help-icon" />
  </OverlayTrigger>
);

// Feature Explanation Tooltip
export const FeatureTooltip = ({ feature, children, placement = 'top' }) => {
  const featureExplanations = {
    'cross-chain': 'Ability to transfer assets between different blockchain networks',
    'defi': 'Decentralized Finance - financial services without traditional intermediaries',
    'staking': 'Locking tokens to support network security and earn rewards',
    'yield-farming': 'Earning rewards by providing liquidity to DeFi protocols',
    'nft': 'Non-Fungible Tokens - unique digital assets on blockchain',
    'smart-contracts': 'Self-executing contracts with terms directly written into code',
    'gas-fees': 'Transaction fees paid to process operations on blockchain',
    'slippage': 'Price difference between expected and actual trade execution',
    'liquidity': 'How easily an asset can be bought or sold without affecting price',
    'market-cap': 'Total value of all tokens in circulation',
    'volume': 'Total amount of trading activity in a given period',
    'apy': 'Annual Percentage Yield - yearly return on investment including compounding'
  };

  const explanation = featureExplanations[feature] || 'Learn more about this feature';

  return (
    <BasicTooltip content={explanation} placement={placement}>
      {children}
    </BasicTooltip>
  );
};

// Risk Warning Tooltip
export const RiskTooltip = ({ level = 'medium', children, placement = 'top' }) => {
  const riskLevels = {
    low: {
      color: 'success',
      message: 'Low risk - Generally stable with minimal volatility'
    },
    medium: {
      color: 'warning', 
      message: 'Medium risk - Moderate volatility, suitable for experienced users'
    },
    high: {
      color: 'danger',
      message: 'High risk - Significant volatility, only for experienced traders'
    }
  };

  const risk = riskLevels[level];

  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip className={`risk-tooltip risk-${level}`}>
          <div className="risk-content">
            <Badge bg={risk.color} className="mb-2">Risk Level: {level.toUpperCase()}</Badge>
            <div>{risk.message}</div>
          </div>
        </Tooltip>
      }
    >
      {children}
    </OverlayTrigger>
  );
};

export default {
  BasicTooltip,
  NetworkTooltip,
  TokenTooltip,
  DetailedInfoModal,
  InteractiveInfo,
  HelpTooltip,
  FeatureTooltip,
  RiskTooltip
};

