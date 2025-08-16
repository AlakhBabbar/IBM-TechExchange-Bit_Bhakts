import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../Firebase/firebase";
import { 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged 
} from "firebase/auth";
import { createBasicUserProfile, checkUserProfileExists } from "../Firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with Email
  const signup = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create basic profile immediately
      await createBasicUserProfile(result.user.uid, {
        name: name,
        email: email
      });
      
      return result;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Sign in with Email
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if this is a new user (first time Google signin)
      const profileExists = await checkUserProfileExists(result.user.uid);
      
      if (!profileExists) {
        // Create basic profile for new Google users
        await createBasicUserProfile(result.user.uid, {
          name: result.user.displayName || "User",
          email: result.user.email
        });
      }
      
      return result;
    } catch (error) {
      console.error("Google signin error:", error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Listen for Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    signup,
    login,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
