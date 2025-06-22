import React, { useState } from 'react';
import { Modal, Button, Input, Alert, Typography, Space, Divider } from 'antd';
import { SecurityScanOutlined, KeyOutlined } from '@ant-design/icons';
import './MFASetup.css';

const { Title, Text, Paragraph } = Typography;

/**
 * MFA Verification Modal Component
 * Used for verifying MFA during login or sensitive operations
 */
const MFAVerificationModal = ({ 
  visible, 
  onClose, 
  onSuccess, 
  title = "Multi-Factor Authentication Required",
  description = "Please enter your 6-digit authentication code to continue.",
  loading = false 
}) => {
  const [token, setToken] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (visible) {
      setToken('');
      setIsRecoveryMode(false);
      setError('');
      setVerifying(false);
    }
  }, [visible]);

  /**
   * Handle MFA verification
   */
  const handleVerification = async () => {
    if (!token || (isRecoveryMode ? token.length < 4 : token.length !== 6)) {
      setError(isRecoveryMode ? 'Please enter a valid recovery code' : 'Please enter a valid 6-digit code');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          token: token,
          isRecoveryCode: isRecoveryMode
        })
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.data);
        onClose();
      } else {
        setError(data.error || 'Verification failed');
        
        // Show remaining attempts if available
        if (data.remainingAttempts !== undefined) {
          setError(`${data.error}. ${data.remainingAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  /**
   * Toggle between TOTP and recovery code mode
   */
  const toggleRecoveryMode = () => {
    setIsRecoveryMode(!isRecoveryMode);
    setToken('');
    setError('');
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    let value = e.target.value;
    
    if (!isRecoveryMode) {
      // For TOTP, only allow digits and limit to 6
      value = value.replace(/\D/g, '').slice(0, 6);
    } else {
      // For recovery codes, allow alphanumeric and limit to 8
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    }
    
    setToken(value);
    setError('');
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerification();
    }
  };

  return (
    <Modal
      title={
        <div className="mfa-modal-header">
          <SecurityScanOutlined style={{ marginRight: 8 }} />
          {title}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={450}
      className="mfa-verify-modal"
      destroyOnClose
      maskClosable={false}
    >
      <div className="mfa-verify-content">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <SecurityScanOutlined style={{ fontSize: 48, color: '#ff6b6b', marginBottom: 16 }} />
          <Paragraph>{description}</Paragraph>
        </div>

        {!isRecoveryMode ? (
          <div>
            <Title level={5}>
              <KeyOutlined style={{ marginRight: 8 }} />
              Authentication Code
            </Title>
            <Paragraph type="secondary">
              Enter the 6-digit code from your authenticator app
            </Paragraph>
            
            <div className="mfa-verify-input">
              <Input
                placeholder="000000"
                value={token}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                size="large"
                maxLength={6}
                autoComplete="off"
                autoFocus
                style={{ 
                  textAlign: 'center', 
                  fontSize: '24px', 
                  letterSpacing: '8px',
                  fontWeight: '600'
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <Title level={5}>
              <KeyOutlined style={{ marginRight: 8 }} />
              Recovery Code
            </Title>
            <Paragraph type="secondary">
              Enter one of your backup recovery codes
            </Paragraph>
            
            <div className="mfa-verify-input">
              <Input
                placeholder="XXXXXXXX"
                value={token}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                size="large"
                maxLength={8}
                autoComplete="off"
                autoFocus
                style={{ 
                  textAlign: 'center', 
                  fontSize: '18px', 
                  letterSpacing: '4px',
                  fontWeight: '600',
                  fontFamily: 'Courier New, monospace'
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <Alert
            message={error}
            type="error"
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={handleVerification}
            loading={verifying || loading}
            disabled={!token || (isRecoveryMode ? token.length < 4 : token.length !== 6)}
            size="large"
            style={{ minWidth: 120 }}
          >
            Verify
          </Button>
        </div>

        <Divider />

        <div className="mfa-recovery-section" style={{ textAlign: 'center' }}>
          <Text type="secondary">
            {!isRecoveryMode ? "Can't access your authenticator app?" : "Want to use your authenticator app?"}
          </Text>
          <br />
          <span 
            className="mfa-recovery-toggle"
            onClick={toggleRecoveryMode}
          >
            {!isRecoveryMode ? "Use a recovery code instead" : "Use authenticator code instead"}
          </span>
        </div>

        {isRecoveryMode && (
          <Alert
            message="Recovery Code Usage"
            description="Each recovery code can only be used once. Make sure to generate new codes if you're running low."
            type="warning"
            style={{ marginTop: 16 }}
            showIcon
          />
        )}
      </div>
    </Modal>
  );
};

export default MFAVerificationModal;

