import React from 'react';

function SearchBar({ onSearch }) {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 focus-within:shadow-md focus-within:bg-white">
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent px-3 py-1 focus:outline-none"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SearchBar;