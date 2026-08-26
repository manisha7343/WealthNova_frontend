import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import {  useNavigate } from "react-router-dom";

const LandingPage = () => {
      const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7ff 0%, #eef2ff 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 6,
            flexDirection: { xs: "column", md: "row" },
            py: 8,
          }}
        >
          {/* LEFT SIDE - Hero Content */}
          <Box sx={{ flex: 1 }}>
            {/* App Name */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#4f46e5",
                mb: 3,
                letterSpacing: 1,
              }}
            >
              WealthNova
            </Typography>

            {/* Main Heading */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.1,
                mb: 3,
                fontSize: { xs: "2.5rem", md: "4rem" },
              }}
            >
              Manage Your Money.
              <br />
              <Box component="span" sx={{ color: "#4f46e5" }}>
                Grow Your Wealth.
              </Box>
            </Typography>

            {/* Description */}
            <Typography
              variant="h6"
              sx={{
                color: "#6b7280",
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: 550,
                mb: 4,
              }}
            >
              WealthNova helps you understand your finances, analyze
              investments, and make smarter financial decisions.
            </Typography>

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: "#4f46e5",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#4338ca",
                  },
                }}
              >
                Login
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/signup")}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "#4f46e5",
                  color: "#4f46e5",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#4338ca",
                    backgroundColor: "#eef2ff",
                  },
                }}
              >
                Create Account
              </Button>
            </Box>
          </Box>

          {/* RIGHT SIDE - Simple Wealth Card */}
          <Box sx={{ flex: 1, width: "100%", maxWidth: 450 }}>
            <Paper
              elevation={8}
              sx={{
                p: 4,
                borderRadius: 4,
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: "#111827",
                }}
              >
                Your Wealth Dashboard
              </Typography>

              <Typography
                sx={{
                  color: "#6b7280",
                  mb: 4,
                }}
              >
                Track your financial growth
              </Typography>

              {/* Balance */}
              <Box
                sx={{
                  backgroundColor: "#f5f7ff",
                  borderRadius: 3,
                  p: 3,
                  mb: 3,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", mb: 1 }}
                >
                  Total Portfolio
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  ₹2,45,000
                </Typography>

                <Typography
                  sx={{
                    color: "#16a34a",
                    mt: 1,
                    fontWeight: 600,
                  }}
                >
                  +12.8% this year
                </Typography>
              </Box>

              {/* Features */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280" }}
                  >
                    Investments
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    ₹1.8L
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#6b7280" }}
                  >
                    Savings
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    ₹65K
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;