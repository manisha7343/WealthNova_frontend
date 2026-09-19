import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AlternateEmailRounded from "@mui/icons-material/AlternateEmailRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import ErrorRounded from "@mui/icons-material/ErrorRounded";
// import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#38bdf8",
      light: "#7dd3fc",
      dark: "#0284c7",
    },
    background: {
      default: "#080c14",
      paper: "rgba(15, 23, 42, 0.75)",
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

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginData.login.trim() || !loginData.password) {
      setError("Please provide both email/username and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://wealthnova-backend.onrender.com/api/auth/login",
        loginData
      );

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      if (response.data.success) {
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(". ")
          : null) ||
        err.response?.data?.error ||
        err.message ||
        "Invalid credentials. Please verify your credentials and try again.";
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
            // background: "radial-gradient(circle, rgba(234, 242, 246, 0.99) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 70%)",
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
            // background: "radial-gradient(circle, rgba(129, 140, 248, 0.12) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 70%)",
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
                  // boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)",
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
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                mb: 3,
                textAlign: "center",
              }}
            >
              Enter your credentials to access your wealth portal
            </Typography>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth 
                label="Username or Email Address"
                name="login"
                autoComplete="username"
                autoFocus
                value={loginData.login}
                onChange={handleChange}
                placeholder="name@example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmailRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputFieldStyles}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="••••••••"
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

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.4,
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #4f46e5 50%, #4f46e5 100%)",
                  color: "#ffffff",
                  // boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0369a1 0%, #1d4ed8 50%, #4338ca 100%)",
                    // boxShadow: "0 15px 30px -5px rgba(37, 99, 235, 0.6)",
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
                    <span>Signing in...</span>
                  </Box>
                ) : (
                  "Sign In"
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
                    // boxShadow: "0 4px 15px rgba(225, 29, 72, 0.2)",
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

              {/* Sign Up Link */}
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  Don't have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/signup"
                    underline="none"
                    sx={{
                      fontWeight: 700,
                      color: "#38bdf8",
                      transition: "color 0.2s",
                      "&:hover": { color: "#7dd3fc", textDecoration: "underline" },
                    }}
                  >
                    Create Account
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

export default Login;
