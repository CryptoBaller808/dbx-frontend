import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Avatar, Tooltip, Badge, Spin, Empty, Input, Select, Slider } from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  EyeOutlined, 
  ShareAltOutlined,
  FilterOutlined,
  SearchOutlined,
  FireOutlined,
  CrownOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import './NFTMarketplace.css';

const { Search } = Input;
const { Option } = Select;

const NFTMarketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({
    category: 'all',
    blockchain: 'all',
    priceRange: [0, 1000],
    sortBy: 'recent'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock NFT data - in real app, this would come from API
  const mockNFTs = [
    {
      id: 1,
      name: "Cosmic Warrior #1234",
      description: "A legendary warrior from the cosmic realm with rare attributes and mystical powers.",
      image: "https://via.placeholder.com/300x300/6366f1/ffffff?text=Cosmic+Warrior",
      price: 2.5,
      currency: "ETH",
      creator: {
        name: "ArtistPro",
        avatar: "https://via.placeholder.com/40x40/f59e0b/ffffff?text=AP",
        verified: true
      },
      collection: "Cosmic Warriors",
      blockchain: "ETH",
      category: "Art",
      rarity: "Legendary",
      views: 1250,
      likes: 89,
      auction: {
        type: "fixed",
        endTime: null
      },
      attributes: [
        { trait_type: "Background", value: "Cosmic Nebula" },
        { trait_type: "Armor", value: "Quantum Steel" },
        { trait_type: "Weapon", value: "Plasma Sword" },
        { trait_type: "Power Level", value: "9500" }
      ]
    },
    {
      id: 2,
      name: "Digital Dreams #0567",
      description: "An abstract representation of digital consciousness and virtual reality.",
      image: "https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Digital+Dreams",
      price: 1.8,
      currency: "ETH",
      creator: {
        name: "DigitalMind",
        avatar: "https://via.placeholder.com/40x40/10b981/ffffff?text=DM",
        verified: true
      },
      collection: "Digital Dreams",
      blockchain: "ETH",
      category: "Abstract",
      rarity: "Epic",
      views: 890,
      likes: 67,
      auction: {
        type: "auction",
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        currentBid: 1.8,
        bidCount: 12
      },
      attributes: [
        { trait_type: "Style", value: "Abstract" },
        { trait_type: "Colors", value: "Neon Purple" },
        { trait_type: "Complexity", value: "High" }
      ]
    },
    {
      id: 3,
      name: "Cyber Punk Cat #2890",
      description: "A futuristic feline with cybernetic enhancements living in Neo Tokyo.",
      image: "https://via.placeholder.com/300x300/f59e0b/ffffff?text=Cyber+Cat",
      price: 0.75,
      currency: "ETH",
      creator: {
        name: "CyberArtist",
        avatar: "https://via.placeholder.com/40x40/ef4444/ffffff?text=CA",
        verified: false
      },
      collection: "Cyber Cats",
      blockchain: "BNB",
      category: "Gaming",
      rarity: "Rare",
      views: 456,
      likes: 34,
      auction: {
        type: "fixed",
        endTime: null
      },
      attributes: [
        { trait_type: "Species", value: "Cyber Cat" },
        { trait_type: "Enhancement", value: "Neural Interface" },
        { trait_type: "Location", value: "Neo Tokyo" }
      ]
    },
    {
      id: 4,
      name: "Mystic Forest Spirit",
      description: "An ancient forest guardian with the power to control nature itself.",
      image: "https://via.placeholder.com/300x300/10b981/ffffff?text=Forest+Spirit",
      price: 3.2,
      currency: "ETH",
      creator: {
        name: "NatureMage",
        avatar: "https://via.placeholder.com/40x40/8b5cf6/ffffff?text=NM",
        verified: true
      },
      collection: "Mystic Spirits",
      blockchain: "AVAX",
      category: "Fantasy",
      rarity: "Mythic",
      views: 2100,
      likes: 156,
      auction: {
        type: "dutch",
        endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        startPrice: 5.0,
        currentPrice: 3.2,
        priceDropInterval: 3600000 // 1 hour
      },
      attributes: [
        { trait_type: "Element", value: "Nature" },
        { trait_type: "Power", value: "Forest Control" },
        { trait_type: "Age", value: "Ancient" }
      ]
    },
    {
      id: 5,
      name: "Space Explorer #4455",
      description: "A brave astronaut exploring the far reaches of the galaxy.",
      image: "https://via.placeholder.com/300x300/3b82f6/ffffff?text=Space+Explorer",
      price: 1.2,
      currency: "SOL",
      creator: {
        name: "SpaceArt",
        avatar: "https://via.placeholder.com/40x40/f59e0b/ffffff?text=SA",
        verified: true
      },
      collection: "Space Explorers",
      blockchain: "SOL",
      category: "Sci-Fi",
      rarity: "Uncommon",
      views: 678,
      likes: 45,
      auction: {
        type: "fixed",
        endTime: null
      },
      attributes: [
        { trait_type: "Suit", value: "Advanced EVA" },
        { trait_type: "Mission", value: "Deep Space" },
        { trait_type: "Rank", value: "Commander" }
      ]
    },
    {
      id: 6,
      name: "Quantum Butterfly",
      description: "A beautiful butterfly that exists in multiple dimensions simultaneously.",
      image: "https://via.placeholder.com/300x300/ec4899/ffffff?text=Quantum+Butterfly",
      price: 0.95,
      currency: "MATIC",
      creator: {
        name: "QuantumArt",
        avatar: "https://via.placeholder.com/40x40/3b82f6/ffffff?text=QA",
        verified: true
      },
      collection: "Quantum Creatures",
      blockchain: "MATIC",
      category: "Nature",
      rarity: "Rare",
      views: 834,
      likes: 72,
      auction: {
        type: "auction",
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        currentBid: 0.95,
        bidCount: 8
      },
      attributes: [
        { trait_type: "Dimension", value: "Multi-dimensional" },
        { trait_type: "Wings", value: "Quantum Shimmer" },
        { trait_type: "Ability", value: "Phase Shift" }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNfts(mockNFTs);
      setLoading(false);
    }, 1500);
  }, []);

  const toggleFavorite = (nftId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(nftId)) {
      newFavorites.delete(nftId);
    } else {
      newFavorites.add(nftId);
    }
    setFavorites(newFavorites);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': '#6b7280',
      'Uncommon': '#10b981',
      'Rare': '#3b82f6',
      'Epic': '#8b5cf6',
      'Legendary': '#f59e0b',
      'Mythic': '#ef4444'
    };
    return colors[rarity] || '#6b7280';
  };

  const getBlockchainColor = (blockchain) => {
    const colors = {
      'ETH': '#627eea',
      'BNB': '#f3ba2f',
      'AVAX': '#e84142',
      'MATIC': '#8247e5',
      'SOL': '#9945ff',
      'XRP': '#23292f',
      'XDC': '#2a5ada',
      'XLM': '#000000'
    };
    return colors[blockchain] || '#6b7280';
  };

  const formatTimeRemaining = (endTime) => {
    if (!endTime) return null;
    
    const now = new Date();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || nft.category === filters.category;
    const matchesBlockchain = filters.blockchain === 'all' || nft.blockchain === filters.blockchain;
    const matchesPrice = nft.price >= filters.priceRange[0] && nft.price <= filters.priceRange[1];
    
    return matchesSearch && matchesCategory && matchesBlockchain && matchesPrice;
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'popular':
        return b.likes - a.likes;
      case 'recent':
      default:
        return b.id - a.id;
    }
  });

  if (loading) {
    return (
      <div className="nft-marketplace-loading">
        <Spin size="large" />
        <p>Loading amazing NFTs...</p>
      </div>
    );
  }

  return (
    <div className="nft-marketplace">
      {/* Hero Section */}
      <div className="nft-hero">
        <div className="nft-hero-content">
          <h1 className="nft-hero-title">
            Discover, Collect & Trade
            <span className="nft-hero-gradient"> Extraordinary NFTs</span>
          </h1>
          <p className="nft-hero-subtitle">
            Explore the world's largest multi-chain NFT marketplace with verified creators and authentic digital assets
          </p>
          <div className="nft-hero-stats">
            <div className="nft-stat">
              <div className="nft-stat-number">2.5M+</div>
              <div className="nft-stat-label">NFTs</div>
            </div>
            <div className="nft-stat">
              <div className="nft-stat-number">150K+</div>
              <div className="nft-stat-label">Creators</div>
            </div>
            <div className="nft-stat">
              <div className="nft-stat-number">7</div>
              <div className="nft-stat-label">Blockchains</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="nft-filters-section">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search NFTs, creators, collections..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="nft-search"
            />
          </Col>
          <Col xs={24} md={16}>
            <div className="nft-filter-controls">
              <Select
                value={filters.category}
                onChange={(value) => setFilters({...filters, category: value})}
                style={{ width: 120 }}
                size="large"
              >
                <Option value="all">All Categories</Option>
                <Option value="Art">Art</Option>
                <Option value="Gaming">Gaming</Option>
                <Option value="Fantasy">Fantasy</Option>
                <Option value="Sci-Fi">Sci-Fi</Option>
                <Option value="Nature">Nature</Option>
                <Option value="Abstract">Abstract</Option>
              </Select>
              
              <Select
                value={filters.blockchain}
                onChange={(value) => setFilters({...filters, blockchain: value})}
                style={{ width: 120 }}
                size="large"
              >
                <Option value="all">All Chains</Option>
                <Option value="ETH">Ethereum</Option>
                <Option value="BNB">BNB Chain</Option>
                <Option value="AVAX">Avalanche</Option>
                <Option value="MATIC">Polygon</Option>
                <Option value="SOL">Solana</Option>
                <Option value="XRP">XRP</Option>
                <Option value="XDC">XDC</Option>
              </Select>
              
              <Select
                value={filters.sortBy}
                onChange={(value) => setFilters({...filters, sortBy: value})}
                style={{ width: 140 }}
                size="large"
              >
                <Option value="recent">Recently Added</Option>
                <Option value="price_low">Price: Low to High</Option>
                <Option value="price_high">Price: High to Low</Option>
                <Option value="popular">Most Popular</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </div>

      {/* NFT Grid */}
      <div className="nft-grid-section">
        {sortedNFTs.length === 0 ? (
          <Empty
            description="No NFTs found matching your criteria"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Row gutter={[24, 24]}>
            {sortedNFTs.map((nft) => (
              <Col xs={24} sm={12} md={8} lg={6} key={nft.id}>
                <Card
                  className="nft-card"
                  cover={
                    <div className="nft-card-image-container">
                      <img
                        alt={nft.name}
                        src={nft.image}
                        className="nft-card-image"
                      />
                      <div className="nft-card-overlay">
                        <div className="nft-card-actions">
                          <Tooltip title="View Details">
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<EyeOutlined />}
                              className="nft-action-btn"
                            />
                          </Tooltip>
                          <Tooltip title="Share">
                            <Button
                              shape="circle"
                              icon={<ShareAltOutlined />}
                              className="nft-action-btn"
                            />
                          </Tooltip>
                        </div>
                        <Button
                          type={favorites.has(nft.id) ? "primary" : "default"}
                          shape="circle"
                          icon={favorites.has(nft.id) ? <HeartFilled /> : <HeartOutlined />}
                          className="nft-favorite-btn"
                          onClick={() => toggleFavorite(nft.id)}
                        />
                      </div>
                      <div className="nft-card-badges">
                        <Tag 
                          color={getRarityColor(nft.rarity)}
                          className="nft-rarity-badge"
                        >
                          {nft.rarity === 'Legendary' && <CrownOutlined />}
                          {nft.rarity === 'Mythic' && <FireOutlined />}
                          {nft.rarity}
                        </Tag>
                        <Tag 
                          color={getBlockchainColor(nft.blockchain)}
                          className="nft-blockchain-badge"
                        >
                          {nft.blockchain}
                        </Tag>
                      </div>
                    </div>
                  }
                  actions={[
                    <div className="nft-card-stats">
                      <span><EyeOutlined /> {nft.views}</span>
                      <span><HeartOutlined /> {nft.likes}</span>
                    </div>
                  ]}
                >
                  <div className="nft-card-content">
                    <div className="nft-card-header">
                      <h3 className="nft-card-title">{nft.name}</h3>
                      <p className="nft-card-collection">{nft.collection}</p>
                    </div>
                    
                    <div className="nft-card-creator">
                      <Avatar src={nft.creator.avatar} size="small" />
                      <span className="nft-creator-name">
                        {nft.creator.name}
                        {nft.creator.verified && (
                          <Badge 
                            count={<ThunderboltOutlined style={{ color: '#1890ff' }} />}
                            offset={[5, 0]}
                          />
                        )}
                      </span>
                    </div>

                    <div className="nft-card-price">
                      <div className="nft-price-main">
                        <span className="nft-price-amount">{nft.price}</span>
                        <span className="nft-price-currency">{nft.currency}</span>
                      </div>
                      {nft.auction.type === 'auction' && (
                        <div className="nft-auction-info">
                          <span className="nft-bid-count">{nft.auction.bidCount} bids</span>
                          <span className="nft-time-remaining">
                            {formatTimeRemaining(nft.auction.endTime)}
                          </span>
                        </div>
                      )}
                      {nft.auction.type === 'dutch' && (
                        <div className="nft-dutch-info">
                          <span className="nft-price-drop">Price dropping...</span>
                          <span className="nft-time-remaining">
                            {formatTimeRemaining(nft.auction.endTime)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="nft-card-footer">
                      {nft.auction.type === 'fixed' ? (
                        <Button type="primary" block className="nft-buy-btn">
                          Buy Now
                        </Button>
                      ) : nft.auction.type === 'auction' ? (
                        <Button type="primary" block className="nft-bid-btn">
                          Place Bid
                        </Button>
                      ) : (
                        <Button type="primary" block className="nft-dutch-btn">
                          Buy at Current Price
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Load More */}
      {sortedNFTs.length > 0 && (
        <div className="nft-load-more">
          <Button size="large" className="nft-load-more-btn">
            Load More NFTs
          </Button>
        </div>
      )}
    </div>
  );
};

export default NFTMarketplace;

