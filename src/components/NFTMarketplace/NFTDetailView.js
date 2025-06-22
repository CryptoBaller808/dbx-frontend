import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Avatar, 
  Tooltip, 
  Badge, 
  Divider,
  Tabs,
  List,
  Modal,
  Form,
  InputNumber,
  message,
  Spin,
  Statistic,
  Progress
} from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  ShareAltOutlined,
  EyeOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import './NFTDetailView.css';

const { TabPane } = Tabs;

const NFTDetailView = ({ nftId, onClose }) => {
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock NFT data
  const mockNFT = {
    id: 1,
    name: "Cosmic Warrior #1234",
    description: "A legendary warrior from the cosmic realm with rare attributes and mystical powers. This unique piece represents the pinnacle of digital artistry, combining traditional warrior aesthetics with futuristic cosmic elements. The intricate details and vibrant colors make this NFT a true masterpiece in the collection.",
    image: "https://via.placeholder.com/600x600/6366f1/ffffff?text=Cosmic+Warrior",
    price: 2.5,
    currency: "ETH",
    creator: {
      name: "ArtistPro",
      avatar: "https://via.placeholder.com/60x60/f59e0b/ffffff?text=AP",
      verified: true,
      bio: "Digital artist specializing in cosmic and fantasy themes",
      followers: 12500,
      created_nfts: 156
    },
    owner: {
      name: "CollectorX",
      avatar: "https://via.placeholder.com/60x60/10b981/ffffff?text=CX",
      verified: false
    },
    collection: {
      name: "Cosmic Warriors",
      total_items: 10000,
      floor_price: 0.85,
      volume: 1250.5
    },
    blockchain: "ETH",
    category: "Art",
    rarity: "Legendary",
    rarity_rank: 45,
    views: 1250,
    likes: 89,
    created_at: new Date('2024-01-15'),
    auction: {
      type: "auction",
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      currentBid: 2.5,
      bidCount: 12,
      minBidIncrement: 0.1,
      reservePrice: 2.0,
      startingPrice: 1.5
    },
    attributes: [
      { trait_type: "Background", value: "Cosmic Nebula", rarity: 5.2 },
      { trait_type: "Armor", value: "Quantum Steel", rarity: 2.1 },
      { trait_type: "Weapon", value: "Plasma Sword", rarity: 1.8 },
      { trait_type: "Power Level", value: "9500", rarity: 0.5 },
      { trait_type: "Element", value: "Cosmic", rarity: 3.7 },
      { trait_type: "Aura", value: "Legendary", rarity: 0.8 }
    ],
    transaction_history: [
      {
        type: "SALE",
        from: "0x1234...5678",
        to: "0x8765...4321",
        price: 2.2,
        currency: "ETH",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tx_hash: "0xabcd...efgh"
      },
      {
        type: "BID",
        from: "0x2468...1357",
        to: null,
        price: 2.5,
        currency: "ETH",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tx_hash: "0xijkl...mnop"
      },
      {
        type: "MINT",
        from: "0x0000...0000",
        to: "0x1234...5678",
        price: 0,
        currency: "ETH",
        timestamp: new Date('2024-01-15'),
        tx_hash: "0xqrst...uvwx"
      }
    ],
    bid_history: [
      {
        bidder: "0x2468...1357",
        amount: 2.5,
        currency: "ETH",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        bidder: "0x1357...2468",
        amount: 2.3,
        currency: "ETH",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        bidder: "0x9876...5432",
        amount: 2.1,
        currency: "ETH",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNft(mockNFT);
      setLoading(false);
    }, 1000);
  }, [nftId]);

  const toggleFavorite = () => {
    setFavorite(!favorite);
    message.success(favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleBid = async (values) => {
    try {
      // Simulate bid placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Bid placed successfully!');
      setBidModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to place bid. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    try {
      // Simulate purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Purchase successful!');
      setBuyModalVisible(false);
    } catch (error) {
      message.error('Purchase failed. Please try again.');
    }
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

  const formatTimeRemaining = (endTime) => {
    if (!endTime) return null;
    
    const now = new Date();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="nft-detail-loading">
        <Spin size="large" />
        <p>Loading NFT details...</p>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="nft-detail-error">
        <p>NFT not found</p>
      </div>
    );
  }

  return (
    <div className="nft-detail-view">
      <div className="nft-detail-container">
        <Row gutter={[40, 40]}>
          {/* Left Column - Image */}
          <Col xs={24} lg={12}>
            <div className="nft-detail-image-section">
              <div className="nft-detail-image-container">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="nft-detail-image"
                />
                <div className="nft-detail-image-overlay">
                  <div className="nft-detail-image-actions">
                    <Tooltip title="View Full Size">
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<EyeOutlined />}
                        className="nft-image-action-btn"
                      />
                    </Tooltip>
                    <Tooltip title="Share">
                      <Button
                        shape="circle"
                        icon={<ShareAltOutlined />}
                        className="nft-image-action-btn"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div className="nft-detail-badges">
                  <Tag 
                    color={getRarityColor(nft.rarity)}
                    className="nft-detail-rarity-badge"
                  >
                    {nft.rarity === 'Legendary' && <CrownOutlined />}
                    {nft.rarity === 'Mythic' && <FireOutlined />}
                    {nft.rarity} #{nft.rarity_rank}
                  </Tag>
                  <Tag color="#1890ff" className="nft-detail-blockchain-badge">
                    {nft.blockchain}
                  </Tag>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Column - Details */}
          <Col xs={24} lg={12}>
            <div className="nft-detail-info-section">
              {/* Header */}
              <div className="nft-detail-header">
                <div className="nft-detail-collection">
                  <span>{nft.collection.name}</span>
                  <Badge 
                    count={<ThunderboltOutlined style={{ color: '#1890ff' }} />}
                    offset={[5, 0]}
                  />
                </div>
                <h1 className="nft-detail-title">{nft.name}</h1>
                <div className="nft-detail-stats">
                  <span><EyeOutlined /> {nft.views} views</span>
                  <span><HeartOutlined /> {nft.likes} likes</span>
                  <Button
                    type={favorite ? "primary" : "default"}
                    icon={favorite ? <HeartFilled /> : <HeartOutlined />}
                    onClick={toggleFavorite}
                    className="nft-favorite-btn"
                  >
                    {favorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                </div>
              </div>

              {/* Creator & Owner */}
              <div className="nft-detail-people">
                <div className="nft-detail-person">
                  <span className="nft-person-label">Creator</span>
                  <div className="nft-person-info">
                    <Avatar src={nft.creator.avatar} size={40} />
                    <div className="nft-person-details">
                      <div className="nft-person-name">
                        {nft.creator.name}
                        {nft.creator.verified && (
                          <Badge 
                            count={<ThunderboltOutlined style={{ color: '#1890ff' }} />}
                            offset={[5, 0]}
                          />
                        )}
                      </div>
                      <div className="nft-person-stats">
                        {nft.creator.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>
                </div>
                <div className="nft-detail-person">
                  <span className="nft-person-label">Owner</span>
                  <div className="nft-person-info">
                    <Avatar src={nft.owner.avatar} size={40} />
                    <div className="nft-person-details">
                      <div className="nft-person-name">
                        {nft.owner.name}
                        {nft.owner.verified && (
                          <Badge 
                            count={<ThunderboltOutlined style={{ color: '#1890ff' }} />}
                            offset={[5, 0]}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Auction Info */}
              <div className="nft-detail-price-section">
                {nft.auction.type === 'auction' ? (
                  <div className="nft-auction-info">
                    <div className="nft-auction-header">
                      <span className="nft-auction-label">Current Bid</span>
                      <div className="nft-auction-timer">
                        <ClockCircleOutlined />
                        <span>{formatTimeRemaining(nft.auction.endTime)}</span>
                      </div>
                    </div>
                    <div className="nft-current-bid">
                      <span className="nft-bid-amount">{nft.auction.currentBid}</span>
                      <span className="nft-bid-currency">{nft.currency}</span>
                    </div>
                    <div className="nft-bid-stats">
                      <span>{nft.auction.bidCount} bids</span>
                      <span>Reserve: {nft.auction.reservePrice} {nft.currency}</span>
                    </div>
                  </div>
                ) : (
                  <div className="nft-fixed-price">
                    <span className="nft-price-label">Price</span>
                    <div className="nft-price-amount">
                      <span className="nft-price-value">{nft.price}</span>
                      <span className="nft-price-currency">{nft.currency}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="nft-detail-actions">
                {nft.auction.type === 'auction' ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Button 
                        type="primary" 
                        size="large" 
                        block
                        className="nft-bid-btn"
                        onClick={() => setBidModalVisible(true)}
                      >
                        Place Bid
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button 
                        size="large" 
                        block
                        className="nft-buy-now-btn"
                        onClick={() => setBuyModalVisible(true)}
                      >
                        Buy Now
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    className="nft-buy-btn"
                    onClick={() => setBuyModalVisible(true)}
                  >
                    Buy Now
                  </Button>
                )}
              </div>

              {/* Collection Stats */}
              <div className="nft-collection-stats">
                <h3>Collection Stats</h3>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Items"
                      value={nft.collection.total_items}
                      formatter={(value) => value.toLocaleString()}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Floor Price"
                      value={nft.collection.floor_price}
                      suffix="ETH"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Volume"
                      value={nft.collection.volume}
                      suffix="ETH"
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Tabs Section */}
        <div className="nft-detail-tabs">
          <Tabs defaultActiveKey="description" size="large">
            <TabPane tab="Description" key="description">
              <div className="nft-description">
                <p>{nft.description}</p>
              </div>
            </TabPane>
            
            <TabPane tab="Attributes" key="attributes">
              <div className="nft-attributes">
                <Row gutter={[16, 16]}>
                  {nft.attributes.map((attr, index) => (
                    <Col xs={12} sm={8} md={6} key={index}>
                      <Card className="nft-attribute-card">
                        <div className="nft-attribute-type">{attr.trait_type}</div>
                        <div className="nft-attribute-value">{attr.value}</div>
                        <div className="nft-attribute-rarity">{attr.rarity}% rarity</div>
                        <Progress 
                          percent={100 - attr.rarity} 
                          showInfo={false}
                          strokeColor="#667eea"
                          size="small"
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </TabPane>
            
            <TabPane tab="Transaction History" key="history">
              <div className="nft-transaction-history">
                <List
                  dataSource={nft.transaction_history}
                  renderItem={(transaction) => (
                    <List.Item className="nft-transaction-item">
                      <div className="nft-transaction-content">
                        <div className="nft-transaction-type">
                          <Tag color={
                            transaction.type === 'SALE' ? 'green' :
                            transaction.type === 'BID' ? 'blue' : 'orange'
                          }>
                            {transaction.type}
                          </Tag>
                        </div>
                        <div className="nft-transaction-details">
                          <div className="nft-transaction-addresses">
                            <span>From: {formatAddress(transaction.from)}</span>
                            {transaction.to && (
                              <span>To: {formatAddress(transaction.to)}</span>
                            )}
                          </div>
                          {transaction.price > 0 && (
                            <div className="nft-transaction-price">
                              {transaction.price} {transaction.currency}
                            </div>
                          )}
                        </div>
                        <div className="nft-transaction-time">
                          {transaction.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>
            
            <TabPane tab="Bid History" key="bids">
              <div className="nft-bid-history">
                <List
                  dataSource={nft.bid_history}
                  renderItem={(bid, index) => (
                    <List.Item className="nft-bid-item">
                      <div className="nft-bid-content">
                        <div className="nft-bid-rank">#{index + 1}</div>
                        <div className="nft-bid-details">
                          <div className="nft-bid-amount">
                            {bid.amount} {bid.currency}
                          </div>
                          <div className="nft-bid-bidder">
                            by {formatAddress(bid.bidder)}
                          </div>
                        </div>
                        <div className="nft-bid-time">
                          {bid.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>

      {/* Bid Modal */}
      <Modal
        title="Place Bid"
        visible={bidModalVisible}
        onCancel={() => setBidModalVisible(false)}
        footer={null}
        className="nft-bid-modal"
      >
        <Form form={form} onFinish={handleBid} layout="vertical">
          <div className="nft-bid-info">
            <p>Current highest bid: <strong>{nft.auction.currentBid} {nft.currency}</strong></p>
            <p>Minimum bid: <strong>{nft.auction.currentBid + nft.auction.minBidIncrement} {nft.currency}</strong></p>
          </div>
          <Form.Item
            name="bidAmount"
            label="Your Bid"
            rules={[
              { required: true, message: 'Please enter your bid amount' },
              { 
                type: 'number', 
                min: nft.auction.currentBid + nft.auction.minBidIncrement,
                message: `Bid must be at least ${nft.auction.currentBid + nft.auction.minBidIncrement} ${nft.currency}`
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter bid amount"
              step={0.01}
              addonAfter={nft.currency}
            />
          </Form.Item>
          <div className="nft-bid-actions">
            <Button onClick={() => setBidModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Place Bid
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Buy Now Modal */}
      <Modal
        title="Buy NFT"
        visible={buyModalVisible}
        onCancel={() => setBuyModalVisible(false)}
        onOk={handleBuyNow}
        okText="Confirm Purchase"
        className="nft-buy-modal"
      >
        <div className="nft-buy-confirmation">
          <div className="nft-buy-item">
            <img src={nft.image} alt={nft.name} className="nft-buy-image" />
            <div className="nft-buy-details">
              <h3>{nft.name}</h3>
              <p>{nft.collection.name}</p>
            </div>
          </div>
          <div className="nft-buy-price">
            <span>Total: <strong>{nft.price} {nft.currency}</strong></span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NFTDetailView;

