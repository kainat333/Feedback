// src/api/authHandlers.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// Google Login
export const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/google`, {
      credential: credentialResponse.credential,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// LinkedIn Login
export const handleLinkedInRedirect = () => {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;
  const scope = "openid profile email";
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  window.location.href = authUrl;
};

// OTP Verification
export const sendOTP = async (email) => {
  return axios.post(`${API_BASE}/auth/send-otp`, { email });
};

export const verifyOTP = async (email, otp) => {
  return axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
};
