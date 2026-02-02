import { Search } from 'lucide-react';
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (term: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder,
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400 dark:text-slate-500" />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-myorange-100 focus:border-transparent dark:focus:ring-myorange-100/60 transition-all duration-200 text-sm"
        aria-label={placeholder}
      />
    </div>
  );
};

export default SearchBar;
