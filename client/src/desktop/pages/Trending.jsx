import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Navbar from '../components/NavBar';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function Trending() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState('trending'); // 'trending', 'category', 'post'
  const [searchQuery, setSearchQuery] = useState('');

  // Top 5 trending categories with dummy data
  const trendingCategories = [
    {
      id: 1,
      title: "AI Revolution: The Future is Now",
      description: "Artificial Intelligence is transforming every aspect of our daily lives, from smart assistants to autonomous vehicles. Discover the latest breakthroughs and what they mean for humanity.",
      relatedPosts: 156,
      images: [
        "src/assets/black pencil pouch.jpg",
        "src/assets/paper bg.jpg",
        "src/assets/black pencil pouch.jpg",
        "src/assets/paper bg.jpg"
      ],
      posts: [
        {
          id: 101,
          user: "TechGuru",
          location: "Silicon Valley",
          text: "ChatGPT just changed the game forever! The future of AI is here 🤖",
          image: "src/assets/black pencil pouch.jpg",
          likes: 234,
          comments: 45
        },
        {
          id: 102,
          user: "AIExplorer",
          location: "Tech Hub",
          text: "Machine learning algorithms are getting scary good at predicting human behavior 🧠",
          image: "src/assets/paper bg.jpg",
          likes: 189,
          comments: 32
        }
      ]
    },
    {
      id: 2,
      title: "Climate Change: Our Planet's Urgent Call",
      description: "Environmental activists and scientists unite to share crucial insights about climate change, sustainable living, and the actions we can take to protect our planet for future generations.",
      relatedPosts: 289,
      images: [
        "src/assets/paper bg.jpg",
        "src/assets/black pencil pouch.jpg",
        "src/assets/paper bg.jpg",
        "src/assets/black pencil pouch.jpg"
      ],
      posts: [
        {
          id: 201,
          user: "EcoWarrior",
          location: "Amazon Rainforest",
          text: "Every tree we plant today is a breath of fresh air for tomorrow 🌱",
          image: "src/assets/paper bg.jpg",
          likes: 445,
          comments: 67
        },
        {
          id: 202,
          user: "GreenActivist",
          location: "Copenhagen",
          text: "Small changes in our daily habits can create massive environmental impact! ♻️",
          image: "src/assets/black pencil pouch.jpg",
          likes: 321,
          comments: 54
        }
      ]
    },
    {
      id: 3,
      title: "Mental Health Matters: Breaking the Silence",
      description: "A growing movement focuses on mental health awareness, self-care practices, and breaking stigmas. Join millions sharing their journeys toward better mental wellness.",
      relatedPosts: 423,
      images: [
        "src/assets/black pencil pouch.jpg",
        "src/assets/paper bg.jpg",
        "src/assets/black pencil pouch.jpg",
        "src/assets/paper bg.jpg"
      ],
      posts: [
        {
          id: 301,
          user: "MindfulSoul",
          location: "Wellness Center",
          text: "Taking care of your mental health isn't selfish, it's essential 💙",
          image: "src/assets/black pencil pouch.jpg",
          likes: 567,
          comments: 89
        },
        {
          id: 302,
          user: "TherapyTalks",
          location: "Online",
          text: "Meditation changed my life. 10 minutes a day, infinite peace 🧘‍♀️",
          image: "src/assets/paper bg.jpg",
          likes: 398,
          comments: 76
        }
      ]
    },
    {
      id: 4,
      title: "Space Exploration: Reaching for the Stars",
      description: "From Mars missions to private space travel, humanity's quest to explore the cosmos has never been more exciting. Discover the latest space discoveries and future missions.",
      relatedPosts: 198,
      images: [
        "src/assets/paper bg.jpg",
        "src/assets/black pencil pouch.jpg",
        "src/assets/paper bg.jpg",
        "src/assets/black pencil pouch.jpg"
      ],
      posts: [
        {
          id: 401,
          user: "AstroNerd",
          location: "NASA HQ",
          text: "The James Webb telescope just discovered something incredible! 🔭✨",
          image: "src/assets/paper bg.jpg",
          likes: 678,
          comments: 123
        },
        {
          id: 402,
          user: "SpaceX_Fan",
          location: "Cape Canaveral",
          text: "Another successful SpaceX launch! Mars, here we come! 🚀",
          image: "src/assets/black pencil pouch.jpg",
          likes: 534,
          comments: 98
        }
      ]
    },
    {
      id: 5,
      title: "Digital Art Renaissance: Creativity Unleashed",
      description: "Digital artists are revolutionizing creative expression through NFTs, AI-generated art, and innovative digital mediums. Explore the intersection of technology and creativity.",
      relatedPosts: 367,
      images: [
        "src/assets/black pencil pouch.jpg",
        "src/assets/paper bg.jpg",
        "src/assets/black pencil pouch.jpg",
        "src/assets/paper bg.jpg"
      ],
      posts: [
        {
          id: 501,
          user: "DigitalArtist",
          location: "Creative Studio",
          text: "AI helped me create this masterpiece! Human + Machine creativity 🎨",
          image: "src/assets/black pencil pouch.jpg",
          likes: 456,
          comments: 87
        },
        {
          id: 502,
          user: "NFTCreator",
          location: "Metaverse",
          text: "Just sold my first NFT collection! Digital art is the future 💎",
          image: "src/assets/paper bg.jpg",
          likes: 289,
          comments: 43
        }
      ]
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setViewMode('category');
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setViewMode('post');
  };

  const goBackToTrending = () => {
    setSelectedCategory(null);
    setSelectedPost(null);
    setViewMode('trending');
  };

  const goBackToCategory = () => {
    setSelectedPost(null);
    setViewMode('category');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter trending categories based on search query
  const filteredCategories = trendingCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.posts.some(post => 
      post.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar 
        onSearch={handleSearch}
        searchPlaceholder="Search trending topics, users, locations..."
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6 bg-black">
        
        {/* Trending Categories View */}
        {viewMode === 'trending' && (
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="text-blue-500" size={32} />
                <h1 className="text-3xl font-bold text-white">Trending Now</h1>
              </div>
              <p className="text-gray-400">Discover what the world is talking about</p>
            </div>

            {/* Trending Categories */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
              <div
                key={category.id}
                className="relative group bg-neutral-900 rounded-xl p-6 hover:bg-neutral-800 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => {}}
              >
                {/* Category Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">{category.title}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">{category.description}</p>
                    <p className="text-blue-500 text-xs mt-2">{category.relatedPosts} trending posts</p>
                  </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {category.images.map((image, imgIndex) => {
                    // Map images to posts (cycle through available posts)
                    const post = category.posts[imgIndex % category.posts.length];
                    return (
                      <div
                        key={imgIndex}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent category modal from opening
                          handlePostClick(post);
                        }}
                        className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
                      >
                        <img
                          src={image}
                          alt={`${category.title} ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* View More Button - Appears on Hover */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    View More
                  </button>
                </div>
              </div>
            ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <div className="text-gray-400 text-lg">No trending topics found</div>
                <div className="text-gray-500 text-sm mt-2">
                  Try searching for something else
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category Feed View */}
        {viewMode === 'category' && selectedCategory && (
          <div className="max-w-md w-full">
            {/* Back Button and Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={goBackToTrending}
                className="p-2 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedCategory.title}</h2>
                <p className="text-gray-400 text-sm">{selectedCategory.relatedPosts} trending posts</p>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {selectedCategory.posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post)}
                  className="cursor-pointer"
                >
                  <PostCard
                    postId={post.id}
                    userId={post.userId || 'dummy-user'}
                    user={post.user}
                    location={post.location}
                    text={post.text}
                    image={post.image}
                    likes={post.likes}
                    comments={post.comments}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram-style Post Feed View */}
        {viewMode === 'post' && selectedPost && (
          <div className="max-w-md w-full mx-auto">
            {/* Back Button and Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={selectedCategory ? goBackToCategory : goBackToTrending}
                className="p-2 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Posts</h2>
                <p className="text-gray-400 text-sm">Discover more trending content</p>
              </div>
            </div>

            {/* Post Feed - Starting with selected post */}
            <div className="space-y-6">
              {/* Selected Post First */}
              <PostCard
                postId={selectedPost.id}
                userId={selectedPost.userId || 'dummy-user'}
                user={selectedPost.user}
                location={selectedPost.location}
                text={selectedPost.text}
                image={selectedPost.image}
                likes={selectedPost.likes}
                comments={selectedPost.comments}
              />
              
              {/* Similar/Related Posts from the same category or all trending posts */}
              {selectedCategory ? (
                // Show other posts from the same category
                selectedCategory.posts
                  .filter(post => post.id !== selectedPost.id)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      postId={post.id}
                      userId={post.userId || 'dummy-user'}
                      user={post.user}
                      location={post.location}
                      text={post.text}
                      image={post.image}
                      likes={post.likes}
                      comments={post.comments}
                    />
                  ))
              ) : (
                // Show posts from all categories if came directly from image click
                trendingCategories
                  .flatMap(category => category.posts)
                  .filter(post => post.id !== selectedPost.id)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      postId={post.id}
                      userId={post.userId || 'dummy-user'}
                      user={post.user}
                      location={post.location}
                      text={post.text}
                      image={post.image}
                      likes={post.likes}
                      comments={post.comments}
                    />
                  ))
              )}
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
