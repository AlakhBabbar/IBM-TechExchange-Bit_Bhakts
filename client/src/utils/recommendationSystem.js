import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter,
  getDoc,
  doc
} from 'firebase/firestore';
import { db } from '../Firebase/firebase';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

/**
 * Get user's liked posts to understand preferences
 * @param {string} userId - Current user's ID
 * @returns {Promise<Array>} Array of liked post IDs
 */
async function getUserLikedPosts(userId) {
  try {
    const likesQuery = query(
      collection(db, 'likes'),
      where('likedBy', '==', doc(db, 'user', userId))
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    const likedPostIds = likesSnapshot.docs.map(doc => {
      const postRef = doc.data().post;
      return postRef.id; // Extract post ID from reference
    });
    
    console.log('🔍 User liked posts:', likedPostIds);
    return likedPostIds;
  } catch (error) {
    console.error('❌ Error fetching liked posts:', error);
    return [];
  }
}

/**
 * Get user's commented posts to understand engagement
 * @param {string} userId - Current user's ID
 * @returns {Promise<Array>} Array of commented post IDs
 */
async function getUserCommentedPosts(userId) {
  try {
    const commentsQuery = query(
      collection(db, 'comments'),
      where('commentBy', '==', doc(db, 'user', userId))
    );
    
    const commentsSnapshot = await getDocs(commentsQuery);
    const commentedPostIds = commentsSnapshot.docs.map(doc => {
      const postRef = doc.data().post;
      return postRef.id; // Extract post ID from reference
    });
    
    console.log('🔍 User commented posts:', commentedPostIds);
    return commentedPostIds;
  } catch (error) {
    console.error('❌ Error fetching commented posts:', error);
    return [];
  }
}

/**
 * Get categories from user's past interactions
 * @param {Array} postIds - Array of post IDs user interacted with
 * @returns {Promise<Array>} Array of preferred categories
 */
async function getUserPreferredCategories(postIds) {
  try {
    if (postIds.length === 0) return [];
    
    const categories = new Set();
    
    // Fetch posts and extract categories
    for (const postId of postIds) {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          if (postData.categories && Array.isArray(postData.categories)) {
            postData.categories.forEach(category => categories.add(category));
          }
          if (postData.moods && Array.isArray(postData.moods)) {
            postData.moods.forEach(mood => categories.add(mood));
          }
        }
      } catch (error) {
        console.error(`❌ Error fetching post ${postId}:`, error);
      }
    }
    
    const preferredCategories = Array.from(categories);
    console.log('🔍 User preferred categories:', preferredCategories);
    return preferredCategories;
  } catch (error) {
    console.error('❌ Error getting preferred categories:', error);
    return [];
  }
}

/**
 * Get all active posts and filter by location (fallback approach)
 * @param {Object} userCoordinates - User's coordinates {lat, lng}
 * @param {number} maxRadius - Maximum radius to search
 * @param {Array} excludePostIds - Post IDs to exclude
 * @param {number} limitCount - Number of posts to return
 * @returns {Promise<Object>} Object with posts and lastDoc
 */
async function getAllPostsAndFilter(userCoordinates, maxRadius, excludePostIds, limitCount) {
  try {
    console.log(`🔍 Getting all posts and filtering by ${maxRadius}km radius`);
    
    // Simple query that doesn't require composite index
    const postsQuery = query(
      collection(db, 'posts'),
      where('isActive', '==', true)
    );
    
    const postsSnapshot = await getDocs(postsQuery);
    const allPosts = [];
    
    // Process all posts
    postsSnapshot.docs.forEach(doc => {
      const postData = { id: doc.id, ...doc.data() };
      
      // Skip excluded posts
      if (excludePostIds.includes(doc.id)) return;
      
      // Check if post has coordinates
      if (postData.coordinates && postData.coordinates.lat && postData.coordinates.lng) {
        const distance = calculateDistance(
          userCoordinates.lat,
          userCoordinates.lng,
          postData.coordinates.lat,
          postData.coordinates.lng
        );
        
        allPosts.push({ ...postData, distance });
      }
    });
    
    // Filter by distance and sort by creation time
    const postsInRadius = allPosts
      .filter(post => post.distance <= maxRadius)
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      })
      .slice(0, limitCount);
    
    console.log(`✅ Found ${postsInRadius.length} posts within ${maxRadius}km`);
    return { posts: postsInRadius, lastDoc: null };
  } catch (error) {
    console.error('❌ Error in getAllPostsAndFilter:', error);
    return { posts: [], lastDoc: null };
  }
}

