import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { showError, showSuccess } from "../../utils/toassters";
import OTPInput from "../Auth/OTPInput";
import SocialAuthButtons from "../Auth/SocialAuthButtons";
import FormFields from "../Auth/FormFields";
import AuthHeader from "../Auth/AuthHeader";
import AuthFooter from "../Auth/AuthFooter";
import useFormValidation from "../hooks/useFormValidation";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    formData,
    errors,
    showErrors,
    setShowErrors,
    handleChange,
    validateAll,
  } = useFormValidation({
    fullName: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  // OAuth handlers
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
    window.location.href = linkedinAuthUrl;
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      if (!credential) {
        showError("Google authentication failed. No credential received.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        { credential }
      );

      const { user, token } = response.data;
      login(user, token);
      showSuccess(`Welcome ${user.name}!`);
      navigate("/feedback");
    } catch (error) {
      console.error("Google login failed:", error);
      showError("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    showError("Google login failed. Please try again.");
  };

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

  // Handle OAuth redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const success = params.get("success");
    const user = params.get("user");
    const token = params.get("token");

    if (success === "linkedin" && token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        login(userData, token);
        showSuccess(
          `Welcome ${userData.name}! Account created with LinkedIn successfully! 🎉`
        );
        navigate("/feedback");
        window.history.replaceState({}, "", window.location.pathname);
      } catch (error) {
        showError("LinkedIn registration failed. Please try again.");
        console.log(error);
      }
    }

    if (error) {
      handleOAuthError(error);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [login, navigate]);

  const handleOAuthError = (error) => {
    let errorMessage = "LinkedIn login failed. Please try again.";
    const errorMessages = {
      authorization_code_missing:
        "Authorization failed. Please try logging in again.",
      insufficient_permissions:
        "Please grant all requested permissions to continue.",
      email_not_found: "Could not retrieve your email from LinkedIn.",
      access_denied: "You denied the LinkedIn login request.",
      invalid_token: "Authentication token invalid. Please try again.",
    };

    Object.keys(errorMessages).forEach((key) => {
      if (error.includes(key)) {
        errorMessage = errorMessages[key];
      }
    });

    showError(errorMessage);
  };

  // OTP Functions
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    const validationErrors = validateAll();

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true);
      setOtpError(""); // Clear previous OTP errors

      console.log("📨 Sending OTP request for:", formData.email);

      const response = await axios.post(
        "http://localhost:5000/api/otp/request-otp",
        {
          email: formData.email,
          name: formData.fullName,
          purpose: "registration",
        }
      );

      console.log("✅ OTP Response:", response.data);

      if (response.data.success) {
        setOtpSent(true);
        setOtpTimer(60);

        // ✅ AUTO-FILL OTP FROM RESPONSE FOR DEVELOPMENT
        if (response.data.otp) {
          const otpArray = response.data.otp.split("");
          setOtp(otpArray);
          console.log("🔢 Auto-filled OTP:", response.data.otp);
          showSuccess(
            `OTP ${response.data.otp} auto-filled! Click Verify OTP.`
          );
        } else {
          showSuccess("OTP sent to your email! Check your inbox.");
        }
      }
    } catch (error) {
      console.error("❌ OTP request failed:", error);
      console.error("📝 Error response data:", error.response?.data);

      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message;

        if (
          errorMessage.includes("already registered") ||
          errorMessage.includes("already exists")
        ) {
          showError("Account already exists. Please sign in instead.");
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else {
          showError(errorMessage || "Registration issue. Please try again.");
        }
      } else if (error.code === "ECONNREFUSED") {
        showError(
          "Cannot connect to server. Please ensure backend is running on localhost:5000"
        );
      } else if (error.message?.includes("Network Error")) {
        showError("Network error. Please check your connection.");
      } else {
        showError("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      setOtpError(""); // Clear previous errors

      console.log("🔐 Verifying OTP:", otpString);

      const response = await axios.post(
        "http://localhost:5000/api/otp/verify-otp",
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
        showSuccess(`Welcome ${user.name}! Registration successful! `);
        navigate("/feedback");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      console.error("Error details:", error.response?.data);

      // ✅ IMPROVED ERROR HANDLING
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        const errorMessage = errorData.message;

        if (
          errorMessage.includes("already registered") ||
          errorData.userExists
        ) {
          showError("Account already exists. Please sign in instead.");
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else if (errorMessage.includes("expired") || errorData.otpExpired) {
          setOtpError("OTP has expired. Please request a new one.");
          showError("OTP expired. Please request a new OTP.");
        } else if (
          errorMessage.includes("attempts") ||
          errorData.tooManyAttempts
        ) {
          setOtpError("Too many failed attempts. Please request a new OTP.");
          showError("Too many failed attempts. Please request a new OTP.");
        } else if (
          errorMessage.includes("Invalid OTP") ||
          errorData.invalidOtp
        ) {
          const attemptsLeft = errorData.attemptsLeft || 3;
          setOtpError(`Invalid OTP. ${attemptsLeft} attempts remaining.`);
          showError(`Invalid OTP. ${attemptsLeft} attempts remaining.`);
        } else {
          setOtpError(
            errorMessage || "Invalid OTP. Please check the code and try again."
          );
          showError(
            errorMessage || "Invalid OTP. Please check the code and try again."
          );
        }
      } else if (error.code === "ECONNREFUSED") {
        showError(
          "Cannot connect to server. Please check if backend is running."
        );
      } else {
        showError("Verification failed. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      setOtpError(""); // Clear errors when resending

      const response = await axios.post(
        "http://localhost:5000/api/otp/resend-otp",
        { email: formData.email }
      );

      if (response.data.success) {
        setOtpTimer(60);
        setOtp(["", "", "", "", "", ""]);

        // ✅ AUTO-FILL NEW OTP FOR DEVELOPMENT
        if (response.data.otp) {
          const otpArray = response.data.otp.split("");
          setOtp(otpArray);
          console.log("🔢 Auto-filled new OTP:", response.data.otp);
          showSuccess(`New OTP ${response.data.otp} auto-filled!`);
        } else {
          showSuccess("New OTP sent to your email!");
        }
      }
    } catch (error) {
      console.error("Resend OTP failed:", error);
      showError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const OTPComponent = (
    <OTPInput
      otp={otp}
      setOtp={setOtp}
      isLoading={isVerifying}
      error={otpError}
    />
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-0 m-0 overflow-hidden font-sans">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border border-gray-200 box-border">
        <AuthHeader
          title="Create Account"
          subtitle="Join us and start your journey"
        />

        <SocialAuthButtons
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
          onLinkedInLogin={handleLinkedInLogin}
          isLoading={isLoading}
        />

        <form
          onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP}
          className="space-y-4"
        >
          <FormFields
            formData={formData}
            errors={errors}
            showErrors={showErrors}
            showPassword={showPassword}
            otpSent={otpSent}
            onFieldChange={handleChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            OTPComponent={OTPComponent}
          />

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

        <AuthFooter
          text="Already have an account?"
          linkText="Sign In"
          linkTo="/signin"
        />
      </div>
    </div>
  );
};

export default RegisterForm;
