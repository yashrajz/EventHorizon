import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchFilters {
  query: string;
  location: string;
  dateRange: string;
  price: string;
  format: string;
}

interface SearchContextType {
  filters: SearchFilters;
  updateFilter: (key: keyof SearchFilters, value: string) => void;
  resetFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const defaultFilters: SearchFilters = {
  query: '',
  location: 'All Locations',
  dateRange: 'Any Date',
  price: 'All Prices',
  format: 'All Formats',
};

export function SearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <SearchContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
