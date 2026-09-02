import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  MenuItem,
  Grid,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Stack,
  Chip,
  InputAdornment,
  Skeleton,
  Tooltip,
} from "@mui/material";
import {
  PhotoCamera,
  Edit,
  Save,
  Close,
  LockReset,
  DeleteForever,
  Public,
  Visibility,
  VisibilityOff,
  Lock,
  Badge,
  AlternateEmail,
  WarningAmber,
} from "@mui/icons-material";
import axios from "axios";

// ---- axios instance (auto-attaches token, auto-logout on 401) ----
// ⚠️ Check this against your actual routes file. Your backend controller
// comments reference /api/users/uploadProfilePic (plural "users") — make
// sure BASE_URL below matches exactly, or every call will 404.
const BASE_URL = "http://localhost:3002/api/user";

const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ---- brand tokens (finance / trading feel — deep navy + brass gold) ----
const NAVY = "#59c0e6";
const NAVY_DARK = "#071427";
const GOLD = "#C9A227";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "United Arab Emirates",
  "Singapore", "Canada", "Australia", "Germany", "France", "Japan", "Other",
];

// Small reusable "read-only" field so locked fields look intentional,
// not just greyed-out disabled inputs.
const LockedField = ({ label, value, icon }) => (
  <TextField
    fullWidth
    label={label}
    value={value || "—"}
    disabled
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">{icon}</InputAdornment>
      ),
    }}
    sx={{
      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "rgba(245, 240, 240, 0.9)",
      },
    }}
  />
);

