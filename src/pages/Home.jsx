import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import SpaceDashboardRounded from "@mui/icons-material/SpaceDashboardRounded";
import AccountBoxRounded from "@mui/icons-material/AccountBoxRounded";
import DvrRounded from "@mui/icons-material/DvrRounded";
import CurrencyExchangeRounded from "@mui/icons-material/CurrencyExchangeRounded";
import CalculateRounded from "@mui/icons-material/CalculateRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import TrendingUp from "@mui/icons-material/TrendingUp";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  CssBaseline,
  Tooltip,
  Chip,
  Button,
} from "@mui/material";
import { useColorMode } from "../context/ThemeContext";

const DRAWER_WIDTH = 250;

// Market indices data for ticker
const MARKET_INDICES = [
  { name: "NIFTY 50", value: "22,145.00", change: 1.2 },
  { name: "SENSEX", value: "73,850.00", change: 1.1 },
  { name: "BANK NIFTY", value: "46,780.00", change: -0.5 },
  { name: "RELIANCE", value: "2,950.00", change: 1.5 },
  { name: "HDFC BANK", value: "1,450.00", change: -0.8 },
  { name: "TCS", value: "4,100.00", change: 0.9 },
  { name: "INFOSYS", value: "1,650.00", change: 1.1 },
  { name: "ICICI BANK", value: "1,080.00", change: 2.1 },
  { name: "SBI", value: "750.00", change: 0.4 },
  { name: "NIFTY IT", value: "37,200.00", change: 2.4 },
];

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, toggleColorMode } = useColorMode();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    {
      text: "Dashboard",
      path: "/home/dashboard",
      icon: <SpaceDashboardRounded />,
    },
    { text: "Watchlist", path: "/home/watchlist", icon: <DvrRounded /> },
    {
      text: "Portfolio",
      path: "/home/portfolio",
      icon: <CurrencyExchangeRounded />,
    },
    {
      text: "Calculators",
      path: "/home/calculator",
      icon: <CalculateRounded />,
    },
    { text: "Profile", path: "/home/profile", icon: <AccountBoxRounded /> },
  ];

  const handleDrawerToggle = () => setOpen(!open);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />

      {/* --- TOP APP BAR --- */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(15, 23, 42, 0.85)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          {/* Left: Hamburger & Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: "10px",
                border: "1px solid",
                borderColor: "divider",
                p: 0.8,
              }}
            >
              <MenuOutlined fontSize="small" />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                cursor: "pointer",
              }}
              onClick={() => navigate("/home/dashboard")}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "9px",
                  background: "#3B82F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp sx={{ color: "#ffffff", fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  fontSize: "1.2rem",
                  color: "#ffffff",
                }}
              >
                WealthNova
              </Typography>
            </Box>

            <Chip
              size="small"
              label="🟢 NSE Live"
              sx={{
                ml: 1.5,
                display: { xs: "none", md: "inline-flex" },
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(16, 185, 129, 0.12)"
                    : "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            />
          </Box>

          {/* Right: Logout, Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              size="small"
              onClick={handleLogout}
              sx={{
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                bgcolor: "rgba(239, 68, 68, 0.1)",
                textTransform: "none",
                borderRadius: "8px",
                fontSize: "0.76rem",
                py: 0.5,
                px: 1.2,
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.2)", borderColor: "rgba(239, 68, 68, 0.5)" },
              }}
            >
              Logout
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  borderRadius: "14px",
                  minWidth: 180,
                  border: "1px solid",
                  borderColor: "divider",
                  backdropFilter: "blur(12px)",
                  bgcolor: "background.paper",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/home/profile");
                }}
                sx={{ py: 1.2, gap: 1.5 }}
              >
                <AccountBoxRounded
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="body2" fontWeight={600}>
                  My Profile
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- MARKET TICKER MARQUEE --- */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          height: 28,
          overflow: "hidden",
          bgcolor: "#000000",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "max-content",
            animation: "marquee 45s linear infinite",
            "@keyframes marquee": {
              "0%": { transform: "translateX(0%)" },
              "100%": { transform: "translateX(-50%)" },
            },
            "&:hover": { animationPlayState: "paused" },
          }}
        >
          {[...MARKET_INDICES, ...MARKET_INDICES].map((m, i) => {
            const isPositive = m.change >= 0;
            return (
              <Box
                key={`${m.name}-${i}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  pr: 4,
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "text.primary",
                  }}
                >
                  {m.name}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  {m.value}
                </Typography>
                <Box
                  sx={{
                    px: 0.8,
                    py: 0.1,
                    borderRadius: "3px",
                    bgcolor: isPositive
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(239, 68, 68, 0.15)",
                    color: isPositive ? "#10b981" : "#ef4444",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.2,
                  }}
                >
                  {isPositive ? "+" : ""}{m.change}%
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* --- COLLAPSIBLE SIDEBAR DRAWER --- */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "#0a0f1d" : "#ffffff",
            borderColor: "divider",
            borderRight: "1px solid",
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 2,
            marginTop:2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                mb: 1,
                display: "block",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "text.secondary",
                fontSize: "0.7rem",
              }}
            >
              Main Navigation
            </Typography>

            <List sx={{ gap: 0.5, display: "flex", flexDirection: "column" }}>
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/home/dashboard" &&
                    location.pathname === "/home");

                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: "10px",
                        py: 1.2,
                        px: 2,
                        transition: "all 0.2s ease-in-out",
                        "&.Mui-selected": {
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(56, 189, 248, 0.15)"
                              : "rgba(2, 132, 199, 0.1)",
                          color: "primary.main",
                          "& .MuiListItemIcon-root": {
                            color: "primary.main",
                          },
                          fontWeight: 700,
                        },
                        "&:hover": {
                          bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 38,
                          color: isActive ? "primary.main" : "text.secondary",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: "0.9rem",
                          fontWeight: isActive ? 700 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>


        </Box>
      </Drawer>

      {/* --- MAIN CONTENT AREA WITH OUTLET --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3, // Increased padding for better spacing
          minHeight: "100vh",
          overflowX: "hidden",
          mt: "28px", // Space for ticker
        }}
      >
        <Toolbar />{" "}
        {/* Yeh sirf upar wale navbar (AppBar) ke barabar space chhodne ke liye hai */}
        <Box
          sx={{
            color: "text.primary",
            minHeight: "calc(100vh - 92px)", // Adjusted for ticker height (64px + 28px)
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
