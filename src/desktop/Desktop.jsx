import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ForYou from "./pages/ForYou";
import Explore from "./pages/Explore";
import Trending from "./pages/Trending";
import Profile from "./pages/Profile";

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
        </Routes>
      </div>
    </Router>
  );
}
