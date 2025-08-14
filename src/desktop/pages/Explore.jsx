import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Navbar from '../components/NavBar';
import { ArrowLeft } from 'lucide-react';

export default function Explore() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState('explore'); // 'explore', 'post'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy posts with varying content and sizes
  const posts = [
    {
      id: 1,
      user: "Helena",
      location: "Nagla Hawai, Agra",
      text: "Fool nhi Phool hu main 🌸",
      image: "src/assets/black pencil pouch.jpg",
      likes: 21,
      comments: 2,
      height: "h-64"
    },
    {
      id: 2,
      user: "Anime_Fan",
      location: "Tokyo, Japan", 
      text: "What Gojo fans saw vs what actually happened 😭",
      image: "src/assets/paper bg.jpg",
      likes: 156,
      comments: 23,
      height: "h-48"
    },
    {
      id: 3,
      user: "Dhamdere",
      location: "Mumbai, India",
      text: "Interesting fact you may not believe about Hashirama but are true ⚡",
      image: "src/assets/black pencil pouch.jpg",
      likes: 89,
      comments: 12,
      height: "h-56"
    },
    {
      id: 4,
      user: "MemeLord",
      location: "Swamp, Far Far Away",
      text: "Shrek: People born between 1995 to 2005 😂",
      image: "src/assets/paper bg.jpg",
      likes: 234,
      comments: 45,
      height: "h-52"
    },
    {
      id: 5,
      user: "MomTexts",
      location: "Home",
      text: "Mom: Fix it. Now\nMom: This is why we don't love you 💀",
      image: "src/assets/black pencil pouch.jpg",
      likes: 67,
      comments: 8,
      height: "h-44"
    },
    {
      id: 6,
      user: "DanceVibes",
      location: "Concert Hall",
      text: "When the beat drops and you can't control yourself 🎵💃",
      image: "src/assets/paper bg.jpg",
      likes: 178,
      comments: 31,
      height: "h-60"
    },
    {
      id: 7,
      user: "TechGuru",
      location: "Silicon Valley",
      text: "React developers be like... useState everywhere! 🚀",
      image: "src/assets/black pencil pouch.jpg",
      likes: 145,
      comments: 19,
      height: "h-48"
    },
    {
      id: 8,
      user: "FoodLover",
      location: "Kitchen",
      text: "Midnight snack hits different when you're coding 🍕",
      image: "src/assets/paper bg.jpg",
      likes: 92,
      comments: 14,
      height: "h-56"
    },
    {
      id: 9,
      user: "GameOn",
      location: "Gaming Setup",
      text: "POV: You finally beat that boss after 100 tries 🎮",
      image: "src/assets/black pencil pouch.jpg",
      likes: 203,
      comments: 37,
      height: "h-52"
    },
    {
      id: 10,
      user: "CoffeeAddict",
      location: "Café",
      text: "Coffee: Because adulting is hard ☕",
      image: "src/assets/paper bg.jpg",
      likes: 134,
      comments: 22,
      height: "h-44"
    },
    {
      id: 11,
      user: "NatureLover",
      location: "Mountains",
      text: "Sometimes you need to disconnect to reconnect 🏔️",
      image: "src/assets/black pencil pouch.jpg",
      likes: 267,
      comments: 41,
      height: "h-64"
    },
    {
      id: 12,
      user: "PetParent",
      location: "Living Room",
      text: "My cat judges my life choices daily 🐱",
      image: "src/assets/paper bg.jpg",
      likes: 189,
      comments: 28,
      height: "h-48"
    }
  ];

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setViewMode('post');
  };

  const goBackToExplore = () => {
    setSelectedPost(null);
    setViewMode('explore');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar 
        onSearch={handleSearch}
        searchPlaceholder="Search images, users, locations..."
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6 bg-black">
        
        {/* Explore Grid View */}
        {viewMode === 'explore' && (
          <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 max-w-7xl">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => {
                    // Define repeating skeleton patterns
                    const skeletonSizes = [
                      'h-48', 'h-64', 'h-56', 'h-40', 'h-52', 'h-60'
                    ];
                    const skeletonSize = skeletonSizes[index % skeletonSizes.length];
                
                return (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    className={`${skeletonSize} cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105 group rounded-lg overflow-hidden`}
                  >
                    <img 
                      src={post.image} 
                      alt={post.text}
                      className="w-full h-full object-cover group-hover:shadow-xl transition-all duration-300"
                    />
                  </div>
                );
                  })
                ) : (
                  <div className="text-center py-12 col-span-full">
                    <div className="text-gray-400 text-lg">No posts found</div>
                    <div className="text-gray-500 text-sm mt-2">
                      Try searching for something else
                    </div>
                  </div>
                )}
              </div>
            </div>
        )}

        {/* Instagram-style Post Feed View */}
        {viewMode === 'post' && selectedPost && (
          <div className="max-w-md w-full">
            {/* Back Button and Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={goBackToExplore}
                className="p-2 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Posts</h2>
                <p className="text-gray-400 text-sm">Discover more content</p>
              </div>
            </div>

            {/* Post Feed - Starting with selected post */}
            <div className="space-y-6">
              {/* Selected Post First */}
              <PostCard
                user={selectedPost.user}
                location={selectedPost.location}
                text={selectedPost.text}
                image={selectedPost.image}
                likes={selectedPost.likes}
                comments={selectedPost.comments}
              />
              
              {/* Similar/Related Posts */}
              {posts
                .filter(post => post.id !== selectedPost.id) // Exclude the selected post
                .map((post) => (
                  <PostCard
                    key={post.id}
                    user={post.user}
                    location={post.location}
                    text={post.text}
                    image={post.image}
                    likes={post.likes}
                    comments={post.comments}
                  />
                ))}
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
