import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// Generate video thumbnail
const generateVideoThumbnail = (videoFile) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    video.addEventListener('loadedmetadata', () => {
      // Set canvas size to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to 1 second to get a good thumbnail
      video.currentTime = Math.min(1, video.duration / 4);
    });
    
    video.addEventListener('seeked', () => {
      try {
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      } catch (error) {
        reject(error);
      }
    });
    
    video.addEventListener('error', (e) => {
      reject(new Error('Video loading failed'));
    });
    
    // Load video
    video.src = URL.createObjectURL(videoFile);
    video.load();
  });
};

// Create basic user profile immediately after signup
export const createBasicUserProfile = async (userId, userData) => {
  try {
    console.log("🔥 Creating basic user profile for:", userId);
    console.log("🔥 User data received:", userData);
    
    const userRef = doc(db, "user", userId);
    
    const basicProfile = {
      // Required fields from signup
      name: userData.name || "",
      email: userData.email || "",
      
      // Empty fields to be filled in AccountSetup
      username: "",
      bio: "",
      photo: "",
      street: "",
      locality: "",
      city: "",
      district: "",
      state: "",
      country: "",
      coordinates: { lat: null, lng: null },
      
      // Auto-generated fields
      totalPosts: 0,
      createdAt: serverTimestamp(),
      accountSetupComplete: false
    };
    
    console.log("🔥 Basic profile to save:", basicProfile);
    
    await setDoc(userRef, basicProfile);
    console.log("✅ Basic user profile created successfully");
    
    return { success: true };
  } catch (error) {
    console.error("❌ Error creating basic user profile:", error);
    console.error("❌ Error details:", error.message);
    console.error("❌ Error code:", error.code);
    throw error;
  }
};

