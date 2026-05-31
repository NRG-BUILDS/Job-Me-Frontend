import React, { createContext, useContext, useState, ReactNode } from "react";

export interface FilterForm {
  q: string;
  state: string;
  city: string;
  min_price: number;
  max_price: number;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
}

interface SearchFilterContextType {
  filter: FilterForm;
  setFilter: React.Dispatch<React.SetStateAction<FilterForm>>;
  updateFilter: (updates: Partial<FilterForm>) => void;
  resetFilter: () => void;
}

const defaultFilter: FilterForm = {
  q: "",
  state: "",
  city: "",
  min_price: 0,
  max_price: 0,
  property_type: "",
  bedrooms: null,
  bathrooms: null,
};

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(
  undefined
);

export const SearchFilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filter, setFilter] = useState<FilterForm>(defaultFilter);

  const updateFilter = (updates: Partial<FilterForm>) => {
    setFilter((prev) => ({ ...prev, ...updates }));
  };

  const resetFilter = () => {
    setFilter(defaultFilter);
  };

  return (
    <SearchFilterContext.Provider
      value={{
        filter,
        setFilter,
        updateFilter,
        resetFilter,
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = () => {
  const context = useContext(SearchFilterContext);
  if (context === undefined) {
    throw new Error(
      "useSearchFilter must be used within a SearchFilterProvider"
    );
  }
  return context;
};
