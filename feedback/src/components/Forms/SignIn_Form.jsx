import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

// Import components
import AuthHeader from "../Auth/AuthHeader";
import AuthFooter from "../Auth/AuthFooter";
import SocialAuthButtonsSignIn from "../Auth/SocialAuthButtonsSignIn";
import SignInFormFields from "../Auth/SignInFormFields";

// Import hooks
import useSignInForm from "../hooks/useSignInForm";
import useOAuthHandlers from "../hooks/useOAuthHandlers";

const SignIn_Form = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State hooks
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Custom hooks
  const { formData, errors, handleChange, validate } = useSignInForm();
  const { handleLinkedInLogin } = useOAuthHandlers(login);

  // Handle form submission - FIXED VERSION
  const handleSubmit = async (e) => {
    // ✅ CRITICAL FIX: Add both preventDefault and stopPropagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("🔄 === SIGN IN FORM SUBMITTED ===");
    console.log("📝 Form Data:", formData);

    // ✅ Validate form
    if (!validate()) {
      console.log("❌ Validation failed");
      return false;
    }

    setIsLoading(true);

    try {
      console.log("📨 Making API call to backend...");

      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("✅ API Response:", response.data);

      if (response.data && response.data.token) {
        console.log("🔑 Login successful, redirecting...");
        login(response.data.user, response.data.token);
        toast.success("Login successful!");
        navigate("/feedback");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? "API endpoint not found (404)"
          : error.response?.status === 204
          ? "No content returned (204)"
          : "Login failed. Please try again.");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }

    // ✅ IMPORTANT: Return false to prevent default behavior
    return false;
  };
  // Handle Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("🔐 Full Google credentialResponse:", credentialResponse);

      const { credential } = credentialResponse;

      if (!credential) {
        console.error(" No credential in response");
        toast.error("Google authentication failed. No credential received.");
        return;
      }

      console.log(" Sending credential to backend...");

      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        { credential }
      );

      console.log("Backend response received:", response.data);

      const { user, token } = response.data;
      login(user, token);
      toast.success("Google login successful!");
      navigate("/feedback");
    } catch (error) {
      console.error(" Google login failed:", error);
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
        <AuthHeader
          title="Sign In"
          subtitle="Welcome back! Please login to your account"
        />

        {/* Social Login Buttons */}
        <SocialAuthButtonsSignIn
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
          onLinkedInLogin={handleLinkedInLogin}
          isLoading={isLoading}
        />

        {/* Email/Password Form - FIXED: Added onSubmit to form */}
        <SignInFormFields
          formData={formData}
          errors={errors}
          showPassword={showPassword}
          isLoading={isLoading}
          handleChange={handleChange}
          setShowPassword={setShowPassword}
          onSubmit={handleSubmit}
        />

        {/* Sign Up Link */}
        <AuthFooter
          text="Don't have an account?"
          linkText="Register"
          linkTo="/register"
        />
      </div>
    </div>
  );
};

export default SignIn_Form;
