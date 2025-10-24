import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showError, showSuccess } from "../utils/toassters";
import GoogleAuthButton from "./GoogleAuth";

// OTP Input Component
const OTPInput = ({ otp, setOtp, isLoading }) => {
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-4">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              disabled={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

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

  // New OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle LinkedIn login
  const handleLinkedInLogin = () => {
    console.log(" Starting LinkedIn OAuth...");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
      redirect_uri: "http://localhost:5000/api/linkedin/callback",
      scope: "openid profile email",
      state: "linkedin_oauth_" + Math.random().toString(36).substring(2),
    });

    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
    console.log(" Redirecting to:", linkedinAuthUrl);

    window.location.href = linkedinAuthUrl;
  };

  // Handle OAuth errors from redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const success = params.get("success");
    const user = params.get("user");
    const token = params.get("token");

    // Handle LinkedIn SUCCESS case
    if (success === "linkedin" && token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        login(userData, token);

        showSuccess(
          `Welcome ${userData.name}! Account created with LinkedIn successfully! 🎉`
        );
        navigate("/feedback");

        // Clear the URL
        window.history.replaceState({}, "", window.location.pathname);
        return;
      } catch (error) {
        console.error("Error processing LinkedIn success:", error);
        showError("LinkedIn registration failed. Please try again.");
      }
    }

    // Your existing ERROR handling code
    if (error) {
      console.log("❌ OAuth error detected:", error);

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

      showError(errorMessage);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [login, navigate]);

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0 && otpSent) {
      interval = setInterval(() => {
        setOtpTimer((timer) => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer, otpSent]);

  // Validate individual fields
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
      else if (!pattern.test(value))
        error = "Please enter a valid email address";
    }
    if (name === "password") {
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!value.trim()) error = "Password is required";
      else if (!pattern.test(value))
        error =
          "Password must have 8+ characters, 1 uppercase, 1 lowercase & 1 number";
    }
    if (name === "acceptTerms" && !value)
      error = "You must accept our Terms and Privacy Policy";
    return error;
  };

  // Validate all fields
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

    // Clear error when user starts typing
    if (showErrors && errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("🔐 Full Google credentialResponse:", credentialResponse);

      const { credential } = credentialResponse;

      if (!credential) {
        console.error(" No credential in response");
        showError("Google authentication failed. No credential received.");
        return;
      }

      console.log("📨 Sending credential to backend...");

      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        { credential }
      );

      console.log("Backend response received:", response.data);

      const { user, token } = response.data;
      login(user, token);
      showSuccess(`Welcome ${user.name}!`);
      navigate("/feedback");
    } catch (error) {
      console.error("Google login failed:", error);
      console.error("Error response data:", error.response?.data);

      showError("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed!");
    showError("Google login failed. Please try again.");
  };

  // STEP 1: Request OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    const validationErrors = validateAll();

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);

      // ✅ CORRECT URL - Remove /otp from path
      const response = await axios.post(
        "http://localhost:5000/api/request-otp",
        {
          email: formData.email,
          name: formData.fullName,
          purpose: "registration",
        }
      );

      if (response.data.success) {
        setOtpSent(true);
        setOtpTimer(60); // 60 seconds timer
        showSuccess("OTP sent to your email! Check your inbox.");

        // Auto-fill OTP for testing (optional)
        // if (response.data.otp) {
        //   const otpArray = response.data.otp.split("");
        //   setOtp(otpArray);
        // }
      }
    } catch (error) {
      console.error("OTP request failed:", error);

      if (
        error.code === "ECONNREFUSED" ||
        error.message?.includes("Network Error")
      ) {
        showError("Something went wrong.Please try again ");
      } else {
        showError(
          error.response?.data?.message ||
            "OTP sent to your email! Check your inbox."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP and Complete Registration
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      showError("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);

      // ✅ CORRECT URL - Remove /otp from path
      const response = await axios.post(
        "http://localhost:5000/api/verify-otp",
        {
          email: formData.email,
          otp: otpString,
          name: formData.fullName,
          password: formData.password,
        }
      );

      if (response.data.success) {
        const { token, user } = response.data;
        login(user, token);
        showSuccess(`Welcome ${user.name}! Registration successful! 🎉`);
        navigate("/feedback");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);

      if (error.response?.status === 400) {
        showError("Invalid OTP. Please check the code and try again.");
      } else if (
        error.code === "ECONNREFUSED" ||
        error.message?.includes("Network Error")
      ) {
        showError(
          "Cannot connect to server. Please check if backend is running."
        );
      } else {
        showError(
          error.response?.data?.message ||
            "Verification failed. Please try again."
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP Function
  const handleResendOTP = async () => {
    try {
      setIsLoading(true);

      // ✅ CORRECT URL - Remove /otp from path
      const response = await axios.post(
        "http://localhost:5000/api/resend-otp",
        {
          email: formData.email,
        }
      );

      if (response.data.success) {
        setOtpTimer(60);
        setOtp(["", "", "", "", "", ""]); // Clear OTP fields
        showSuccess("New OTP sent to your email!");
      }
    } catch (error) {
      showError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-0 m-0 overflow-hidden font-sans">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border border-gray-200 box-border">
        {/* Header */}
        <div className="flex items-center justify-center flex-col mb-6 text-left">
          <h1 className="text-2xl font-bold text-gray-800 font-sans">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm font-sans">
            Join us and start your journey
          </p>
        </div>

        {/* ✅ SOCIAL LOGIN BUTTONS - Consistent with SignIn */}
        <div className="mb-6">
          <div className="space-y-3 mb-4">
            {/* Google Button - Using GoogleLogin component */}
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
            />
            {/* LinkedIn Button - Now with consistent layout */}
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
                Sign up with LinkedIn
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

        {/* Registration Form */}
        <form
          onSubmit={otpSent ? handleVerifyOTP : handleSubmit}
          className="space-y-4"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left font-sans">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
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
              onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition-all duration-200 font-sans"
                disabled={otpSent}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
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

          {/* OTP Input Section - Show only when OTP sent */}
          {otpSent && (
            <OTPInput otp={otp} setOtp={setOtp} isLoading={isVerifying} />
          )}

          {/* Terms */}
          <div>
            <label className="flex items-start text-sm text-gray-600 text-left font-sans">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
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

          {/* Submit/Verify Button */}
          <button
            type="submit"
            disabled={
              isLoading || isVerifying || (otpSent && otp.join("").length !== 6)
            }
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-2.5 rounded-lg text-sm font-medium transition-all font-sans"
          >
            {isVerifying
              ? "Verifying..."
              : otpSent
              ? "Verify OTP & Create Account"
              : isLoading
              ? "Sending OTP..."
              : "Request OTP"}
          </button>

          {/* Resend OTP Section */}
          {otpSent && (
            <div className="text-center">
              {otpTimer > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend OTP in {otpTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-blue-600 hover:underline text-sm font-sans"
                >
                  Resend OTP
                </button>
              )}
            </div>
          )}
        </form>

        {/* Sign In Link */}
        <div className="text-center text-gray-600 text-sm mt-6 pt-4 border-t border-gray-200">
          <p className="font-sans">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-800 hover:underline font-medium font-sans"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register_Form;
