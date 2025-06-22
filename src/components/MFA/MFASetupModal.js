import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message, Steps, Typography, Space, Divider, Alert } from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import { CopyOutlined, DownloadOutlined, SecurityScanOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './MFASetup.css';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

/**
 * MFA Setup Modal Component
 * Handles the complete MFA setup flow including QR code display and verification
 */
const MFASetupModal = ({ visible, onClose, onSuccess, userEmail }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      setSetupData(null);
      setVerificationToken('');
      setBackupCodes([]);
      setError('');
      initiateMFASetup();
    }
  }, [visible]);

  /**
   * Step 1: Initiate MFA setup and get QR code
   */
  const initiateMFASetup = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setSetupData(data.data);
        setCurrentStep(1);
      } else {
        setError(data.error || 'Failed to setup MFA');
      }
    } catch (error) {
      console.error('MFA setup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Verify TOTP token and complete setup
   */
  const verifyAndCompleteMFA = async () => {
    if (!verificationToken || verificationToken.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mfa/verify-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          token: verificationToken
        })
      });

      const data = await response.json();

      if (data.success) {
        setBackupCodes(data.data.backupCodes);
        setCurrentStep(2);
        message.success('MFA has been successfully enabled!');
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copy text to clipboard
   */
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy to clipboard');
    });
  };

  /**
   * Download backup codes as text file
   */
  const downloadBackupCodes = () => {
    const codesText = `DBX Multi-Factor Authentication Backup Codes
Generated: ${new Date().toLocaleString()}
Account: ${userEmail}

IMPORTANT: Save these codes in a secure location. Each code can only be used once.

${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}

Instructions:
- Use these codes if you lose access to your authenticator app
- Each code can only be used once
- Generate new codes if you use all of them
- Keep these codes secure and private`;

    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DBX-MFA-Backup-Codes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('Backup codes downloaded!');
  };

  /**
   * Complete MFA setup
   */
  const completeMFASetup = () => {
    onSuccess();
    onClose();
  };

  /**
   * Render Step 1: QR Code and Manual Entry
   */
  const renderQRCodeStep = () => (
    <div className="mfa-setup-step">
      <div className="mfa-qr-section">
        <Title level={4}>Scan QR Code</Title>
        <Paragraph>
          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
        </Paragraph>
        
        <div className="mfa-qr-container">
          {setupData?.qrCode && (
            <QRCodeSVG
              value={setupData.qrCode.replace('data:image/png;base64,', '')}
              size={200}
              level="M"
              includeMargin={true}
            />
          )}
        </div>

        <Divider>OR</Divider>

        <Title level={5}>Manual Entry</Title>
        <Paragraph>
          If you can't scan the QR code, enter this secret key manually:
        </Paragraph>
        
        <div className="mfa-secret-container">
          <Input.Group compact>
            <Input
              value={setupData?.secret || ''}
              readOnly
              style={{ width: 'calc(100% - 40px)' }}
              className="mfa-secret-input"
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(setupData?.secret)}
              title="Copy secret key"
            />
          </Input.Group>
        </div>

        <Alert
          message="Authenticator App Setup"
          description="Popular authenticator apps include Google Authenticator, Authy, Microsoft Authenticator, and 1Password. Make sure to save the secret key in a secure location."
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </div>

      <div className="mfa-verification-section">
        <Title level={4}>Verify Setup</Title>
        <Paragraph>
          Enter the 6-digit code from your authenticator app to complete setup:
        </Paragraph>
        
        <Input
          placeholder="Enter 6-digit code"
          value={verificationToken}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setVerificationToken(value);
            setError('');
          }}
          size="large"
          style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
          maxLength={6}
          autoComplete="off"
        />

        {error && (
          <Alert
            message={error}
            type="error"
            style={{ marginTop: 12 }}
            showIcon
          />
        )}

        <div className="mfa-step-actions">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={verifyAndCompleteMFA}
            loading={loading}
            disabled={verificationToken.length !== 6}
            icon={<SecurityScanOutlined />}
          >
            Verify & Enable MFA
          </Button>
        </div>
      </div>
    </div>
  );

  /**
   * Render Step 2: Backup Codes
   */
  const renderBackupCodesStep = () => (
    <div className="mfa-backup-codes-step">
      <div className="mfa-success-header">
        <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
        <Title level={3}>MFA Successfully Enabled!</Title>
        <Paragraph>
          Your account is now protected with Multi-Factor Authentication.
        </Paragraph>
      </div>

      <Alert
        message="Important: Save Your Backup Codes"
        description="These backup codes can be used to access your account if you lose your authenticator device. Each code can only be used once."
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <div className="mfa-backup-codes-container">
        <Title level={4}>Backup Recovery Codes</Title>
        <div className="mfa-backup-codes-grid">
          {backupCodes.map((code, index) => (
            <div key={index} className="mfa-backup-code">
              <span className="code-number">{index + 1}.</span>
              <span className="code-value">{code}</span>
            </div>
          ))}
        </div>

        <div className="mfa-backup-actions">
          <Space>
            <Button
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(backupCodes.join('\n'))}
            >
              Copy All Codes
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={downloadBackupCodes}
              type="primary"
            >
              Download Codes
            </Button>
          </Space>
        </div>

        <Alert
          message="Security Tips"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Store these codes in a secure location (password manager, safe, etc.)</li>
              <li>Don't share these codes with anyone</li>
              <li>You can generate new codes anytime from your security settings</li>
              <li>Each code can only be used once</li>
            </ul>
          }
          type="info"
          style={{ marginTop: 16 }}
        />
      </div>

      <div className="mfa-step-actions">
        <Button
          type="primary"
          onClick={completeMFASetup}
          size="large"
          icon={<CheckCircleOutlined />}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );

  const steps = [
    {
      title: 'Setup',
      description: 'Configure authenticator app'
    },
    {
      title: 'Verify',
      description: 'Confirm setup works'
    },
    {
      title: 'Backup Codes',
      description: 'Save recovery codes'
    }
  ];

  return (
    <Modal
      title={
        <div className="mfa-modal-header">
          <SecurityScanOutlined style={{ marginRight: 8 }} />
          Enable Multi-Factor Authentication
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="mfa-setup-modal"
      destroyOnClose
    >
      <div className="mfa-setup-content">
        <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

        {loading && currentStep === 0 && (
          <div className="mfa-loading">
            <SecurityScanOutlined spin style={{ fontSize: 24, marginBottom: 16 }} />
            <Text>Setting up MFA...</Text>
          </div>
        )}

        {error && currentStep === 0 && (
          <Alert
            message="Setup Error"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={initiateMFASetup}>
                Retry
              </Button>
            }
          />
        )}

        {currentStep === 1 && renderQRCodeStep()}
        {currentStep === 2 && renderBackupCodesStep()}
      </div>
    </Modal>
  );
};

export default MFASetupModal;

