import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, Camera, ArrowRight, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LocationSelector from "../components/LocationSelector";
import { completeAccountSetup, uploadProfilePicture } from "../../Firebase/firestore";

export default function AccountSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profilePreview, setProfilePreview] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    coordinates: { lat: null, lng: null },
    location: {
      street: "",
      locality: "",
      city: "",
      district: "",
      state: "",
      country: ""
    },
    profilePicture: null
  });

  // Debug logging
  useEffect(() => {
    console.log("🏗️ AccountSetup component mounted");
    console.log("👤 Current user:", user?.uid);
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle coordinates change from LocationSelector
  const handleCoordinatesChange = (newCoordinates) => {
    console.log("� Coordinates changed:", newCoordinates);
    setFormData(prev => ({
      ...prev,
      coordinates: newCoordinates
    }));
  };

  // Handle location change from LocationSelector
  const handleLocationChange = (newLocation) => {
    console.log("🏠 Location changed:", newLocation);
    setFormData(prev => ({
      ...prev,
      location: newLocation
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step navigation
  const nextStep = () => {
    console.log("🔄 Moving to next step from:", currentStep);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    console.log("🔄 Moving to previous step from:", currentStep);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission - ONLY for the final step
  const handleFinalSubmit = async () => {
    console.log("🚀 Final form submission triggered");
    
    if (!user) {
      setError("No user found. Please sign up again.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      console.log("🔄 Starting account setup completion...");
      
      let profilePictureURL = "";
      
      // Upload profile picture if provided
      if (formData.profilePicture) {
        console.log("📸 Uploading profile picture...");
        const uploadResult = await uploadProfilePicture(user.uid, formData.profilePicture);
        if (uploadResult.success) {
          profilePictureURL = uploadResult.url;
          console.log("✅ Profile picture uploaded:", profilePictureURL);
        }
      }
      
      // Prepare the complete profile data
      const profileData = {
        username: formData.username,
        bio: formData.bio,
        street: formData.location.street,
        locality: formData.location.locality,
        city: formData.location.city,
        district: formData.location.district,
        state: formData.location.state,
        country: formData.location.country,
        coordinates: formData.coordinates,
        photo: profilePictureURL
      };
      
      console.log("📝 Profile data to update:", profileData);
      
      // Complete the account setup
      await completeAccountSetup(user.uid, profileData);
      console.log("✅ Account setup completed successfully");
      
      // Navigate to main app
      navigate("/for-you", { replace: true });
      
    } catch (error) {
      console.error("❌ Account setup error:", error);
      setError(error.message || "Failed to complete account setup");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-neutral-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-neutral-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neutral-600 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neutral-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light mb-3 bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Vivenza
          </h1>
          <h2 className="text-xl font-light text-neutral-300 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-neutral-500 text-sm">
            Step {currentStep} of 3 - Let's personalize your experience
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  step <= currentStep 
                    ? 'bg-neutral-700 text-white' 
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <div 
              className="bg-neutral-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Container - NO FORM ELEMENT */}
        <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl p-8 border border-neutral-800 shadow-xl">
          
          {/* Step 1: Profile Picture */}
          {currentStep === 1 && (
            <div className="text-center space-y-6">
              <h3 className="text-lg font-medium text-white mb-4">Add Profile Picture</h3>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-neutral-600 flex items-center justify-center overflow-hidden bg-neutral-800/50">
                    {profilePreview ? (
                      <img 
                        src={profilePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-neutral-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-neutral-700 p-2 rounded-full cursor-pointer hover:bg-neutral-600 transition-colors">
                    <Upload size={16} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-neutral-400">
                  Upload a profile picture or skip for now
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Username & Bio */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
              
              {/* Username */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-all duration-200 hover:border-neutral-500"
                />
              </div>
              
              {/* Bio */}
              <div className="relative group">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <textarea
                  name="bio"
                  placeholder="Write a short bio... (optional)"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-all duration-200 hover:border-neutral-500 resize-none"
                />
              </div>
              
              <p className="text-xs text-neutral-500">
                Username will be your unique identifier on Vivenza
              </p>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">Location Information</h3>
              
              {/* Location with LocationSelector Component */}
              <LocationSelector
                coordinates={formData.coordinates}
                location={formData.location}
                onCoordinatesChange={handleCoordinatesChange}
                onLocationChange={handleLocationChange}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-4 rounded-xl transition-all duration-200 focus:outline-none"
              >
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 group focus:outline-none"
              >
                Next
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group focus:outline-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}