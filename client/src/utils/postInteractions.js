import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  increment,
  updateDoc,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../Firebase/firebase';

/**
 * Like a post
 * @param {string} postId - The ID of the post to like
 * @param {string} userId - The ID of the user liking the post
 * @returns {Promise<boolean>} Success status
 */
export async function likePost(postId, userId) {
  try {
    console.log('👍 Liking post:', postId, 'by user:', userId);
    
    // Check if user already liked this post
    const existingLike = await getUserLikeForPost(postId, userId);
    if (existingLike) {
      console.log('❌ User already liked this post');
      return false;
    }
    
    // Add like to likes collection
    await addDoc(collection(db, 'likes'), {
      post: doc(db, 'posts', postId),
      likedBy: doc(db, 'user', userId),
      likedAt: Timestamp.now()
    });
    
    // Update post likes count
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1)
    });
    
    console.log('✅ Post liked successfully');
    return true;
  } catch (error) {
    console.error('❌ Error liking post:', error);
    return false;
  }
}

/**
 * Unlike a post
 * @param {string} postId - The ID of the post to unlike
 * @param {string} userId - The ID of the user unliking the post
 * @returns {Promise<boolean>} Success status
 */
export async function unlikePost(postId, userId) {
  try {
    console.log('👎 Unliking post:', postId, 'by user:', userId);
    
    // Find the existing like
    const existingLike = await getUserLikeForPost(postId, userId);
    if (!existingLike) {
      console.log('❌ User has not liked this post');
      return false;
    }
    
    // Remove like from likes collection
    await deleteDoc(doc(db, 'likes', existingLike.id));
    
    // Update post likes count
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(-1)
    });
    
    console.log('✅ Post unliked successfully');
    return true;
  } catch (error) {
    console.error('❌ Error unliking post:', error);
    return false;
  }
}

/**
 * Check if user has liked a specific post
 * @param {string} postId - The ID of the post
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object|null>} Like document if exists, null otherwise
 */
export async function getUserLikeForPost(postId, userId) {
  try {
    const likesQuery = query(
      collection(db, 'likes'),
      where('post', '==', doc(db, 'posts', postId)),
      where('likedBy', '==', doc(db, 'user', userId)),
      limit(1)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    
    if (likesSnapshot.empty) {
      return null;
    }
    
    const likeDoc = likesSnapshot.docs[0];
    return { id: likeDoc.id, ...likeDoc.data() };
  } catch (error) {
    console.error('❌ Error checking user like:', error);
    return null;
  }
}

/**
 * Get all likes for a post
 * @param {string} postId - The ID of the post
 * @returns {Promise<Array>} Array of like documents
 */
export async function getPostLikes(postId) {
  try {
    const likesQuery = query(
      collection(db, 'likes'),
      where('post', '==', doc(db, 'posts', postId)),
      orderBy('likedAt', 'desc')
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    const likes = [];
    
    for (const likeDoc of likesSnapshot.docs) {
      const likeData = likeDoc.data();
      
      // Get user data for each like
      const userDoc = await getDoc(likeData.likedBy);
      const userData = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
      
      likes.push({
        id: likeDoc.id,
        ...likeData,
        user: userData
      });
    }
    
    return likes;
  } catch (error) {
    console.error('❌ Error getting post likes:', error);
    return [];
  }
}

/**
 * Add a comment to a post
 * @param {string} postId - The ID of the post to comment on
 * @param {string} userId - The ID of the user commenting
 * @param {string} commentText - The comment text
 * @returns {Promise<Object|null>} Created comment document or null
 */
export async function addComment(postId, userId, commentText) {
  try {
    console.log('💬 Adding comment to post:', postId, 'by user:', userId);
    console.log('💬 Comment text:', commentText);
    
    if (!commentText || commentText.trim().length === 0) {
      console.log('❌ Comment text is empty');
      return null;
    }
    
    // Add comment to comments collection
    console.log('📝 Creating comment document...');
    const commentDoc = await addDoc(collection(db, 'comments'), {
      post: doc(db, 'posts', postId),
      commentBy: doc(db, 'user', userId),
      comment: commentText.trim(),
      commentAt: Timestamp.now()
    });
    console.log('✅ Comment document created with ID:', commentDoc.id);
    
    // Update post comments count
    console.log('📊 Updating post comments count...');
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: increment(1)
    });
    console.log('✅ Post comments count updated');
    
    console.log('✅ Comment added successfully');
    
    // Return the created comment with user data
    console.log('👤 Fetching comment and user data...');
    const createdComment = await getDoc(commentDoc);
    const commentData = createdComment.data();
    console.log('💬 Created comment data:', commentData);
    
    // Get user data
    const userDoc = await getDoc(commentData.commentBy);
    console.log('👤 User doc exists:', userDoc.exists(), userDoc.id);
    const userData = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    console.log('👤 User data for comment:', userData);
    
    const result = {
      id: createdComment.id,
      ...commentData,
      user: userData
    };
    console.log('✅ Final comment result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error adding comment:', error);
    return null;
  }
}

