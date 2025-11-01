import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header, BottomNav, Loading } from '@/components';
import { SearchBar } from '@/components/browse/SearchBar';
import { CategoryFilter } from '@/components/browse/CategoryFilter';
import { CelebrityGrid } from '@/components/browse/CelebrityGrid';
import { celebrityApi } from '@/services/api';

export const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: celebrities, isLoading, error } = useQuery({
    queryKey: ['celebrities'],
    queryFn: () => celebrityApi.getAll(),
  });

  // Get unique categories
  const categories = useMemo(() => {
    if (!celebrities) return [];
    const uniqueCategories = [...new Set(celebrities.map((c) => c.category))];
    return uniqueCategories.sort();
  }, [celebrities]);

  // Filter celebrities
  const filteredCelebrities = useMemo(() => {
    if (!celebrities) return [];

    let filtered = celebrities;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [celebrities, selectedCategory, searchQuery]);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
          <h1 className="text-3xl font-bold mb-6">Browse Celebrities</h1>
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Celebrities</h2>
            <p className="text-gray-400">Please try refreshing the page.</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <h1 className="text-3xl font-bold mb-6">Browse Celebrities</h1>

        <SearchBar onSearch={setSearchQuery} />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-400">
            {filteredCelebrities.length} {filteredCelebrities.length === 1 ? 'celebrity' : 'celebrities'} found
          </p>
        </div>

        <CelebrityGrid celebrities={filteredCelebrities} />
      </main>
      <BottomNav />
    </div>
  );
};
