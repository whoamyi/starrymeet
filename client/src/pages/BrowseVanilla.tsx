import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { celebrityApi } from '@/services/api';
import { HeaderVanilla, FooterVanilla } from '@/components';
import {
  Toolbar,
  CategoryFilter,
  ToolbarMeta,
  SwipeView,
  GridView,
  FilterModal,
} from '@/components/browse';

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

  const handleSortChange = () => {
    setSortBy(sortBy === 'popular' ? 'recent' : 'popular');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <HeaderVanilla />

      <Toolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterClick={() => setFilterModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ToolbarMeta
        resultCount={filteredCelebrities.length}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {viewMode === 'swipe' && (
        <SwipeView currentCard={currentCard} onPass={handlePass} onBack={handleBack} />
      )}

      {viewMode === 'grid' && (
        <GridView
          celebrities={paginatedCelebrities}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      )}

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        onClearFilters={clearFilters}
      />

      <FooterVanilla />
    </div>
  );
};