/**
 * Delete a comment
 * @param {string} commentId - The ID of the comment to delete
 * @param {string} postId - The ID of the post the comment belongs to
 * @param {string} userId - The ID of the user deleting the comment
 * @returns {Promise<boolean>} Success status
 */
export async function deleteComment(commentId, postId, userId) {
  try {
    console.log('🗑️ Deleting comment:', commentId);
    
    // Get comment to verify ownership
    const commentDoc = await getDoc(doc(db, 'comments', commentId));
    if (!commentDoc.exists()) {
      console.log('❌ Comment not found');
      return false;
    }
    
    const commentData = commentDoc.data();
    const commentUserId = commentData.commentBy.id;
    
    // Check if user owns the comment
    if (commentUserId !== userId) {
      console.log('❌ User not authorized to delete this comment');
      return false;
    }
    
    // Delete comment
    await deleteDoc(doc(db, 'comments', commentId));
    
    // Update post comments count
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: increment(-1)
    });
    
    console.log('✅ Comment deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    return false;
  }
}

/**
 * Get all comments for a post
 * @param {string} postId - The ID of the post
 * @param {number} limitCount - Maximum number of comments to fetch (default: 50)
 * @returns {Promise<Array>} Array of comment documents with user data
 */
export async function getPostComments(postId, limitCount = 50) {
  try {
    console.log('🔍 Fetching comments for post:', postId);
    
    // Simple query without orderBy to avoid composite index requirement
    const commentsQuery = query(
      collection(db, 'comments'),
      where('post', '==', doc(db, 'posts', postId)),
      limit(limitCount)
    );
    
    console.log('📝 Comments query created, executing...');
    const commentsSnapshot = await getDocs(commentsQuery);
    console.log('📥 Comments snapshot received, docs count:', commentsSnapshot.docs.length);
    
    const comments = [];
    
    for (const commentDoc of commentsSnapshot.docs) {
      const commentData = commentDoc.data();
      console.log('💬 Processing comment:', commentDoc.id, commentData);
      
      // Get user data for each comment
      const userDoc = await getDoc(commentData.commentBy);
      console.log('👤 User doc exists:', userDoc.exists(), userDoc.id);
      
      const userData = userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
      console.log('👤 User data:', userData);
      
      comments.push({
        id: commentDoc.id,
        ...commentData,
        user: userData
      });
    }
    
    // Sort comments by timestamp on client side (newest first)
    comments.sort((a, b) => {
      if (a.commentAt && b.commentAt) {
        return b.commentAt.toMillis() - a.commentAt.toMillis();
      }
      return 0;
    });
    
    console.log('✅ Final comments array:', comments);
    return comments;
  } catch (error) {
    console.error('❌ Error getting post comments:', error);
    return [];
  }
}

/**
 * Toggle like status for a post
 * @param {string} postId - The ID of the post
 * @param {string} userId - The ID of the user
 * @returns {Promise<boolean>} New like status (true if liked, false if unliked)
 */
export async function togglePostLike(postId, userId) {
  try {
    const existingLike = await getUserLikeForPost(postId, userId);
    
    if (existingLike) {
      // Unlike the post
      await unlikePost(postId, userId);
      return false;
    } else {
      // Like the post
      await likePost(postId, userId);
      return true;
    }
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    return false;
  }
}
