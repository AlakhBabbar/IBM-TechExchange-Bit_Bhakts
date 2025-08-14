import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import ForYou from "./pages/ForYou";
import Explore from "./pages/Explore";
import Trending from "./pages/Trending";

export default function Desktop() {
  return (
    <Router>
      <div className="bg-black min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/for-you" />} />
            <Route path="/for-you" element={<ForYou />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/trending" element={<Trending />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
