import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

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