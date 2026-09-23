import { useState } from "react";
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [search, setSearch] = useState("");
  
  // Add Asset Dialog States (LTP add kar diya)
  const [open, setOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ symbol: "", qty: "", avgPrice: "", ltp: "" });

  // Calculations
  const totalInvested = holdings.reduce((acc, curr) => acc + curr.qty * curr.avgPrice, 0);
  const currentValue = holdings.reduce((acc, curr) => acc + curr.qty * curr.ltp, 0);
  const totalPnL = currentValue - totalInvested;
  const pnlPercentage = totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : 0;

  // Search Filter
  const filteredHoldings = holdings.filter((h) =>
    h.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setHoldings(holdings.filter((item) => item.id !== id));
  };

  const handleAddAsset = () => {
    if (!newAsset.symbol || !newAsset.qty || !newAsset.avgPrice || !newAsset.ltp) return;
    
    const newHolding = {
      id: Date.now(),
      symbol: newAsset.symbol.toUpperCase(),
      qty: Number(newAsset.qty),
      avgPrice: Number(newAsset.avgPrice),
      ltp: Number(newAsset.ltp), // Ab LTP user khud daalega!
    };
    
    setHoldings([...holdings, newHolding]);
    setOpen(false);
    setNewAsset({ symbol: "", qty: "", avgPrice: "", ltp: "" });
  };

  const darkInputStyle = {
    bgcolor: "#0b0f17", 
    borderRadius: "8px", 
    input: { color: "#fff" }, 
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
    mb: 2
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#0b0f17", color: "#f3f4f6", p: { xs: 2, md: 4 } }}>
      
      {/* ----------------- HEADER & ACTION BUTTONS ----------------- */}
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#2563eb", width: 48, height: 48, borderRadius: "12px" }}>
            <AccountBalanceWalletIcon sx={{ color: "#fff" }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: -0.5 }}>My Portfolio</Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>Track your investments & performance</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          <Button variant="outlined" startIcon={<FileUploadIcon />} sx={{ color: "#cbd5e1", borderColor: "#374151", textTransform: "none", borderRadius: "10px", "&:hover": { bgcolor: "#1f2937", borderColor: "#4b5563" } }}>Import</Button>
          <Button variant="outlined" startIcon={<SaveIcon />} sx={{ color: "#cbd5e1", borderColor: "#374151", textTransform: "none", borderRadius: "10px", "&:hover": { bgcolor: "#1f2937", borderColor: "#4b5563" } }}>Export</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: "#2563eb", fontWeight: "bold", textTransform: "none", borderRadius: "10px", "&:hover": { bgcolor: "#1d4ed8" } }}>Add Asset</Button>
        </Stack>
      </Stack>

      {/* ----------------- SUMMARY CARDS ----------------- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: "#111827", border: "1px solid #1f2937", borderRadius: "14px" }}>
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1 }}>Total Invested</Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff" }}>
              ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: "#111827", border: "1px solid #1f2937", borderRadius: "14px" }}>
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1 }}>Current Value</Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff" }}>
              ₹{currentValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: "#111827", border: "1px solid #1f2937", borderRadius: "14px" }}>
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1 }}>Overall P&L</Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: totalPnL >= 0 ? "#10b981" : "#ef4444" }}>
              {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ({pnlPercentage}%)
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ----------------- SEARCH & TABLE ----------------- */}
      <Paper elevation={0} sx={{ bgcolor: "#111827", border: "1px solid #1f2937", borderRadius: "14px", overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #1f2937" }}>
          <TextField
            size="small"
            placeholder="Search holdings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", sm: 300 }, ...darkInputStyle, mb: 0 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#9ca3af" }} /></InputAdornment> }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#0b0f17" }}>
                <TableCell sx={{ color: "#9ca3af", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>Symbol</TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>Qty</TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>Avg Price</TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>LTP</TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>Current Value</TableCell>
                <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>P&L</TableCell>
                <TableCell align="center" sx={{ color: "#9ca3af", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHoldings.length > 0 ? (
                filteredHoldings.map((row) => {
                  const invested = row.qty * row.avgPrice;
                  const current = row.qty * row.ltp;
                  const pnl = current - invested;
                  const isProfit = pnl >= 0;

                  return (
                    <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                      <TableCell sx={{ color: "#f3f4f6", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>{row.symbol}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>{row.qty}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>₹{row.avgPrice.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>₹{row.ltp.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>₹{current.toLocaleString("en-IN")}</TableCell>
                      <TableCell align="right" sx={{ color: isProfit ? "#10b981" : "#ef4444", fontWeight: "bold", borderBottom: "1px solid #1f2937" }}>
                        {isProfit ? "+" : ""}₹{pnl.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: "1px solid #1f2937" }}>
                        <IconButton size="small" onClick={() => handleDelete(row.id)} sx={{ color: "#ef4444", "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8, color: "#9ca3af", borderBottom: "none" }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>Sheet is empty.</Typography>
                    <Typography variant="body2">Click 'Add Asset' to start building your portfolio.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ----------------- ADD ASSET DIALOG ----------------- */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: "#111827", color: "#fff", border: "1px solid #1f2937", borderRadius: "12px", minWidth: { xs: "90%", sm: "400px" } } }}>
        <DialogTitle sx={{ borderBottom: "1px solid #1f2937" }}>Add New Stock</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth size="small" label="Stock Symbol (e.g. RELIANCE)"
            InputLabelProps={{ style: { color: "#9ca3af" } }}
            value={newAsset.symbol} onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
            sx={darkInputStyle}
          />
          <TextField
            fullWidth size="small" type="number" label="Quantity"
            InputLabelProps={{ style: { color: "#9ca3af" } }}
            value={newAsset.qty} onChange={(e) => setNewAsset({ ...newAsset, qty: e.target.value })}
            sx={darkInputStyle}
          />
          <TextField
            fullWidth size="small" type="number" label="Buy Price (₹)"
            InputLabelProps={{ style: { color: "#9ca3af" } }}
            value={newAsset.avgPrice} onChange={(e) => setNewAsset({ ...newAsset, avgPrice: e.target.value })}
            sx={darkInputStyle}
          />
          {/* Naya LTP Box jisse P&L calculate hoga */}
          <TextField
            fullWidth size="small" type="number" label="Current Price / LTP (₹)"
            InputLabelProps={{ style: { color: "#9ca3af" } }}
            value={newAsset.ltp} onChange={(e) => setNewAsset({ ...newAsset, ltp: e.target.value })}
            sx={{ ...darkInputStyle, mb: 0 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #1f2937" }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#9ca3af", textTransform: "none" }}>Cancel</Button>
          <Button 
            onClick={handleAddAsset} variant="contained"
            disabled={!newAsset.symbol || !newAsset.qty || !newAsset.avgPrice || !newAsset.ltp}
            sx={{ bgcolor: "#2563eb", textTransform: "none", "&:hover": { bgcolor: "#1d4ed8" } }}
          >
            Add to Portfolio
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}