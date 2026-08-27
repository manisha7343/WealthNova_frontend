import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import {
  PhotoCamera,
  Edit,
  Save,
  Cancel,
  LockReset,
  DeleteForever,
  Person,
  Email,
  Phone,
} from "@mui/icons-material";

// Backend API Base URLs configuration
const API_URL = "http://localhost:3002/api/user";
// Custom Helper Chip Component
const ChipTag = ({ label }) => (
  <Box
    sx={{
      display: "inline-block",
      bgcolor: "primary.light",
      color: "primary.contrastText",
      px: 1.5,
      py: 0.5,
      borderRadius: 10,
      fontSize: "0.75rem",
      fontWeight: "bold",
    }}
  >
    {label}
  </Box>
);

function Profile() {
  // --- States ---
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Trader",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", phone: "" });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Delete Dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Authorization Header Utility
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // --- 1. GET PROFILE DATA ---
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/getProfile`,
        getAuthHeader()
      );
      const data = response.data?.user || response.data;
      setUser(data);
      setEditFormData({ name: data.name || "", phone: data.phone || "" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load profile details.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 2. UPDATE PROFILE DETAILS ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.put(
        `${API_URL}/updateProfile`,
        editFormData,
        getAuthHeader()
      );
      setUser((prev) => ({ ...prev, ...editFormData }));
      setIsEditing(false);
      setMessage({
        type: "success",
        text: response.data?.message || "Profile updated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // --- 3. UPLOAD PROFILE PICTURE ---
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setActionLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.put(
        `${API_URL}/uploadProfilePic`, // ya upload avatar endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser((prev) => ({
        ...prev,
        avatar: response.data.avatarUrl || URL.createObjectURL(file),
      }));
      setMessage({
        type: "success",
        text: "Profile picture updated successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to upload image.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // --- 4. CHANGE PASSWORD ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    setActionLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/changePassword`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        getAuthHeader()
      );

      setMessage({
        type: "success",
        text: response.data?.message || "Password changed successfully!",
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // --- 5. DELETE PROFILE ---
  const handleDeleteAccount = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}/deleteAccount`, getAuthHeader());
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete account.",
      });
      setOpenDeleteDialog(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: "0 auto", p: 1 }}>
      {/* Alert Notification */}
      {message.text && (
        <Alert
          severity={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
          sx={{ mb: 3 }}
        >
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Side: Profile Summary Card */}
        <Grid xs={12} md={4}>
          <Card
            elevation={2}
            sx={{ borderRadius: 3, textAlign: "center", p: 2 }}
          >
            <CardContent>
              <Box
                sx={{ position: "relative", display: "inline-block", mb: 2 }}
              >
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 110,
                    height: 110,
                    margin: "0 auto",
                    bgcolor: "primary.main",
                    fontSize: "2.5rem",
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Avatar>

                {/* Upload Photo Badge Button */}
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="icon-button-file"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "background.paper",
                      boxShadow: 2,
                      "&:hover": { bgcolor: "background.paper" },
                    }}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </label>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {user.name || "User Name"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {user.email}
              </Typography>

              <ChipTag label={user.role || "Stock Trader"} />

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5} sx={{ textAlign: "left" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person color="action" fontSize="small" />
                  <Typography variant="body2">{user.name}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email color="action" fontSize="small" />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone color="action" fontSize="small" />
                  <Typography variant="body2">
                    {user.phone || "Not Added"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Edit Profile & Security Options */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* 1. EDIT PROFILE SECTION */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Personal Information
                </Typography>
                {!isEditing && (
                  <Button
                    startIcon={<Edit />}
                    variant="outlined"
                    size="small"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              <Box component="form" onSubmit={handleUpdateProfile}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      disabled={!isEditing}
                      value={isEditing ? editFormData.name : user.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      disabled={!isEditing}
                      value={isEditing ? editFormData.phone : user.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      disabled
                      value={user.email}
                      helperText="Email address cannot be changed."
                    />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      startIcon={<Cancel />}
                      color="inherit"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={actionLoading}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* 2. CHANGE PASSWORD SECTION */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LockReset color="primary" /> Security & Password
              </Typography>

              <Box component="form" onSubmit={handleChangePassword}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      required
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={actionLoading}
                  >
                    Update Password
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* 3. DANGER ZONE (DELETE ACCOUNT) */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "error.light",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "error.main",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <DeleteForever /> Danger Zone
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Once you delete your profile, all trading watchlist data and
                account history will be permanently deleted.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete Profile
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Confirmation Modal for Delete Account */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
          Delete Account Permanently?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kya aap sure hain? Ye step reverse nahi ho sakta. Aapka saara
            profile data erase ho jayega.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