/**
 * Get posts within specified radius, with fallback to larger radius
 * @param {Object} userCoordinates - User's coordinates {lat, lng}
 * @param {number} maxRadius - Maximum radius to search (starts with 5km)
 * @param {Array} excludePostIds - Post IDs to exclude (already shown)
 * @param {number} limitCount - Number of posts to fetch
 * @param {Object} lastDoc - Last document for pagination
 * @returns {Promise<Object>} Object with posts and lastDoc
 */
async function getPostsByLocation(userCoordinates, maxRadius = 5, excludePostIds = [], limitCount = 50, lastDoc = null) {
  try {
    console.log(`🔍 Searching posts within ${maxRadius}km radius`);
    
    // Use the simpler approach that doesn't require composite index
    const result = await getAllPostsAndFilter(userCoordinates, maxRadius, excludePostIds, limitCount);
    
    // If not enough posts found and radius is less than 50km, try larger radius
    if (result.posts.length < 10 && maxRadius < 50) {
      console.log(`🔍 Not enough posts found, expanding radius to ${maxRadius * 2}km`);
      const expandedResult = await getAllPostsAndFilter(
        userCoordinates, 
        maxRadius * 2, 
        excludePostIds, 
        limitCount
      );
      return {
        posts: expandedResult.posts,
        lastDoc: expandedResult.lastDoc
      };
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error fetching posts by location:', error);
    return { posts: [], lastDoc: null };
  }
}

/**
 * Score and sort posts based on user preferences
 * @param {Array} posts - Array of posts to score
 * @param {Array} commentedPostIds - Posts user commented on (highest priority)
 * @param {Array} likedPostIds - Posts user liked
 * @param {Array} preferredCategories - User's preferred categories
 * @returns {Array} Sorted posts by relevance score
 */
function scoreAndSortPosts(posts, commentedPostIds, likedPostIds, preferredCategories) {
  return posts.map(post => {
    let score = 0;
    
    // Priority 1: Location (closer = higher score)
    const locationScore = Math.max(0, 10 - post.distance); // Max 10 points, decreases with distance
    score += locationScore * 4; // Weight: 4x
    
    // Priority 2: Comments (user engaged before)
    const hasCommented = commentedPostIds.some(id => id === post.id);
    if (hasCommented) score += 30; // Weight: 30 points
    
    // Priority 3: Likes (user liked similar posts)
    const hasLiked = likedPostIds.some(id => id === post.id);
    if (hasLiked) score += 20; // Weight: 20 points
    
    // Priority 4: Category match
    let categoryScore = 0;
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach(category => {
        if (preferredCategories.includes(category)) categoryScore += 5;
      });
    }
    if (post.moods && Array.isArray(post.moods)) {
      post.moods.forEach(mood => {
        if (preferredCategories.includes(mood)) categoryScore += 3;
      });
    }
    score += categoryScore;
    
    // Priority 5: Recency (newer posts get slight boost)
    const now = new Date();
    const postDate = post.createdAt.toDate();
    const hoursDiff = (now - postDate) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 10 - (hoursDiff / 24)); // Newer posts get higher score
    score += recencyScore;
    
    return { ...post, recommendationScore: score };
  }).sort((a, b) => b.recommendationScore - a.recommendationScore);
}

