/**
 * Calculate how long ago a post was created
 * @param {Date|Object|string} createdAt - The timestamp when the post was created
 * @returns {string} - Human readable time difference (e.g., "2 minutes ago", "1 hour ago")
 */
export const timeAgo = (createdAt) => {
  try {
    let postDate;
    
    // Handle Firebase Timestamp object
    if (createdAt && typeof createdAt === 'object' && createdAt.toDate) {
      postDate = createdAt.toDate();
    }
    // Handle Date object
    else if (createdAt instanceof Date) {
      postDate = createdAt;
    }
    // Handle string timestamp
    else if (typeof createdAt === 'string') {
      postDate = new Date(createdAt);
    }
    // Handle Unix timestamp (number)
    else if (typeof createdAt === 'number') {
      postDate = new Date(createdAt);
    }
    else {
      return 'Unknown time';
    }
    
    // Check if date is valid
    if (isNaN(postDate.getTime())) {
      return 'Unknown time';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - postDate.getTime();
    
    // If time is in future (edge case)
    if (diffInMs < 0) {
      return 'Just now';
    }
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    // Return appropriate time format
    if (diffInSeconds < 30) {
      return 'Just now';
    } else if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes === 1) {
      return '1 minute ago';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours === 1) {
      return '1 hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInWeeks === 1) {
      return '1 week ago';
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} weeks ago`;
    } else if (diffInMonths === 1) {
      return '1 month ago';
    } else if (diffInMonths < 12) {
      return `${diffInMonths} months ago`;
    } else if (diffInYears === 1) {
      return '1 year ago';
    } else {
      return `${diffInYears} years ago`;
    }
    
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'Unknown time';
  }
};

/**
 * Get a more detailed timestamp for tooltips or detailed views
 * @param {Date|Object|string} createdAt - The timestamp when the post was created
 * @returns {string} - Formatted date string
 */
export const formatFullDate = (createdAt) => {
  try {
    let postDate;
    
    // Handle Firebase Timestamp object
    if (createdAt && typeof createdAt === 'object' && createdAt.toDate) {
      postDate = createdAt.toDate();
    }
    // Handle Date object
    else if (createdAt instanceof Date) {
      postDate = createdAt;
    }
    // Handle string timestamp
    else if (typeof createdAt === 'string') {
      postDate = new Date(createdAt);
    }
    // Handle Unix timestamp (number)
    else if (typeof createdAt === 'number') {
      postDate = new Date(createdAt);
    }
    else {
      return 'Unknown date';
    }
    
    // Check if date is valid
    if (isNaN(postDate.getTime())) {
      return 'Unknown date';
    }
    
    return postDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
  } catch (error) {
    console.error('Error formatting full date:', error);
    return 'Unknown date';
  }
};