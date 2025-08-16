import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createBasicUserProfile } from "../../Firebase/firestore";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Create Firebase Auth account with basic profile
      const result = await signup(formData.email, formData.password, formData.name);

      console.log("✅ User signed up and basic profile created");
      
      // Navigate to account setup
      navigate("/account-setup");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message);
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
    
      // Create basic user profile in Firestore
      await createBasicUserProfile(result.user.uid, {
        name: result.user.displayName || "User",
        email: result.user.email
      });

      console.log("✅ Google signup and basic profile created");
      
      // Navigate to account setup
      navigate("/account-setup");
    } catch (error) {
      console.error("Google signin error:", error);
      setError(error.message);
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light mb-3 bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Vivenza
          </h1>
          <h2 className="text-xl font-light text-neutral-300 mb-2">
            Join Us
          </h2>
          <p className="text-neutral-500 text-sm">Create your account and start exploring</p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/60 backdrop-blur-sm rounded-3xl p-8 border border-neutral-800 shadow-xl">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-all duration-200 hover:border-neutral-500"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-all duration-200 hover:border-neutral-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-black/50 border border-neutral-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-all duration-200 hover:border-neutral-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 mr-3 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-0 active:outline-none"
                style={{ outline: 'none' }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group focus:outline-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Login Options */}
          <div className="mt-8">
            <div className="relative my-6">
              <hr />
              <div className="relative flex justify-center mt-1">
                <span className="px-4 text-sm text-gray-400">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-neutral-700 bg-neutral-800/50 text-sm font-medium text-gray-300 hover:bg-neutral-700/50 hover:border-neutral-600 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Continue with Google</span>
            </button>
          </div>

          {/* Login Link
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-white hover:text-gray-300 font-medium transition-colors">
                Sign in
              </a>
            </p>
          </div> */}
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-white hover:text-neutral-300 transition-colors focus:outline-none"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
