const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const getAccessToken = async (code) => {
  try {
    console.log("🔐 Getting LinkedIn access token...");

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      client_id: process.env.VITE_LINKEDIN_CLIENT_ID,
      client_secret: process.env.VITE_LINKEDIN_CLIENT_SECRET,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
    });

    const response = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(" Access token received successfully");
    return response.data.access_token;
  } catch (error) {
    console.error(
      " Error getting access token:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to get access token: ${
        error.response?.data?.error_description || error.message
      }`
    );
  }
};

const LinkedCallBack = async (req, res) => {
  try {
    console.log(" LinkedIn callback received:", req.query);

    const { code, error, error_description } = req.query;

    // Check for LinkedIn OAuth errors
    if (error) {
      console.error(" LinkedIn OAuth error:", error, error_description);
      return res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=linkedin_${error}`
      );
    }

    if (!code) {
      console.error(" Authorization code missing");
      return res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=authorization_code_missing`
      );
    }

    const accessToken = await getAccessToken(code);

    // Get user info from OpenID endpoint
    console.log("👤 Fetching LinkedIn user info via OpenID Connect...");
    const userInfoRes = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(
      " OpenID Connect response:",
      JSON.stringify(userInfoRes.data, null, 2)
    );

    const userData = userInfoRes.data;
    const linkedinId = userData.sub;
    const name = userData.name || "LinkedIn User";
    const email = userData.email;

    if (!email) {
      console.error(" No email found in LinkedIn OpenID response");
      return res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=email_not_found`
      );
    }

    console.log("✅ Extracted user data:", { name, email, linkedinId });

    // Find or create user in database
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        linkedinId,
        isVerified: true,
      });
      await user.save();
      console.log("✅ New user created:", email);
    } else {
      if (!user.linkedinId) {
        user.linkedinId = linkedinId;
        await user.save();
      }
      console.log("✅ Existing user found:", email);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ FIXED: Create user data object for frontend
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      linkedinId: user.linkedinId,
    };

    console.log(" LinkedIn login successful for:", email);

    // ✅ FIXED: Redirect with BOTH token and user data
    return res.redirect(
      `${
        process.env.FRONTEND_URL
      }/feedback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(userResponse)
      )}&replaceHistory=true`
    );
  } catch (error) {
    console.error(
      " LinkedIn OAuth callback error:",
      error.response?.data || error.message || error
    );

    let errorType = "authentication_failed";
    if (error.response?.status === 403) {
      errorType = "insufficient_permissions";
    } else if (error.response?.status === 401) {
      errorType = "invalid_token";
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/signin?error=linkedin_${errorType}`
    );
  }
};

module.exports = { LinkedCallBack };
