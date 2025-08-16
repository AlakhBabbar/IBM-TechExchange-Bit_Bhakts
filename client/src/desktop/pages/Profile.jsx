import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, MapPin, Heart, Grid3X3, Plus, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, getUserPosts, updateUserPostCount } from '../../Firebase/firestore';

function Profile() {
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'liked'
  const [viewMode, setViewMode] = useState('profile'); // 'profile', 'postFeed'
  const [selectedPost, setSelectedPost] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setError('No user found');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching profile for user:', user.uid);
        const profileResult = await getUserProfile(user.uid);
        
        if (profileResult.success && profileResult.data) {
          console.log('✅ Profile fetched:', profileResult.data);
          setUserProfile(profileResult.data);
        } else {
          console.error('❌ Failed to fetch profile:', profileResult);
          setError('Failed to load profile');
        }
      } catch (error) {
        console.error('❌ Error fetching profile:', error);
        setError('Error loading profile');
      }
      
      setLoading(false);
    };

    fetchUserProfile();
  }, [user]);

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      try {
        console.log('🔍 Fetching posts for user:', user.uid);
        const postsResult = await getUserPosts(user.uid);
        
        if (postsResult.success) {
          console.log('✅ Posts fetched:', postsResult.data);
          setUserPosts(postsResult.data);
          
          // Update the totalPosts count in Firebase if needed
          if (userProfile && userProfile.totalPosts !== postsResult.data.length) {
            await updateUserPostCount(user.uid);
          }
        } else {
          console.error('❌ Failed to fetch posts:', postsResult);
        }
      } catch (error) {
        console.error('❌ Error fetching posts:', error);
      }
    };

    if (userProfile) {
      fetchUserPosts();
    }
  }, [user, userProfile]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Profile not found'}</p>
            <Link to="/account-setup" className="text-blue-400 hover:text-blue-300">
              Complete your profile setup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mock liked posts for demo purposes
  const likedPosts = [
    {
      id: 10,
      user: 'sarah_wanderer',
      location: 'Yosemite National Park',
      text: 'Half Dome at sunset - absolutely breathtaking! 🏔️',
      image: 'src/assets/paper bg.jpg',
      likes: 567,
      comments: 89,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: 11,
      user: 'mike_photographer',
      location: 'Big Sur, CA',
      text: 'The coastal drive through Big Sur is pure magic ✨',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 423,
      comments: 67,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    },
    {
      id: 12,
      user: 'adventure_anna',
      location: 'Lake Tahoe, CA',
      text: 'Crystal clear waters and mountain reflections 💙',
      image: 'src/assets/paper bg.jpg',
      likes: 389,
      comments: 56,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    },
    {
      id: 13,
      user: 'nature_nick',
      location: 'Sequoia National Park',
      text: 'Standing next to these giants makes you feel so small 🌲',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 445,
      comments: 73,
      createdAt: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
    },
    {
      id: 14,
      user: 'beach_lover',
      location: 'Monterey Bay, CA',
      text: 'Watching otters play while the waves crash 🦦',
      image: 'src/assets/paper bg.jpg',
      likes: 312,
      comments: 41,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    },
    {
      id: 15,
      user: 'mountain_max',
      location: 'Mount Shasta, CA',
      text: 'Snow-capped peaks and endless blue skies ⛷️',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 278,
      comments: 35,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 2 weeks ago
    },
    {
      id: 16,
      user: 'city_explorer',
      location: 'Los Angeles, CA',
      text: 'Sunset from Griffith Observatory never disappoints 🌅',
      image: 'src/assets/paper bg.jpg',
      likes: 356,
      comments: 48,
      createdAt: new Date(Date.now() - 20 * 60 * 1000) // 20 minutes ago
    },
    {
      id: 17,
      user: 'desert_dreamer',
      location: 'Joshua Tree, CA',
      text: 'Stargazing in the desert - pure magic ✨',
      image: 'src/assets/black pencil pouch.jpg',
      likes: 201,
      comments: 29,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 1 month ago
    }
  ];


  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <div className="flex-1 p-6 w-full">
        <div className="w-full">
          
          {/* Profile View */}
          {viewMode === 'profile' && (
            <>
              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="text-white">Loading profile...</div>
                </div>
              ) : error ? (
                <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 mb-6">
                  <p className="text-red-400">{error}</p>
                </div>
              ) : userProfile ? (
                <>
                  {/* Profile Header */}
                  <div className="bg-neutral-900 rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  {/* Profile Picture and Info */}
                  <div className="flex items-start space-x-4">
                    <img
                      src={userProfile.photo || '/default-avatar.png'}
                      alt={userProfile.username || 'User'}
                      className="w-24 h-24 rounded-full object-cover border-2"
                    />
                    <div className="flex-1">
                      <h1 className="text-2xl ml-1 font-bold text-white leading-tight justify-self-start">
                        {userProfile.username || 'No username set'}
                      </h1>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>
                          {userProfile.locality && userProfile.city 
                            ? `${userProfile.locality}, ${userProfile.city}`
                            : userProfile.locality || userProfile.city || 'Location not set'
                          }
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-2 ml-1 justify-self-start">
                        {userProfile.bio || 'No bio available'}
                      </p>
                      <div className="mt-3">
                        <span className="text-lg font-bold text-white">{userProfile.totalPosts || 0}</span>
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
                </>
              ) : (
                <div className="bg-neutral-900 rounded-xl p-6 mb-6">
                  <p className="text-gray-400">No profile data available</p>
                </div>
              )}

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
                          user={post.username || post.user || 'Unknown User'}
                          userPhoto={post.userPhoto || userProfile?.photo}
                          location={post.location}
                          text={post.description || post.text}
                          image={post.mediaUrl || post.image}
                          mediaType={post.mediaType}
                          thumbnailUrl={post.thumbnailUrl}
                          createdAt={post.createdAt}
                          likes={post.likes || 0}
                          comments={post.comments || 0}
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
                          user={post.username || post.user || 'Unknown User'}
                          userPhoto={post.userPhoto || userProfile?.photo}
                          location={post.location}
                          text={post.description || post.text}
                          image={post.mediaUrl || post.image}
                          mediaType={post.mediaType}
                          thumbnailUrl={post.thumbnailUrl}
                          createdAt={post.createdAt}
                          likes={post.likes || 0}
                          comments={post.comments || 0}
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
                user={selectedPost.username || selectedPost.user || 'Unknown User'}
                userPhoto={selectedPost.userPhoto || userProfile?.photo}
                location={selectedPost.location}
                text={selectedPost.description || selectedPost.text}
                image={selectedPost.mediaUrl || selectedPost.image}
                mediaType={selectedPost.mediaType}
                thumbnailUrl={selectedPost.thumbnailUrl}
                createdAt={selectedPost.createdAt}
                likes={selectedPost.likes || 0}
                comments={selectedPost.comments || 0}
              />
              
              {/* Other Posts from the same tab */}
              {activeTab === 'posts' ? (
                // Show other user posts
                userPosts
                  .filter(post => post.id !== selectedPost.id)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      user={post.username || post.user || 'Unknown User'}
                      userPhoto={post.userPhoto || userProfile?.photo}
                      location={post.location}
                      text={post.description || post.text}
                      image={post.mediaUrl || post.image}
                      mediaType={post.mediaType}
                      thumbnailUrl={post.thumbnailUrl}
                      createdAt={post.createdAt}
                      likes={post.likes || 0}
                      comments={post.comments || 0}
                    />
                  ))
              ) : (
                // Show other liked posts
                likedPosts
                  .filter(post => post.id !== selectedPost.id)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      user={post.username || post.user || 'Unknown User'}
                      userPhoto={post.userPhoto || userProfile?.photo}
                      location={post.location}
                      text={post.description || post.text}
                      image={post.mediaUrl || post.image}
                      mediaType={post.mediaType}
                      thumbnailUrl={post.thumbnailUrl}
                      createdAt={post.createdAt}
                      likes={post.likes || 0}
                      comments={post.comments || 0}
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