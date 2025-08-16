import React, { useState } from 'react';
import MainFeed from './pages/MainFeed';
import GridView from './pages/GridView';
import TrendingView from './pages/TrendingView';

const MobileApp = () => {
  const [currentView, setCurrentView] = useState('feed'); // 'feed', 'grid', 'trending'

  const renderCurrentView = () => {
    switch (currentView) {
      case 'grid':
        return <GridView />;
      case 'trending':
        return <TrendingView />;
      default:
        return <MainFeed />;
    }
  };

  return (
    <div className="mobile-app">
      {renderCurrentView()}
    </div>
  );
};

export default MobileApp;
