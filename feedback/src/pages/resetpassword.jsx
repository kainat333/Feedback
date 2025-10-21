import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockResetIcon from "@mui/icons-material/LockReset";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card, CardContent } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("id");
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({
    newpassword: "",
    confirmpassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newpassword = data.get("newpassword");
    const confirmpassword = data.get("confirmpassword");

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const newErrors = { newpassword: "", confirmpassword: "" };

    if (!passwordPattern.test(newpassword)) {
      newErrors.newpassword =
        "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
    }

    if (newpassword !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (newErrors.newpassword || newErrors.confirmpassword) return;

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/resetPassword`;
      const res = await axios.post(url, {
        password: newpassword,
        token,
        userId,
      });

      if (res.data.success === false) {
        toast.error(res.data.message, {
          autoClose: 5000,
          position: "top-right",
        });
      } else {
        toast.success(res.data.message, {
          autoClose: 5000,
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/feedback");
        }, 2000);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
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
              <LockResetIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ mt: 2, mb: 1, textAlign: "center" }}
            >
              Reset Your Password
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 3, textAlign: "center", color: "gray" }}
            >
              Enter your new password below to complete the reset process.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                type={showPassword ? "text" : "password"}
                name="newpassword"
                id="newpassword"
                label="New Password"
                autoFocus
                error={!!errors.newpassword}
                helperText={errors.newpassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer", color: "gray" }}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                type={showConfirm ? "text" : "password"}
                name="confirmpassword"
                id="confirmpassword"
                label="Confirm Password"
                error={!!errors.confirmpassword}
                helperText={errors.confirmpassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <span
                        onClick={() => setShowConfirm(!showConfirm)}
                        style={{ cursor: "pointer", color: "gray" }}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "black", color: "white" }}
              >
                Submit
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ResetPassword;
