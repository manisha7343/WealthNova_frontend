import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
} from "@mui/material";

import axios from "axios"
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Signup = () => {
  const [loading, setLoading] = (false);
  const navigate = useNavigate;
  const [signupData, setSignupData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    country:"",
  });

  const handleChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true)

    try{

     const response = await axios.post("http://localhost:3002/api/auth/register", signupData);
      console.log("Response Data:", response.data);

      if(response.data.success){
        navigate("/login")
      }
    }catch(error){
      console.log("Error:", error.response?.data || error.message ) ;
      alert(error.response?.data?.message || "Signup failed!");
    }finally{
      setLoading(false)
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
            sx={{
              mt: 1,
              width: "100%",

              "& .MuiInputBase-input": {
                color: "black",
              },
            }}
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
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: 1.5,
              }}
            >
              {loading ? "Signning in ..." : "signIn"}
            </Button>

            {/* Login */}

            <Grid
              container
              justifyContent="center"
              sx={{ mt: 1 }}
            >
              <Grid item>
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