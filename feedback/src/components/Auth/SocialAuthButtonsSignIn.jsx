import React from "react";
import GoogleAuthButton from "./GoogleAuthButton";

const SocialAuthButtonsSignIn = ({
  onGoogleSuccess,
  onGoogleError,
  onLinkedInLogin,
  isLoading,
}) => {
  return (
    <div className="mb-6">
      <div className="space-y-3 mb-4">
        {/* Google Button */}
        <GoogleAuthButton
          onSuccess={onGoogleSuccess}
          onError={onGoogleError}
          text="signin_with"
        />

        {/* LinkedIn Button */}
        <button
          onClick={onLinkedInLogin}
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
  );
};

export default SocialAuthButtonsSignIn;
