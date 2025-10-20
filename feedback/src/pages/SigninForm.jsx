import React, { useState } from "react";
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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validate email and password
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

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        if (response.status === 200 && response.data.token) {
          login(response.data.user, response.data.token);
          toast.success("Login successful! Redirecting...");
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

        // Only show toast, don't set inline errors for server errors
        toast.error(errorMessage);
      }
    }
    setIsLoading(false);
  };

  // ✅ Google login handlers
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;

      // Send the credential to your backend for verification and login/signup
      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          credential,
        }
      );

      // Extract user + token from backend response
      const { user, token } = response.data;

      // Save in your auth context
      login(user, token);
      toast.success("Google login successful! Redirecting...");

      // Redirect to feedback page
      navigate("/feedback");
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed!");
    toast.error("Google login failed. Please try again.");
  };

  // ✅ UI
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-50 p-4 pt-20">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {/* Header */}
        <div className="mb-5 text-left">
          <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
          <p className="text-gray-600 text-sm">
            Welcome back! Please login to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
                         focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all duration-200"
              required
            />
            {/* Only show inline errors for client-side validation */}
            {errors.email &&
              errors.email !== "Login failed. Please try again." && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 
               focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all duration-200"
              required
            />
            <span
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className=" flex text-sm text-blue-800 justify-end">
            <Link to="/forgot-password">Forget Password?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 
                       text-white py-2 rounded-lg text-sm font-medium transition-all"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-left text-gray-600 text-sm mt-4">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-800 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
          <div className="flex items-center justify-center my-3">
            <span className="text-gray-400 text-sm">or</span>
          </div>
          <GoogleAuthButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="Signin_with"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn_Form;
