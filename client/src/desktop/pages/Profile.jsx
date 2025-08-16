import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, MapPin, Heart, Grid3X3, Plus, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

function Profile() {
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'liked'
  const [viewMode, setViewMode] = useState('profile'); // 'profile', 'postFeed'
  const [selectedPost, setSelectedPost] = useState(null);

  // Mock user data
  const user = {
    profilePicture: 'src/assets/black pencil pouch.jpg',
    username: 'john_explorer',
    location: 'San Francisco, CA',
    bio: 'Adventure seeker | Coffee lover | Photographer',
    postsCount: 42
  };

  // Mock user posts
  const userPosts = [
    {
      id: 1,
      user: 'john_explorer',
      location: 'Golden Gate Bridge, SF',
      text: 'Morning walk across the iconic Golden Gate! The fog was perfect today 🌉',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 234,
      comments: 45
    },
    {
      id: 2,
      user: 'john_explorer',
      location: 'Lombard Street, SF',
      text: 'The crookedest street in the world never gets old! 🏠',
      image: 'src/assets/paper bg.jpg',
      likes: 189,
      comments: 32
    },
    {
      id: 3,
      user: 'john_explorer',
      location: 'Alcatraz Island, SF',
      text: 'Exploring the history of Alcatraz. What a fascinating place! 🏛️',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 156,
      comments: 28
    },
    {
      id: 4,
      user: 'john_explorer',
      location: 'Fisherman\'s Wharf, SF',
      text: 'Sea lions everywhere! Love the energy at the wharf 🦭',
      image: 'src/assets/paper bg.jpg',
      likes: 198,
      comments: 41
    },
    {
      id: 5,
      user: 'john_explorer',
      location: 'Chinatown, SF',
      text: 'Amazing dim sum and vibrant culture in SF Chinatown 🥟',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 167,
      comments: 29
    },
    {
      id: 6,
      user: 'john_explorer',
      location: 'Coit Tower, SF',
      text: 'Incredible 360° views of the city from Coit Tower! 🏙️',
      image: 'src/assets/paper bg.jpg',
      likes: 213,
      comments: 37
    },
    {
      id: 7,
      user: 'john_explorer',
      location: 'Mission District, SF',
      text: 'Street art and tacos - Mission District has it all! 🌮',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 176,
      comments: 24
    },
    {
      id: 8,
      user: 'john_explorer',
      location: 'Twin Peaks, SF',
      text: 'Sunrise from Twin Peaks hits different ☀️',
      image: 'src/assets/paper bg.jpg',
      likes: 298,
      comments: 52
    },
    {
      id: 9,
      user: 'john_explorer',
      location: 'Painted Ladies, SF',
      text: 'Classic Victorian houses against the modern skyline 🏠',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 184,
      comments: 33
    }
  ];

  // Mock liked posts
  const likedPosts = [
    {
      id: 10,
      user: 'sarah_wanderer',
      location: 'Yosemite National Park',
      text: 'Half Dome at sunset - absolutely breathtaking! 🏔️',
      image: 'src/assets/paper bg.jpg',
      likes: 567,
      comments: 89
    },
    {
      id: 11,
      user: 'mike_photographer',
      location: 'Big Sur, CA',
      text: 'The coastal drive through Big Sur is pure magic ✨',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 423,
      comments: 67
    },
    {
      id: 12,
      user: 'adventure_anna',
      location: 'Lake Tahoe, CA',
      text: 'Crystal clear waters and mountain reflections 💙',
      image: 'src/assets/paper bg.jpg',
      likes: 389,
      comments: 56
    },
    {
      id: 13,
      user: 'nature_nick',
      location: 'Sequoia National Park',
      text: 'Standing next to these giants makes you feel so small 🌲',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 445,
      comments: 73
    },
    {
      id: 14,
      user: 'beach_lover',
      location: 'Monterey Bay, CA',
      text: 'Watching otters play while the waves crash 🦦',
      image: 'src/assets/paper bg.jpg',
      likes: 312,
      comments: 41
    },
    {
      id: 15,
      user: 'mountain_max',
      location: 'Mount Shasta, CA',
      text: 'Snow-capped peaks and endless blue skies ⛷️',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 278,
      comments: 35
    },
    {
      id: 16,
      user: 'city_explorer',
      location: 'Los Angeles, CA',
      text: 'Sunset from Griffith Observatory never disappoints 🌅',
      image: 'src/assets/paper bg.jpg',
      likes: 356,
      comments: 48
    },
    {
      id: 17,
      user: 'desert_dreamer',
      location: 'Joshua Tree, CA',
      text: 'Stargazing in the desert - pure magic ✨',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 201,
      comments: 29
    }
  ];

  // Scroll to top when entering feed view
  useEffect(() => {
    if (viewMode === 'postFeed') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [viewMode]);

  // Handle post click to open feed
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setViewMode('postFeed');
    // Scroll to top when feed opens
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Go back to profile
  const goBackToProfile = () => {
    setSelectedPost(null);
    setViewMode('profile');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <div className="flex-1 p-6 w-full">
        <div className="w-full">
          
          {/* Profile View */}
          {viewMode === 'profile' && (
            <>
              {/* Profile Header */}
              <div className="bg-neutral-900 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              {/* Profile Picture and Info */}
              <div className="flex items-start space-x-4">
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border-2"
                />
                <div className="flex-1">
                  <h1 className="text-2xl ml-1 font-bold text-white leading-tight justify-self-start">{user.username}</h1>
                  <div className="flex items-center text-gray-400 text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    <span>{user.location}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{user.bio}</p>
                  <div className="mt-3">
                    <span className="text-lg font-bold text-white">{user.postsCount}</span>
                    <span className="text-gray-400 text-sm ml-1">Posts</span>
                  </div>
                </div>
              </div>
              
              {/* Edit Profile Button */}
              <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors">
                <Edit size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Posts Section */}
          <div className="bg-neutral-900 rounded-xl p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                  activeTab === 'posts'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <Grid3X3 size={18} />
                <span>My Posts</span>
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                  activeTab === 'liked'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <Heart size={18} />
                <span>Liked Posts</span>
              </button>
            </div>

            {/* Posts Content */}
            {activeTab === 'posts' && (
              <div>
                {userPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPosts.map((post) => (
                      <div key={post.id} onClick={() => handlePostClick(post)} className="cursor-pointer">
                        <PostCard
                          user={post.user}
                          location={post.location}
                          text={post.text}
                          image={post.image}
                          likes={post.likes}
                          comments={post.comments}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-neutral-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Grid3X3 size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No posts available</h3>
                    <p className="text-gray-400 mb-4">
                      Let the city know your locality by uploading something.
                    </p>
                    <Link
                      to="/create"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
                    >
                      <Plus size={18} />
                      <span>Create Post</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'liked' && (
              <div>
                {likedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedPosts.map((post) => (
                      <div key={post.id} onClick={() => handlePostClick(post)} className="cursor-pointer">
                        <PostCard
                          user={post.user}
                          location={post.location}
                          text={post.text}
                          image={post.image}
                          likes={post.likes}
                          comments={post.comments}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-neutral-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Heart size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No liked posts yet</h3>
                    <p className="text-gray-400">
                      Posts you like will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
        )}

        {/* Instagram-style Post Feed View */}
        {viewMode === 'postFeed' && selectedPost && (
          <div className="max-w-md w-full mx-auto">
            {/* Back Button and Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={goBackToProfile}
                className="p-2 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Posts</h2>
                <p className="text-gray-400 text-sm">Discover more content</p>
              </div>
            </div>

            {/* Post Feed - Starting with selected post */}
            <div className="space-y-6">
              {/* Selected Post First */}
              <PostCard
                user={selectedPost.user}
                location={selectedPost.location}
                text={selectedPost.text}
                image={selectedPost.image}
                likes={selectedPost.likes}
                comments={selectedPost.comments}
              />
              
              {/* Other Posts from the same tab */}
              {activeTab === 'posts' ? (
                // Show other user posts
                userPosts
                  .filter(post => post.id !== selectedPost.id)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      user={post.user}
                      location={post.location}
                      text={post.text}
                      image={post.image}
                      likes={post.likes}
                      comments={post.comments}
                    />
                  ))
              ) : (
                // Show other liked posts
                likedPosts
                  .filter(post => post.id !== selectedPost.id)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      user={post.user}
                      location={post.location}
                      text={post.text}
                      image={post.image}
                      likes={post.likes}
                      comments={post.comments}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}

export default Profile;