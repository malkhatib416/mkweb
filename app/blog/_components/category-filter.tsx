import { categories } from '@/data';
import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  // eslint-disable-next-line no-unused-vars
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          selectedCategory === null
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Tout
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.id
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