function Profile() {
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ fullName: "", country: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({ old: false, next: false, confirm: false });
  const [changingPassword, setChangingPassword] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState({ open: false, type: "success", text: "" });
  const notify = (type, text) => setToast({ open: true, type, text });

  // ---------------- 1. GET PROFILE ----------------
  const fetchProfile = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await axiosInstance.get("/getProfile");
      const data = res.data?.user || res.data;
      setUser(data);
      setEditFormData({ fullName: data.fullName || "", country: data.country || "" });
    } catch (err) {
      setLoadError(err.response?.data?.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- 2. UPDATE PROFILE (fullName + country only — that's all the backend accepts) ----------------
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await axiosInstance.put("/updateProfile", {
        fullName: editFormData.fullName,
        country: editFormData.country,
      });
      setUser((prev) => ({ ...prev, ...editFormData }));
      setIsEditing(false);
      notify("success", res.data?.message || "Profile updated successfully!");
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ---------------- 3. UPLOAD PROFILE PICTURE ----------------
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("error", "Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Image must be smaller than 5MB.");
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));

    // Field name MUST be "profilePic" — that's the key your multer
    // middleware reads with upload.single("profilePic") on the backend.
    const formData = new FormData();
    formData.append("profilePic", file);

    setUploadingAvatar(true);
    try {
      const res = await axiosInstance.put("/uploadProfilePic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      notify("success", res.data?.message || "Profile picture updated successfully!");
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to upload image.");
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ---------------- 4. CHANGE PASSWORD ----------------
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify("error", "New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      notify("error", "New password should be at least 8 characters.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await axiosInstance.put("/changePassword", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      notify("success", res.data?.message || "Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  // ---------------- 5. DELETE ACCOUNT ----------------
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete("/deleteAccount");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      notify("error", err.response?.data?.message || "Failed to delete account.");
      setDeleting(false);
    }
  };

  // ---------------- loading / error states ----------------
  if (loading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, md: 3 } }}>
        <Skeleton variant="rounded" height={160} sx={{ mb: 3, borderRadius: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 8, p: 2 }}>
        <Alert severity="error" variant="outlined">{loadError}</Alert>
        <Button sx={{ mt: 2 }} variant="contained" onClick={fetchProfile}>
          Try again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 5, md: 1 } }}>
      {/* -------- Hero banner + floating avatar -------- */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          height: 140,
          mb: 8,
          background: `linear-gradient(120deg, ${NAVY_DARK} 0%, ${NAVY} 55%, #04347d 100%)`,
          overflow: "visible",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: { xs: "50%", sm: 50 },
            bottom: -56,
            transform: { xs: "translateX(-50%)", sm: "none" },
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={avatarPreview || user.profilePic}
              sx={{
                width: 112,
                height: 112,
                border: "4px solid #ebdede",
                boxShadow: 3,
                bgcolor: GOLD,
                color: NAVY_DARK,
                fontSize: "2.25rem",
                fontWeight: 700,
              }}
            >
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Avatar>

            {uploadingAvatar && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  bgcolor: "rgba(0,0,0,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={28} sx={{ color: "#040303" }} />
              </Box>
            )}

            <input
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              type="file"
              onChange={handleAvatarChange}
            />
            <Tooltip title="Change photo">
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                sx={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  bgcolor: GOLD,
                  color: NAVY_DARK,
                  boxShadow: 2,
                  "&:hover": { bgcolor: "   #b61fb8" },
                }}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* -------- Left: identity summary -------- */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              {user.fullName || "Unnamed User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.userName || "username"}
            </Typography>

            {user.country && (
              <Chip
                icon={<Public sx={{ fontSize: 16 }} />}
                label={user.country}
                size="small"
                sx={{ mt: 1.5, bgcolor: `${NAVY}14`, color: NAVY, fontWeight: 600 }}
              />
            )}

            <Divider sx={{ my: 2.5 }} />

            <Stack spacing={2} sx={{ textAlign: "left" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <AlternateEmail sx={{ fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                  {user.email}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Badge sx={{ fontSize: 20, color: "text.secondary" }} />
                <Typography variant="body2">{user.userName}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* -------- Right: edit + security + danger zone -------- */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Personal information */}
            <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Personal Information</Typography>
                {!isEditing && (
                  <Button startIcon={<Edit />} size="small" onClick={() => setIsEditing(true)}>
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
                      value={isEditing ? editFormData.fullName : user.fullName || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Country"
                      disabled={!isEditing}
                      value={isEditing ? editFormData.country : user.country || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                    >
                      {COUNTRIES.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <LockedField label="Username" value={user.userName} icon={<Badge fontSize="small" />} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LockedField label="Email Address" value={user.email} icon={<AlternateEmail fontSize="small" />} />
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box sx={{ mt: 2.5, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                    <Button
                      startIcon={<Close />}
                      color="inherit"
                      onClick={() => {
                        setIsEditing(false);
                        setEditFormData({ fullName: user.fullName || "", country: user.country || "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={savingProfile ? <CircularProgress size={16} color="inherit" /> : <Save />}
                      disabled={savingProfile}
                      sx={{ bgcolor: NAVY, "&:hover": { bgcolor: NAVY_DARK } }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Security */}
            <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <LockReset sx={{ color: NAVY }} /> Security &amp; Password
              </Typography>

              <Box component="form" onSubmit={handleChangePassword}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Current Password"
                      type={showPw.old ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPw({ ...showPw, old: !showPw.old })} edge="end">
                              {showPw.old ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="New Password"
                      type={showPw.next ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPw({ ...showPw, next: !showPw.next })} edge="end">
                              {showPw.next ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Confirm New Password"
                      type={showPw.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      error={!!passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword}
                      helperText={
                        passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword
                          ? "Passwords don't match"
                          : " "
                      }
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })} edge="end">
                              {showPw.confirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 1, textAlign: "right" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={changingPassword}
                    startIcon={changingPassword ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{ bgcolor: NAVY, "&:hover": { bgcolor: NAVY_DARK } }}
                  >
                    Update Password
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Danger zone */}
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "error.light", bgcolor: "#fff8f8" }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color="error.main"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <DeleteForever /> Danger Zone
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Deleting your profile will permanently remove your account, watchlist data and trading history. This cannot be undone.
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

      {/* -------- Delete confirmation -------- */}
      <Dialog open={openDeleteDialog} onClose={() => !deleting && setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main", fontWeight: 700 }}>
          <WarningAmber /> Delete account permanently?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This step can't be reversed — your entire profile, watchlist and trading history will be erased for good.
            Type <strong>DELETE</strong> below to confirm.
          </DialogContentText>
          <TextField
            fullWidth
            size="small"
            placeholder="Type DELETE to confirm"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setOpenDeleteDialog(false); setDeleteConfirmText(""); }} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleteConfirmText !== "DELETE" || deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* -------- Toast -------- */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.type} variant="filled" onClose={() => setToast({ ...toast, open: false })}>
          {toast.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;
