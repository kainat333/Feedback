import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuth";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const SignIn_Form = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Handle LinkedIn login
  // Handle LinkedIn login with error handling
  const handleLinkedInLogin = async () => {
    console.log("🚀 Starting LinkedIn OAuth...");

    try {
      // Quick check if backend might be running
      const params = new URLSearchParams({
        response_type: "code",
        client_id: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
        redirect_uri: "http://localhost:5000/api/linkedin/callback",
        scope: "openid profile email",
        state: "linkedin_oauth_" + Math.random().toString(36).substring(2),
      });

      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
      console.log("🔗 Redirecting to:", linkedinAuthUrl);

      window.location.href = linkedinAuthUrl;
    } catch (error) {
      console.error("Error starting LinkedIn OAuth:", error);
      toast.error("Server Error please try again later.");
    }
  };

  // Handle OAuth errors from redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      console.log("OAuth error detected:", error);

      let errorMessage = "LinkedIn login failed. Please try again.";

      if (error.includes("authorization_code_missing")) {
        errorMessage = "Authorization failed. Please try logging in again.";
      } else if (error.includes("insufficient_permissions")) {
        errorMessage = "Please grant all requested permissions to continue.";
      } else if (error.includes("email_not_found")) {
        errorMessage = "Could not retrieve your email from LinkedIn.";
      } else if (error.includes("access_denied")) {
        errorMessage = "You denied the LinkedIn login request.";
      } else if (error.includes("invalid_token")) {
        errorMessage = "Authentication token invalid. Please try again.";
      }

      toast.error(errorMessage);
      // Clear the error from URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          { email: formData.email, password: formData.password }
        );
        if (response.status === 200 && response.data.token) {
          login(response.data.user, response.data.token);
          toast.success("Login successful!");
          navigate("/feedback");
        } else {
          toast.error("Unexpected response from server.");
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          error.response?.data?.message ||
          (error.response?.status === 404
            ? "API endpoint not found (404)"
            : error.response?.status === 204
            ? "No content returned (204)"
            : "Login failed. Please try again.");
        toast.error(errorMessage);
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("🔐 Full Google credentialResponse:", credentialResponse);

      const { credential } = credentialResponse;

      if (!credential) {
        console.error("❌ No credential in response");
        toast.error("Google authentication failed. No credential received.");
        return;
      }

      console.log("📨 Sending credential to backend...");

      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        { credential }
      );

      console.log("✅ Backend response received:", response.data);

      const { user, token } = response.data;
      login(user, token);
      toast.success("Google login successful!");
      navigate("/feedback");
    } catch (error) {
      console.error("❌ Google login failed:", error);
      console.error("Error response data:", error.response?.data);

      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed!");
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-0 m-0 overflow-hidden font-sans">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border border-gray-200 box-border">
        {/* Header */}
        <div className="flex items-center justify-center flex-col mb-6 text-left">
          <h1 className="text-2xl font-bold text-gray-800 font-sans">
            Sign In
          </h1>
          <p className="text-gray-600 text-sm font-sans">
            Welcome back! Please login to your account
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="mb-6">
          <div className="space-y-3 mb-4">
            {/* Google Button */}
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
            />

            {/* LinkedIn Button - Updated text to "Sign in with LinkedIn" */}
            <button
              onClick={handleLinkedInLogin}
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-start gap-3 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-800 py-3 px-3 rounded-sm text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md font-sans"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="#0A66C2"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="flex-1 text-center text-sm font-sans">
                Sign in with LinkedIn
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-sans">
                Or with email
              </span>
            </div>
          </div>
        </div>

        {/* Email/Password Form with LEFT-ALIGNED Labels */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2 text-left font-sans"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all duration-200 font-sans"
              required
            />
            {errors.email &&
              errors.email !== "Login failed. Please try again." && (
                <p className="text-red-500 text-xs mt-1 text-left font-sans">
                  {errors.email}
                </p>
              )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2 text-left font-sans"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all duration-200 font-sans"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex text-sm text-blue-800 justify-end">
            <Link to="/forgot-password" className="font-sans">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-2.5 rounded-lg text-sm font-medium transition-all font-sans"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Centered Register Link */}
        <div className="text-center text-gray-600 text-sm mt-6 pt-4 border-t border-gray-200">
          <p className="font-sans">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-800 hover:underline font-medium font-sans"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn_Form;
