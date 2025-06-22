import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Upload, 
  message, 
  Steps,
  Divider,
  Tag,
  Tooltip,
  Progress
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  InfoCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  FireOutlined,
  CrownOutlined
} from '@ant-design/icons';
import './CreatorDashboard.css';

const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const CreatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mintModalVisible, setMintModalVisible] = useState(false);
  const [mintStep, setMintStep] = useState(0);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock dashboard data
  const mockDashboardData = {
    overview: {
      total_nfts: 156,
      total_collections: 8,
      total_sales: 89,
      total_volume: 45.7,
      total_royalties: 12.3,
      royalty_payments: 234,
      active_auctions: 12,
      floor_price: { amount: 0.85, currency: 'ETH' }
    },
    recent_activity: [
      {
        type: 'SALE',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        data: {
          nft_name: 'Cosmic Warrior #1234',
          collection_name: 'Cosmic Warriors',
          price: 2.5,
          currency: 'ETH'
        }
      },
      {
        type: 'MINT',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        data: {
          nft_name: 'Digital Dreams #0567',
          collection_name: 'Digital Dreams',
          blockchain: 'ETH'
        }
      },
      {
        type: 'ROYALTY',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        data: {
          nft_name: 'Space Explorer #4455',
          collection_name: 'Space Explorers',
          royalty_amount: 0.15,
          currency: 'SOL'
        }
      }
    ],
    collections: [
      {
        id: 1,
        name: 'Cosmic Warriors',
        total_nfts: 45,
        minted_nfts: 45,
        total_sales: 23,
        total_volume: 18.5,
        floor_price: 0.85,
        royalty_percentage: 7.5
      },
      {
        id: 2,
        name: 'Digital Dreams',
        total_nfts: 30,
        minted_nfts: 28,
        total_sales: 15,
        total_volume: 12.3,
        floor_price: 1.2,
        royalty_percentage: 5.0
      },
      {
        id: 3,
        name: 'Space Explorers',
        total_nfts: 50,
        minted_nfts: 42,
        total_sales: 31,
        total_volume: 8.9,
        floor_price: 0.45,
        royalty_percentage: 10.0
      }
    ],
    top_nfts: [
      {
        id: 1,
        name: 'Cosmic Warrior #1234',
        image_url: 'https://via.placeholder.com/150x150/6366f1/ffffff?text=CW',
        total_volume: 8.5,
        sales_count: 5,
        highest_sale: 2.5
      },
      {
        id: 2,
        name: 'Digital Dreams #0567',
        image_url: 'https://via.placeholder.com/150x150/8b5cf6/ffffff?text=DD',
        total_volume: 6.2,
        sales_count: 4,
        highest_sale: 1.8
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMintSubmit = async (values) => {
    setUploading(true);
    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      message.success('NFT minted successfully!');
      setMintModalVisible(false);
      setMintStep(0);
      form.resetFields();
    } catch (error) {
      message.error('Minting failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'SALE':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'MINT':
        return <PlusOutlined style={{ color: '#1890ff' }} />;
      case 'ROYALTY':
        return <CrownOutlined style={{ color: '#faad14' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  if (loading) {
    return (
      <div className="creator-dashboard-loading">
        <LoadingOutlined style={{ fontSize: 48 }} />
        <p>Loading your creator dashboard...</p>
      </div>
    );
  }

  return (
    <div className="creator-dashboard">
      {/* Header */}
      <div className="creator-dashboard-header">
        <div className="creator-header-content">
          <h1 className="creator-dashboard-title">Creator Dashboard</h1>
          <p className="creator-dashboard-subtitle">
            Manage your NFT collections, track performance, and grow your creative business
          </p>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />}
            className="creator-mint-btn"
            onClick={() => setMintModalVisible(true)}
          >
            Mint New NFT
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="creator-dashboard-nav">
        <div className="creator-nav-tabs">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'collections', label: 'Collections' },
            { key: 'analytics', label: 'Analytics' },
            { key: 'royalties', label: 'Royalties' },
            { key: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`creator-nav-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="creator-dashboard-content">
        {activeTab === 'overview' && (
          <div className="creator-overview">
            {/* Stats Cards */}
            <Row gutter={[24, 24]} className="creator-stats-row">
              <Col xs={24} sm={12} lg={6}>
                <Card className="creator-stat-card">
                  <div className="creator-stat-content">
                    <div className="creator-stat-number">{dashboardData.overview.total_nfts}</div>
                    <div className="creator-stat-label">Total NFTs</div>
                  </div>
                  <div className="creator-stat-icon">
                    <FireOutlined />
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="creator-stat-card">
                  <div className="creator-stat-content">
                    <div className="creator-stat-number">{dashboardData.overview.total_volume}</div>
                    <div className="creator-stat-label">Total Volume (ETH)</div>
                  </div>
                  <div className="creator-stat-icon">
                    <CrownOutlined />
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="creator-stat-card">
                  <div className="creator-stat-content">
                    <div className="creator-stat-number">{dashboardData.overview.total_sales}</div>
                    <div className="creator-stat-label">Total Sales</div>
                  </div>
                  <div className="creator-stat-icon">
                    <CheckCircleOutlined />
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="creator-stat-card">
                  <div className="creator-stat-content">
                    <div className="creator-stat-number">{dashboardData.overview.total_royalties}</div>
                    <div className="creator-stat-label">Royalties (ETH)</div>
                  </div>
                  <div className="creator-stat-icon">
                    <CrownOutlined />
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              {/* Recent Activity */}
              <Col xs={24} lg={12}>
                <Card title="Recent Activity" className="creator-activity-card">
                  <div className="creator-activity-list">
                    {dashboardData.recent_activity.map((activity, index) => (
                      <div key={index} className="creator-activity-item">
                        <div className="creator-activity-icon">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="creator-activity-content">
                          <div className="creator-activity-title">
                            {activity.type === 'SALE' && `Sold ${activity.data.nft_name}`}
                            {activity.type === 'MINT' && `Minted ${activity.data.nft_name}`}
                            {activity.type === 'ROYALTY' && `Royalty from ${activity.data.nft_name}`}
                          </div>
                          <div className="creator-activity-details">
                            {activity.type === 'SALE' && (
                              <span>{activity.data.price} {activity.data.currency}</span>
                            )}
                            {activity.type === 'ROYALTY' && (
                              <span>{activity.data.royalty_amount} {activity.data.currency}</span>
                            )}
                            <span className="creator-activity-time">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              {/* Top Performing NFTs */}
              <Col xs={24} lg={12}>
                <Card title="Top Performing NFTs" className="creator-top-nfts-card">
                  <div className="creator-top-nfts-list">
                    {dashboardData.top_nfts.map((nft, index) => (
                      <div key={nft.id} className="creator-top-nft-item">
                        <div className="creator-top-nft-rank">#{index + 1}</div>
                        <img 
                          src={nft.image_url} 
                          alt={nft.name}
                          className="creator-top-nft-image"
                        />
                        <div className="creator-top-nft-info">
                          <div className="creator-top-nft-name">{nft.name}</div>
                          <div className="creator-top-nft-stats">
                            <span>{nft.total_volume} ETH volume</span>
                            <span>{nft.sales_count} sales</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="creator-collections">
            <Row gutter={[24, 24]}>
              {dashboardData.collections.map(collection => (
                <Col xs={24} md={12} lg={8} key={collection.id}>
                  <Card className="creator-collection-card">
                    <div className="creator-collection-header">
                      <h3 className="creator-collection-name">{collection.name}</h3>
                      <Tag color="blue">{collection.minted_nfts}/{collection.total_nfts} minted</Tag>
                    </div>
                    <div className="creator-collection-stats">
                      <div className="creator-collection-stat">
                        <span className="creator-collection-stat-label">Volume</span>
                        <span className="creator-collection-stat-value">{collection.total_volume} ETH</span>
                      </div>
                      <div className="creator-collection-stat">
                        <span className="creator-collection-stat-label">Sales</span>
                        <span className="creator-collection-stat-value">{collection.total_sales}</span>
                      </div>
                      <div className="creator-collection-stat">
                        <span className="creator-collection-stat-label">Floor</span>
                        <span className="creator-collection-stat-value">{collection.floor_price} ETH</span>
                      </div>
                      <div className="creator-collection-stat">
                        <span className="creator-collection-stat-label">Royalty</span>
                        <span className="creator-collection-stat-value">{collection.royalty_percentage}%</span>
                      </div>
                    </div>
                    <Progress 
                      percent={(collection.minted_nfts / collection.total_nfts) * 100}
                      strokeColor="#667eea"
                      className="creator-collection-progress"
                    />
                    <Button type="primary" block className="creator-collection-btn">
                      Manage Collection
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>

      {/* Mint NFT Modal */}
      <Modal
        title="Mint New NFT"
        visible={mintModalVisible}
        onCancel={() => {
          setMintModalVisible(false);
          setMintStep(0);
          form.resetFields();
        }}
        footer={null}
        width={800}
        className="creator-mint-modal"
      >
        <Steps current={mintStep} className="creator-mint-steps">
          <Step title="Upload Media" />
          <Step title="Add Details" />
          <Step title="Set Properties" />
          <Step title="Mint NFT" />
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleMintSubmit}
          className="creator-mint-form"
        >
          {mintStep === 0 && (
            <div className="creator-mint-step">
              <h3>Upload Your Media</h3>
              <Form.Item
                name="media"
                label="NFT Media"
                rules={[{ required: true, message: 'Please upload your NFT media' }]}
              >
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  accept="image/*,video/*,audio/*"
                  beforeUpload={() => false}
                  className="creator-upload-dragger"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for images, videos, and audio files. Max size: 100MB
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </div>
          )}

          {mintStep === 1 && (
            <div className="creator-mint-step">
              <h3>Add NFT Details</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="NFT Name"
                    rules={[{ required: true, message: 'Please enter NFT name' }]}
                  >
                    <Input placeholder="Enter NFT name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="collection"
                    label="Collection"
                    rules={[{ required: true, message: 'Please select collection' }]}
                  >
                    <Select placeholder="Select collection">
                      <Option value="cosmic-warriors">Cosmic Warriors</Option>
                      <Option value="digital-dreams">Digital Dreams</Option>
                      <Option value="space-explorers">Space Explorers</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <TextArea rows={4} placeholder="Describe your NFT..." />
              </Form.Item>
            </div>
          )}

          {mintStep === 2 && (
            <div className="creator-mint-step">
              <h3>Set Properties & Pricing</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="blockchain"
                    label="Blockchain"
                    rules={[{ required: true, message: 'Please select blockchain' }]}
                  >
                    <Select placeholder="Select blockchain">
                      <Option value="ETH">Ethereum</Option>
                      <Option value="BNB">BNB Chain</Option>
                      <Option value="AVAX">Avalanche</Option>
                      <Option value="MATIC">Polygon</Option>
                      <Option value="SOL">Solana</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="royalty"
                    label="Royalty Percentage"
                    rules={[{ required: true, message: 'Please set royalty percentage' }]}
                  >
                    <InputNumber
                      min={0}
                      max={20}
                      step={0.5}
                      placeholder="5.0"
                      style={{ width: '100%' }}
                      addonAfter="%"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {mintStep === 3 && (
            <div className="creator-mint-step">
              <h3>Review & Mint</h3>
              <div className="creator-mint-review">
                <p>Review your NFT details and confirm minting.</p>
                <div className="creator-mint-gas-estimate">
                  <div className="creator-gas-info">
                    <span>Estimated Gas Fee:</span>
                    <span className="creator-gas-amount">0.025 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="creator-mint-actions">
            {mintStep > 0 && (
              <Button onClick={() => setMintStep(mintStep - 1)}>
                Previous
              </Button>
            )}
            {mintStep < 3 ? (
              <Button type="primary" onClick={() => setMintStep(mintStep + 1)}>
                Next
              </Button>
            ) : (
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={uploading}
                className="creator-mint-submit"
              >
                {uploading ? 'Minting...' : 'Mint NFT'}
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreatorDashboard;

