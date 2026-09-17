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
      main: "#38bdf8",
      light: "#7dd3fc",
      dark: "#0284c7",
    },

    background: {
      default:
        "linear-gradient(135deg, #050811 0%, #6c1af1 50%, #061124 100%)",
      paper: "#0b1120",
    },

    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },

  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
});

const inputFieldStyles = {
  "& .MuiInputBase-root": {
    color: "#ffffff",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: "10px",
    transition: "all 0.25s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(30, 41, 59, 0.7)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(15, 23, 42, 0.85)",
      boxShadow: "0 0 0 2px rgba(56, 189, 248, 0.4)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#38bdf8",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(56, 189, 248, 0.5)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#38bdf8",
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #0f172a inset !important",
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
      const response = await axios.post(
        "http://localhost:3002/api/auth/register",
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
          background: "linear-gradient(135deg, #050811 0%, #6c1af1 50%, #061124 100%)",
          py: 4,
          px: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
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
              borderRadius: "20px",
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.08)",
              animation: "cardEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Brand Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUpRounded sx={{ color: "#ffffff", fontSize: 26 }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  background: "linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                WealthNova
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#f8fafc",
                mt: 1,
                mb: 0.5,
              }}
            >
              Create Your Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                mb: 2,
                textAlign: "center",
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
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  id="country-select"
                  name="country"
                  value={signupData.country}
                  label="Country"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <PublicRounded sx={{ color: "#94a3b8", fontSize: 20, ml: 1 }} />
                    </InputAdornment>
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "#0f172a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        "& .MuiMenuItem-root": {
                          color: "#f8fafc",
                          "&:hover": {
                            backgroundColor: "rgba(56, 189, 248, 0.15)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(2, 132, 199, 0.35)",
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
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)",
                  color: "#ffffff",
                  boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0369a1 0%, #1d4ed8 50%, #4338ca 100%)",
                    boxShadow: "0 15px 30px -5px rgba(37, 99, 235, 0.6)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "rgba(30, 41, 59, 0.6)",
                    color: "#64748b",
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
                    boxShadow: "0 4px 15px rgba(225, 29, 72, 0.2)",
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
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    underline="none"
                    sx={{
                      fontWeight: 700,
                      color: "#38bdf8",
                      transition: "color 0.2s",
                      "&:hover": { color: "#7dd3fc", textDecoration: "underline" },
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
