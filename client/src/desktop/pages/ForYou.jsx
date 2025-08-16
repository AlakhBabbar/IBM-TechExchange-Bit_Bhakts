import React, { useState, useEffect, useCallback, useRef } from 'react';
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../Firebase/firestore';
import { getRecommendedPosts, getMoreRecommendedPosts } from '../../utils/recommendationSystem';

export default function ForYou() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [shownPostIds, setShownPostIds] = useState([]);
  
  const { user } = useAuth();
  const observerTarget = useRef(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setError('Please log in to see recommendations');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Fetching user profile for recommendations');
        const profileResult = await getUserProfile(user.uid);
        
        if (profileResult.success && profileResult.data) {
          setUserProfile(profileResult.data);
          console.log('✅ User profile loaded:', profileResult.data);
        } else {
          setError('Failed to load user profile');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error fetching user profile:', error);
        setError('Error loading profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Load initial recommended posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      if (!userProfile || !userProfile.coordinates) {
        console.log('⏳ Waiting for user profile with coordinates');
        return;
      }

      try {
        setLoading(true);
        console.log('🚀 Loading initial recommended posts');
        
        const result = await getRecommendedPosts(
          user.uid,
          userProfile.coordinates,
          [],
          null,
          10
        );

        if (result.posts && result.posts.length > 0) {
          setPosts(result.posts);
          setFilteredPosts(result.posts);
          setLastDoc(result.lastDoc);
          setHasMore(result.hasMore);
          setShownPostIds(result.posts.map(post => post.id));
          
          console.log('✅ Initial posts loaded:', result.posts.length);
          console.log('🎯 Debug info:', result.debug);
        } else {
          setError('No posts found in your area. Try expanding your location preferences.');
        }
      } catch (error) {
        console.error('❌ Error loading initial posts:', error);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadInitialPosts();
  }, [userProfile, user]);

  // Load more posts for infinite scroll
  const loadMorePosts = useCallback(async () => {
    if (!userProfile || !userProfile.coordinates || !hasMore || loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);
      console.log('📚 Loading more recommended posts');
      
      const result = await getMoreRecommendedPosts(
        user.uid,
        userProfile.coordinates,
        shownPostIds,
        lastDoc
      );

      if (result.posts && result.posts.length > 0) {
        const newPosts = [...posts, ...result.posts];
        setPosts(newPosts);
        setFilteredPosts(searchQuery ? newPosts.filter(post => 
          (post.username || post.user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.location?.locality || post.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.description || post.text || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) : newPosts);
        
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
        setShownPostIds(prev => [...prev, ...result.posts.map(post => post.id)]);
        
        console.log('✅ More posts loaded:', result.posts.length);
      } else {
        setHasMore(false);
        console.log('📭 No more posts available');
      }
    } catch (error) {
      console.error('❌ Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [userProfile, user, hasMore, loadingMore, shownPostIds, lastDoc, posts, searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMorePosts, hasMore, loadingMore]);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(post => 
      (post.username || post.user || '').toLowerCase().includes(query.toLowerCase()) ||
      (post.location?.locality || post.location || '').toLowerCase().includes(query.toLowerCase()) ||
      (post.description || post.text || '').toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredPosts(filtered);
  }, [posts]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar 
          onSearch={handleSearch}
          searchPlaceholder="Search posts, users, locations..."
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-6">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                  <div className="text-gray-400 text-lg mt-4">Loading your personalized feed...</div>
                  <div className="text-gray-500 text-sm mt-2">
                    We're finding the best posts for you
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar 
          onSearch={handleSearch}
          searchPlaceholder="Search posts, users, locations..."
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-6">
                <div className="text-center py-12">
                  <div className="text-red-400 text-lg">{error}</div>
                  <div className="text-gray-500 text-sm mt-2">
                    Please try refreshing the page
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar 
        onSearch={handleSearch}
        searchPlaceholder="Search posts, users, locations..."
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Posts Feed */}
            <div className="flex flex-col items-center gap-6">
              {filteredPosts.length > 0 ? (
                <>
                  {filteredPosts.map((post, idx) => (
                    <PostCard 
                      key={post.id || idx}
                      user={post.username || post.user || 'Unknown User'}
                      userPhoto={post.userPhoto}
                      location={post.location?.locality || post.location}
                      text={post.description || post.text}
                      image={post.mediaUrl || post.image}
                      mediaType={post.mediaType}
                      thumbnailUrl={post.thumbnailUrl}
                      createdAt={post.createdAt}
                      likes={post.likes || 0}
                      comments={post.comments || 0}
                    />
                  ))}
                  
                  {/* Infinite scroll trigger */}
                  {hasMore && (
                    <div ref={observerTarget} className="w-full py-4">
                      {loadingMore && (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                          <div className="text-gray-400 text-sm mt-2">Loading more posts...</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* End of feed message */}
                  {!hasMore && filteredPosts.length > 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-lg">You're all caught up!</div>
                      <div className="text-gray-500 text-sm mt-2">
                        Check back later for more posts
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">
                    {searchQuery ? 'No posts found' : 'No posts available'}
                  </div>
                  <div className="text-gray-500 text-sm mt-2">
                    {searchQuery 
                      ? 'Try searching for something else' 
                      : 'Check back later for new content'
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
