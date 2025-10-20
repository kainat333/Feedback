import React, { useState } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card, CardContent } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password",
        { email }
      );

      if (res.data.success === false) {
        toast.error(res.data.message || "Something went wrong");
      } else {
        toast.success(res.data.message || "Reset link sent to your email");
        setLinkSent(true);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  const handleResend = () => {
    handleSubmit(new Event("submit"));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ boxShadow: 4 }}>
          <CardContent sx={{ m: 3 }}>
            <Avatar sx={{ m: "auto", bgcolor: "black" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 2 }}>
              Forgot Password
            </Typography>

            {!linkSent ? (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, bgcolor: "black", color: "white" }}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Box>
            ) : (
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, textAlign: "center", color: "gray" }}
                >
                  A password reset link has been sent to{" "}
                  <strong>{email}</strong>. Please check your inbox.
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mb: 1, bgcolor: "black", color: "white" }}
                  onClick={handleResend}
                >
                  Resend Link
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ borderColor: "black", color: "black" }}
                  onClick={() => navigate("/signin")}
                >
                  Back to Login
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
