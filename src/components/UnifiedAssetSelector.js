/**
 * DBX Unified Asset Selector Component
 * Cross-chain asset selection with unified representation
 * 
 * @version 4.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Badge, Button, Collapse, Alert, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { ChevronDownIcon, ChevronUpIcon, LinkIcon, SwapIcon } from '../Icons';
import crossChainAssetMapper from '../services/crossChainAssetMapper';
import assetMetadataService from '../services/assetMetadataService';
import './UnifiedAssetSelector.css';

const UnifiedAssetSelector = ({
  selectedNetwork,
  selectedAsset,
  onAssetSelect,
  onNetworkChange,
  showCrossChainOptions = true,
  placeholder = "Select asset...",
  className = "",
  isDisabled = false
}) => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEquivalents, setShowEquivalents] = useState(false);
  const [equivalentTokens, setEquivalentTokens] = useState([]);
  const [unifiedAsset, setUnifiedAsset] = useState(null);

  // Load assets for the selected network
  useEffect(() => {
    if (!selectedNetwork) {
      setAssets([]);
      return;
    }

    const loadAssets = async () => {
      setIsLoading(true);
      try {
        const networkTokens = await assetMetadataService.getNetworkTokens(selectedNetwork);
        
        // Enhance tokens with unified asset information
        const enhancedTokens = networkTokens.map(token => {
          const unified = crossChainAssetMapper.getUnifiedAsset(selectedNetwork, token.symbol);
          return {
            ...token,
            unifiedAsset: unified,
            hasEquivalents: unified ? unified.availableNetworks.length > 1 : false
          };
        });

        setAssets(enhancedTokens);
      } catch (error) {
        console.error('Failed to load assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [selectedNetwork]);

  // Update unified asset and equivalents when selection changes
  useEffect(() => {
    if (selectedAsset && selectedNetwork) {
      const unified = crossChainAssetMapper.getUnifiedAsset(selectedNetwork, selectedAsset.symbol);
      setUnifiedAsset(unified);
      
      if (unified) {
        const equivalents = crossChainAssetMapper.findEquivalentTokens(selectedNetwork, selectedAsset.symbol);
        setEquivalentTokens(equivalents);
      } else {
        setEquivalentTokens([]);
      }
    } else {
      setUnifiedAsset(null);
      setEquivalentTokens([]);
    }
  }, [selectedAsset, selectedNetwork]);

  // Format assets for react-select
  const selectOptions = useMemo(() => {
    return assets.map(asset => ({
      value: asset.id,
      label: asset.displayName,
      asset: asset,
      unifiedAsset: asset.unifiedAsset,
      hasEquivalents: asset.hasEquivalents
    }));
  }, [assets]);

  // Custom option component
  const AssetOption = ({ data, ...props }) => {
    const { asset } = data;
    
    return (
      <div {...props} className="unified-asset-option">
        <div className="asset-option-content">
          <div className="asset-icon">
            <img 
              src={asset.logoURI} 
              alt={asset.symbol}
              onError={(e) => {
                e.target.src = '/images/tokens/placeholder.png';
              }}
            />
          </div>
          <div className="asset-info">
            <div className="asset-symbol">{asset.symbol}</div>
            <div className="asset-name">{asset.name}</div>
          </div>
          <div className="asset-badges">
            {asset.isNative && <Badge bg="primary" size="sm">Native</Badge>}
            {asset.isStablecoin && <Badge bg="success" size="sm">Stable</Badge>}
            {asset.hasEquivalents && <Badge bg="info" size="sm">Multi-Chain</Badge>}
          </div>
        </div>
      </div>
    );
  };

  // Custom single value component
  const AssetSingleValue = ({ data }) => {
    const { asset } = data;
    
    return (
      <div className="unified-asset-single-value">
        <img 
          src={asset.logoURI} 
          alt={asset.symbol}
          className="asset-icon-small"
          onError={(e) => {
            e.target.src = '/images/tokens/placeholder.png';
          }}
        />
        <span className="asset-symbol">{asset.symbol}</span>
        <span className="asset-name-small">{asset.name}</span>
        {asset.hasEquivalents && (
          <Badge bg="info" size="sm" className="ms-auto">
            <LinkIcon size={10} className="me-1" />
            Multi-Chain
          </Badge>
        )}
      </div>
    );
  };

  // Handle asset selection
  const handleAssetSelect = useCallback((selectedOption) => {
    if (selectedOption && onAssetSelect) {
      onAssetSelect(selectedOption.asset);
    }
  }, [onAssetSelect]);

  // Handle cross-chain asset selection
  const handleEquivalentSelect = useCallback((equivalent) => {
    if (onNetworkChange && onAssetSelect) {
      // First change the network
      onNetworkChange(equivalent.network);
      
      // Then select the equivalent asset
      setTimeout(() => {
        onAssetSelect({
          symbol: equivalent.symbol,
          name: equivalent.unifiedAsset.name,
          logoURI: equivalent.unifiedAsset.logoURI,
          address: equivalent.address,
          decimals: equivalent.decimals,
          isNative: equivalent.isNative
        });
      }, 100);
    }
  }, [onNetworkChange, onAssetSelect]);

  // Get current selected option
  const selectedOption = useMemo(() => {
    if (!selectedAsset) return null;
    return selectOptions.find(option => option.asset.symbol === selectedAsset.symbol);
  }, [selectedAsset, selectOptions]);

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      borderColor: state.isFocused ? '#0d6efd' : '#dee2e6',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(13, 110, 253, 0.25)' : 'none',
      '&:hover': {
        borderColor: '#0d6efd'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      padding: 0,
      backgroundColor: state.isSelected ? '#0d6efd' : state.isFocused ? '#f8f9fa' : 'white'
    })
  };

  return (
    <div className={`unified-asset-selector ${className}`}>
      <Select
        value={selectedOption}
        onChange={handleAssetSelect}
        options={selectOptions}
        components={{
          Option: AssetOption,
          SingleValue: AssetSingleValue
        }}
        styles={customStyles}
        placeholder={isLoading ? "Loading assets..." : placeholder}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        isSearchable={true}
        className="unified-asset-select"
        classNamePrefix="unified-asset-select"
      />

      {/* Cross-chain equivalents section */}
      {showCrossChainOptions && unifiedAsset && equivalentTokens.length > 0 && (
        <Card className="mt-3 cross-chain-card">
          <Card.Header 
            className="cross-chain-header"
            onClick={() => setShowEquivalents(!showEquivalents)}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <LinkIcon className="me-2" />
                <span>Available on {equivalentTokens.length} other networks</span>
              </div>
              {showEquivalents ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </div>
          </Card.Header>
          <Collapse in={showEquivalents}>
            <Card.Body>
              <div className="equivalent-tokens">
                {equivalentTokens.map((equivalent, index) => (
                  <div key={index} className="equivalent-token">
                    <div className="equivalent-info">
                      <img 
                        src={equivalent.unifiedAsset.logoURI} 
                        alt={equivalent.symbol}
                        className="equivalent-icon"
                        onError={(e) => {
                          e.target.src = '/images/tokens/placeholder.png';
                        }}
                      />
                      <div className="equivalent-details">
                        <div className="equivalent-symbol">{equivalent.symbol}</div>
                        <div className="equivalent-network">{equivalent.network}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEquivalentSelect(equivalent)}
                      className="switch-button"
                    >
                      <SwapIcon size={12} className="me-1" />
                      Switch
                    </Button>
                  </div>
                ))}
              </div>
              
              <Alert variant="info" className="mt-3 mb-0">
                <small>
                  <strong>Cross-Chain Asset:</strong> This asset is available on multiple networks. 
                  You can switch networks to access the same asset with potentially different fees and speeds.
                </small>
              </Alert>
            </Card.Body>
          </Collapse>
        </Card>
      )}

      {/* Asset info */}
      {assets.length > 0 && (
        <div className="asset-selector-info">
          <small className="text-muted">
            {assets.length} assets available on {selectedNetwork}
          </small>
        </div>
      )}
    </div>
  );
};

export default UnifiedAssetSelector;

