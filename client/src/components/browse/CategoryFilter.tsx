import type { Dispatch, SetStateAction } from 'react';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) => {
  return (
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
  );
};
