import React, { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, getDocs, limit, startAfter } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Navbar from '../components/NavBar';
import { ArrowLeft } from 'lucide-react';

/**
 * Shuffle array randomly
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Simple test component to debug thumbnail loading
 */
function ThumbnailTest({ thumbnailUrl, onResult }) {
  useEffect(() => {
    if (!thumbnailUrl) return;
    
    console.log('🧪 Testing thumbnail URL:', thumbnailUrl);
    
    const img = new Image();
    img.onload = () => {
      console.log('✅ Thumbnail test PASSED:', thumbnailUrl);
      onResult(true);
    };
    img.onerror = (e) => {
      console.log('❌ Thumbnail test FAILED:', thumbnailUrl, e);
      onResult(false);
    };
    img.src = thumbnailUrl;
  }, [thumbnailUrl, onResult]);
  
  return null;
}
function VideoThumbnail({ post, className, skeletonSize }) {
  const [thumbnailError, setThumbnailError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleThumbnailError = () => {
    console.log('❌ Thumbnail failed to load:', post.thumbnailUrl);
    setThumbnailError(true);
  };

  const handleThumbnailLoad = () => {
    console.log('✅ Thumbnail loaded successfully:', post.thumbnailUrl);
    setImageLoaded(true);
  };

  return (
    <div className={`relative w-full h-full bg-gray-900 ${className}`}>
      {post.thumbnailUrl && !thumbnailError ? (
        <img 
          src={post.thumbnailUrl} 
          alt={post.description || 'Video thumbnail'}
          className={`w-full h-full object-cover group-hover:shadow-xl transition-all duration-300 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
          onError={handleThumbnailError}
          onLoad={handleThumbnailLoad}
        />
      ) : null}
      
      {/* Show video if no thumbnail or thumbnail failed */}
      {(!post.thumbnailUrl || thumbnailError) && (
        <video 
          src={post.mediaUrl}
          className="w-full h-full object-cover group-hover:shadow-xl transition-all duration-300"
          muted
          preload="metadata"
          onError={(e) => {
            console.log('❌ Video failed to load:', post.mediaUrl);
          }}
          onLoadedMetadata={() => {
            console.log('✅ Video metadata loaded:', post.mediaUrl);
          }}
        />
      )}
      
      {/* Loading skeleton while thumbnail loads */}
      {post.thumbnailUrl && !thumbnailError && !imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
        <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-l-[8px] border-l-black border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
        </div>
      </div>
      
      {/* Debug info overlay (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs p-1 rounded">
          {post.thumbnailUrl && !thumbnailError ? 'T' : 'V'}
          {thumbnailError && ' (Error)'}
        </div>
      )}
    </div>
  );
}

export default function Explore() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState('explore'); // 'explore', 'post'
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [shownPostIds, setShownPostIds] = useState([]);
  
  const observerTarget = useRef(null);

  // Fetch all posts in random order
  const fetchRandomPosts = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      console.log('🔍 Fetching posts for Explore page');

      // Simple query to get all active posts
      let postsQuery = query(
        collection(db, 'posts'),
        where('isActive', '==', true),
        limit(20) // Load 20 posts at a time
      );

      if (isLoadMore && lastDoc) {
        postsQuery = query(
          collection(db, 'posts'),
          where('isActive', '==', true),
          startAfter(lastDoc),
          limit(20)
        );
      }

      const postsSnapshot = await getDocs(postsQuery);
      const newPosts = [];
      let newLastDoc = null;

      postsSnapshot.docs.forEach(doc => {
        const postData = { id: doc.id, ...doc.data() };
        
        // Debug log for video posts
        if (postData.mediaType === 'video') {
          console.log('🎥 Video post found:', {
            id: postData.id,
            mediaType: postData.mediaType,
            thumbnailUrl: postData.thumbnailUrl,
            mediaUrl: postData.mediaUrl,
            hasThumbnail: !!postData.thumbnailUrl
          });
        }
        
        // Skip posts already shown
        if (!shownPostIds.includes(doc.id)) {
          newPosts.push(postData);
          newLastDoc = doc;
        }
      });

      if (newPosts.length > 0) {
        // Shuffle the new posts randomly
        const shuffledNewPosts = shuffleArray(newPosts);
        
        if (isLoadMore) {
          const updatedPosts = [...posts, ...shuffledNewPosts];
          setPosts(updatedPosts);
          setFilteredPosts(searchQuery ? updatedPosts.filter(post => 
            (post.username || post.user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.location?.locality || post.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.description || post.text || '').toLowerCase().includes(searchQuery.toLowerCase())
          ) : updatedPosts);
        } else {
          setPosts(shuffledNewPosts);
          setFilteredPosts(shuffledNewPosts);
        }

        setLastDoc(newLastDoc);
        setShownPostIds(prev => [...prev, ...shuffledNewPosts.map(post => post.id)]);
        setHasMore(postsSnapshot.docs.length === 20); // If we got less than 20, no more posts
        
        console.log(`✅ Loaded ${shuffledNewPosts.length} posts${isLoadMore ? ' (more)' : ''}`);
      } else {
        setHasMore(false);
        console.log('📭 No more posts available');
      }

    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [posts, lastDoc, shownPostIds, searchQuery]);

  // Load initial posts
  useEffect(() => {
    fetchRandomPosts();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && viewMode === 'explore') {
          fetchRandomPosts(true);
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
  }, [fetchRandomPosts, hasMore, loadingMore, viewMode]);

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

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setViewMode('post');
  };

  const goBackToExplore = () => {
    setSelectedPost(null);
    setViewMode('explore');
  };

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar 
          onSearch={handleSearch}
          searchPlaceholder="Search images, users, locations..."
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-6 bg-black">
            <div className="flex justify-center">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <div className="text-gray-400 text-lg mt-4">Loading posts...</div>
                <div className="text-gray-500 text-sm mt-2">
                  Discovering amazing content for you
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
          searchPlaceholder="Search images, users, locations..."
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto p-6 bg-black">
            <div className="flex justify-center">
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
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar 
        onSearch={handleSearch}
        searchPlaceholder="Search images, users, locations..."
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6 bg-black">
        
        {/* Explore Grid View */}
        {viewMode === 'explore' && (
          <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 max-w-7xl">
                {filteredPosts.length > 0 ? (
                  <>
                    {filteredPosts.map((post, index) => {
                      // Define repeating skeleton patterns for variety
                      const skeletonSizes = [
                        'h-48', 'h-64', 'h-56', 'h-40', 'h-52', 'h-60'
                      ];
                      const skeletonSize = skeletonSizes[index % skeletonSizes.length];
                  
                      return (
                        <div
                          key={post.id}
                          onClick={() => handlePostClick(post)}
                          className={`${skeletonSize} cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105 group rounded-lg overflow-hidden`}
                        >
                          {post.mediaType === 'video' ? (
                            <div className="relative w-full h-full">
                              {/* Show thumbnail exactly like image posts */}
                              <img 
                                src={post.thumbnailUrl || post.mediaUrl} 
                                alt={post.description || 'Video thumbnail'}
                                className="w-full h-full object-cover group-hover:shadow-xl transition-all duration-300"
                                onError={(e) => {
                                  console.log('❌ Thumbnail failed, trying video as fallback:', post.thumbnailUrl);
                                  // If thumbnail fails, try to use video poster frame
                                  if (post.thumbnailUrl && e.target.src === post.thumbnailUrl) {
                                    e.target.src = post.mediaUrl;
                                  }
                                }}
                                onLoad={() => {
                                  console.log('✅ Video thumbnail displayed successfully');
                                }}
                              />
                              
                              {/* Small video icon indicator */}
                              <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1.5">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <img 
                              src={post.mediaUrl || post.image} 
                              alt={post.description || post.text || 'Post image'}
                              className="w-full h-full object-cover group-hover:shadow-xl transition-all duration-300"
                            />
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Infinite scroll trigger */}
                    {hasMore && (
                      <div ref={observerTarget} className="col-span-full py-4">
                        {loadingMore && (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                            <div className="text-gray-400 text-sm mt-2">Loading more posts...</div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 col-span-full">
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
        )}

        {/* Instagram-style Post Feed View */}
        {viewMode === 'post' && selectedPost && (
          <div className="max-w-md w-full mx-auto">
            {/* Back Button and Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={goBackToExplore}
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
                userPhoto={selectedPost.userPhoto}
                location={selectedPost.location?.locality || selectedPost.location}
                text={selectedPost.description || selectedPost.text}
                image={selectedPost.mediaUrl || selectedPost.image}
                mediaType={selectedPost.mediaType}
                thumbnailUrl={selectedPost.thumbnailUrl}
                createdAt={selectedPost.createdAt}
                likes={selectedPost.likes || 0}
                comments={selectedPost.comments || 0}
              />
              
              {/* Similar/Related Posts */}
              {posts
                .filter(post => post.id !== selectedPost.id) // Exclude the selected post
                .slice(0, 10) // Show first 10 other posts
                .map((post) => (
                  <PostCard
                    key={post.id}
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
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
