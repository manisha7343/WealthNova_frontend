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
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

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
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #041125 inset !important",
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
      const apiBase = import.meta.env.VITE_API_BASE_URL || "https://wealthnova-backend.onrender.com";
      const response = await axios.post(
        `${apiBase}/api/auth/login`,
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
            {/* Logo - same as landing page (blue box, white arrow, no shadow) */}
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
                  borderRadius: "10px",
                  bgcolor: "#3B82F6",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <TrendingUpRounded sx={{ color: "#ffffff", fontSize: 26 }} />
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
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#e1d7d7",
                mb: 3,
                textAlign: "center",
                opacity: 0.85,
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

              {/* Forgot password - display only, does nothing for now */}
              {/* <Box sx={{ textAlign: "right", mt: 0.5 }}>
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={(e) => e.preventDefault()}
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#3B82F6",
                    "&:hover": { color: "#60a5fa" },
                  }}
                >
                  Forgot password?
                </Link>
              </Box> */}

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2.5,
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
                    <span>Signing in...</span>
                  </Box>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* ERROR ALERT DISPLAY */}
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

              {/* Sign Up Link */}
              <Box sx={{ textAlign: "center", mt: 1 }}>
                <Typography variant="body2" sx={{ color: "#e1d7d7" }}>
                  Don't have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/signup"
                    underline="none"
                    sx={{
                      fontWeight: 700,
                      color: "#3B82F6",
                      transition: "color 0.2s",
                      "&:hover": { color: "#60a5fa", textDecoration: "underline" },
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
