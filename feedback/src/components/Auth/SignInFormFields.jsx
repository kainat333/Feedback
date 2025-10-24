import React from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const SignInFormFields = ({
  formData,
  errors,
  showPassword,
  isLoading,
  handleChange,
  setShowPassword,
  onSubmit, // ✅ ADD THIS PROP
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {" "}
      {/* ✅ ADD onSubmit HERE */}
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
        {errors.email && errors.email !== "Login failed. Please try again." && (
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
        {errors.password && ( // ✅ ADD PASSWORD ERROR DISPLAY
          <p className="text-red-500 text-xs mt-1 text-left font-sans">
            {errors.password}
          </p>
        )}
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
  );
};

export default SignInFormFields;
