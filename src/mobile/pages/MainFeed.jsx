import React from 'react';
import Header from '../components/Header';
import NavigationTabs from '../components/NavigationTabs';
import Post from '../components/Post';
import BottomNavigation from '../components/BottomNavigation';

const MainFeed = () => {
  // Sample data - you can replace this with real data from your API
  const posts = [
    {
      id: 1,
      user: 'techno',
      timeAgo: '5 min ago',
      content: 'Fun job! Show the chart 🔥',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 31,
      comments: 5,
      isLiked: true
    },
    {
      id: 2,
      user: 'Dhanashri',
      timeAgo: '8 min ago',
      content: 'Fun job! Show the chart 🔥',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 54,
      comments: 2,
      isLiked: false
    },
    {
      id: 3,
      user: 'helena',
      timeAgo: '12 min ago',
      content: 'Fun job! Show the chart 🔥',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 31,
      comments: 5,
      isLiked: false
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <NavigationTabs />
      
      <div className="pb-16"> {/* Add padding for bottom navigation */}
        {posts.map((post) => (
          <Post
            key={post.id}
            user={post.user}
            timeAgo={post.timeAgo}
            content={post.content}
            image={post.image}
            likes={post.likes}
            comments={post.comments}
            isLiked={post.isLiked}
          />
        ))}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MainFeed;
