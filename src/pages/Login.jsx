import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
} from "@mui/material";


import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

//------------- Login -----------------------------------
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  //handleChange function to updaet the state when user types in input
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    // console.log(e.target.value)
    // console.log(e.target.name)
  };

  //action="handleSubmit" to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Data:", loginData);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3002/api/auth/login",
        loginData,
      );
      console.log("Response:", response.data);

      const token = response.data.token;

      localStorage.setItem("token", token);
      console.log("Login successfully");
      navigate("/home");
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
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
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username or Email Address"
              name="login"
              // type="email"
              autoFocus
              value={loginData.login}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={loginData.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              // onClick={() => navigate("/home")}
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 1.5 }}
            >
            
              {loading ? "Loggin in... " : "Login"}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/signup"
                variant="body2"
                underline="hover"
                sx={{ fontWeight: "bold" }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
