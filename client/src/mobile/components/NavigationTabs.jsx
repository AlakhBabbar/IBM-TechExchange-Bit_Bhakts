import React, { useState } from 'react';

const NavigationTabs = () => {
  const [activeTab, setActiveTab] = useState('FOR YOU');
  
  const tabs = ['FOR YOU', 'EXPLORE', 'TRENDING'];

  return (
    <div className="bg-black border-b border-gray-800">
      <div className="flex justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium relative ${
              activeTab === tab
                ? 'text-white'
                : 'text-gray-400'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