// Complete account setup by updating existing profile
export const completeAccountSetup = async (userId, setupData) => {
  try {
    console.log("🔥 Completing account setup for:", userId);
    
    const userRef = doc(db, "user", userId);
    
    // Update the existing basic profile with complete information
    await updateDoc(userRef, {
      ...setupData,
      accountSetupComplete: true,
      updatedAt: serverTimestamp()
    });
    
    console.log("✅ Account setup completed successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error completing account setup:", error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  try {
    const fileRef = ref(storage, `profile-pictures/${userId}/${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// Check if user profile exists
export const checkUserProfileExists = async (userId) => {
  try {
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error("Error checking user profile:", error);
    return false;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "user", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Get user posts
export const getUserPosts = async (userId) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: posts };
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

// Update user's total post count
export const updateUserPostCount = async (userId) => {
  try {
    const postsResult = await getUserPosts(userId);
    if (postsResult.success) {
      const userRef = doc(db, "user", userId);
      await updateDoc(userRef, {
        totalPosts: postsResult.data.length,
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Updated post count for user ${userId}: ${postsResult.data.length} posts`);
      return { success: true, count: postsResult.data.length };
    }
  } catch (error) {
    console.error("Error updating user post count:", error);
    throw error;
  }
};

// Upload post media (image or video) with thumbnail generation for videos
export const uploadPostMedia = async (userId, file, fileType) => {
  try {
    console.log("🔥 Uploading post media for user:", userId);
    console.log("🔥 File type:", fileType);
    console.log("🔥 File details:", file?.name, file?.size, file?.type);
    
    if (!userId) {
      throw new Error("User ID is required for media upload");
    }
    
    if (!file) {
      throw new Error("File is required for media upload");
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error(`File size too large. Maximum allowed size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
    }
    
    const fileName = `${Date.now()}_${file.name}`;
    const folderName = fileType === 'video' ? 'videos' : 'images';
    const filePath = `posts/${folderName}/${userId}/${fileName}`;
    
    console.log("🔥 Upload path:", filePath);
    
    const fileRef = ref(storage, filePath);
    
    console.log("🔥 Starting file upload...");
    const snapshot = await uploadBytes(fileRef, file);
    console.log("🔥 File uploaded, getting download URL...");
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    let thumbnailURL = null;
    
    // Generate and upload thumbnail for videos
    if (fileType === 'video') {
      try {
        console.log("🔥 Generating video thumbnail...");
        const thumbnailBlob = await generateVideoThumbnail(file);
        
        const thumbnailFileName = `thumbnail_${Date.now()}_${file.name.split('.')[0]}.jpg`;
        const thumbnailPath = `posts/thumbnails/${userId}/${thumbnailFileName}`;
        const thumbnailRef = ref(storage, thumbnailPath);
        
        console.log("🔥 Uploading thumbnail...");
        const thumbnailSnapshot = await uploadBytes(thumbnailRef, thumbnailBlob);
        thumbnailURL = await getDownloadURL(thumbnailSnapshot.ref);
        
        console.log("✅ Thumbnail uploaded successfully:", thumbnailURL);
      } catch (thumbnailError) {
        console.error("⚠️ Thumbnail generation failed:", thumbnailError);
        // Continue without thumbnail - it's not critical
      }
    }
    
    console.log("✅ Media uploaded successfully:", downloadURL);
    return { 
      success: true, 
      url: downloadURL, 
      thumbnailUrl: thumbnailURL 
    };
  } catch (error) {
    console.error("❌ Error uploading post media:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);
    return { success: false, error: error.message };
  }
};

// Create a new post
export const createPost = async (userId, postData) => {
  try {
    console.log("🔥 Creating new post for user:", userId);
    console.log("🔥 Post data:", postData);
    
    if (!userId) {
      throw new Error("User ID is required for post creation");
    }
    
    // Get user profile for reference
    console.log("🔥 Getting user profile...");
    const userProfile = await getUserProfile(userId);
    if (!userProfile.success) {
      throw new Error("User profile not found");
    }
    console.log("🔥 User profile retrieved:", userProfile.data?.username || userProfile.data?.name);
    
    const postsRef = collection(db, "posts");
    
    // Prepare post document
    const postDocument = {
      // User information
      userId: userId,
      userRef: doc(db, "user", userId),
      username: userProfile.data.username || userProfile.data.name,
      userPhoto: userProfile.data.photo || "",
      
      // Post content
      description: postData.description,
      mediaUrl: postData.mediaUrl,
      mediaType: postData.mediaType, // 'image' or 'video'
      thumbnailUrl: postData.thumbnailUrl || null, // Video thumbnail URL
      
      // Categories and moods
      categories: postData.categories || [],
      moods: postData.moods || [],
      
      // Post type and issue flag
      postType: postData.postType || "General Update",
      isIssue: postData.isIssue === "yes",
      
      // Location data
      location: {
        street: postData.location?.street || "",
        locality: postData.location?.locality || "",
        city: postData.location?.city || "",
        district: postData.location?.district || "",
        state: postData.location?.state || "",
        country: postData.location?.country || ""
      },
      coordinates: {
        lat: postData.coordinates?.lat || null,
        lng: postData.coordinates?.lng || null
      },
      
      // Engagement metrics
      likes: 0,
      likedBy: [],
      comments: 0,
      shares: 0,
      views: 0,
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Status
      isActive: true,
      isReported: false,
      reportCount: 0
    };
    
    console.log("🔥 Final post document:", postDocument);
    
    // Add post to Firestore
    console.log("🔥 Adding post to Firestore...");
    const docRef = await addDoc(postsRef, postDocument);
    console.log("✅ Post created with ID:", docRef.id);
    
    // Update user's post count
    console.log("🔥 Updating user post count...");
    await updateUserPostCount(userId);
    
    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error("❌ Error creating post:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error code:", error.code);
    throw error;
  }
};

// Complete post creation process (upload media + create post)
export const createPostWithMedia = async (userId, file, postData) => {
  try {
    console.log("🔥 Starting complete post creation process");
    console.log("🔥 User ID:", userId);
    console.log("🔥 File:", file?.name, file?.size);
    console.log("🔥 Post data:", postData);
    
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    if (!file) {
      throw new Error("File is required");
    }
    
    // Determine file type
    const fileType = file.type.startsWith('video/') ? 'video' : 'image';
    console.log("🔥 File type determined:", fileType);
    
    // Upload media first
    console.log("🔥 Starting media upload...");
    const mediaResult = await uploadPostMedia(userId, file, fileType);
    if (!mediaResult.success) {
      throw new Error("Failed to upload media: " + (mediaResult.error || 'Unknown error'));
    }
    console.log("✅ Media upload successful:", mediaResult.url);
    
    // Create post with media URL
    const completePostData = {
      ...postData,
      mediaUrl: mediaResult.url,
      mediaType: fileType,
      thumbnailUrl: mediaResult.thumbnailUrl || null
    };
    
    console.log("🔥 Creating post with complete data:", completePostData);
    const postResult = await createPost(userId, completePostData);
    
    console.log("✅ Complete post creation successful");
    return { 
      success: true, 
      postId: postResult.postId, 
      mediaUrl: mediaResult.url,
      thumbnailUrl: mediaResult.thumbnailUrl 
    };
  } catch (error) {
    console.error("❌ Error in complete post creation:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    throw error;
  }
};