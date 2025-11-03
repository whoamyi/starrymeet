interface ToolbarMetaProps {
  resultCount: number;
  sortBy: string;
  onSortChange: () => void;
}

export const ToolbarMeta = ({ resultCount, sortBy, onSortChange }: ToolbarMetaProps) => {
  return (
    <div className="toolbar-meta">
      <span>{resultCount} results</span>
      <button className="sort-btn" onClick={onSortChange}>
        <span>{sortBy === 'popular' ? 'Popular' : 'Recent'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
};
