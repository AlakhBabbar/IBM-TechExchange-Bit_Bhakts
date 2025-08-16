import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import ForYou from "./pages/ForYou";
import Explore from "./pages/Explore";
import Trending from "./pages/Trending";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import Create from "./pages/Create";
import Notifications from "./pages/Notifications";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import AccountSetup from "./pages/AccountSetup";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../Firebase/firestore";

// Simple Route Guard Component
function RouteGuard({ children }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndProfile = async () => {
      console.log("🔍 Checking user and profile...");
      
      // If no user, redirect to login (unless already on login/signup)
      if (!user) {
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
          console.log("❌ No user - redirecting to login");
          navigate('/login', { replace: true });
        }
        setLoading(false);
        return;
      }

      // If user exists, check their profile
      try {
        const profileResult = await getUserProfile(user.uid);
        console.log("🔍 Raw profile result:", profileResult);
        
        if (profileResult.success && profileResult.data) {
          const profile = profileResult.data;
          console.log("🔍 Profile data:", profile);
          console.log("🔍 Profile keys:", Object.keys(profile));
          
          setUserProfile(profile);
          
          console.log("📍 Coordinates field:", profile.coordinates);
          console.log("📍 Coordinates type:", typeof profile.coordinates);
          
          if (profile.coordinates) {
            console.log("📍 Coordinates lat:", profile.coordinates.lat);
            console.log("📍 Coordinates lng:", profile.coordinates.lng);
            console.log("📍 Lat type:", typeof profile.coordinates.lat);
            console.log("📍 Lng type:", typeof profile.coordinates.lng);
          }
          
          const hasCoordinates = profile.coordinates && 
                                profile.coordinates.lat !== null &&
                                profile.coordinates.lat !== undefined &&
                                profile.coordinates.lng !== null &&
                                profile.coordinates.lng !== undefined;
          
          console.log("📋 Has coordinates result:", hasCoordinates);
          
          // If profile is incomplete and not on account-setup, redirect to account-setup
          if (!hasCoordinates && location.pathname !== '/account-setup') {
            console.log("🔄 Incomplete profile - redirecting to account setup");
            navigate('/account-setup', { replace: true });
          }
          
          // If profile is complete and on account-setup, redirect to main app
          if (hasCoordinates && location.pathname === '/account-setup') {
            console.log("✅ Profile complete - redirecting to main app");
            navigate('/for-you', { replace: true });
          }
        } else {
          // No profile exists or profile fetch failed, redirect to account setup
          console.log("❌ No profile found - redirecting to account setup");
          if (location.pathname !== '/account-setup') {
            navigate('/account-setup', { replace: true });
          }
        }
      } catch (error) {
        console.error("❌ Error checking profile:", error);
      }
      
      setLoading(false);
    };

    checkUserAndProfile();
  }, [user, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}

export default function Desktop() {
  return (
    <Router>
      <div className="bg-black min-h-screen">
        <RouteGuard>
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/for-you" replace />} />
            
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Account setup */}
            <Route path="/account-setup" element={<AccountSetup />} />
            
            {/* Main app routes */}
            <Route path="/for-you" element={<ForYou />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/map" element={<Map />} />
            <Route path="/create" element={<Create />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </RouteGuard>
      </div>
    </Router>
  );
}
