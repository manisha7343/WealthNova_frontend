import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  IconButton,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PersonRounded from "@mui/icons-material/PersonRounded";
import AlternateEmailRounded from "@mui/icons-material/AlternateEmailRounded";
import EmailRounded from "@mui/icons-material/EmailRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import PublicRounded from "@mui/icons-material/PublicRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import ErrorRounded from "@mui/icons-material/ErrorRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import axios from "axios";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3B82F6",
      dark: "#00245b",
    },
    background: {
      default: "#041125",
      paper: "#041125",
    },
    text: {
      primary: "#ffffff",
      secondary: "#e1d7d7",
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
});

const inputFieldStyles = {
  "& .MuiInputBase-root": {
    color: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "10px",
    transition: "all 0.25s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
    "&::placeholder": {
      color: "rgba(225, 215, 215, 0.6)",
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#e1d7d7",
    "&.Mui-focused": {
      color: "#3B82F6",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(225, 215, 215, 0.3)",
    transition: "border-color 0.2s ease-in-out",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(59, 130, 246, 0.6)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3B82F6",
    borderWidth: "1.5px",
  },
  "& .MuiSelect-icon": {
    color: "#e1d7d7",
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #041125 inset !important",
    WebkitTextFillColor: "#ffffff !important",
  },
};

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    country: "India",
  });

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const { fullName, userName, email, password, country } = signupData;

    if (!fullName?.trim() || !userName?.trim() || !email?.trim() || !password || !country) {
      setError("All fields are required!");
      return;
    }

    if (fullName.trim().length < 2 || fullName.trim().length > 40) {
      setError("Full name must be between 2 and 40 characters.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(fullName.trim())) {
      setError("Full name can contain only letters and spaces.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userName.trim())) {
      setError("Username can contain only letters, numbers, and underscore.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address!");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long with uppercase, lowercase, number, and special character (@$!%*?&)."
      );
      return;
    }

    try {
      setLoading(true);
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";
      const response = await axios.post(
        `${apiBase}/api/auth/register`,
        signupData
      );

      if (response.data.success) {
        setSuccessMsg("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      console.error("Signup error:", err);
      const serverMsg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(". ")
          : null) ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Please check your inputs and try again.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #041125 0%, #00245b 100%)",
          py: 4,
          px: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            top: "-5%",
            left: "-5%",
            filter: "blur(40px)",
            animation: "pulseOrb 8s ease-in-out infinite alternate",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 36, 91, 0.4) 0%, transparent 70%)",
            bottom: "-5%",
            right: "-5%",
            filter: "blur(40px)",
            animation: "pulseOrb 10s ease-in-out infinite alternate-reverse",
            pointerEvents: "none",
          },
          "@keyframes pulseOrb": {
            "0%": { transform: "translate(0, 0) scale(1)" },
            "100%": { transform: "translate(20px, 30px) scale(1.1)" },
          },
          "@keyframes cardEnter": {
            from: { opacity: 0, transform: "translateY(20px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes shake": {
            "0%, 100%": { transform: "translateX(0)" },
            "20%, 60%": { transform: "translateX(-6px)" },
            "40%, 80%": { transform: "translateX(6px)" },
          },
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4.5 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              borderRadius: "16px",
              backgroundColor: "rgba(4, 17, 37, 0.75)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(225, 215, 215, 0.15)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.12)",
              animation: "cardEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Exact Landing Page Matched Logo */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                mb: 1.5,
                cursor: "pointer",
                textDecoration: "none",
              }}
              onClick={() => navigate("/")}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "#00b0ff",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 4px 12px rgba(0, 176, 255, 0.35)",
                  flexShrink: 0,
                }}
              >
                <TrendingUpRounded sx={{ color: "#041125", fontSize: 26 }} />
              </Box>
              <Typography
                component="span"
                sx={{
                  fontWeight: 800,
                  fontSize: "1.35rem",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                WealthNova
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#ffffff",
                mt: 1,
                mb: 0.5,
              }}
            >
              Create Your Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#e1d7d7",
                mb: 2,
                textAlign: "center",
                opacity: 0.85,
              }}
            >
              Start tracking your stocks and managing your wealth
            </Typography>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: "100%" }}
            >
              {/* Full Name */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="fullName"
                autoComplete="name"
                value={signupData.fullName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputFieldStyles}
              />

              {/* Username */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="userName"
                autoComplete="username"
                value={signupData.userName}
                onChange={handleChange}
                placeholder="e.g. rahul_invests"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmailRounded sx={{ color: "#94a3b8", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputFieldStyles}
              />

              {/* Email */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={signupData.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputFieldStyles}
              />

              {/* Password */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={signupData.password}
                onChange={handleChange}
                placeholder="Min. 8 chars (A-Z, 0-9, @#$)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94a3b8" }}
                      >
                        {showPassword ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputFieldStyles}
              />

              {/* Country */}
              <FormControl fullWidth margin="normal" sx={inputFieldStyles}>
                <InputLabel id="country-label" sx={{ color: "#e1d7d7", "&.Mui-focused": { color: "#3B82F6" } }}>Country</InputLabel>
                <Select
                  labelId="country-label"
                  id="country-select"
                  name="country"
                  value={signupData.country}
                  label="Country"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <PublicRounded sx={{ color: "#e1d7d7", fontSize: 20, ml: 1 }} />
                    </InputAdornment>
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "#041125",
                        border: "1px solid rgba(225, 215, 215, 0.2)",
                        color: "#ffffff",
                        "& .MuiMenuItem-root": {
                          color: "#e1d7d7",
                          "&:hover": {
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(59, 130, 246, 0.35)",
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="United States">United States</MenuItem>
                  <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                  <MenuItem value="Australia">Australia</MenuItem>
                  <MenuItem value="Singapore">Singapore</MenuItem>
                  <MenuItem value="UAE">UAE</MenuItem>
                  <MenuItem value="Germany">Germany</MenuItem>
                </Select>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.4,
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.3px",
                  bgcolor: "#3B82F6",
                  color: "#ffffff",
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "#2563EB",
                    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.5)",
                    transform: "translateY(-1px)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#3B82F6",
                    color: "#ffffff",
                    opacity: 0.7,
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Creating Account...</span>
                  </Box>
                ) : (
                  "Create WealthNova Account"
                )}
              </Button>

              {/* ERROR ALERT DISPLAY (Prominent, High-Contrast, Animated) */}
              <Collapse in={Boolean(error)}>
                <Alert
                  severity="error"
                  icon={<ErrorRounded sx={{ color: "#f43f5e" }} />}
                  onClose={() => setError("")}
                  sx={{
                    mb: 2.5,
                    color: "#fecdd3",
                    backgroundColor: "rgba(225, 29, 72, 0.15)",
                    border: "1px solid rgba(244, 63, 94, 0.4)",
                    borderRadius: "12px",
                    fontWeight: 500,
                    animation: "shake 0.4s ease-in-out",
                    "& .MuiAlert-icon": {
                      alignItems: "center",
                    },
                    "& .MuiAlert-message": {
                      fontSize: "0.9rem",
                    },
                  }}
                >
                  {error}
                </Alert>
              </Collapse>

              {/* SUCCESS ALERT DISPLAY */}
              <Collapse in={Boolean(successMsg)}>
                <Alert
                  severity="success"
                  icon={<CheckCircleRounded sx={{ color: "#10b981" }} />}
                  sx={{
                    mb: 2.5,
                    color: "#a7f3d0",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.4)",
                    borderRadius: "12px",
                    fontWeight: 500,
                  }}
                >
                  {successMsg}
                </Alert>
              </Collapse>

              {/* Back to Login link */}
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography variant="body2" sx={{ color: "#e1d7d7" }}>
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    underline="none"
                    sx={{
                      fontWeight: 700,
                      color: "#3B82F6",
                      transition: "color 0.2s",
                      "&:hover": { color: "#60a5fa", textDecoration: "underline" },
                    }}
                  >
                    Log In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
