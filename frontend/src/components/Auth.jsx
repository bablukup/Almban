import React, { useState } from "react";
import { Heart, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const Auth = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);

  const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:8080";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First, try to login
      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        // Login successful
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify(loginData.user));
        onAuthSuccess(loginData.user, loginData.token, "login");
        return;
      }

      // If login failed and error is "Invalid credentials", try signup
      if (
        loginResponse.status === 401 &&
        loginData.message === "Invalid credentials"
      ) {
        // Check if name is provided for signup
        if (!formData.name.trim()) {
          setIsSignupMode(true);
          setError("Please enter your name to create a new account");
          setIsLoading(false);
          return;
        }

        // Try signup
        const signupResponse = await fetch(`${API_URL}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const signupData = await signupResponse.json();

        if (signupResponse.ok) {
          // Signup successful
          localStorage.setItem("token", signupData.token);
          localStorage.setItem("user", JSON.stringify(signupData.user));
          onAuthSuccess(signupData.user, signupData.token, "signup");
          return;
        } else {
          setError(signupData.message || "Failed to create account");
        }
      } else {
        setError(loginData.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-[#1F2937] mb-2">
            Welcome to Āḷmban
          </h1>
          <p className="text-gray-600">Your emotional support companion</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field - Show when in signup mode */}
            {isSignupMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1F2937] flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required={isSignupMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1F2937] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1F2937] flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          {/* Info Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {isSignupMode
                ? "Creating your account..."
                : "Enter your email & password. We'll automatically log you in or create a new account."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Your privacy and security are our top priority</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
