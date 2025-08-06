import React from 'react';
import Header from '../components/Header';
import NavigationTabs from '../components/NavigationTabs';
import BottomNavigation from '../components/BottomNavigation';

const TrendingView = () => {
  // Sample trending items data
  const trendingItems = [
    {
      id: 1,
      title: 'A+ personalized headline w/ category per p or advice',
      subtitle: '3 posts high in cards h.',
      description: 'Thanks their description. Ib gk pols random-figures are fit and etc.',
      images: [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
      ]
    },
    {
      id: 2,
      title: 'A+ personalized headline w/ category per p or advice',
      subtitle: '3 posts high in cards h.',
      description: 'Thanks their description. Ib gk pols random-figures are fit and etc.',
      images: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
      ]
    },
    {
      id: 3,
      title: 'A+ personalized headline w/ category per p or advice',
      subtitle: '3 posts high in cards h.',
      description: 'Thanks their description. Ib gk pols random-figures are fit and etc.',
      images: [
        'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1502657877623-f66bf489d236?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80'
      ]
    }
  ];

  const TrendingCard = ({ item }) => (
    <div className="bg-gray-900 rounded-lg p-4 mb-4 mx-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white text-sm font-medium mb-1">{item.title}</h3>
          <p className="text-blue-400 text-xs mb-2">{item.subtitle}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {item.images.map((image, index) => (
          <div key={index} className="aspect-square">
            <img 
              src={image} 
              alt={`Trending ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <NavigationTabs />
      
      <div className="pb-16"> {/* Add padding for bottom navigation */}
        <div className="py-4">
          {trendingItems.map((item) => (
            <TrendingCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TrendingView;
