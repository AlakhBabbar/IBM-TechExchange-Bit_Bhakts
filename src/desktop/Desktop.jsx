import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

export default function Desktop() {
  return (
    <Router>
      <div className="bg-black min-h-screen">
        <Routes>
          {/* Protected Routes - Require Authentication */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/for-you" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/for-you" 
            element={
              <ProtectedRoute>
                <ForYou />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/explore" 
            element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trending" 
            element={
              <ProtectedRoute>
                <Trending />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/map" 
            element={
              <ProtectedRoute>
                <Map />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />

          {/* Public Routes - Only for Non-Authenticated Users */}
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Account Setup - Special case (authenticated but needs setup) */}
          <Route 
            path="/account-setup" 
            element={
              <ProtectedRoute>
                <AccountSetup />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}
