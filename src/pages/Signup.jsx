import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  Alert,
} from "@mui/material";

import axios from "axios";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate;
  const [error, setError] = useState("");
  const [signupData, setSignupData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    country: "",
  });

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //----------------- validations -----------------------------------
    const { fullName, userName, email, password } = signupData;

    if (!fullName || !userName || !email || !password) {
      setError("All fields are required!");
      return;
    }

    if (fullName.trim().length < 2 || fullName.trim().length > 40) {
      setError("Full name must be between 2 and 40 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      );
      return;
    }
    // -----------------------------------------------------------------------

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3002/api/auth/register",
        signupData,
      );
      console.log("Response Data:", response.data);

      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Invalid Creadentials");
    } finally {
      setLoading(false);
    }

    console.log("Signup Data:", signupData);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
          }}
        >
          {/* Heading */}

          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: 1,
            }}
          >
            Create Account
          </Typography>

          {/* <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >

           WealthNova 
          </Typography> */}

          {/* <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
          _____________________________
          </Typography> */}

          {/* Form ------------------------------------------*/}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            {/* Full Name */}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              name="fullName"
              value={signupData.fullName}
              onChange={handleChange}
              autoFocus
            />

            {/* Username */}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="userName"
              value={signupData.userName}
              onChange={handleChange}
            />

            {/* Email */}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={signupData.email}
              onChange={handleChange}
            />

            {/* Password */}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={signupData.password}
              onChange={handleChange}
            />

            {/* Signup Button */}

            <Button
              type="submit"
              fullWidth
              // onClick={() => navigate("/home")}
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 1.5 }}
            >
              {loading ? "SigUP ..." : "sigUp"}
            </Button>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  color: "red",
                  backgroundColor: "black Transperant",
                  border: "1px solid red",
                }}
              >
                {error}
              </Alert>
            )}

            {/* Login */}

            <Grid container sx={{ mt: 1, justifyContent: "center" }}>
              <Grid>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    underline="hover"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    Login
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
