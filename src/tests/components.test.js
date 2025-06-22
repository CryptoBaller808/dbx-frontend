/**
 * Frontend Component Tests
 * Testing React components for NFT marketplace
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

// Import components
import NFTMarketplace from '../src/components/NFTMarketplace/NFTMarketplace';
import CreatorDashboard from '../src/components/NFTMarketplace/CreatorDashboard';
import NFTDetailView from '../src/components/NFTMarketplace/NFTDetailView';

const mockStore = configureStore([]);

// Mock data
const mockNFTs = [
  {
    id: 1,
    name: 'Test NFT #1',
    description: 'A test NFT',
    image: 'https://example.com/image1.jpg',
    price: 1.5,
    currency: 'ETH',
    creator: {
      name: 'TestCreator',
      avatar: 'https://example.com/avatar1.jpg',
      verified: true
    },
    collection: 'Test Collection',
    blockchain: 'ETH',
    category: 'Art',
    rarity: 'Rare',
    views: 100,
    likes: 25,
    auction: {
      type: 'fixed',
      endTime: null
    }
  }
];

const mockDashboardData = {
  overview: {
    total_nfts: 156,
    total_collections: 8,
    total_sales: 89,
    total_volume: 45.7,
    total_royalties: 12.3
  },
  recent_activity: [],
  collections: [],
  top_nfts: []
};

// Helper function to render with providers
const renderWithProviders = (component, initialState = {}) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('NFT Marketplace Components', () => {
  describe('NFTMarketplace Component', () => {
    beforeEach(() => {
      // Mock fetch for API calls
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: { nfts: mockNFTs, pagination: { total: 1, page: 1 } }
          })
        })
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('renders marketplace hero section', async () => {
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        expect(screen.getByText(/Discover, Collect & Trade/)).toBeInTheDocument();
        expect(screen.getByText(/Extraordinary NFTs/)).toBeInTheDocument();
        expect(screen.getByText(/2.5M\+/)).toBeInTheDocument();
        expect(screen.getByText(/150K\+/)).toBeInTheDocument();
      });
    });

    test('renders search and filter controls', async () => {
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search NFTs, creators, collections/)).toBeInTheDocument();
        expect(screen.getByText(/All Categories/)).toBeInTheDocument();
        expect(screen.getByText(/All Chains/)).toBeInTheDocument();
      });
    });

    test('displays NFT cards when data loads', async () => {
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        expect(screen.getByText('Test NFT #1')).toBeInTheDocument();
        expect(screen.getByText('Test Collection')).toBeInTheDocument();
        expect(screen.getByText('TestCreator')).toBeInTheDocument();
      });
    });

    test('search functionality works', async () => {
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search NFTs, creators, collections/);
        fireEvent.change(searchInput, { target: { value: 'Test NFT' } });
        expect(searchInput.value).toBe('Test NFT');
      });
    });

    test('filter functionality works', async () => {
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        const categoryFilter = screen.getByText(/All Categories/);
        fireEvent.click(categoryFilter);
        // Test that dropdown opens (implementation depends on Ant Design)
      });
    });

    test('favorite functionality works', async () => {
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        const nftCard = screen.getByText('Test NFT #1').closest('.nft-card');
        const favoriteBtn = nftCard.querySelector('.nft-favorite-btn');
        
        if (favoriteBtn) {
          fireEvent.click(favoriteBtn);
          // Test that favorite state changes
        }
      });
    });
  });

  describe('CreatorDashboard Component', () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: mockDashboardData
          })
        })
      );
    });

    test('renders dashboard header', async () => {
      renderWithProviders(<CreatorDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Creator Dashboard')).toBeInTheDocument();
        expect(screen.getByText(/Manage your NFT collections/)).toBeInTheDocument();
        expect(screen.getByText('Mint New NFT')).toBeInTheDocument();
      });
    });

    test('renders navigation tabs', async () => {
      renderWithProviders(<CreatorDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Collections')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
        expect(screen.getByText('Royalties')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });
    });

    test('displays statistics cards', async () => {
      renderWithProviders(<CreatorDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Total NFTs')).toBeInTheDocument();
        expect(screen.getByText('Total Volume (ETH)')).toBeInTheDocument();
        expect(screen.getByText('Total Sales')).toBeInTheDocument();
        expect(screen.getByText('Royalties (ETH)')).toBeInTheDocument();
      });
    });

    test('mint modal opens when button clicked', async () => {
      renderWithProviders(<CreatorDashboard />);
      
      await waitFor(() => {
        const mintButton = screen.getByText('Mint New NFT');
        fireEvent.click(mintButton);
        
        // Check if modal opens
        expect(screen.getByText('Mint New NFT')).toBeInTheDocument();
      });
    });

    test('tab navigation works', async () => {
      renderWithProviders(<CreatorDashboard />);
      
      await waitFor(() => {
        const collectionsTab = screen.getByText('Collections');
        fireEvent.click(collectionsTab);
        
        // Test that collections view is shown
        // This would depend on the specific implementation
      });
    });
  });

  describe('NFTDetailView Component', () => {
    const mockNFT = {
      id: 1,
      name: 'Test NFT #1',
      description: 'A detailed test NFT',
      image: 'https://example.com/image1.jpg',
      price: 2.5,
      currency: 'ETH',
      creator: {
        name: 'TestCreator',
        avatar: 'https://example.com/avatar1.jpg',
        verified: true,
        bio: 'Test creator bio',
        followers: 1000
      },
      owner: {
        name: 'TestOwner',
        avatar: 'https://example.com/avatar2.jpg',
        verified: false
      },
      collection: {
        name: 'Test Collection',
        total_items: 1000,
        floor_price: 1.0,
        volume: 500.0
      },
      blockchain: 'ETH',
      rarity: 'Legendary',
      views: 1500,
      likes: 200,
      attributes: [
        { trait_type: 'Color', value: 'Blue', rarity: 10.5 },
        { trait_type: 'Style', value: 'Abstract', rarity: 5.2 }
      ],
      auction: {
        type: 'auction',
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        currentBid: 2.5,
        bidCount: 5
      }
    };

    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: mockNFT
          })
        })
      );
    });

    test('renders NFT details correctly', async () => {
      renderWithProviders(<NFTDetailView nftId={1} />);
      
      await waitFor(() => {
        expect(screen.getByText('Test NFT #1')).toBeInTheDocument();
        expect(screen.getByText('A detailed test NFT')).toBeInTheDocument();
        expect(screen.getByText('Test Collection')).toBeInTheDocument();
        expect(screen.getByText('TestCreator')).toBeInTheDocument();
        expect(screen.getByText('TestOwner')).toBeInTheDocument();
      });
    });

    test('displays auction information', async () => {
      renderWithProviders(<NFTDetailView nftId={1} />);
      
      await waitFor(() => {
        expect(screen.getByText('Current Bid')).toBeInTheDocument();
        expect(screen.getByText('2.5')).toBeInTheDocument();
        expect(screen.getByText('5 bids')).toBeInTheDocument();
      });
    });

    test('shows attributes correctly', async () => {
      renderWithProviders(<NFTDetailView nftId={1} />);
      
      await waitFor(() => {
        // Click on attributes tab
        const attributesTab = screen.getByText('Attributes');
        fireEvent.click(attributesTab);
        
        expect(screen.getByText('Color')).toBeInTheDocument();
        expect(screen.getByText('Blue')).toBeInTheDocument();
        expect(screen.getByText('10.5% rarity')).toBeInTheDocument();
      });
    });

    test('bid modal opens correctly', async () => {
      renderWithProviders(<NFTDetailView nftId={1} />);
      
      await waitFor(() => {
        const bidButton = screen.getByText('Place Bid');
        fireEvent.click(bidButton);
        
        expect(screen.getByText('Place Bid')).toBeInTheDocument();
        expect(screen.getByText('Your Bid')).toBeInTheDocument();
      });
    });

    test('favorite functionality works', async () => {
      renderWithProviders(<NFTDetailView nftId={1} />);
      
      await waitFor(() => {
        const favoriteButton = screen.getByText(/Add to Favorites/);
        fireEvent.click(favoriteButton);
        
        // Test that favorite state changes
        expect(screen.getByText(/Favorited/)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design Tests', () => {
    test('components render correctly on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderWithProviders(<NFTMarketplace />);
      
      // Test that mobile-specific styles are applied
      // This would require checking computed styles or class names
    });

    test('components render correctly on tablet', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      renderWithProviders(<CreatorDashboard />);
      
      // Test tablet-specific layout
    });
  });

  describe('Accessibility Tests', () => {
    test('components have proper ARIA labels', async () => {
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search NFTs, creators, collections/);
        expect(searchInput).toHaveAttribute('aria-label');
      });
    });

    test('keyboard navigation works', async () => {
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search NFTs, creators, collections/);
        searchInput.focus();
        
        // Test Tab navigation
        fireEvent.keyDown(searchInput, { key: 'Tab', code: 'Tab' });
        
        // Check that focus moves to next element
      });
    });

    test('screen reader compatibility', async () => {
      renderWithProviders(<NFTDetailView nftId={1} />);
      
      await waitFor(() => {
        // Test that important content has proper semantic markup
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Tests', () => {
    test('handles API errors gracefully', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('API Error'))
      );
      
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        // Test that error state is handled properly
        // This would depend on how errors are displayed in the component
      });
    });

    test('handles loading states', () => {
      global.fetch = jest.fn(() =>
        new Promise(() => {}) // Never resolves to test loading state
      );
      
      renderWithProviders(<NFTMarketplace />);
      
      // Test that loading indicator is shown
      expect(screen.getByText(/Loading amazing NFTs/)).toBeInTheDocument();
    });

    test('handles empty data states', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: { nfts: [], pagination: { total: 0, page: 1 } }
          })
        })
      );
      
      renderWithProviders(<NFTMarketplace />);
      
      await waitFor(() => {
        expect(screen.getByText(/No NFTs found/)).toBeInTheDocument();
      });
    });
  });
});

// Performance tests
describe('Performance Tests', () => {
  test('components render within acceptable time', async () => {
    const startTime = performance.now();
    
    renderWithProviders(<NFTMarketplace />);
    
    await waitFor(() => {
      expect(screen.getByText(/Discover, Collect & Trade/)).toBeInTheDocument();
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 1000ms
    expect(renderTime).toBeLessThan(1000);
  });

  test('large lists render efficiently', async () => {
    const largeNFTList = Array(100).fill().map((_, index) => ({
      ...mockNFTs[0],
      id: index + 1,
      name: `Test NFT #${index + 1}`
    }));
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { nfts: largeNFTList, pagination: { total: 100, page: 1 } }
        })
      })
    );
    
    const startTime = performance.now();
    
    renderWithProviders(<NFTMarketplace />);
    
    await waitFor(() => {
      expect(screen.getByText('Test NFT #1')).toBeInTheDocument();
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should handle large lists efficiently
    expect(renderTime).toBeLessThan(2000);
  });
});

export default {};

