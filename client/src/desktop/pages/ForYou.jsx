import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import { useState } from 'react';

export default function ForYou() {
  const [searchQuery, setSearchQuery] = useState('');

  const posts = [
    {
      user: "Helena",
      location: "Nagla Hawai, Agra",
      text: "Fool nhi Phool hu main 🌸",
      image: "src/assets/black pencil pouch.jpg",
      likes: 21,
      comments: 2
    },
    {
      user: "Dhamdere",
      location: "Nagla Hawai, Agra",
      text: "Fool nhi Phool hu main 🌸",
      image: "src/assets/paper bg.jpg",
      likes: 21,
      comments: 2
    }
  ];

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar 
        onSearch={handleSearch}
        searchPlaceholder="Search posts, users, locations..."
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Posts Feed */}
            <div className="flex flex-col items-center gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, idx) => (
                  <PostCard key={idx} {...post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">No posts found</div>
                  <div className="text-gray-500 text-sm mt-2">
                    Try searching for something else
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
