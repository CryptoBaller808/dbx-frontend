/**
 * DBX Skeleton Loader Components
 * Reusable skeleton loaders for async data loading states
 * 
 * @version 3.0.0
 * @author DBX Development Team
 */

import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './SkeletonLoaders.css';

// Basic Skeleton Component
export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => (
  <div 
    className={`skeleton ${className}`}
    style={{ 
      width, 
      height, 
      borderRadius,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'loading 1.5s infinite'
    }}
  />
);

// Asset Card Skeleton
export const AssetCardSkeleton = () => (
  <Card className="asset-card mb-3">
    <Card.Body>
      <Row className="align-items-center">
        <Col xs={2}>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
        </Col>
        <Col xs={4}>
          <div>
            <Skeleton width="80px" height="16px" className="mb-2" />
            <Skeleton width="120px" height="12px" />
            <div className="mt-2">
              <Skeleton width="60px" height="18px" borderRadius="12px" />
            </div>
          </div>
        </Col>
        <Col xs={3} className="text-end">
          <Skeleton width="80px" height="16px" className="mb-1" />
          <Skeleton width="40px" height="12px" />
        </Col>
        <Col xs={3} className="text-end">
          <Skeleton width="90px" height="18px" className="mb-1" />
          <Skeleton width="70px" height="14px" />
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

// NFT Card Skeleton
export const NFTCardSkeleton = () => (
  <Col lg={3} md={4} sm={6} className="mb-4">
    <Card className="nft-card h-100">
      <div className="nft-image-container">
        <Skeleton width="100%" height="250px" borderRadius="0" />
        <div className="nft-overlay">
          <Skeleton width="60px" height="24px" borderRadius="12px" />
          <Skeleton width="24px" height="24px" borderRadius="50%" />
        </div>
      </div>
      
      <Card.Body className="nft-card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <Skeleton width="120px" height="16px" className="mb-1" />
            <Skeleton width="80px" height="12px" />
          </div>
          <Skeleton width="20px" height="20px" borderRadius="50%" />
        </div>
        
        <div className="nft-price-section">
          <Skeleton width="40px" height="12px" className="mb-1" />
          <div className="price-display">
            <Skeleton width="80px" height="16px" className="me-2" />
            <Skeleton width="60px" height="12px" />
          </div>
        </div>
        
        <div className="nft-actions mt-3">
          <Skeleton width="100%" height="32px" borderRadius="8px" />
        </div>
        
        <div className="nft-stats mt-2 text-center">
          <Skeleton width="100px" height="12px" />
        </div>
      </Card.Body>
    </Card>
  </Col>
);

// Transaction Item Skeleton
export const TransactionSkeleton = () => (
  <div className="transaction-item">
    <div className="d-flex align-items-center">
      <div className="transaction-icon me-3">
        <Skeleton width="40px" height="40px" borderRadius="50%" />
      </div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Skeleton width="80px" height="14px" className="mb-1" />
            <Skeleton width="60px" height="12px" />
          </div>
          <div className="text-end">
            <Skeleton width="90px" height="14px" className="mb-1" />
            <Skeleton width="50px" height="12px" />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <Skeleton width="40px" height="18px" borderRadius="9px" />
          <Skeleton width="70px" height="18px" borderRadius="9px" />
        </div>
      </div>
    </div>
  </div>
);

// Trading Pair Skeleton
export const TradingPairSkeleton = () => (
  <div className="trading-pair-skeleton">
    <div className="swap-section mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Skeleton width="40px" height="16px" />
        <Skeleton width="120px" height="12px" />
      </div>
      
      <div className="swap-input-container">
        <Row>
          <Col md={6}>
            <Skeleton width="100%" height="40px" borderRadius="8px" className="mb-2" />
          </Col>
          <Col md={6}>
            <Skeleton width="100%" height="40px" borderRadius="8px" className="mb-2" />
          </Col>
        </Row>
        
        <div className="amount-input-container">
          <Skeleton width="100%" height="56px" borderRadius="12px" />
        </div>
      </div>
    </div>
  </div>
);

// Chart Skeleton
export const ChartSkeleton = ({ height = '400px' }) => (
  <div className="chart-skeleton" style={{ height }}>
    <div className="chart-header mb-3">
      <Row className="align-items-center">
        <Col>
          <Skeleton width="150px" height="24px" className="mb-2" />
          <Skeleton width="100px" height="16px" />
        </Col>
        <Col xs="auto">
          <div className="d-flex gap-2">
            <Skeleton width="80px" height="14px" />
            <Skeleton width="80px" height="14px" />
            <Skeleton width="80px" height="14px" />
          </div>
        </Col>
      </Row>
    </div>
    
    <div className="chart-area">
      <Skeleton width="100%" height={`calc(${height} - 80px)`} borderRadius="8px" />
    </div>
  </div>
);

// Order Book Skeleton
export const OrderBookSkeleton = () => (
  <div className="orderbook-skeleton">
    <div className="orderbook-header mb-2">
      <Row>
        <Col><Skeleton width="60px" height="14px" /></Col>
        <Col><Skeleton width="80px" height="14px" /></Col>
        <Col><Skeleton width="70px" height="14px" /></Col>
      </Row>
    </div>
    
    {[...Array(10)].map((_, index) => (
      <div key={index} className="orderbook-row mb-1">
        <Row>
          <Col><Skeleton width="70px" height="12px" /></Col>
          <Col><Skeleton width="90px" height="12px" /></Col>
          <Col><Skeleton width="80px" height="12px" /></Col>
        </Row>
      </div>
    ))}
  </div>
);

// Portfolio Summary Skeleton
export const PortfolioSummarySkeleton = () => (
  <Card className="portfolio-summary-card">
    <Card.Body>
      <Skeleton width="140px" height="16px" className="mb-2" />
      <Skeleton width="200px" height="40px" className="mb-2" />
      <div className="d-flex align-items-center">
        <Skeleton width="20px" height="20px" borderRadius="50%" className="me-2" />
        <Skeleton width="150px" height="18px" />
      </div>
    </Card.Body>
  </Card>
);

// Network Distribution Skeleton
export const NetworkDistributionSkeleton = () => (
  <Card className="portfolio-stats-card">
    <Card.Body>
      <Skeleton width="140px" height="16px" className="mb-3" />
      {[...Array(4)].map((_, index) => (
        <div key={index} className="network-distribution mb-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="d-flex align-items-center">
              <Skeleton width="20px" height="20px" borderRadius="50%" className="me-2" />
              <Skeleton width="60px" height="14px" />
            </div>
            <Skeleton width="80px" height="14px" />
          </div>
          <Skeleton width="100%" height="4px" borderRadius="2px" />
        </div>
      ))}
    </Card.Body>
  </Card>
);

// Loading Grid Skeleton
export const LoadingGridSkeleton = ({ 
  rows = 3, 
  cols = 4, 
  cardHeight = '300px',
  showHeader = true 
}) => (
  <div className="loading-grid-skeleton">
    {showHeader && (
      <div className="grid-header mb-4">
        <Row className="align-items-center">
          <Col>
            <Skeleton width="200px" height="24px" className="mb-2" />
            <Skeleton width="300px" height="16px" />
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <Skeleton width="100px" height="36px" borderRadius="8px" />
              <Skeleton width="80px" height="36px" borderRadius="8px" />
            </div>
          </Col>
        </Row>
      </div>
    )}
    
    {[...Array(rows)].map((_, rowIndex) => (
      <Row key={rowIndex} className="mb-4">
        {[...Array(cols)].map((_, colIndex) => (
          <Col key={colIndex} lg={12/cols} md={6} className="mb-3">
            <Card>
              <Skeleton width="100%" height={cardHeight} borderRadius="0" />
              <Card.Body>
                <Skeleton width="80%" height="18px" className="mb-2" />
                <Skeleton width="60%" height="14px" className="mb-3" />
                <Skeleton width="100%" height="32px" borderRadius="8px" />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    ))}
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="table-skeleton">
    <div className="table-header mb-2">
      <Row>
        {[...Array(cols)].map((_, index) => (
          <Col key={index}>
            <Skeleton width="80px" height="16px" />
          </Col>
        ))}
      </Row>
    </div>
    
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="table-row mb-2 pb-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
        <Row>
          {[...Array(cols)].map((_, colIndex) => (
            <Col key={colIndex}>
              <Skeleton width={`${60 + Math.random() * 40}%`} height="14px" />
            </Col>
          ))}
        </Row>
      </div>
    ))}
  </div>
);

// Pulse Loading Component
export const PulseLoader = ({ size = 'md', color = '#007bff' }) => {
  const sizeMap = {
    sm: '12px',
    md: '20px',
    lg: '32px'
  };
  
  return (
    <div 
      className="pulse-loader"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        backgroundColor: color,
        borderRadius: '50%',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}
    />
  );
};

