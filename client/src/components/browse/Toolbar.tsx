import type { Dispatch, SetStateAction } from 'react';

interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onFilterClick: () => void;
  viewMode: 'swipe' | 'grid';
  setViewMode: Dispatch<SetStateAction<'swipe' | 'grid'>>;
}

export const Toolbar = ({
  searchQuery,
  setSearchQuery,
  onFilterClick,
  viewMode,
  setViewMode,
}: ToolbarProps) => {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="icon-btn" onClick={onFilterClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
        </button>
        <div className="view-switch">
          <button
            className={`icon-btn view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            className={`icon-btn view-toggle ${viewMode === 'swipe' ? 'active' : ''}`}
            onClick={() => setViewMode('swipe')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
