import { NavLink } from "react-router-dom";
import { Home, Search, TrendingUp } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar({ onSearch, searchPlaceholder = "Search..." }) {
  const tabs = [
    { to: "/for-you", label: "For You", icon: <Home size={18} /> },
    { to: "/explore", label: "Explore", icon: <Search size={18} /> },
    { to: "/trending", label: "Trending", icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="bg-black text-gray-400 flex items-center px-6 py-3 sticky top-0 z-10">
      {/* Empty div for spacing */}
      <div className="flex-1"></div>
      
      {/* Navigation Tabs - Center */}
      <div className="flex gap-6 absolute left-1/2 transform -translate-x-1/2">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex items-center gap-2 hover:text-gray-300 transition pb-1 ${
                isActive ? "text-white border-b-2 border-white" : ""
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Search Bar - Right */}
      <div className="max-w-sm w-80 ml-auto">
        <SearchBar 
          onSearch={onSearch}
          placeholder={searchPlaceholder}
        />
      </div>
    </div>
  );
}
