interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
          selectedCategory === 'all'
            ? 'bg-[#D4A574] text-black font-semibold'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
            selectedCategory === category
              ? 'bg-[#D4A574] text-black font-semibold'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
