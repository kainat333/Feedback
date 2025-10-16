import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuth";
import { jwtDecode } from "jwt-decode";

jwtDecode;
const Register_Form = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (name === "fullName") {
      if (!value.trim()) error = "Full name is required";
      else if (value.length < 3)
        error = "Full name must be at least 3 characters";
    }
    if (name === "email") {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) error = "Email is required";
      else if (!pattern.test(value)) error = "Invalid email address";
    }
    if (name === "password") {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!value.trim()) error = "Password is required";
      else if (!pattern.test(value))
        error = "Must have 8+ chars, 1 uppercase, 1 lowercase & 1 number";
    }
    if (name === "acceptTerms" && !value)
      error = "You must accept Terms and Privacy Policy";
    return error;
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;

      // Send credential to backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          credential,
        }
      );

      // Backend returns user + token
      const { user, token } = response.data;

      // Save login info globally
      login(user, token);

      alert(`Welcome ${user.name}!`);
      navigate("/feedback");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed!");
    alert("Google login failed. Please try again.");
  };
  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);
      await axios.post("http://localhost:5000/api/users/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      const loginResponse = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (loginResponse.data.token) {
        login(loginResponse.data.user, loginResponse.data.token);
        navigate("/feedback");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Registration failed. Try again.";
      setErrors({ ...errors, email: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Changed to w-full max-w-2xl for wider form */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 text-base">
            Join us and start your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {showErrors && errors.fullName && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {showErrors && errors.email && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <span
              className="absolute right-3 top-9 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            {showErrors && errors.password && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {errors.password}
              </p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start text-sm text-gray-600 text-left">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 mr-2 rounded focus:ring-gray-400 mt-0.5"
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-gray-800 hover:underline font-medium"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-gray-800 hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {showErrors && errors.acceptTerms && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {errors.acceptTerms}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg text-sm font-semibold transition-all"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </Link>
          <div className="flex items-center justify-center my-3">
            <span className="text-gray-400 text-sm">or</span>
          </div>
          <GoogleAuthButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
          />
        </p>
      </div>
    </div>
  );
};

export default Register_Form;
