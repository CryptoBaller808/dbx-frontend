/**
 * DBX Token List Component
 * Dynamic token selector with search, filtering, and metadata display
 * 
 * @version 4.0.0
 * @author DBX Development Team
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Spinner, Alert, Badge, InputGroup, Form } from 'react-bootstrap';
import Select from 'react-select';
import { SearchIcon, StarIcon, TrendingUpIcon } from '../Icons';
import assetMetadataService from '../services/assetMetadataService';
import './TokenList.css';

const TokenList = ({ 
  networkSymbol, 
  selectedToken, 
  onTokenSelect, 
  placeholder = "Select token...",
  showBalance = false,
  walletAddress = null,
  className = "",
  isDisabled = false
}) => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopular, setShowPopular] = useState(false);

  // Load tokens for the selected network
  useEffect(() => {
    if (!networkSymbol) {
      setTokens([]);
      return;
    }

    const loadTokens = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const networkTokens = await assetMetadataService.getNetworkTokens(networkSymbol);
        setTokens(networkTokens);
      } catch (err) {
        setError(`Failed to load tokens for ${networkSymbol}`);
        console.error('Token loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, [networkSymbol]);

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;
    
    const query = searchQuery.toLowerCase();
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.searchTerms?.some(term => term.toLowerCase().includes(query))
    );
  }, [tokens, searchQuery]);

  // Format tokens for react-select
  const selectOptions = useMemo(() => {
    return filteredTokens.map(token => ({
      value: token.id,
      label: token.displayName,
      token: token,
      isNative: token.isNative,
      isStablecoin: token.isStablecoin
    }));
  }, [filteredTokens]);

  // Custom option component
  const TokenOption = ({ data, ...props }) => {
    const { token } = data;
    
    return (
      <div {...props} className="token-option">
        <div className="token-option-content">
          <div className="token-icon">
            <img 
              src={token.logoURI} 
              alt={token.symbol}
              onError={(e) => {
                e.target.src = '/images/tokens/placeholder.png';
              }}
            />
          </div>
          <div className="token-info">
            <div className="token-symbol">{token.symbol}</div>
            <div className="token-name">{token.name}</div>
          </div>
          <div className="token-badges">
            {token.isNative && <Badge bg="primary" size="sm">Native</Badge>}
            {token.isStablecoin && <Badge bg="success" size="sm">Stable</Badge>}
          </div>
        </div>
      </div>
    );
  };

  // Custom single value component
  const TokenSingleValue = ({ data }) => {
    const { token } = data;
    
    return (
      <div className="token-single-value">
        <img 
          src={token.logoURI} 
          alt={token.symbol}
          className="token-icon-small"
          onError={(e) => {
            e.target.src = '/images/tokens/placeholder.png';
          }}
        />
        <span className="token-symbol">{token.symbol}</span>
        <span className="token-name-small">{token.name}</span>
      </div>
    );
  };

  // Handle token selection
  const handleTokenSelect = useCallback((selectedOption) => {
    if (selectedOption && onTokenSelect) {
      onTokenSelect(selectedOption.token);
    }
  }, [onTokenSelect]);

  // Get current selected option
  const selectedOption = useMemo(() => {
    if (!selectedToken) return null;
    return selectOptions.find(option => option.token.symbol === selectedToken.symbol);
  }, [selectedToken, selectOptions]);

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
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center'
    })
  };

  if (error) {
    return (
      <Alert variant="warning" className={`token-list-error ${className}`}>
        <strong>Error:</strong> {error}
      </Alert>
    );
  }

  return (
    <div className={`token-list ${className}`}>
      <Select
        value={selectedOption}
        onChange={handleTokenSelect}
        options={selectOptions}
        components={{
          Option: TokenOption,
          SingleValue: TokenSingleValue
        }}
        styles={customStyles}
        placeholder={isLoading ? "Loading tokens..." : placeholder}
        isLoading={isLoading}
        isDisabled={isDisabled || isLoading}
        isSearchable={true}
        onInputChange={setSearchQuery}
        noOptionsMessage={() => searchQuery ? `No tokens found for "${searchQuery}"` : "No tokens available"}
        className="token-select"
        classNamePrefix="token-select"
      />
      
      {/* Token count and network info */}
      {tokens.length > 0 && (
        <div className="token-list-info">
          <small className="text-muted">
            {filteredTokens.length} of {tokens.length} tokens on {networkSymbol}
          </small>
        </div>
      )}
    </div>
  );
};

export default TokenList;

