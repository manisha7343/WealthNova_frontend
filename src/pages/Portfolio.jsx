import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Grid,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add Asset Dialog State
  const [openAdd, setOpenAdd] = useState(false);
  const [newAsset, setNewAsset] = useState({
    symbol: "",
    name: "",
    qty: "",
    avgPrice: "",
    ltp: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Edit Asset Dialog State
  const [openEdit, setOpenEdit] = useState(false);
  const [editAsset, setEditAsset] = useState(null);

  // Import Dialog State
  const [openImport, setOpenImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [parsedPreview, setParsedPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  // Snackbar Notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  // Fetch portfolio holdings from backend
  const fetchPortfolio = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setHoldings(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load portfolio.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [token]);

  // Calculations
  const totalInvested = holdings.reduce(
    (acc, curr) => acc + (Number(curr.qty) || 0) * (Number(curr.avgPrice) || 0),
    0
  );
  const currentValue = holdings.reduce(
    (acc, curr) => acc + (Number(curr.qty) || 0) * (Number(curr.ltp) || 0),
    0
  );
  const totalPnL = currentValue - totalInvested;
  const pnlPercentage =
    totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : 0;

  // Search Filter
  const filteredHoldings = holdings.filter(
    (h) =>
      h.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      (h.name && h.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Add Asset Handler (Saves to MongoDB)
  const handleAddAsset = async () => {
    if (!newAsset.symbol || !newAsset.qty || !newAsset.avgPrice || !newAsset.ltp) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields.",
        severity: "warning",
      });
      return;
    }

    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login to save your portfolio.",
        severity: "warning",
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        symbol: newAsset.symbol.toUpperCase().trim(),
        name: newAsset.name ? newAsset.name.trim() : newAsset.symbol.toUpperCase().trim(),
        qty: Number(newAsset.qty),
        avgPrice: Number(newAsset.avgPrice),
        ltp: Number(newAsset.ltp),
      };

      const res = await axios.post(`${BASE_URL}/api/portfolio`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setSnackbar({
          open: true,
          message: res.data.message || "Asset saved successfully to database!",
          severity: "success",
        });
        setOpenAdd(false);
        setNewAsset({ symbol: "", name: "", qty: "", avgPrice: "", ltp: "" });
        fetchPortfolio();
      }
    } catch (err) {
      console.error("Error adding asset:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add asset.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Asset Handler (Deletes from MongoDB)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this asset from your portfolio?")) {
      return;
    }

    try {
      const res = await axios.delete(`${BASE_URL}/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setSnackbar({
          open: true,
          message: res.data.message || "Asset deleted successfully!",
          severity: "info",
        });
        setHoldings((prev) => prev.filter((item) => (item._id || item.id) !== id));
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to remove asset.",
        severity: "error",
      });
    }
  };

  // Edit Asset Submit Handler
  const handleUpdateAsset = async () => {
    if (!editAsset) return;

    try {
      setSubmitting(true);
      const payload = {
        qty: Number(editAsset.qty),
        avgPrice: Number(editAsset.avgPrice),
        ltp: Number(editAsset.ltp),
        name: editAsset.name,
      };

      const res = await axios.put(
        `${BASE_URL}/api/portfolio/${editAsset._id || editAsset.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setSnackbar({
          open: true,
          message: "Holding updated successfully in database!",
          severity: "success",
        });
        setOpenEdit(false);
        setEditAsset(null);
        fetchPortfolio();
      }
    } catch (err) {
      console.error("Error updating asset:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update holding.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // CSV / Text parsing for Import
  const parseCSVContent = (content) => {
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return [];

    let startIndex = 0;
    const firstLineLower = lines[0].toLowerCase();
    // Check if first line is a header
    if (
      firstLineLower.includes("symbol") ||
      firstLineLower.includes("qty") ||
      firstLineLower.includes("price")
    ) {
      startIndex = 1;
    }

    const items = [];
    for (let i = startIndex; i < lines.length; i++) {
      const row = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      if (row.length < 3) continue;

      // Format expected: Symbol, Quantity, AvgBuyPrice, LTP, Name
      // Or: Symbol, Name, Quantity, AvgBuyPrice, LTP
      let symbol = row[0].toUpperCase();
      let name = "";
      let qty = 0;
      let avgPrice = 0;
      let ltp = 0;

      if (isNaN(row[1]) && !isNaN(row[2])) {
        // row[1] is name
        name = row[1];
        qty = Number(row[2]);
        avgPrice = Number(row[3]);
        ltp = row[4] ? Number(row[4]) : avgPrice;
      } else {
        // row[1] is qty
        qty = Number(row[1]);
        avgPrice = Number(row[2]);
        ltp = row[3] ? Number(row[3]) : avgPrice;
        name = row[4] || symbol;
      }

      if (symbol && qty > 0 && avgPrice >= 0) {
        items.push({
          symbol,
          name: name || symbol,
          qty,
          avgPrice,
          ltp: ltp > 0 ? ltp : avgPrice,
        });
      }
    }
    return items;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result || "";
      setImportText(text);
      const parsed = parseCSVContent(text);
      setParsedPreview(parsed);
      if (parsed.length === 0) {
        setSnackbar({
          open: true,
          message: "No valid holdings detected in the file. Check CSV format.",
          severity: "warning",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = async () => {
    const items = parsedPreview.length > 0 ? parsedPreview : parseCSVContent(importText);
    if (items.length === 0) {
      setSnackbar({
        open: true,
        message: "No valid holdings to import.",
        severity: "warning",
      });
      return;
    }

    if (!token) {
      setSnackbar({
        open: true,
        message: "Please log in first to import into your database.",
        severity: "warning",
      });
      return;
    }

    try {
      setImporting(true);
      const res = await axios.post(
        `${BASE_URL}/api/portfolio/bulk`,
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setSnackbar({
          open: true,
          message: res.data.message || `Imported ${items.length} assets successfully!`,
          severity: "success",
        });
        setOpenImport(false);
        setImportText("");
        setParsedPreview([]);
        fetchPortfolio();
      }
    } catch (err) {
      console.error("Bulk import error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to import portfolio.",
        severity: "error",
      });
    } finally {
      setImporting(false);
    }
  };

  // Export to CSV Functionality
  const handleExportCSV = () => {
    if (holdings.length === 0) {
      setSnackbar({ open: true, message: "No holdings to export!", severity: "warning" });
      return;
    }

    const headers = ["Symbol", "Name", "Quantity", "Avg Buy Price", "LTP", "Current Value", "P&L"];
    const rows = holdings.map((h) => {
      const invested = h.qty * h.avgPrice;
      const current = h.qty * h.ltp;
      const pnl = current - invested;
      return [
        h.symbol,
        `"${h.name || h.symbol}"`,
        h.qty,
        h.avgPrice,
        h.ltp,
        current.toFixed(2),
        pnl.toFixed(2),
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wealthnova_portfolio_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbar({ open: true, message: "Portfolio exported as CSV!", severity: "success" });
  };

  // Compact Dark Input Style
  const darkInputStyle = {
    bgcolor: "#0b0f17",
    borderRadius: "6px",
    input: { color: "#fff", fontSize: "0.8rem", py: 0.9, px: 1.2 },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
    mb: 1.5,
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#0b0f17", color: "#f3f4f6", p: { xs: 1.5, md: 2.5 } }}>
      
      {/* ----------------- COMPACT HEADER & ACTION BUTTONS ----------------- */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: "#2563eb", width: 36, height: 36, borderRadius: "10px" }}>
            <AccountBalanceWalletIcon sx={{ color: "#fff", fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: -0.3, fontSize: "1.15rem", lineHeight: 1.2 }}>
              My Portfolio
            </Typography>
            <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "0.75rem" }}>
              Live investments saved securely in database
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
          <Tooltip title="Refresh Portfolio">
            <IconButton
              size="small"
              onClick={fetchPortfolio}
              disabled={loading}
              sx={{ color: "#cbd5e1", border: "1px solid #374151", borderRadius: "8px", p: 0.6 }}
            >
              <RefreshIcon sx={{ fontSize: 16, animation: loading ? "spin 1s linear infinite" : "none" }} />
            </IconButton>
          </Tooltip>

          {/* Import Button */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<FileUploadIcon sx={{ fontSize: 16 }} />}
            onClick={() => {
              setImportText("");
              setParsedPreview([]);
              setOpenImport(true);
            }}
            sx={{
              color: "#cbd5e1",
              borderColor: "#374151",
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.76rem",
              py: 0.5,
              px: 1.2,
              "&:hover": { bgcolor: "#1f2937", borderColor: "#4b5563" },
            }}
          >
            Import
          </Button>

          {/* Export Button */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
            onClick={handleExportCSV}
            sx={{
              color: "#cbd5e1",
              borderColor: "#374151",
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.76rem",
              py: 0.5,
              px: 1.2,
              "&:hover": { bgcolor: "#1f2937", borderColor: "#4b5563" },
            }}
          >
            Export
          </Button>

          {/* Add Asset Button */}
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setOpenAdd(true)}
            sx={{
              bgcolor: "#2563eb",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.76rem",
              py: 0.5,
              px: 1.4,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Add Asset
          </Button>
        </Stack>
      </Stack>

      {/* ----------------- AUTH WARNING (IF NOT LOGGED IN) ----------------- */}
      {!token && (
        <Alert severity="warning" sx={{ mb: 2, bgcolor: "rgba(234, 179, 8, 0.1)", color: "#fef08a", border: "1px solid #854d0e", py: 0.5, fontSize: "0.78rem" }}>
          You are currently not logged in. Portfolio changes cannot be saved to the database without logging in.
        </Alert>
      )}

      {/* ----------------- COMPACT SUMMARY CARDS ----------------- */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "10px",
            }}
          >
            <Typography sx={{ color: "#9ca3af", mb: 0.5, fontWeight: 500, fontSize: "0.72rem" }}>
              Total Invested
            </Typography>
            <Typography fontWeight="bold" sx={{ color: "#ffffff", fontSize: "1.2rem", lineHeight: 1.2 }}>
              ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </Typography>
            <Typography sx={{ color: "#6b7280", mt: 0.4, fontSize: "0.68rem" }}>
              {holdings.length} assets held
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "10px",
            }}
          >
            <Typography sx={{ color: "#9ca3af", mb: 0.5, fontWeight: 500, fontSize: "0.72rem" }}>
              Current Value
            </Typography>
            <Typography fontWeight="bold" sx={{ color: "#ffffff", fontSize: "1.2rem", lineHeight: 1.2 }}>
              ₹{currentValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </Typography>
            <Typography sx={{ color: "#6b7280", mt: 0.4, fontSize: "0.68rem" }}>
              At market LTP
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "10px",
            }}
          >
            <Typography sx={{ color: "#9ca3af", mb: 0.5, fontWeight: 500, fontSize: "0.72rem" }}>
              Overall P&L
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              {totalPnL >= 0 ? (
                <TrendingUpIcon sx={{ color: "#10b981", fontSize: 20 }} />
              ) : (
                <TrendingDownIcon sx={{ color: "#ef4444", fontSize: 20 }} />
              )}
              <Typography fontWeight="bold" sx={{ color: totalPnL >= 0 ? "#10b981" : "#ef4444", fontSize: "1.2rem", lineHeight: 1.2 }}>
                {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ({pnlPercentage}%)
              </Typography>
            </Stack>
            <Typography sx={{ color: "#6b7280", mt: 0.4, fontSize: "0.68rem" }}>
              Net Return
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ----------------- COMPACT SEARCH & TABLE ----------------- */}
      <Paper elevation={0} sx={{ bgcolor: "#111827", border: "1px solid #1f2937", borderRadius: "10px", overflow: "hidden" }}>
        <Box sx={{ p: 1.5, borderBottom: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
          <TextField
            size="small"
            placeholder="Search by symbol or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", sm: 260 }, ...darkInputStyle, mb: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          <Typography sx={{ color: "#9ca3af", fontSize: "0.74rem" }}>
            Showing {filteredHoldings.length} of {holdings.length} holdings
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#0b0f17" }}>
                <TableCell sx={{ color: "#9ca3af", fontWeight: 600, borderBottom: "1px solid #1f2937", fontSize: "0.72rem", py: 1, px: 1.5 }}>
                  Asset
                </TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: 600, borderBottom: "1px solid #1f2937", fontSize: "0.72rem", py: 1, px: 1.5 }}>
                  Qty
                </TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: 600, borderBottom: "1px solid #1f2937", fontSize: "0.72rem", py: 1, px: 1.5 }}>
                  Avg Price
                </TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: 600, borderBottom: "1px solid #1f2937", fontSize: "0.72rem", py: 1, px: 1.5 }}>
                  LTP
                </TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: 600, borderBottom: "1px solid #1f2937", fontSize: "0.72rem", py: 1, px: 1.5 }}>
                  Current Value
                </TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: 600, borderBottom: "1px solid #1f2937", fontSize: "0.72rem", py: 1, px: 1.5 }}>
                  P&L
                </TableCell>
                <TableCell align="center" sx={{ color: "#9ca3af", fontWeight: 600, borderBottom: "1px solid #1f2937", fontSize: "0.72rem", py: 1, px: 1.5 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#9ca3af", borderBottom: "none" }}>
                    <CircularProgress size={28} sx={{ color: "#2563eb", mb: 1.5 }} />
                    <Typography sx={{ fontSize: "0.78rem" }}>Loading portfolio from database...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredHoldings.length > 0 ? (
                filteredHoldings.map((row) => {
                  const invested = row.qty * row.avgPrice;
                  const current = row.qty * row.ltp;
                  const pnl = current - invested;
                  const pnlPct = invested > 0 ? ((pnl / invested) * 100).toFixed(2) : 0;
                  const isProfit = pnl >= 0;
                  const id = row._id || row.id;

                  return (
                    <TableRow key={id} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                      <TableCell sx={{ color: "#f3f4f6", borderBottom: "1px solid #1f2937", py: 0.9, px: 1.5 }}>
                        <Typography fontWeight="bold" sx={{ color: "#ffffff", fontSize: "0.78rem", lineHeight: 1.2 }}>
                          {row.symbol}
                        </Typography>
                        {row.name && row.name !== row.symbol && (
                          <Typography sx={{ color: "#9ca3af", display: "block", fontSize: "0.68rem" }}>
                            {row.name}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937", fontSize: "0.78rem", py: 0.9, px: 1.5 }}>
                        {row.qty}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937", fontSize: "0.78rem", py: 0.9, px: 1.5 }}>
                        ₹{Number(row.avgPrice).toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937", fontSize: "0.78rem", py: 0.9, px: 1.5 }}>
                        ₹{Number(row.ltp).toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937", fontSize: "0.78rem", py: 0.9, px: 1.5 }}>
                        ₹{current.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: isProfit ? "#10b981" : "#ef4444",
                          fontWeight: 600,
                          borderBottom: "1px solid #1f2937",
                          fontSize: "0.78rem",
                          py: 0.9,
                          px: 1.5,
                        }}
                      >
                        {isProfit ? "+" : ""}₹{pnl.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        <Typography sx={{ display: "block", color: isProfit ? "#34d399" : "#f87171", fontSize: "0.68rem" }}>
                          ({isProfit ? "+" : ""}{pnlPct}%)
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: "1px solid #1f2937", py: 0.9, px: 1.5 }}>
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Edit Holding">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditAsset({ ...row });
                                setOpenEdit(true);
                              }}
                              sx={{ color: "#38bdf8", p: 0.5, "&:hover": { bgcolor: "rgba(56, 189, 248, 0.1)" } }}
                            >
                              <EditIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Holding">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(id)}
                              sx={{ color: "#ef4444", p: 0.5, "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}
                            >
                              <DeleteIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#9ca3af", borderBottom: "none" }}>
                    <Typography sx={{ mb: 0.5, color: "#cbd5e1", fontWeight: 600, fontSize: "0.82rem" }}>
                      No assets found in your portfolio.
                    </Typography>
                    <Typography sx={{ mb: 1.5, fontSize: "0.74rem" }}>
                      Click 'Add Asset' or 'Import' to add your stock holdings.
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                        onClick={() => setOpenAdd(true)}
                        sx={{ bgcolor: "#2563eb", textTransform: "none", borderRadius: "6px", fontSize: "0.74rem", py: 0.4, px: 1.2 }}
                      >
                        Add Asset
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FileUploadIcon sx={{ fontSize: 15 }} />}
                        onClick={() => setOpenImport(true)}
                        sx={{ color: "#cbd5e1", borderColor: "#374151", textTransform: "none", borderRadius: "6px", fontSize: "0.74rem", py: 0.4, px: 1.2 }}
                      >
                        Import CSV
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ----------------- IMPORT MODAL / DIALOG ----------------- */}
      <Dialog
        open={openImport}
        onClose={() => !importing && setOpenImport(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#111827",
            color: "#fff",
            border: "1px solid #1f2937",
            borderRadius: "10px",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #1f2937", fontWeight: "bold", fontSize: "0.95rem", py: 1.2, px: 2 }}>
          Import Portfolio Holdings
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, px: 2 }}>
          <Typography sx={{ color: "#9ca3af", fontSize: "0.74rem", mb: 1.5 }}>
            Upload a CSV file or paste your holdings below (format: <code style={{ color: "#38bdf8" }}>Symbol, Quantity, BuyPrice, LTP, Name</code>).
          </Typography>

          <input
            type="file"
            accept=".csv, .txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          <Button
            fullWidth
            variant="outlined"
            startIcon={<CloudUploadIcon sx={{ fontSize: 18 }} />}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              borderColor: "#374151",
              color: "#38bdf8",
              textTransform: "none",
              borderRadius: "8px",
              py: 1,
              mb: 2,
              fontSize: "0.78rem",
              borderStyle: "dashed",
              "&:hover": { borderColor: "#38bdf8", bgcolor: "rgba(56, 189, 248, 0.05)" },
            }}
          >
            Click to Browse & Upload CSV File
          </Button>

          <Typography sx={{ color: "#6b7280", fontSize: "0.7rem", mb: 0.5 }}>
            Or paste CSV lines manually:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={`RELIANCE, 10, 2500, 2600, Reliance Industries\nTCS, 5, 3800, 3950, Tata Consultancy Services\nINFY, 20, 1450, 1520`}
            value={importText}
            onChange={(e) => {
              setImportText(e.target.value);
              setParsedPreview(parseCSVContent(e.target.value));
            }}
            sx={{
              ...darkInputStyle,
              textarea: { color: "#fff", fontSize: "0.75rem", fontFamily: "monospace" },
              mb: 1.5,
            }}
          />

          {parsedPreview.length > 0 && (
            <Box sx={{ mt: 1, p: 1, bgcolor: "#0b0f17", borderRadius: "6px", border: "1px solid #1f2937" }}>
              <Typography sx={{ color: "#10b981", fontWeight: 600, fontSize: "0.72rem", mb: 0.5 }}>
                ✓ {parsedPreview.length} asset(s) ready for import:
              </Typography>
              <Box sx={{ maxHeight: 110, overflowY: "auto" }}>
                {parsedPreview.map((item, idx) => (
                  <Typography key={idx} sx={{ color: "#cbd5e1", fontSize: "0.68rem" }}>
                    • <b>{item.symbol}</b> - {item.qty} shares @ ₹{item.avgPrice} (LTP: ₹{item.ltp})
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 1.5, borderTop: "1px solid #1f2937" }}>
          <Button
            size="small"
            onClick={() => setOpenImport(false)}
            disabled={importing}
            sx={{ color: "#9ca3af", textTransform: "none", fontSize: "0.75rem" }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleImportSubmit}
            variant="contained"
            disabled={importing || (parsedPreview.length === 0 && !importText.trim())}
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: "6px",
              py: 0.5,
              px: 1.5,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            {importing ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : `Import to Database`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ----------------- COMPACT ADD ASSET DIALOG ----------------- */}
      <Dialog
        open={openAdd}
        onClose={() => !submitting && setOpenAdd(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#111827",
            color: "#fff",
            border: "1px solid #1f2937",
            borderRadius: "10px",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #1f2937", fontWeight: "bold", fontSize: "0.95rem", py: 1.2, px: 2 }}>
          Add Stock / Asset
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, px: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Stock Symbol (e.g. RELIANCE, TCS)"
            required
            InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
            value={newAsset.symbol}
            onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value.toUpperCase() })}
            sx={darkInputStyle}
          />
          <TextField
            fullWidth
            size="small"
            label="Company Name (Optional)"
            InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
            value={newAsset.name}
            onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            sx={darkInputStyle}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Quantity"
            required
            InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
            value={newAsset.qty}
            onChange={(e) => setNewAsset({ ...newAsset, qty: e.target.value })}
            sx={darkInputStyle}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Buy Price (Avg ₹)"
            required
            InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
            value={newAsset.avgPrice}
            onChange={(e) => setNewAsset({ ...newAsset, avgPrice: e.target.value })}
            sx={darkInputStyle}
          />
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Current Market Price / LTP (₹)"
            required
            InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
            value={newAsset.ltp}
            onChange={(e) => setNewAsset({ ...newAsset, ltp: e.target.value })}
            sx={{ ...darkInputStyle, mb: 0 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 1.5, borderTop: "1px solid #1f2937" }}>
          <Button
            size="small"
            onClick={() => setOpenAdd(false)}
            disabled={submitting}
            sx={{ color: "#9ca3af", textTransform: "none", fontSize: "0.75rem" }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleAddAsset}
            variant="contained"
            disabled={submitting || !newAsset.symbol || !newAsset.qty || !newAsset.avgPrice || !newAsset.ltp}
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: "6px",
              py: 0.5,
              px: 1.5,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            {submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Save to Database"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ----------------- COMPACT EDIT ASSET DIALOG ----------------- */}
      <Dialog
        open={openEdit}
        onClose={() => !submitting && setOpenEdit(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#111827",
            color: "#fff",
            border: "1px solid #1f2937",
            borderRadius: "10px",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #1f2937", fontWeight: "bold", fontSize: "0.95rem", py: 1.2, px: 2 }}>
          Edit {editAsset?.symbol} Holding
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, px: 2 }}>
          {editAsset && (
            <>
              <TextField
                fullWidth
                size="small"
                label="Company Name"
                InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
                value={editAsset.name || ""}
                onChange={(e) => setEditAsset({ ...editAsset, name: e.target.value })}
                sx={darkInputStyle}
              />
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Quantity"
                required
                InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
                value={editAsset.qty}
                onChange={(e) => setEditAsset({ ...editAsset, qty: e.target.value })}
                sx={darkInputStyle}
              />
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Buy Price (Avg ₹)"
                required
                InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
                value={editAsset.avgPrice}
                onChange={(e) => setEditAsset({ ...editAsset, avgPrice: e.target.value })}
                sx={darkInputStyle}
              />
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Current Market Price / LTP (₹)"
                required
                InputLabelProps={{ style: { color: "#9ca3af", fontSize: "0.78rem" } }}
                value={editAsset.ltp}
                onChange={(e) => setEditAsset({ ...editAsset, ltp: e.target.value })}
                sx={{ ...darkInputStyle, mb: 0 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 1.5, borderTop: "1px solid #1f2937" }}>
          <Button
            size="small"
            onClick={() => setOpenEdit(false)}
            disabled={submitting}
            sx={{ color: "#9ca3af", textTransform: "none", fontSize: "0.75rem" }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleUpdateAsset}
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: "6px",
              py: 0.5,
              px: 1.5,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            {submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Update Holding"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ----------------- SNACKBAR FEEDBACK ----------------- */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", fontSize: "0.78rem" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}