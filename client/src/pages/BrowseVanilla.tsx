import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { celebrityApi } from '@/services/api';
import { HeaderVanilla, FooterVanilla } from '@/components';

export const BrowseVanilla = () => {
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const { data: celebrities = [] } = useQuery({
    queryKey: ['browse-celebrities'],
    queryFn: () => celebrityApi.getAll(),
  });

  const categories = [
    { id: 'all', name: 'All', count: celebrities.length },
    { id: 'Music', name: 'Music', count: celebrities.filter(c => c.category === 'Music').length },
    { id: 'Sports', name: 'Sports', count: celebrities.filter(c => c.category === 'Sports').length },
    { id: 'Film & Television', name: 'Film & TV', count: celebrities.filter(c => c.category === 'Film & Television').length },
    { id: 'Business & Tech', name: 'Business', count: celebrities.filter(c => c.category === 'Business & Tech').length },
  ];

  const filteredCelebrities = celebrities.filter(celeb => {
    if (selectedCategory !== 'all' && celeb.category !== selectedCategory) return false;
    if (searchQuery && !celeb.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredCelebrities.length / perPage);
  const paginatedCelebrities = filteredCelebrities.slice((currentPage - 1) * perPage, currentPage * perPage);
  const currentCard = filteredCelebrities[currentCardIndex];

  const handlePass = () => {
    if (currentCardIndex < filteredCelebrities.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const clearFilters = () => {
    setPriceFilter('all');
    setAvailabilityFilter('all');
    setFilterModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <HeaderVanilla />

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-row">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="icon-btn" onClick={() => setFilterModalOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
          </button>
          <div className="view-switch">
            <button
              className={`icon-btn view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              className={`icon-btn view-toggle ${viewMode === 'swipe' ? 'active' : ''}`}
              onClick={() => setViewMode('swipe')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="2"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        <div className="toolbar-meta">
          <span>{filteredCelebrities.length} results</span>
          <button className="sort-btn" onClick={() => setSortBy(sortBy === 'popular' ? 'recent' : 'popular')}>
            <span>{sortBy === 'popular' ? 'Popular' : 'Recent'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Swipe View */}
      {viewMode === 'swipe' && (
        <div className="swipe-section">
          <div className="card-container">
            <div className="card">
              {currentCard ? (
                <>
                  <img
                    src={currentCard.profile_image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=600&h=800&fit=crop'}
                    alt={currentCard.name}
                    className="card-image"
                  />
                  <div className="card-info">
                    <h2>{currentCard.name}</h2>
                    <p className="category">{currentCard.category}</p>
                    <p className="price">From ${Math.round(currentCard.price_per_hour).toLocaleString()}/hr</p>
                    <p className="bio">{currentCard.bio || 'No bio available'}</p>
                  </div>
                </>
              ) : (
                <div className="loading-state">No more celebrities</div>
              )}
            </div>
          </div>

          <div className="controls">
            <button className="ctrl-btn pass" onClick={handlePass}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <button className="ctrl-btn back" onClick={handleBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button className="ctrl-btn view">
              <Link to={currentCard ? `/celebrity/${currentCard.slug}` : '#'}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </Link>
            </button>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid-section">
          <div className="grid">
            {paginatedCelebrities.map((celeb) => (
              <Link key={celeb.id} to={`/celebrity/${celeb.slug}`} className="grid-card">
                <img
                  src={celeb.profile_image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=500&fit=crop'}
                  alt={celeb.name}
                />
                <div className="card-content">
                  <h3>{celeb.name}</h3>
                  <p className="category">{celeb.category}</p>
                  <p className="price">From ${Math.round(celeb.price_per_hour).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              className="page-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          <div className="per-page">
            <span>Show:</span>
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {filterModalOpen && (
        <div className="filter-modal">
          <div className="modal-overlay" onClick={() => setFilterModalOpen(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Filters</h3>
              <button onClick={() => setFilterModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="filter-group">
                <label>Price Range</label>
                <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
                  <option value="all">All Prices</option>
                  <option value="0-5000">Under $5,000</option>
                  <option value="5000-15000">$5,000 - $15,000</option>
                  <option value="15000-30000">$15,000 - $30,000</option>
                  <option value="30000+">$30,000+</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Availability</label>
                <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="available">Available Now</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={clearFilters}>Clear</button>
              <button onClick={() => setFilterModalOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      )}

      <FooterVanilla />
    </div>
  );
};
