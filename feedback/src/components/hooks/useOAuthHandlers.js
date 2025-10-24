import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const useOAuthHandlers = (login) => {
  const navigate = useNavigate();

  // Handle LinkedIn login
  const handleLinkedInLogin = async () => {
    console.log("🚀 Starting LinkedIn OAuth...");

    try {
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
        errorMessage = "You canceled the LinkedIn sign-in.";
        toast.info(errorMessage);

        setTimeout(() => {
          window.location.href = "/signin";
        }, 1500);

        window.history.replaceState({}, "", window.location.pathname);
        return;
      } else if (error.includes("invalid_token")) {
        errorMessage = "Authentication token invalid. Please try again.";
      }

      toast.error(errorMessage);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return {
    handleLinkedInLogin,
  };
};

export default useOAuthHandlers;
