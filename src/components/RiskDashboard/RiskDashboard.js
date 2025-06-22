import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './RiskDashboard.css';

/**
 * Risk Dashboard Component
 * Real-time risk monitoring and visualization for trading operations
 */
const RiskDashboard = () => {
  const dispatch = useDispatch();
  const [riskData, setRiskData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  // Connect to risk data WebSocket
  useEffect(() => {
    connectToRiskFeed();
    fetchInitialData();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch('/api/risk/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setRiskData(result.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('[RiskDashboard] Failed to fetch initial data:', error);
      setLoading(false);
    }
  };

  const connectToRiskFeed = () => {
    try {
      const wsUrl = `ws://localhost:3000`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log('[RiskDashboard] Connected to risk feed');
        setIsConnected(true);
        
        // Subscribe to risk data feed
        socketRef.current.send(JSON.stringify({
          type: 'subscribe_risk_feed'
        }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleRiskUpdate(data);
      };

      socketRef.current.onclose = () => {
        console.log('[RiskDashboard] Disconnected from risk feed');
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        setTimeout(connectToRiskFeed, 5000);
      };

      socketRef.current.onerror = (error) => {
        console.error('[RiskDashboard] WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('[RiskDashboard] Failed to connect to risk feed:', error);
      setIsConnected(false);
    }
  };

  const handleRiskUpdate = (data) => {
    switch (data.type) {
      case 'risk_dashboard':
        setRiskData(data.data);
        break;
      case 'circuit_breaker':
        addAlert('CIRCUIT_BREAKER', `Circuit breaker triggered for ${data.symbol}`, 'CRITICAL');
        break;
      case 'suspicious_activity':
        addAlert('SUSPICIOUS_ACTIVITY', `Suspicious activity detected for user ${data.userId}`, 'HIGH');
        break;
      case 'high_risk_user':
        addAlert('HIGH_RISK_USER', `High risk user detected: ${data.userId}`, 'MEDIUM');
        break;
      default:
        console.log('[RiskDashboard] Unknown update type:', data.type);
    }
  };

  const addAlert = (type, message, severity) => {
    const alert = {
      id: Date.now() + Math.random(),
      type,
      message,
      severity,
      timestamp: Date.now()
    };
    
    setAlerts(prev => [alert, ...prev.slice(0, 49)]); // Keep last 50 alerts
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toFixed(0) || '0';
  };

  const formatPercentage = (num) => {
    return ((num || 0) * 100).toFixed(2) + '%';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'CIRCUIT_BREAKER':
        return '🛑';
      case 'SUSPICIOUS_ACTIVITY':
        return '⚠️';
      case 'HIGH_RISK_USER':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'severity-critical';
      case 'HIGH':
        return 'severity-high';
      case 'MEDIUM':
        return 'severity-medium';
      case 'LOW':
        return 'severity-low';
      default:
        return 'severity-info';
    }
  };

  const renderOverview = () => {
    if (!riskData) {
      return (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      );
    }

    const { system, positions, circuitBreakers, manipulation } = riskData;

    return (
      <div className="overview-section">
        {/* System Status */}
        <div className="system-status">
          <div className="status-item">
            <div className={`status-icon ${system?.isRunning ? 'healthy' : 'error'}`}></div>
            <div className="status-text">Risk System: {system?.isRunning ? 'Active' : 'Inactive'}</div>
          </div>
          <div className="status-item">
            <div className={`status-icon ${circuitBreakers?.active === 0 ? 'healthy' : 'warning'}`}></div>
            <div className="status-text">Circuit Breakers: {circuitBreakers?.active || 0} Active</div>
          </div>
          <div className="status-item">
            <div className={`status-icon ${manipulation?.suspiciousActivities?.length === 0 ? 'healthy' : 'warning'}`}></div>
            <div className="status-text">Suspicious Activities: {manipulation?.suspiciousActivities?.length || 0}</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="overview-grid">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">Total Positions</div>
              <div className="metric-icon">📊</div>
            </div>
            <div className="metric-value">{formatNumber(positions?.totalPositions || 0)}</div>
            <div className="metric-change neutral">Active trading positions</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">Risk Assessments</div>
              <div className="metric-icon">🔍</div>
            </div>
            <div className="metric-value">{formatNumber(system?.stats?.assessmentsPerformed || 0)}</div>
            <div className="metric-change neutral">Total assessments performed</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">Blocked Trades</div>
              <div className="metric-icon">🚫</div>
            </div>
            <div className="metric-value">{formatNumber(system?.stats?.tradesBlocked || 0)}</div>
            <div className="metric-change negative">High-risk trades blocked</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">System Uptime</div>
              <div className="metric-icon">⏱️</div>
            </div>
            <div className="metric-value">{Math.floor((system?.uptime || 0) / 3600000)}h</div>
            <div className="metric-change positive">Continuous monitoring</div>
          </div>
        </div>
      </div>
    );
  };

  const renderCircuitBreakers = () => {
    if (!riskData?.circuitBreakers) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">🛑</div>
          <div className="empty-state-title">No Circuit Breaker Data</div>
          <div className="empty-state-message">Circuit breaker information will appear here when available.</div>
        </div>
      );
    }

    const { active, history } = riskData.circuitBreakers;

    return (
      <div className="breakers-section">
        <div className="section-title">Active Circuit Breakers ({active?.length || 0})</div>
        
        {active?.length > 0 ? (
          <div className="breakers-grid">
            {active.map((breaker, index) => (
              <div key={index} className="breaker-card active">
                <div className="breaker-header">
                  <div className="breaker-symbol">{breaker.symbol}</div>
                  <div className="breaker-status active">ACTIVE</div>
                </div>
                <div className="breaker-details">
                  <strong>Type:</strong> {breaker.type}<br/>
                  <strong>Reason:</strong> {breaker.data?.reason || 'Market protection'}<br/>
                  <strong>Triggered:</strong> {formatTime(breaker.triggeredAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-title">No Active Circuit Breakers</div>
            <div className="empty-state-message">All markets are operating normally.</div>
          </div>
        )}

        <div className="section-title" style={{ marginTop: '32px' }}>Recent History</div>
        
        {history?.length > 0 ? (
          <div className="breakers-grid">
            {history.slice(0, 6).map((breaker, index) => (
              <div key={index} className="breaker-card">
                <div className="breaker-header">
                  <div className="breaker-symbol">{breaker.symbol}</div>
                  <div className={`breaker-status ${breaker.active ? 'active' : 'inactive'}`}>
                    {breaker.active ? 'ACTIVE' : 'RESOLVED'}
                  </div>
                </div>
                <div className="breaker-details">
                  <strong>Type:</strong> {breaker.type}<br/>
                  <strong>Duration:</strong> {Math.floor((Date.now() - breaker.triggeredAt) / 60000)}m
                </div>
                <div className="breaker-time">{formatTime(breaker.triggeredAt)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-title">No Historical Data</div>
            <div className="empty-state-message">Circuit breaker history will appear here.</div>
          </div>
        )}
      </div>
    );
  };

  const renderSuspiciousActivities = () => {
    if (!riskData?.manipulation?.suspiciousActivities) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No Suspicious Activities</div>
          <div className="empty-state-message">Suspicious activity monitoring is active. No issues detected.</div>
        </div>
      );
    }

    const activities = riskData.manipulation.suspiciousActivities;

    if (activities.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <div className="empty-state-title">All Clear</div>
          <div className="empty-state-message">No suspicious trading activities detected.</div>
        </div>
      );
    }

    return (
      <div className="activities-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-card">
            <div className="activity-header">
              <div className="activity-user">User: {activity.userId}</div>
              <div className={`activity-score ${activity.suspicionScore > 0.8 ? 'high' : activity.suspicionScore > 0.5 ? 'medium' : 'low'}`}>
                Risk: {(activity.suspicionScore * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="activity-rules">
              {activity.detectedRules?.map((rule, ruleIndex) => (
                <span key={ruleIndex} className="rule-tag">
                  {rule.name}
                </span>
              ))}
            </div>
            
            <div className="activity-time">{formatTime(activity.timestamp)}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderAlerts = () => {
    if (alerts.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <div className="empty-state-title">No Active Alerts</div>
          <div className="empty-state-message">Risk monitoring alerts will appear here when triggered.</div>
        </div>
      );
    }

    return (
      <div className="alerts-container">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.severity.toLowerCase()}`}>
            <div className="alert-icon">{getAlertIcon(alert.type)}</div>
            <div className="alert-content">
              <div className="alert-title">{alert.type.replace('_', ' ')}</div>
              <div className="alert-message">{alert.message}</div>
              <div className="alert-time">{formatTime(alert.timestamp)}</div>
            </div>
            <button 
              className="alert-dismiss"
              onClick={() => dismissAlert(alert.id)}
              title="Dismiss alert"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="risk-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="risk-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Risk Management Dashboard</h1>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${selectedTab === 'breakers' ? 'active' : ''}`}
          onClick={() => setSelectedTab('breakers')}
        >
          Circuit Breakers
        </button>
        <button 
          className={`tab-button ${selectedTab === 'activities' ? 'active' : ''}`}
          onClick={() => setSelectedTab('activities')}
        >
          Suspicious Activities
        </button>
        <button 
          className={`tab-button ${selectedTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setSelectedTab('alerts')}
        >
          Alerts ({alerts.length})
        </button>
      </div>

      <div className="dashboard-content">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'breakers' && renderCircuitBreakers()}
        {selectedTab === 'activities' && renderSuspiciousActivities()}
        {selectedTab === 'alerts' && renderAlerts()}
      </div>
    </div>
  );
};

export default RiskDashboard;
        console.error('[RiskDashboard] WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('[RiskDashboard] Connection error:', error);
      setIsConnected(false);
    }
  };

  const handleRiskUpdate = (data) => {
    switch (data.type) {
      case 'RISK_DASHBOARD':
        setRiskData(data.data);
        break;
      
      case 'CIRCUIT_BREAKER':
        addAlert({
          type: 'CIRCUIT_BREAKER',
          severity: 'HIGH',
          message: `Circuit breaker activated for ${data.symbol}: ${data.reason}`,
          timestamp: Date.now()
        });
        break;
      
      case 'SUSPICIOUS_ACTIVITY':
        addAlert({
          type: 'SUSPICIOUS_ACTIVITY',
          severity: 'MEDIUM',
          message: `Suspicious activity detected for user ${data.userId}`,
          timestamp: Date.now()
        });
        break;
      
      case 'HIGH_RISK_USER':
        addAlert({
          type: 'HIGH_RISK_USER',
          severity: 'HIGH',
          message: `High-risk user flagged: ${data.userId} (Score: ${data.riskScore.toFixed(3)})`,
          timestamp: Date.now()
        });
        break;
      
      default:
        console.log('[RiskDashboard] Unknown update type:', data.type);
    }
  };

  const addAlert = (alert) => {
    setAlerts(prev => [{ ...alert, id: Date.now() }, ...prev.slice(0, 49)]);
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const formatPercentage = (num) => {
    return (num * 100).toFixed(2) + '%';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'CIRCUIT_BREAKER':
        return '🛑';
      case 'SUSPICIOUS_ACTIVITY':
        return '⚠️';
      case 'HIGH_RISK_USER':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'severity-critical';
      case 'HIGH':
        return 'severity-high';
      case 'MEDIUM':
        return 'severity-medium';
      case 'LOW':
        return 'severity-low';
      default:
        return 'severity-info';
    }
  };

  const renderOverview = () => {
    if (!riskData) return <div className="loading">Loading risk data...</div>;

    const { system, positions, circuitBreakers, manipulation } = riskData;

    return (
      <div className="overview-grid">
        {/* System Status */}
        <div className="risk-card">
          <div className="card-header">
            <h3>System Status</h3>
            <div className={`status-indicator ${system.isRunning ? 'online' : 'offline'}`}>
              {system.isRunning ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>
          <div className="card-content">
            <div className="metric">
              <span className="metric-label">Uptime</span>
              <span className="metric-value">{Math.floor(system.uptime / 3600000)}h</span>
            </div>
            <div className="metric">
              <span className="metric-label">Assessments</span>
              <span className="metric-value">{formatNumber(system.stats.assessmentsPerformed)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Blocked Trades</span>
              <span className="metric-value">{formatNumber(system.stats.tradesBlocked)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Risk Violations</span>
              <span className="metric-value">{formatNumber(system.stats.riskViolations)}</span>
            </div>
          </div>
        </div>

        {/* Position Monitoring */}
        <div className="risk-card">
          <div className="card-header">
            <h3>Position Monitoring</h3>
          </div>
          <div className="card-content">
            <div className="metric">
              <span className="metric-label">Total Positions</span>
              <span className="metric-value">{formatNumber(positions.totalPositions)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Active Users</span>
              <span className="metric-value">{formatNumber(manipulation.stats.totalUsers)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">High Risk Users</span>
              <span className="metric-value">{formatNumber(manipulation.stats.highRiskUsers)}</span>
            </div>
          </div>
        </div>

        {/* Circuit Breakers */}
        <div className="risk-card">
          <div className="card-header">
            <h3>Circuit Breakers</h3>
            <div className={`status-indicator ${circuitBreakers.active > 0 ? 'warning' : 'normal'}`}>
              {circuitBreakers.active > 0 ? 'ACTIVE' : 'NORMAL'}
            </div>
          </div>
          <div className="card-content">
            <div className="metric">
              <span className="metric-label">Active Breakers</span>
              <span className="metric-value">{circuitBreakers.active}</span>
            </div>
            {circuitBreakers.history.slice(0, 3).map((breaker, index) => (
              <div key={index} className="breaker-item">
                <span className="breaker-symbol">{breaker.symbol}</span>
                <span className="breaker-type">{breaker.type}</span>
                <span className="breaker-time">{formatTime(breaker.triggeredAt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Manipulation Detection */}
        <div className="risk-card">
          <div className="card-header">
            <h3>Manipulation Detection</h3>
          </div>
          <div className="card-content">
            <div className="metric">
              <span className="metric-label">Suspicious Activities</span>
              <span className="metric-value">{formatNumber(manipulation.stats.suspiciousActivities)}</span>
            </div>
            {manipulation.suspiciousActivities.slice(0, 3).map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-user">User {activity.userId.substring(0, 8)}...</span>
                <span className="activity-score">{(activity.suspicionScore * 100).toFixed(1)}%</span>
                <span className="activity-time">{formatTime(activity.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCircuitBreakers = () => {
    if (!riskData) return <div className="loading">Loading circuit breaker data...</div>;

    const { circuitBreakers } = riskData;

    return (
      <div className="circuit-breakers-view">
        <div className="section-header">
          <h3>Circuit Breaker Status</h3>
          <div className={`status-badge ${circuitBreakers.active > 0 ? 'active' : 'normal'}`}>
            {circuitBreakers.active} Active
          </div>
        </div>

        <div className="breakers-table">
          <div className="table-header">
            <div className="col-symbol">Symbol</div>
            <div className="col-type">Type</div>
            <div className="col-status">Status</div>
            <div className="col-triggered">Triggered</div>
            <div className="col-expires">Expires</div>
          </div>
          
          {circuitBreakers.history.map((breaker, index) => (
            <div key={index} className={`table-row ${breaker.active ? 'active' : 'expired'}`}>
              <div className="col-symbol">{breaker.symbol}</div>
              <div className="col-type">{breaker.type}</div>
              <div className="col-status">
                <span className={`status-badge ${breaker.active ? 'active' : 'expired'}`}>
                  {breaker.active ? 'ACTIVE' : 'EXPIRED'}
                </span>
              </div>
              <div className="col-triggered">{formatTime(breaker.triggeredAt)}</div>
              <div className="col-expires">{formatTime(breaker.expiresAt)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSuspiciousActivities = () => {
    if (!riskData) return <div className="loading">Loading suspicious activities...</div>;

    const { manipulation } = riskData;

    return (
      <div className="suspicious-activities-view">
        <div className="section-header">
          <h3>Suspicious Activities</h3>
          <div className="stats-summary">
            <span>Total: {manipulation.stats.suspiciousActivities}</span>
            <span>High Risk Users: {manipulation.stats.highRiskUsers}</span>
          </div>
        </div>

        <div className="activities-table">
          <div className="table-header">
            <div className="col-user">User ID</div>
            <div className="col-score">Risk Score</div>
            <div className="col-rules">Triggered Rules</div>
            <div className="col-status">Status</div>
            <div className="col-time">Time</div>
          </div>
          
          {manipulation.suspiciousActivities.map((activity, index) => (
            <div key={index} className="table-row">
              <div className="col-user">{activity.userId.substring(0, 12)}...</div>
              <div className="col-score">
                <span className={`score-badge ${getSeverityClass(activity.suspicionScore > 0.8 ? 'HIGH' : activity.suspicionScore > 0.5 ? 'MEDIUM' : 'LOW')}`}>
                  {(activity.suspicionScore * 100).toFixed(1)}%
                </span>
              </div>
              <div className="col-rules">
                {activity.detectedRules.map((rule, ruleIndex) => (
                  <span key={ruleIndex} className="rule-tag">{rule.ruleId}</span>
                ))}
              </div>
              <div className="col-status">
                <span className={`status-badge ${activity.status.toLowerCase()}`}>
                  {activity.status}
                </span>
              </div>
              <div className="col-time">{formatTime(activity.timestamp)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAlerts = () => {
    return (
      <div className="alerts-view">
        <div className="section-header">
          <h3>Real-Time Alerts</h3>
          <div className="alerts-count">{alerts.length} Active</div>
        </div>

        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${getSeverityClass(alert.severity)}`}>
              <div className="alert-icon">{getAlertIcon(alert.type)}</div>
              <div className="alert-content">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-time">{formatTime(alert.timestamp)}</div>
              </div>
              <button 
                className="alert-dismiss"
                onClick={() => dismissAlert(alert.id)}
              >
                ×
              </button>
            </div>
          ))}
          
          {alerts.length === 0 && (
            <div className="no-alerts">
              <div className="no-alerts-icon">✅</div>
              <div className="no-alerts-text">No active alerts</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="risk-dashboard">
      <div className="dashboard-header">
        <h1>Risk Management Dashboard</h1>
        <div className="connection-status">
          <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
          <div className="last-update">
            Last Update: {riskData ? formatTime(riskData.timestamp) : 'Never'}
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${selectedTab === 'breakers' ? 'active' : ''}`}
          onClick={() => setSelectedTab('breakers')}
        >
          Circuit Breakers
        </button>
        <button 
          className={`tab-button ${selectedTab === 'activities' ? 'active' : ''}`}
          onClick={() => setSelectedTab('activities')}
        >
          Suspicious Activities
        </button>
        <button 
          className={`tab-button ${selectedTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setSelectedTab('alerts')}
        >
          Alerts ({alerts.length})
        </button>
      </div>

      <div className="dashboard-content">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'breakers' && renderCircuitBreakers()}
        {selectedTab === 'activities' && renderSuspiciousActivities()}
        {selectedTab === 'alerts' && renderAlerts()}
      </div>
    </div>
  );
};

export default RiskDashboard;

