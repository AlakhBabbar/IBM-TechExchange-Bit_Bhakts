import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, FileText, Camera, ArrowRight, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LocationSelector from "../components/LocationSelector";

export default function AccountSetup() {
  const navigate = useNavigate();
  const { completeAccountSetup } = useAuth();
  
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
      country: "",
      postalCode: ""
    },
    profilePicture: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePreview, setProfilePreview] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log("🏗️ AccountSetup component mounted");
    return () => {
      console.log("🏗️ AccountSetup component unmounted");
    };
  }, []);
  
  // Debug current step changes
  useEffect(() => {
    console.log("🔄 AccountSetup step changed to:", currentStep);
  }, [currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location object
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setFormData(prev => ({
      ...prev,
      coordinates: newCoordinates
    }));
  };

  const handleLocationChange = (newLocation) => {
    setFormData(prev => ({
      ...prev,
      location: newLocation
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Account setup data:", {
      ...formData,
      coordinates: formData.coordinates
    });
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mark account setup as complete
      completeAccountSetup();
      // Navigate to main app after account setup completion
      navigate("/");
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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

        {/* Form Container */}
        <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl p-8 border border-neutral-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
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

            {/* Step 2: Username */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Choose Username</h3>
                
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
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500">
                  This will be your unique identifier on Vivenza
                </p>
              </div>
            )}

            {/* Step 3: Bio & Location */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">Tell us about yourself</h3>
                
                {/* Bio */}
                <div className="relative group">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                  </div>
                  <textarea
                    name="bio"
                    placeholder="Write a short bio..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-all duration-200 hover:border-neutral-500 resize-none"
                  />
                </div>

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
            <div className="flex gap-3 pt-4">
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
                  type="submit"
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
          </form>

          {/* Skip Option */}
          <div className="mt-6 text-center">
            <button 
              className="text-sm text-neutral-400 hover:text-white transition-colors focus:outline-none"
              onClick={() => {
                // Skip to main app
                alert('Skipping to main app...');
              }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
