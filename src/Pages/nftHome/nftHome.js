/**
 * DBX Enhanced NFT Marketplace
 * Multi-chain NFT marketplace with network selection and filtering
 * 
 * @version 3.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Modal, Button, Dropdown } from 'react-bootstrap';
import { Tabs, Pagination } from 'antd';
import { EllipsisOutlined, ArrowLeftOutlined, ArrowRightOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { SUPPORTED_NETWORKS } from '../../config/networks';
import { switchNetwork } from '../../redux/network/action';
import NetworkSelector from '../../components/NetworkSelector';
import './nftHome.css';

const { TabPane } = Tabs;

const EnhancedNFTHome = () => {
  const dispatch = useDispatch();
  const { activeNetwork, networkType, connectedNetworks } = useSelector(state => state.networkReducers);
  
  // NFT state
  const [selectedNetwork, setSelectedNetwork] = useState('ETH');
  const [nftCollections, setNftCollections] = useState([]);
  const [featuredNFTs, setFeaturedNFTs] = useState([]);
  const [hotBids, setHotBids] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Modal state
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  useEffect(() => {
    loadNFTData(selectedNetwork);
  }, [selectedNetwork, networkType]);

  const loadNFTData = async (network) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock NFT data for different networks
      const mockNFTData = await generateMockNFTData(network);
      setNftCollections(mockNFTData.collections);
      setFeaturedNFTs(mockNFTData.featured);
      setHotBids(mockNFTData.hotBids);
      setLiveAuctions(mockNFTData.liveAuctions);
    } catch (error) {
      console.error('Failed to load NFT data:', error);
      setError('Failed to load NFT data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockNFTData = async (network) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const networkConfig = SUPPORTED_NETWORKS[network];
    const nativeSymbol = networkConfig?.nativeSymbol || 'ETH';
    
    const categories = ['Art', 'Gaming', 'Music', 'Sports', 'Collectibles', 'Virtual Worlds'];
    const collections = ['CryptoPunks', 'Bored Apes', 'Azuki', 'Doodles', 'Cool Cats', 'World of Women'];
    
    const generateNFT = (id, type = 'featured') => ({
      id,
      name: `${collections[Math.floor(Math.random() * collections.length)]} #${Math.floor(Math.random() * 10000)}`,
      collection: collections[Math.floor(Math.random() * collections.length)],
      image: `https://picsum.photos/300/300?random=${id}`,
      price: (Math.random() * 10 + 0.1).toFixed(2),
      currency: nativeSymbol,
      usdPrice: (Math.random() * 50000 + 100).toFixed(2),
      network: network,
      category: categories[Math.floor(Math.random() * categories.length)],
      creator: `0x${Math.random().toString(16).substr(2, 8)}...`,
      owner: `0x${Math.random().toString(16).substr(2, 8)}...`,
      description: `A unique ${type} NFT from the ${network} blockchain`,
      attributes: [
        { trait_type: 'Background', value: ['Blue', 'Red', 'Green', 'Purple'][Math.floor(Math.random() * 4)] },
        { trait_type: 'Eyes', value: ['Normal', 'Laser', 'Sunglasses', 'Wink'][Math.floor(Math.random() * 4)] },
        { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)] }
      ],
      likes: Math.floor(Math.random() * 1000),
      views: Math.floor(Math.random() * 10000),
      isAuction: type === 'auction',
      auctionEndTime: type === 'auction' ? Date.now() + Math.random() * 86400000 : null,
      highestBid: type === 'auction' ? (Math.random() * 5 + 0.1).toFixed(2) : null,
      bidCount: type === 'auction' ? Math.floor(Math.random() * 50) : 0,
      isVerified: Math.random() > 0.5,
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString()
    });
    
    return {
      collections: Array.from({ length: 20 }, (_, i) => generateNFT(i + 1, 'collection')),
      featured: Array.from({ length: 8 }, (_, i) => generateNFT(i + 21, 'featured')),
      hotBids: Array.from({ length: 8 }, (_, i) => generateNFT(i + 31, 'bid')),
      liveAuctions: Array.from({ length: 8 }, (_, i) => generateNFT(i + 41, 'auction'))
    };
  };

  const handleNetworkChange = (network) => {
    setSelectedNetwork(network);
    dispatch(switchNetwork(network, networkType));
    setCurrentPage(1);
  };

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
    setShowNFTModal(true);
  };

  const handleBuyNow = (nft) => {
    if (!connectedNetworks || !connectedNetworks[selectedNetwork]) {
      alert('Please connect your wallet to this network first');
      return;
    }
    setShowComingSoonModal(true);
  };

  const handlePlaceBid = (nft) => {
    if (!connectedNetworks || !connectedNetworks[selectedNetwork]) {
      alert('Please connect your wallet to this network first');
      return;
    }
    setShowComingSoonModal(true);
  };

  const getFilteredNFTs = (nfts) => {
    let filtered = [...nfts];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.collection.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(nft => nft.category === categoryFilter);
    }
    
    // Price filter
    if (priceFilter !== 'all') {
      const price = parseFloat(nft.price);
      switch (priceFilter) {
        case 'low':
          filtered = filtered.filter(nft => parseFloat(nft.price) < 1);
          break;
        case 'medium':
          filtered = filtered.filter(nft => parseFloat(nft.price) >= 1 && parseFloat(nft.price) < 5);
          break;
        case 'high':
          filtered = filtered.filter(nft => parseFloat(nft.price) >= 5);
          break;
      }
    }
    
    // Sort
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price_high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }
    
    return filtered;
  };

  const getPaginatedNFTs = (nfts) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return nfts.slice(startIndex, endIndex);
  };

  const formatTimeRemaining = (endTime) => {
    if (!endTime) return '';
    
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const NFTCard = ({ nft, showBidInfo = false }) => (
    <Col lg={3} md={4} sm={6} className="mb-4">
      <Card className="nft-card h-100" onClick={() => handleNFTClick(nft)}>
        <div className="nft-image-container">
          <img 
            src={nft.image} 
            alt={nft.name}
            className="nft-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=NFT';
            }}
          />
          <div className="nft-overlay">
            <Badge bg="primary" className="network-badge">{nft.network}</Badge>
            {nft.isVerified && <Badge bg="success" className="verified-badge">✓</Badge>}
          </div>
          {nft.isAuction && (
            <div className="auction-timer">
              <small>Ends in: {formatTimeRemaining(nft.auctionEndTime)}</small>
            </div>
          )}
        </div>
        
        <Card.Body className="nft-card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="nft-name mb-1">{nft.name}</h6>
              <small className="text-muted">{nft.collection}</small>
            </div>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="nft-menu-btn">
                <EllipsisOutlined />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleNFTClick(nft)}>View Details</Dropdown.Item>
                <Dropdown.Item onClick={() => setShowComingSoonModal(true)}>Share</Dropdown.Item>
                <Dropdown.Item onClick={() => setShowComingSoonModal(true)}>Report</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          
          <div className="nft-price-section">
            {showBidInfo && nft.isAuction ? (
              <div>
                <small className="text-muted">Highest bid</small>
                <div className="price-display">
                  <span className="price">{nft.highestBid} {nft.currency}</span>
                  <small className="usd-price">${nft.usdPrice}</small>
                </div>
                <small className="bid-count">{nft.bidCount} bids</small>
              </div>
            ) : (
              <div>
                <small className="text-muted">Price</small>
                <div className="price-display">
                  <span className="price">{nft.price} {nft.currency}</span>
                  <small className="usd-price">${nft.usdPrice}</small>
                </div>
              </div>
            )}
          </div>
          
          <div className="nft-actions mt-3">
            {nft.isAuction ? (
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaceBid(nft);
                }}
              >
                Place Bid
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                className="w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuyNow(nft);
                }}
              >
                Buy Now
              </Button>
            )}
          </div>
          
          <div className="nft-stats mt-2">
            <small className="text-muted">
              ❤️ {nft.likes} • 👁️ {nft.views}
            </small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="nft-marketplace">
      {/* Hero Section */}
      <div className="nft-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Discover, collect, and<br />
                  sell extraordinary<br />
                  NFTs
                </h1>
                <p className="hero-description">
                  Explore the world's largest multi-chain NFT marketplace.<br />
                  Trade across {Object.keys(SUPPORTED_NETWORKS).length} blockchain networks with ease.
                </p>
                <div className="hero-actions">
                  <Button variant="primary" size="lg" className="me-3">
                    Explore
                  </Button>
                  <Button variant="outline-primary" size="lg">
                    Create
                  </Button>
                </div>
                <div className="hero-stats mt-4">
                  <div className="stat">
                    <h4>2.5M+</h4>
                    <small>NFTs</small>
                  </div>
                  <div className="stat">
                    <h4>500K+</h4>
                    <small>Users</small>
                  </div>
                  <div className="stat">
                    <h4>9</h4>
                    <small>Networks</small>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-nft-showcase">
                <div className="floating-nft nft-1">
                  <img src="https://picsum.photos/200/200?random=1" alt="NFT 1" />
                </div>
                <div className="floating-nft nft-2">
                  <img src="https://picsum.photos/200/200?random=2" alt="NFT 2" />
                </div>
                <div className="floating-nft nft-3">
                  <img src="https://picsum.photos/200/200?random=3" alt="NFT 3" />
                </div>
                <div className="floating-nft nft-4">
                  <img src="https://picsum.photos/200/200?random=4" alt="NFT 4" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="nft-content">
        {/* Network Selection */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3>Multi-Chain NFT Marketplace</h3>
                <p className="text-muted mb-0">Browse NFTs across all supported networks</p>
              </div>
              <NetworkSelector
                selectedNetwork={selectedNetwork}
                onNetworkChange={handleNetworkChange}
                showBalance={false}
                compact={true}
              />
            </div>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Filters and Search */}
        <Row className="mb-4">
          <Col>
            <Card className="filter-card">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={3}>
                    <div className="search-box">
                      <SearchOutlined className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search NFTs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control search-input"
                      />
                    </div>
                  </Col>
                  <Col md={2}>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="form-select"
                    >
                      <option value="all">All Categories</option>
                      <option value="Art">Art</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Music">Music</option>
                      <option value="Sports">Sports</option>
                      <option value="Collectibles">Collectibles</option>
                      <option value="Virtual Worlds">Virtual Worlds</option>
                    </select>
                  </Col>
                  <Col md={2}>
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="form-select"
                    >
                      <option value="all">All Prices</option>
                      <option value="low">Under 1 {SUPPORTED_NETWORKS[selectedNetwork]?.nativeSymbol}</option>
                      <option value="medium">1-5 {SUPPORTED_NETWORKS[selectedNetwork]?.nativeSymbol}</option>
                      <option value="high">5+ {SUPPORTED_NETWORKS[selectedNetwork]?.nativeSymbol}</option>
                    </select>
                  </Col>
                  <Col md={2}>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="form-select"
                    >
                      <option value="recent">Recently Added</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </Col>
                  <Col md={3}>
                    <div className="d-flex align-items-center justify-content-end">
                      <Badge bg="secondary" className="me-2">
                        {selectedNetwork} Network
                      </Badge>
                      <Badge bg={networkType === 'mainnet' ? 'success' : 'warning'}>
                        {networkType.toUpperCase()}
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Loading State */}
        {isLoading && (
          <Row>
            <Col className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading NFTs from {selectedNetwork} network...</p>
            </Col>
          </Row>
        )}

        {/* NFT Sections */}
        {!isLoading && (
          <Tabs defaultActiveKey="featured" className="nft-tabs">
            <TabPane tab="Featured" key="featured">
              <Row>
                {featuredNFTs.map(nft => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </Row>
            </TabPane>
            
            <TabPane tab="Hot Bids" key="hotbids">
              <Row>
                {hotBids.map(nft => (
                  <NFTCard key={nft.id} nft={nft} showBidInfo={true} />
                ))}
              </Row>
            </TabPane>
            
            <TabPane tab="Live Auctions" key="auctions">
              <Row>
                {liveAuctions.map(nft => (
                  <NFTCard key={nft.id} nft={nft} showBidInfo={true} />
                ))}
              </Row>
            </TabPane>
            
            <TabPane tab="All NFTs" key="all">
              <Row>
                {getPaginatedNFTs(getFilteredNFTs(nftCollections)).map(nft => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </Row>
              
              {getFilteredNFTs(nftCollections).length > itemsPerPage && (
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
                    <Pagination
                      current={currentPage}
                      total={getFilteredNFTs(nftCollections).length}
                      pageSize={itemsPerPage}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              )}
            </TabPane>
          </Tabs>
        )}

        {/* Coming Soon Banner */}
        <Row className="mt-5">
          <Col>
            <Card className="coming-soon-banner">
              <Card.Body className="text-center py-5">
                <h3>🚀 More Features Coming Soon!</h3>
                <p className="lead">
                  We're working hard to bring you advanced NFT features including:
                </p>
                <Row className="mt-4">
                  <Col md={3}>
                    <div className="feature-preview">
                      <h5>🎨 NFT Creation</h5>
                      <p>Mint your own NFTs directly on the platform</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="feature-preview">
                      <h5>🔄 Cross-Chain Trading</h5>
                      <p>Trade NFTs across different blockchain networks</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="feature-preview">
                      <h5>📊 Analytics</h5>
                      <p>Advanced market analytics and price tracking</p>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="feature-preview">
                      <h5>🏆 Rewards</h5>
                      <p>Earn rewards for trading and collecting</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* NFT Detail Modal */}
      <Modal show={showNFTModal} onHide={() => setShowNFTModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNFT?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNFT && (
            <Row>
              <Col md={6}>
                <img 
                  src={selectedNFT.image} 
                  alt={selectedNFT.name}
                  className="w-100 rounded"
                />
              </Col>
              <Col md={6}>
                <div className="nft-details">
                  <div className="mb-3">
                    <Badge bg="primary">{selectedNFT.network}</Badge>
                    {selectedNFT.isVerified && <Badge bg="success" className="ms-2">Verified</Badge>}
                  </div>
                  
                  <h5>{selectedNFT.collection}</h5>
                  <p className="text-muted">{selectedNFT.description}</p>
                  
                  <div className="price-section mb-3">
                    <h4>{selectedNFT.price} {selectedNFT.currency}</h4>
                    <small className="text-muted">${selectedNFT.usdPrice}</small>
                  </div>
                  
                  <div className="nft-info mb-3">
                    <div><strong>Creator:</strong> {selectedNFT.creator}</div>
                    <div><strong>Owner:</strong> {selectedNFT.owner}</div>
                    <div><strong>Category:</strong> {selectedNFT.category}</div>
                  </div>
                  
                  <div className="attributes mb-3">
                    <h6>Attributes</h6>
                    {selectedNFT.attributes.map((attr, index) => (
                      <Badge key={index} bg="secondary" className="me-2 mb-2">
                        {attr.trait_type}: {attr.value}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="nft-stats">
                    <small>❤️ {selectedNFT.likes} likes • 👁️ {selectedNFT.views} views</small>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNFTModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowNFTModal(false);
              setShowComingSoonModal(true);
            }}
          >
            {selectedNFT?.isAuction ? 'Place Bid' : 'Buy Now'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Coming Soon Modal */}
      <Modal show={showComingSoonModal} onHide={() => setShowComingSoonModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🚀 Coming Soon!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5>This feature is under development</h5>
          <p>We're working hard to bring you the best NFT trading experience across all blockchain networks.</p>
          <p>Stay tuned for updates!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowComingSoonModal(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Legacy NFT Home wrapper
const NftHome = () => {
  const [activeTab, setActiveTab] = useState('enhanced');
  
  return (
    <div className="nft-home-container">
      <Tabs 
        className="nft-home-tabs" 
        activeKey={activeTab}
        onChange={setActiveTab}
        centered 
        size="large"
      >
        <TabPane tab="Enhanced Marketplace" key="enhanced">
          <EnhancedNFTHome />
        </TabPane>
        <TabPane tab="Legacy View" key="legacy">
          {/* Legacy NFT content would go here */}
          <div className="legacy-nft-placeholder text-center py-5">
            <h4>Legacy NFT Marketplace</h4>
            <p>Original NFT marketplace interface</p>
            <Badge bg="warning">Coming Soon</Badge>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default NftHome;

