import React from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const FormFields = ({
  formData,
  errors,
  showErrors,
  showPassword,
  otpSent,
  onFieldChange,
  onTogglePassword,
  OTPComponent,
}) => {
  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left font-sans">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onFieldChange}
          placeholder="Enter your full name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all duration-200 font-sans"
          disabled={otpSent}
        />
        {showErrors && errors.fullName && (
          <p className="text-red-500 text-xs mt-1 text-left font-sans">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left font-sans">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onFieldChange}
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all duration-200 font-sans"
          disabled={otpSent}
        />
        {showErrors && errors.email && (
          <p className="text-red-500 text-xs mt-1 text-left font-sans">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left font-sans">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onFieldChange}
            placeholder="Create a password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all duration-200 font-sans"
            disabled={otpSent}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onTogglePassword}
            disabled={otpSent}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {showErrors && errors.password && (
          <p className="text-red-500 text-xs mt-1 text-left font-sans">
            {errors.password}
          </p>
        )}
      </div>

      {/* OTP Input Section */}
      {otpSent && OTPComponent}

      {/* Terms */}
      <div>
        <label className="flex items-start text-sm text-gray-600 text-left font-sans">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={onFieldChange}
            className="h-4 w-4 border-gray-300 mr-2 rounded focus:ring-gray-400 mt-0.5"
            disabled={otpSent}
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
          <p className="text-red-500 text-xs mt-1 text-left font-sans">
            {errors.acceptTerms}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormFields;
