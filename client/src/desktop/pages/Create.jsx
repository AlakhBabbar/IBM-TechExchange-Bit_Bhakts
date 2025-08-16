import { useState, useRef } from "react";
import { Camera, Video, Upload, X, ImageIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import LocationSelector from "../components/LocationSelector";
import { useAuth } from '../../context/AuthContext';
import { createPostWithMedia } from '../../Firebase/firestore';

export default function Create() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' or 'video'
  const [description, setDescription] = useState("");
  const [isIssue, setIsIssue] = useState("");
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [customMood, setCustomMood] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [postType, setPostType] = useState("");
  const [customPostType, setCustomPostType] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [location, setLocation] = useState({
    street: "",
    locality: "",
    city: "",
    district: "",
    state: "",
    country: ""
  });
  const [isMuted, setIsMuted] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Mood options with emojis
  const moodOptions = [
    { name: "Happy", emoji: "😊", color: "bg-yellow-500" },
    { name: "Calm", emoji: "😌", color: "bg-blue-400" },
    { name: "Peaceful", emoji: "☮️", color: "bg-green-400" },
    { name: "Excited", emoji: "🤩", color: "bg-orange-500" },
    { name: "Grateful", emoji: "🙏", color: "bg-purple-400" },
    { name: "Proud", emoji: "💪", color: "bg-indigo-500" },
    { name: "Hopeful", emoji: "🌟", color: "bg-cyan-400" },
    { name: "Content", emoji: "😊", color: "bg-teal-400" },
    { name: "Concerned", emoji: "😟", color: "bg-yellow-600" },
    { name: "Frustrated", emoji: "😤", color: "bg-red-500" },
    { name: "Angry", emoji: "😠", color: "bg-red-600" },
    { name: "Disappointed", emoji: "😞", color: "bg-gray-500" },
    { name: "Disgusted", emoji: "🤢", color: "bg-green-600" },
    { name: "Worried", emoji: "😰", color: "bg-orange-600" },
    { name: "Annoyed", emoji: "😒", color: "bg-amber-600" },
    { name: "Upset", emoji: "😢", color: "bg-blue-600" },
    { name: "Surprised", emoji: "😲", color: "bg-pink-500" },
    { name: "Curious", emoji: "🤔", color: "bg-violet-500" },
    { name: "Thoughtful", emoji: "🤓", color: "bg-emerald-500" },
    { name: "Motivated", emoji: "🔥", color: "bg-rose-500" }
  ];

  // Category options with icons and colors
  const categoryOptions = [
    { name: "Garbage/Waste", icon: "🗑️", color: "bg-red-500", type: "issue" },
    { name: "Poor Infrastructure", icon: "🏗️", color: "bg-red-600", type: "issue" },
    { name: "Congested Roads", icon: "🚗", color: "bg-orange-600", type: "issue" },
    { name: "Poor Crowd Management", icon: "👥", color: "bg-yellow-600", type: "issue" },
    { name: "Potholes", icon: "🕳️", color: "bg-gray-600", type: "issue" },
    { name: "Broken Streetlights", icon: "💡", color: "bg-amber-600", type: "issue" },
    { name: "Water Logging", icon: "💧", color: "bg-blue-700", type: "issue" },
    { name: "Air Pollution", icon: "💨", color: "bg-gray-700", type: "issue" },
    { name: "Noise Pollution", icon: "🔊", color: "bg-purple-600", type: "issue" },
    { name: "Safety Concerns", icon: "⚠️", color: "bg-red-700", type: "issue" },
    { name: "Couple Spot", icon: "💕", color: "bg-pink-500", type: "positive" },
    { name: "Clean Environment", icon: "🌿", color: "bg-green-500", type: "positive" },
    { name: "Beautiful Architecture", icon: "🏛️", color: "bg-blue-500", type: "positive" },
    { name: "Well-maintained Parks", icon: "🌳", color: "bg-emerald-500", type: "positive" },
    { name: "Good Public Transport", icon: "🚌", color: "bg-indigo-500", type: "positive" },
    { name: "Helpful People", icon: "🤝", color: "bg-cyan-500", type: "positive" },
    { name: "Cultural Heritage", icon: "🏺", color: "bg-amber-500", type: "positive" },
    { name: "Food & Dining", icon: "🍽️", color: "bg-orange-500", type: "positive" },
    { name: "Shopping Areas", icon: "🛍️", color: "bg-violet-500", type: "positive" },
    { name: "Entertainment", icon: "🎭", color: "bg-rose-500", type: "positive" }
  ];

  // Post type options
  const postTypeOptions = [
    "Issue Report", "City Appreciation", "Suggestion/Improvement", "General Update", "Emergency Alert"
  ];

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleMoodSelect = (moodName) => {
    setSelectedMoods(prev => 
      prev.includes(moodName) 
        ? prev.filter(m => m !== moodName)
        : [...prev, moodName]
    );
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert(`File size too large. Maximum allowed size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Please select a valid image or video file.');
        return;
      }

      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setSelectedFile(file);
      setFileType(type);
      
      // Set default mute for videos
      if (type === 'video') {
        setIsMuted(true);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert(`File size too large. Maximum allowed size is 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
        return;
      }

      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setSelectedFile(file);
      setFileType(type);
      
      // Set default mute for videos
      if (type === 'video') {
        setIsMuted(true);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePost = async () => {
    // Validation
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
    
    if (!description.trim()) {
      alert("Please add a description");
      return;
    }
    
    if (!isIssue) {
      alert("Please specify if this is an issue");
      return;
    }
    
    if (!user) {
      alert("Please log in to create a post");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Prepare post data
      const allMoods = [...selectedMoods];
      if (customMood.trim()) {
        allMoods.push(customMood.trim());
      }
      
      const allCategories = [...selectedCategories];
      if (customCategory.trim()) {
        allCategories.push(customCategory.trim());
      }
      
      const finalPostType = postType === "Other" && customPostType.trim() 
        ? customPostType.trim() 
        : postType || "General Update";
      
      const postData = {
        description: description.trim(),
        isIssue,
        moods: allMoods,
        categories: allCategories,
        postType: finalPostType,
        coordinates,
        location
      };
      
      console.log("🔥 Creating post with data:", postData);
      console.log("🔥 User details:", user);
      
      // Create post with media upload
      const result = await createPostWithMedia(user.uid, selectedFile, postData);
      
      if (result.success) {
        console.log("✅ Post created successfully:", result.postId);
        console.log("✅ Media URL:", result.mediaUrl);
        
        // Reset form after successful upload
        setSelectedFile(null);
        setFileType(null);
        setDescription("");
        setIsIssue("");
        setSelectedMoods([]);
        setCustomMood("");
        setSelectedCategories([]);
        setCustomCategory("");
        setPostType("");
        setCustomPostType("");
        setCoordinates({ lat: null, lng: null });
        setLocation({
          street: "",
          locality: "",
          city: "",
          district: "",
          state: "",
          country: ""
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        alert("Post uploaded successfully!");
        
        // Navigate to ForYou page to see the new post
        setTimeout(() => {
          navigate('/for-you');
        }, 1000);
      } else {
        throw new Error("Post creation failed but no error was thrown");
      }
      
    } catch (error) {
      console.error("❌ Upload error:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      alert(`Failed to upload post: ${error.message}`);
    }
    
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
          <p className="text-gray-400">Share your photos and videos with the community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gray-800 rounded-full">
                    <Upload size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Upload Photo or Video
                    </h3>
                    <p className="text-gray-400 mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Maximum file size: 10MB
                    </p>
                    <div className="flex justify-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <ImageIcon size={16} className="mr-1" />
                        Photos
                      </span>
                      <span className="flex items-center">
                        <Video size={16} className="mr-1" />
                        Videos
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                {/* Remove Button */}
                <button
                  onClick={removeFile}
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>

                {/* File Preview */}
                {fileType === 'image' ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={URL.createObjectURL(selectedFile)}
                      className="w-full h-96 object-cover rounded-t-lg"
                      controls
                      muted={isMuted}
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video Info Overlay */}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      VIDEO PREVIEW
                    </div>
                  </div>
                )}

                {/* File Info */}
                <div className="p-4 bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{selectedFile.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      {fileType === 'video' && (
                        <p className="text-blue-400 text-xs mt-1">
                          📹 Thumbnail will be auto-generated
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {fileType === 'image' ? (
                        <ImageIcon size={20} className="text-blue-400" />
                      ) : (
                        <Video size={20} className="text-red-400" />
                      )}
                      <span className="text-sm text-gray-400 capitalize">
                        {fileType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Upload Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
              >
                <Camera size={20} />
                <span>Upload Photo</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
              >
                <Video size={20} />
                <span>Upload Video</span>
              </button>
            </div>
          </div>

          {/* Post Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you're sharing..."
                className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 resize-none focus:border-blue-500 focus:outline-none"
                maxLength={1000}
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {description.length}/1000
              </div>
            </div>

            {/* Is it an Issue? */}
            <div>
              <label className="block text-white font-medium mb-2">
                Is this an issue? *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={isIssue === "yes"}
                    onChange={(e) => setIsIssue(e.target.value)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-gray-300">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={isIssue === "no"}
                    onChange={(e) => setIsIssue(e.target.value)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="text-gray-300">No</span>
                </label>
              </div>
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-white font-medium mb-3">
                How do you feel about this? 
                <span className="text-sm text-gray-400 ml-2">(Select multiple moods)</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.name}
                    type="button"
                    onClick={() => handleMoodSelect(mood.name)}
                    className={`relative p-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 border-2 ${
                      selectedMoods.includes(mood.name)
                        ? `${mood.color} text-white border-white shadow-lg`
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg">{mood.emoji}</span>
                      <span className="text-xs leading-tight">{mood.name}</span>
                    </div>
                    {selectedMoods.includes(mood.name) && (
                      <div className="absolute -top-1 -right-1 bg-white text-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                  placeholder="✨ Add your own mood..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              {selectedMoods.length > 0 && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Selected moods:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMoods.map((mood) => {
                      const moodObj = moodOptions.find(m => m.name === mood);
                      return (
                        <span
                          key={mood}
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium text-white ${moodObj?.color || 'bg-gray-600'}`}
                        >
                          <span>{moodObj?.emoji}</span>
                          <span>{mood}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-white font-medium mb-3">
                Category 
                <span className="text-sm text-gray-400 ml-2">(Select multiple categories)</span>
              </label>
              
              {/* Issues Categories */}
              <div className="mb-4">
                <h4 className="text-red-400 font-medium mb-2 flex items-center">
                  ⚠️ Issues & Problems
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {categoryOptions.filter(cat => cat.type === 'issue').map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => handleCategorySelect(category.name)}
                      className={`relative p-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 border ${
                        selectedCategories.includes(category.name)
                          ? `${category.color} text-white border-white shadow-md`
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-base">{category.icon}</span>
                        <span className="text-xs leading-tight text-center">{category.name}</span>
                      </div>
                      {selectedCategories.includes(category.name) && (
                        <div className="absolute -top-1 -right-1 bg-white text-gray-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Positive Categories */}
              <div className="mb-4">
                <h4 className="text-green-400 font-medium mb-2 flex items-center">
                  ✨ Positive Aspects
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {categoryOptions.filter(cat => cat.type === 'positive').map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => handleCategorySelect(category.name)}
                      className={`relative p-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 border ${
                        selectedCategories.includes(category.name)
                          ? `${category.color} text-white border-white shadow-md`
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-base">{category.icon}</span>
                        <span className="text-xs leading-tight text-center">{category.name}</span>
                      </div>
                      {selectedCategories.includes(category.name) && (
                        <div className="absolute -top-1 -right-1 bg-white text-gray-800 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="🏷️ Add your own category..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pl-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              
              {selectedCategories.length > 0 && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Selected categories:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => {
                      const catObj = categoryOptions.find(c => c.name === category);
                      return (
                        <span
                          key={category}
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium text-white ${catObj?.color || 'bg-gray-600'}`}
                        >
                          <span>{catObj?.icon}</span>
                          <span>{category}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Post Type */}
            <div>
              <label className="block text-white font-medium mb-2">
                Post Type *
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none mb-3"
                required
              >
                <option value="">Select post type...</option>
                {postTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              {postType === "Other" && (
                <input
                  type="text"
                  value={customPostType}
                  onChange={(e) => setCustomPostType(e.target.value)}
                  placeholder="Specify post type..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              )}
            </div>

            {/* Location Section */}
            <LocationSelector
              coordinates={coordinates}
              onCoordinatesChange={handleCoordinatesChange}
              location={location}
              onLocationChange={handleLocationChange}
              required={true}
            />

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <button
                onClick={handlePost}
                disabled={!selectedFile || !description || !isIssue || !postType || !coordinates.lat || isUploading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedFile && description && isIssue && postType && coordinates.lat && !isUploading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Submit Post'}
              </button>
              
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setFileType(null);
                  setDescription("");
                  setIsIssue("");
                  setSelectedMoods([]);
                  setCustomMood("");
                  setSelectedCategories([]);
                  setCustomCategory("");
                  setPostType("");
                  setCustomPostType("");
                  setCoordinates({ lat: null, lng: null });
                  setLocation({
                    street: "",
                    locality: "",
                    city: "",
                    district: "",
                    state: "",
                    country: ""
                  });
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
