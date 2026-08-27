import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined } from "@mui/icons-material";

// -----------------
// import profile from "./Profile"
//-----icons ----------
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import DvrRoundedIcon from '@mui/icons-material/DvrRounded';
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';
// --------------------
import {
  Box,
  Drawer,
  // TextField,
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
} from "@mui/material";
import { useColorMode } from "../context/ThemeContext";

const DRAWER_WIDTH = 240;

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, toggleColorMode } = useColorMode();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: "Dashboard", path: "/home/dashboard", icon: <SpaceDashboardIcon /> },
    { text: "Profile", path: "/home/profile", icon: <AccountBoxRoundedIcon />},
    { text: "Watchlist", path: "/home/watchlist", icon: <DvrRoundedIcon /> },
    { text: "Portfolio", path: "/home/portfolio", icon: <CurrencyExchangeRoundedIcon /> },
    { text: "Calculator", path: "/home/calculator", icon: <CalculateRoundedIcon /> },
  ];

  const handleDrawerToggle = () => setOpen(!open);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    // localStorage.removeItem("token");
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
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, fontSize: "1.5rem" }}
            >
              <MenuOutlined />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: "bold", color:"#9dcbf9"}}
            >
              WealthNova Workspace

             

            </Typography>
             
          </Box>
          {/* <TextField label="fullWidth" id="fullWidth" /> */}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === "dark" ? "☀️" : "🌙"}
            </IconButton>

            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                M
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate("/home/profile");
                }}
              >
                Profile 
              </MenuItem>

              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                Logout
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
            bgcolor: "background.paper",
            borderColor: "divider",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                style={{
                  padding: "2px 8px 2px 8px",
                  borderRadius: 100,
                }}
              >
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    "&.Mui-selected": {
                      borderRadius: 10,
                    },
                  }}
                >
                  <ListItemIcon sx={{ fontSize: "1.2rem", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mt: "auto" }} />

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon sx={{ fontSize: "1.2rem", minWidth: 40 }}>
                  ➜]
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "error.main" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* --- MAIN CONTENT AREA WITH OUTLET --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default", // Automatic page background
          p: 3,
          minHeight: "100vh",
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />
        <Box
          sx={{
            bgcolor: "background.paper", // Automatic Light/Dark card background
            color: "text.primary",
            p: 3,
            borderRadius: 2,
            border: 1,
            borderColor: "divider", // Clean separation for both themes
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
