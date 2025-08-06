import React, { useState } from 'react';

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
      <div className="flex justify-around py-2">
        {/* Home */}
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-2 px-3 ${
            activeTab === 'home' ? 'text-white' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </button>

        {/* Grid View */}
        <button 
          onClick={() => setActiveTab('grid')}
          className={`flex flex-col items-center py-2 px-3 ${
            activeTab === 'grid' ? 'text-white' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        {/* Location */}
        <button 
          onClick={() => setActiveTab('location')}
          className={`flex flex-col items-center py-2 px-3 ${
            activeTab === 'location' ? 'text-white' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Notifications */}
        <button 
          onClick={() => setActiveTab('notifications')}
          className={`flex flex-col items-center py-2 px-3 ${
            activeTab === 'notifications' ? 'text-white' : 'text-gray-400'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