/**
 * Shuffle array for randomization of posts with similar scores
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
 * Main recommendation function
 * @param {string} userId - Current user's ID
 * @param {Object} userCoordinates - User's coordinates {lat, lng}
 * @param {Array} excludePostIds - Post IDs to exclude (already shown)
 * @param {Object} lastDoc - Last document for pagination
 * @param {number} limitCount - Number of posts to return (default: 10)
 * @returns {Promise<Object>} Object with recommended posts and pagination info
 */
export async function getRecommendedPosts(userId, userCoordinates, excludePostIds = [], lastDoc = null, limitCount = 10) {
  try {
    console.log('🚀 Starting recommendation engine for user:', userId);
    
    // Step 1: Get user's interaction history
    const [likedPostIds, commentedPostIds] = await Promise.all([
      getUserLikedPosts(userId),
      getUserCommentedPosts(userId)
    ]);
    
    // Step 2: Get preferred categories from interactions
    const allInteractedPosts = [...new Set([...likedPostIds, ...commentedPostIds])];
    const preferredCategories = await getUserPreferredCategories(allInteractedPosts);
    
    // Step 3: Get posts by location (with expanding radius if needed)
    const { posts, lastDoc: newLastDoc } = await getPostsByLocation(
      userCoordinates,
      5, // Start with 5km radius
      excludePostIds,
      50, // Fetch more to have better selection
      lastDoc
    );
    
    if (posts.length === 0) {
      console.log('❌ No posts found in any radius');
      return { posts: [], lastDoc: null, hasMore: false };
    }
    
    // Step 4: Score and sort posts
    const scoredPosts = scoreAndSortPosts(posts, commentedPostIds, likedPostIds, preferredCategories);
    
    // Step 5: Group by similar scores and randomize within groups
    const scoreGroups = {};
    scoredPosts.forEach(post => {
      const scoreRange = Math.floor(post.recommendationScore / 10) * 10; // Group by 10-point ranges
      if (!scoreGroups[scoreRange]) scoreGroups[scoreRange] = [];
      scoreGroups[scoreRange].push(post);
    });
    
    // Randomize within each score group and flatten
    const finalPosts = [];
    Object.keys(scoreGroups)
      .sort((a, b) => b - a) // Sort score ranges descending
      .forEach(scoreRange => {
        const shuffledGroup = shuffleArray(scoreGroups[scoreRange]);
        finalPosts.push(...shuffledGroup);
      });
    
    // Step 6: Return requested number of posts
    const resultPosts = finalPosts.slice(0, limitCount);
    const hasMore = finalPosts.length > limitCount || newLastDoc !== null;
    
    console.log(`✅ Recommendation complete: ${resultPosts.length} posts returned`);
    console.log('Top post scores:', resultPosts.slice(0, 3).map(p => p.recommendationScore));
    
    return {
      posts: resultPosts,
      lastDoc: newLastDoc,
      hasMore,
      debug: {
        totalPostsFound: posts.length,
        likedPostsCount: likedPostIds.length,
        commentedPostsCount: commentedPostIds.length,
        preferredCategories: preferredCategories.slice(0, 5) // Top 5 categories for debug
      }
    };
    
  } catch (error) {
    console.error('❌ Error in recommendation engine:', error);
    return { posts: [], lastDoc: null, hasMore: false };
  }
}

/**
 * Get more recommended posts for infinite scroll
 * @param {string} userId - Current user's ID
 * @param {Object} userCoordinates - User's coordinates {lat, lng}
 * @param {Array} shownPostIds - Post IDs already shown to user
 * @param {Object} lastDoc - Last document from previous fetch
 * @returns {Promise<Object>} Object with more recommended posts
 */
export async function getMoreRecommendedPosts(userId, userCoordinates, shownPostIds = [], lastDoc = null) {
  return await getRecommendedPosts(userId, userCoordinates, shownPostIds, lastDoc, 10);
}
