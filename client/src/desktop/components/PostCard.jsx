import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { timeAgo, formatFullDate } from '../../utils/timeAgo';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../Firebase/firestore';
import { 
  togglePostLike, 
  getUserLikeForPost, 
  addComment, 
  getPostComments 
} from '../../utils/postInteractions';

export default function PostCard({ 
  postId, 
  userId, 
  user, 
  location, 
  text, 
  image, 
  likes: initialLikes, 
  comments: initialComments, 
  userPhoto, 
  mediaType, 
  thumbnailUrl, 
  createdAt 
}) {
  const { user: currentUser } = useAuth();
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes || 0);
  const [commentsCount, setCommentsCount] = useState(initialComments || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  // Fetch current user's complete profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        const profile = await getUserProfile(currentUser.uid);
        setCurrentUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  // Check if user has liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!currentUser || !postId) return;
      
      try {
        const userLike = await getUserLikeForPost(postId, currentUser.uid);
        setIsLiked(!!userLike);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [postId, currentUser]);

  // Handle like toggle
  const handleLike = async () => {
    if (!currentUser || !postId || loadingLike) return;
    
    try {
      setLoadingLike(true);
      const newLikeStatus = await togglePostLike(postId, currentUser.uid);
      
      setIsLiked(newLikeStatus);
      setLikesCount(prev => newLikeStatus ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoadingLike(false);
    }
  };

  // Load comments
  const loadComments = async () => {
    if (!postId || loadingComments) return;
    
    try {
      setLoadingComments(true);
      console.log('📖 Loading comments for post:', postId);
      const postComments = await getPostComments(postId);
      console.log('📖 Comments loaded:', postComments);
      setComments(postComments);
      setShowComments(true);
    } catch (error) {
      console.error('❌ Error loading comments:', error);
      // Show comments section anyway, even if empty
      setShowComments(true);
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser || !postId || !newComment.trim()) {
      console.log('❌ Comment validation failed:', { currentUser: !!currentUser, postId, comment: newComment.trim() });
      return;
    }
    
    try {
      console.log('💬 Adding comment:', { postId, userId: currentUser.uid, comment: newComment });
      const addedComment = await addComment(postId, currentUser.uid, newComment);
      console.log('💬 Comment added result:', addedComment);
      
      if (addedComment) {
        setComments(prev => [addedComment, ...prev]);
        setCommentsCount(prev => prev + 1);
        setNewComment('');
        console.log('✅ Comment added to UI');
      } else {
        console.log('❌ Failed to add comment');
      }
    } catch (error) {
      console.error('❌ Error adding comment:', error);
    }
  };

  // Format location object into a readable string
  const formatLocation = (locationObj) => {
    if (!locationObj) return '';
    
    if (typeof locationObj === 'string') {
      return locationObj;
    }
    
    // If it's an object, format it properly
    const parts = [];
    if (locationObj.locality) parts.push(locationObj.locality);
    if (locationObj.city) parts.push(locationObj.city);
    if (locationObj.state) parts.push(locationObj.state);
    if (locationObj.country) parts.push(locationObj.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  };

  return (
    <div className="bg-neutral-900 text-white rounded-lg shadow-md p-4 max-w-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
            {userPhoto ? (
              <img 
                src={userPhoto} 
                alt={`${user}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                {user ? user.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div className="text-left">
            <h3 className="font-semibold text-left">{user}</h3>
            <p className="text-sm text-gray-400 text-left">{formatLocation(location)}</p>
          </div>
        </div>
        <span 
          className="text-gray-400 text-xs cursor-help" 
          title={formatFullDate(createdAt)}
        >
          {timeAgo(createdAt)}
        </span>
      </div>
      <p className="mt-2 text-left">{text}</p>
      
      {/* Media Display */}
      {image && (
        <div className="rounded-lg mt-2 overflow-hidden">
          {mediaType === 'video' ? (
            <div className="relative">
              {/* Video Player */}
              <video 
                controls 
                className="w-full h-auto max-h-96 object-cover"
                poster={thumbnailUrl || undefined}
                preload="metadata"
              >
                <source src={image} type="video/mp4" />
                <source src={image} type="video/webm" />
                <source src={image} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Overlay Info */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                VIDEO
              </div>
            </div>
          ) : (
            <img src={image} alt="" className="rounded-lg w-full h-auto max-h-96 object-cover" />
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-2 border-t border-neutral-700">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={loadingLike || !currentUser}
            className={`flex items-center space-x-2 transition-all duration-200 ${
              isLiked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-red-500'
            } ${loadingLike ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Heart 
              size={20} 
              className={`transition-all duration-200 ${
                isLiked ? 'fill-current' : ''
              }`} 
            />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={loadComments}
            disabled={loadingComments || !currentUser}
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{commentsCount}</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors duration-200 cursor-pointer">
            <Share size={20} />
          </button>
        </div>

        {/* More Options */}
        <button className="text-gray-400 hover:text-white transition-colors duration-200">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-neutral-700">
          {/* Comment Input */}
          {currentUser && (
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                  {(currentUserProfile?.photo || currentUser.photoURL) ? (
                    <img 
                      src={currentUserProfile?.photo || currentUser.photoURL} 
                      alt="Your profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                      {(currentUserProfile?.name || currentUserProfile?.username || currentUser.displayName) ? 
                        (currentUserProfile?.name || currentUserProfile?.username || currentUser.displayName).charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-neutral-800 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-full transition-colors duration-200"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          {loadingComments ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-400 text-sm">Loading comments...</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                      {comment.user?.photoURL || comment.user?.photo ? (
                        <img 
                          src={comment.user.photoURL || comment.user.photo} 
                          alt={`${comment.user.displayName || comment.user.name || comment.user.username}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
                          {(comment.user?.displayName || comment.user?.name || comment.user?.username) ? 
                            (comment.user.displayName || comment.user.name || comment.user.username).charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-neutral-800 rounded-lg px-3 py-2">
                        <p className="font-medium text-sm text-white">
                          {comment.user?.displayName || comment.user?.name || comment.user?.username || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-200 mt-1">{comment.comment}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-3">
                        {timeAgo(comment.commentAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
