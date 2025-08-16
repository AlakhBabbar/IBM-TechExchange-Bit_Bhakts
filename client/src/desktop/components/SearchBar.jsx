import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, MapPin, User, Hash } from 'lucide-react';

function SearchBar({ onSearch, placeholder = "Search posts, users, locations...", suggestions = [] }) {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Default suggestions for different types
  const defaultSuggestions = [
    { type: 'trending', text: 'Golden Gate Bridge', icon: <TrendingUp size={16} /> },
    { type: 'trending', text: 'Street Art', icon: <TrendingUp size={16} /> },
    { type: 'location', text: 'San Francisco, CA', icon: <MapPin size={16} /> },
    { type: 'location', text: 'Yosemite National Park', icon: <MapPin size={16} /> },
    { type: 'user', text: 'john_explorer', icon: <User size={16} /> },
    { type: 'user', text: 'sarah_wanderer', icon: <User size={16} /> },
    { type: 'hashtag', text: '#photography', icon: <Hash size={16} /> },
    { type: 'hashtag', text: '#adventure', icon: <Hash size={16} /> },
  ];

  const allSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  // Filter suggestions based on query
  const filteredSuggestions = query 
    ? allSuggestions.filter(suggestion => 
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      )
    : allSuggestions.slice(0, 6); // Show only first 6 when no query

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    
    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion.text);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchContainerRef} className="relative w-full">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center bg-neutral-800 rounded-lg border-2 transition-all duration-200 ${
          isActive ? 'border-purple-500 bg-neutral-700' : 'border-neutral-700 hover:border-neutral-600'
        }`}>
          {/* Search Icon */}
          <div className="absolute left-3 z-10">
            <Search size={16} className="text-gray-400" />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setIsActive(true);
              setShowSuggestions(true);
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 p-1 hover:bg-neutral-600 rounded-full transition-colors"
            >
              <X size={14} className="text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (isActive || query) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 rounded-xl border border-neutral-700 shadow-xl z-50 max-h-80 overflow-y-auto">
          {/* Recent/Popular Searches Header */}
          {!query && (
            <div className="px-4 py-3 border-b border-neutral-700">
              <h3 className="text-sm font-medium text-gray-300">Popular Searches</h3>
            </div>
          )}

          {/* Suggestions List */}
          <div className="py-2">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-700 transition-colors text-left"
                >
                  <div className={`flex-shrink-0 ${
                    suggestion.type === 'trending' ? 'text-orange-400' :
                    suggestion.type === 'location' ? 'text-blue-400' :
                    suggestion.type === 'user' ? 'text-green-400' :
                    'text-purple-400'
                  }`}>
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm">{suggestion.text}</div>
                    <div className="text-gray-400 text-xs capitalize">{suggestion.type}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-400">
                <Search size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            )}
          </div>

          {/* Search Tips */}
          {!query && (
            <div className="border-t border-neutral-700 px-4 py-3">
              <div className="text-xs text-gray-500">
                <p className="mb-1">💡 Search tips:</p>
                <p>• Use @ for users (e.g., @john_explorer)</p>
                <p>• Use # for hashtags (e.g., #photography)</p>
                <p>• Search by location or post content</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;