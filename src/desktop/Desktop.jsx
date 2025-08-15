import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ForYou from "./pages/ForYou";
import Explore from "./pages/Explore";
import Trending from "./pages/Trending";
import Profile from "./pages/Profile";
import Map from "./pages/Map";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import AccountSetup from "./pages/AccountSetup";

export default function Desktop() {
  return (
    <Router>
      <div className="bg-black min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/for-you" />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/account-setup" element={<AccountSetup/>} />
        </Routes>
      </div>
    </Router>
  );
}