// Shimmer Effect Component
export const ShimmerEffect = ({ children, isLoading = true }) => (
  <div className={`shimmer-container ${isLoading ? 'loading' : ''}`}>
    {children}
    {isLoading && <div className="shimmer-overlay" />}
  </div>
);

// Loading Dots Component
export const LoadingDots = ({ size = 'md', color = '#007bff' }) => {
  const sizeMap = {
    sm: '6px',
    md: '10px',
    lg: '14px'
  };
  
  return (
    <div className="loading-dots">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="loading-dot"
          style={{
            width: sizeMap[size],
            height: sizeMap[size],
            backgroundColor: color,
            animationDelay: `${index * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

// Skeleton Text Lines
export const SkeletonText = ({ lines = 3, lineHeight = '16px', gap = '8px' }) => (
  <div className="skeleton-text">
    {[...Array(lines)].map((_, index) => (
      <Skeleton
        key={index}
        width={index === lines - 1 ? '70%' : '100%'}
        height={lineHeight}
        className={index < lines - 1 ? `mb-${gap}` : ''}
      />
    ))}
  </div>
);

export default {
  Skeleton,
  AssetCardSkeleton,
  NFTCardSkeleton,
  TransactionSkeleton,
  TradingPairSkeleton,
  ChartSkeleton,
  OrderBookSkeleton,
  PortfolioSummarySkeleton,
  NetworkDistributionSkeleton,
  LoadingGridSkeleton,
  TableSkeleton,
  PulseLoader,
  ShimmerEffect,
  LoadingDots,
  SkeletonText
};

