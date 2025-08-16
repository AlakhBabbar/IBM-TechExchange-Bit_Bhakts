import { timeAgo, formatFullDate } from '../../utils/timeAgo';

export default function PostCard({ user, location, text, image, likes, comments, userPhoto, mediaType, thumbnailUrl, createdAt }) {
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
      
      <div className="flex justify-between text-sm text-gray-400 mt-3">
        <span>❤️ {likes} likes</span>
        <span>💬 {comments} comments</span>
      </div>
    </div>
  );
}
