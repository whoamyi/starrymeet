import type { Dispatch, SetStateAction } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceFilter: string;
  setPriceFilter: Dispatch<SetStateAction<string>>;
  availabilityFilter: string;
  setAvailabilityFilter: Dispatch<SetStateAction<string>>;
  onClearFilters: () => void;
}

export const FilterModal = ({
  isOpen,
  onClose,
  priceFilter,
  setPriceFilter,
  availabilityFilter,
  setAvailabilityFilter,
  onClearFilters,
}: FilterModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="filter-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Filters</h3>
          <button onClick={onClose}>×</button>
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
          <button onClick={onClearFilters}>Clear</button>
          <button onClick={onClose}>Apply</button>
        </div>
      </div>
    </div>
  );
};
