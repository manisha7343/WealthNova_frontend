import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  MenuOutlined,
  SpaceDashboardRounded,
  AccountBoxRounded,
  DvrRounded,
  CurrencyExchangeRounded,
  CalculateRounded,
  LogoutRounded,
  TrendingUp,
  DarkModeRounded,
  LightModeRounded,
  NotificationsNoneRounded,
} from "@mui/icons-material";
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
} from "@mui/material";
import { useColorMode } from "../context/ThemeContext";

const DRAWER_WIDTH = 250;

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, toggleColorMode } = useColorMode();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: "Dashboard", path: "/home/dashboard", icon: <SpaceDashboardRounded /> },
    { text: "Watchlist", path: "/home/watchlist", icon: <DvrRounded /> },
    { text: "Portfolio", path: "/home/portfolio", icon: <CurrencyExchangeRounded /> },
    { text: "Calculators", path: "/home/calculator", icon: <CalculateRounded /> },
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
                  background: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)",
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
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)"
                      : "linear-gradient(135deg, #0f172a 0%, #0284c7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
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

          {/* Right: Notification, Theme Toggle, Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Market Alerts">
              <IconButton
                size="small"
                color="inherit"
                sx={{
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: "divider",
                  p: 0.9,
                }}
              >
                <NotificationsNoneRounded fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={`Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`}>
              <IconButton
                onClick={toggleColorMode}
                size="small"
                color="inherit"
                sx={{
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: "divider",
                  p: 0.9,
                }}
              >
                {mode === "dark" ? (
                  <LightModeRounded fontSize="small" sx={{ color: "#fbbf24" }} />
                ) : (
                  <DarkModeRounded fontSize="small" sx={{ color: "#6366f1" }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Account menu">
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    color: "#ffffff",
                    width: 36,
                    height: 36,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    border: "2px solid rgba(56, 189, 248, 0.4)",
                  }}
                >
                  W
                </Avatar>
              </IconButton>
            </Tooltip>

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
                <AccountBoxRounded fontSize="small" sx={{ color: "primary.main" }} />
                <Typography variant="body2" fontWeight={600}>
                  My Profile
                </Typography>
              </MenuItem>

              <Divider sx={{ my: 0.8 }} />

              <MenuItem onClick={handleLogout} sx={{ py: 1.2, gap: 1.5, color: "error.main" }}>
                <LogoutRounded fontSize="small" />
                <Typography variant="body2" fontWeight={600}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

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
                  (item.path === "/home/dashboard" && location.pathname === "/home");

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

          {/* Bottom Logout Item */}
          <Box>
            <Divider sx={{ mb: 1.5 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: "10px",
                  py: 1.2,
                  px: 2,
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "rgba(244, 63, 94, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: "error.main" }}>
                  <LogoutRounded fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* --- MAIN CONTENT AREA WITH OUTLET --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: { xs: 2, sm: 3.5 },
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            color: "text.primary",
            minHeight: "calc(100vh - 120px)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
