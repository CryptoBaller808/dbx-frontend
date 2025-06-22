import React, { useState, useEffect } from 'react';
import { Card, Switch, Button, Typography, Space, Alert, Divider, Modal, message } from 'antd';
import { 
  SecurityScanOutlined, 
  SettingOutlined, 
  KeyOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import MFASetupModal from './MFASetupModal';
import MFAVerificationModal from './MFAVerificationModal';
import './MFASetup.css';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

/**
 * MFA Settings Component
 * Manages MFA configuration in user settings/profile
 */
const MFASettings = ({ userEmail, onMFAStatusChange }) => {
  const [mfaStatus, setMfaStatus] = useState({
    enabled: false,
    setupCompleted: false,
    remainingRecoveryCodes: 0,
    lastUsedAt: null,
    isLocked: false
  });
  const [loading, setLoading] = useState(true);
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Load MFA status on component mount
  useEffect(() => {
    loadMFAStatus();
  }, []);

  /**
   * Load current MFA status from API
   */
  const loadMFAStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mfa/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setMfaStatus(data.data);
        if (onMFAStatusChange) {
          onMFAStatusChange(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to load MFA status:', error);
      message.error('Failed to load MFA status');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle MFA toggle switch
   */
  const handleMFAToggle = (enabled) => {
    if (enabled) {
      // Enable MFA - show setup modal
      setSetupModalVisible(true);
    } else {
      // Disable MFA - require verification first
      setPendingAction('disable');
      setVerifyModalVisible(true);
    }
  };

  /**
   * Handle MFA setup success
   */
  const handleSetupSuccess = () => {
    message.success('MFA has been successfully enabled!');
    loadMFAStatus();
    setSetupModalVisible(false);
  };

  /**
   * Handle MFA verification success for sensitive operations
   */
  const handleVerificationSuccess = async (verificationData) => {
    if (pendingAction === 'disable') {
      await disableMFA();
    } else if (pendingAction === 'regenerate') {
      await regenerateBackupCodes();
    }
    setPendingAction(null);
    setVerifyModalVisible(false);
  };

  /**
   * Disable MFA
   */
  const disableMFA = async () => {
    try {
      const response = await fetch('/api/mfa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          token: '000000', // This will be handled by the verification modal
          isRecoveryCode: false
        })
      });

      const data = await response.json();
      if (data.success) {
        message.success('MFA has been disabled');
        loadMFAStatus();
      } else {
        message.error(data.error || 'Failed to disable MFA');
      }
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      message.error('Failed to disable MFA');
    }
  };

  /**
   * Show confirmation dialog for disabling MFA
   */
  const showDisableConfirmation = () => {
    confirm({
      title: 'Disable Multi-Factor Authentication',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Paragraph>
            Are you sure you want to disable MFA? This will make your account less secure.
          </Paragraph>
          <Alert
            message="Security Warning"
            description="Disabling MFA will remove an important layer of security from your account. We strongly recommend keeping MFA enabled."
            type="warning"
            showIcon
          />
        </div>
      ),
      okText: 'Yes, Disable MFA',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setPendingAction('disable');
        setVerifyModalVisible(true);
      }
    });
  };

  /**
   * Regenerate backup codes
   */
  const regenerateBackupCodes = async () => {
    try {
      const response = await fetch('/api/mfa/regenerate-backup-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          token: '000000', // This will be handled by the verification modal
          isRecoveryCode: false
        })
      });

      const data = await response.json();
      if (data.success) {
        // Show new backup codes
        Modal.info({
          title: 'New Backup Codes Generated',
          width: 600,
          content: (
            <div>
              <Alert
                message="Important: Save These New Codes"
                description="Your old backup codes are no longer valid. Save these new codes in a secure location."
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <div className="mfa-backup-codes-grid">
                {data.data.backupCodes.map((code, index) => (
                  <div key={index} className="mfa-backup-code">
                    <span className="code-number">{index + 1}.</span>
                    <span className="code-value">{code}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
          onOk() {
            loadMFAStatus();
          }
        });
      } else {
        message.error(data.error || 'Failed to regenerate backup codes');
      }
    } catch (error) {
      console.error('Failed to regenerate backup codes:', error);
      message.error('Failed to regenerate backup codes');
    }
  };

  /**
   * Handle regenerate backup codes
   */
  const handleRegenerateBackupCodes = () => {
    confirm({
      title: 'Regenerate Backup Codes',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Paragraph>
            This will generate new backup codes and invalidate your existing ones.
          </Paragraph>
          <Alert
            message="Important"
            description="Make sure to save the new codes in a secure location. Your current backup codes will no longer work."
            type="info"
            showIcon
          />
        </div>
      ),
      okText: 'Generate New Codes',
      cancelText: 'Cancel',
      onOk() {
        setPendingAction('regenerate');
        setVerifyModalVisible(true);
      }
    });
  };

  const getStatusColor = () => {
    if (mfaStatus.isLocked) return '#ff4d4f';
    return mfaStatus.enabled ? '#52c41a' : '#ff4d4f';
  };

  const getStatusText = () => {
    if (mfaStatus.isLocked) return 'Locked';
    return mfaStatus.enabled ? 'Enabled' : 'Disabled';
  };

  return (
    <div className="mfa-settings">
      <Card
        title={
          <Space>
            <SecurityScanOutlined />
            Multi-Factor Authentication
          </Space>
        }
        extra={
          <Switch
            checked={mfaStatus.enabled}
            onChange={handleMFAToggle}
            loading={loading}
            disabled={mfaStatus.isLocked}
          />
        }
        className="mfa-settings-card"
        loading={loading}
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text strong>Status:</Text>
            <Text style={{ color: getStatusColor() }}>
              {getStatusText()}
            </Text>
          </Space>
        </div>

        {mfaStatus.enabled ? (
          <div>
            <div className="mfa-info-section">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space>
                  <InfoCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>Your account is protected with Multi-Factor Authentication</Text>
                </Space>
                
                {mfaStatus.lastUsedAt && (
                  <Text type="secondary">
                    Last used: {new Date(mfaStatus.lastUsedAt).toLocaleString()}
                  </Text>
                )}
                
                <Space>
                  <KeyOutlined />
                  <Text>
                    Backup codes remaining: <strong>{mfaStatus.remainingRecoveryCodes}</strong>
                  </Text>
                </Space>
              </Space>
            </div>

            {mfaStatus.remainingRecoveryCodes <= 2 && (
              <Alert
                message="Low Backup Codes"
                description="You're running low on backup codes. Consider generating new ones."
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <div className="mfa-settings-actions">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRegenerateBackupCodes}
              >
                Regenerate Backup Codes
              </Button>
              
              <Button
                danger
                icon={<SettingOutlined />}
                onClick={showDisableConfirmation}
              >
                Disable MFA
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mfa-warning-section">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space>
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                  <Text>Your account is not protected with MFA</Text>
                </Space>
                <Text type="secondary">
                  Enable Multi-Factor Authentication to add an extra layer of security to your account.
                </Text>
              </Space>
            </div>

            <Paragraph>
              <strong>Benefits of enabling MFA:</strong>
            </Paragraph>
            <ul>
              <li>Protects your account even if your password is compromised</li>
              <li>Required for high-value transactions and withdrawals</li>
              <li>Meets industry security standards</li>
              <li>Provides backup recovery codes for account access</li>
            </ul>

            <Button
              type="primary"
              icon={<SecurityScanOutlined />}
              onClick={() => setSetupModalVisible(true)}
              size="large"
            >
              Enable MFA
            </Button>
          </div>
        )}

        {mfaStatus.isLocked && (
          <Alert
            message="Account Temporarily Locked"
            description={`Your account is locked due to too many failed MFA attempts. Please try again after ${new Date(mfaStatus.lockedUntil).toLocaleString()}.`}
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      {/* MFA Setup Modal */}
      <MFASetupModal
        visible={setupModalVisible}
        onClose={() => setSetupModalVisible(false)}
        onSuccess={handleSetupSuccess}
        userEmail={userEmail}
      />

      {/* MFA Verification Modal */}
      <MFAVerificationModal
        visible={verifyModalVisible}
        onClose={() => {
          setVerifyModalVisible(false);
          setPendingAction(null);
        }}
        onSuccess={handleVerificationSuccess}
        title={
          pendingAction === 'disable' 
            ? "Verify to Disable MFA" 
            : "Verify to Regenerate Backup Codes"
        }
        description={
          pendingAction === 'disable'
            ? "Please verify your identity to disable Multi-Factor Authentication."
            : "Please verify your identity to generate new backup codes."
        }
      />
    </div>
  );
};

export default MFASettings;

