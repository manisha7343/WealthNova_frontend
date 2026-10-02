import { useEffect, useState, useRef, memo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Link,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// ==========================================
// 1. TRADINGVIEW LIVE CHART (PURE BLACK)
// ==========================================
const TradingViewWidget = memo(({ symbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BSE:${symbol || "TCS"}`,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "in",
      enable_publishing: false,
      allow_symbol_change: true,
      backgroundColor: "#000000",
      gridColor: "#111111",
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: 500,
        width: "100%",
        bgcolor: "#000000",
        borderRadius: "10px",
        overflow: "hidden",
        "& .tradingview-widget-container": { height: "100%", width: "100%" },
      }}
    />
  );
});

// Common Sticky Metric Style for Horizontal Tables
const stickyMetricCellStyle = {
  position: "sticky",
  left: 0,
  bgcolor: "#111827",
  borderBottom: "1px solid #1f2937",
  zIndex: 2,
  minWidth: 180,
};

// ==========================================
// 2. MAIN WATCHLIST COMPONENT
// ==========================================
export default function Watchlist() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStocks = async (query = "") => {
    try {
      setLoading(true);
      const url = query.trim()
        ? `http://localhost:3002/api/stocks/search?query=${encodeURIComponent(query.trim())}`
        : `http://localhost:3002/api/stocks/search`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        if (result.type === "FULL_DETAILS" && result.data.length > 0) {
          setSelectedStock(result.data[0]);
          setStocks([]);
        } else {
          setSelectedStock(null);
          setStocks(result.data);
        }
      } else {
        setStocks([]);
        setSelectedStock(null);
      }
    } catch (error) {
      console.error("Stocks fetch error:", error);
      setStocks([]);
      setSelectedStock(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSelectedStock(null);
      fetchStocks("");
    } else {
      fetchStocks(searchQuery);
    }
  };

  const handleResetToWatchlist = () => {
    setSearchQuery("");
    setSelectedStock(null);
    fetchStocks("");
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 0, // Outer padding completely zero
        bgcolor: "#0b0f17",
        minHeight: "100vh",
        color: "#f3f4f6",
        "@keyframes fadeInUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(22px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
      }}
    >
      {/* Top Search Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3.5,
          borderRadius: "14px",
          bgcolor: "#111827",
          border: "1px solid #1f2937",
          animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems="center">
          <Avatar
            sx={{
              width: 50,
              height: 50,
              borderRadius: "12px",
              bgcolor: "#2563eb",
              animation: "floatAvatar 3s ease-in-out infinite",
              "@keyframes floatAvatar": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-5px)" },
              },
            }}
          >
            <ShowChartIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Avatar>

          <Box sx={{ width: "100%" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: -0.2 }}>
              Stock Financials & Full Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af", display: "block", mb: 2 }}> 
              Symbol search karein (e.g. TCS) aur Screener layout mein exact interactive live charts aur detailed financials dekhein.
            </Typography>

            <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: "flex", gap: 1.2, maxWidth: 500 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search symbol (e.g. TCS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  bgcolor: "#0b0f17",
                  borderRadius: "10px",
                  input: { color: "#fff", py: 1 },
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  px: 3.5,
                  textTransform: "none",
                  borderRadius: "10px",
                  bgcolor: "#2563eb",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Search"}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* ========================================================= */}
      {/* SCREENER DETAIL BREAKDOWN */}
      {/* ========================================================= */}
      {selectedStock ? (
        <Box sx={{ animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            size="small"
            onClick={handleResetToWatchlist}
            sx={{
              mb: 3,
              textTransform: "none",
              borderRadius: "10px",
              borderColor: "#374151",
              color: "#cbd5e1",
              px: 2,
              py: 0.8,
              "&:hover": { borderColor: "#4b5563", bgcolor: "#111827" },
            }}
          >
            Back to Watchlist
          </Button>

          {/* 1. SCREENER OVERVIEW & EXACT 4-BOXES PER ROW RATIOS */}
          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
              mb: 3.5,
              bgcolor: "#111827",
              borderRadius: "14px",
              border: "1px solid #1f2937",
              animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {/* Header Row */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Stack direction="row" spacing={2.2} alignItems="center">
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: "#f59e0b",
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    color: "#fff",
                    borderRadius: "12px",
                  }}
                >
                  {selectedStock.symbol?.slice(0, 2) || "ST"}
                </Avatar>

                <Box>
                  <Stack direction="row" spacing={1.5} alignItems="baseline" flexWrap="wrap">
                    <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: -0.3 }}>
                      {selectedStock.companyName || selectedStock.symbol}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: "#38bdf8" }}>
                      ₹ {selectedStock.marketData?.currentPrice?.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{  fontWeight: "bold", fontSize: "0.85rem" }}>
                      ▲ 0.80%
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2.5} sx={{ mt: 0.6 }}>
                    {selectedStock.website && (
                      <Link
                        href={selectedStock.website}
                        target="_blank"
                        underline="hover"
                        sx={{ color: "#60a5fa", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 0.5 }}
                      >
                        🔗 {selectedStock.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </Link>
                    )}
                    <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                      BSE: <span style={{ color: "#e5e7eb", fontWeight: "bold" }}>{selectedStock.bseCode}</span>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                      NSE: <span style={{ color: "#e5e7eb", fontWeight: "bold" }}>{selectedStock.nseSymbol}</span>
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#e5e7eb",
                    borderColor: "#374151",
                    bgcolor: "#1f2937",
                    textTransform: "uppercase",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 2,
                    "&:hover": { bgcolor: "#374151" },
                  }}
                >
                  📥 Export to Excel
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#e5e7eb",
                    borderColor: "#374151",
                    bgcolor: "#1f2937",
                    textTransform: "uppercase",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    borderRadius: "10px",
                    px: 2,
                    "&:hover": { bgcolor: "#374151" },
                  }}
                >
                  - Unfollow
                </Button>
              </Stack>
            </Stack>

            {/* ======================================================== */}
            {/* EXACT 4 EQUAL-WIDTH BOXES PER ROW USING CSS GRID */}
            {/* ======================================================== */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)", // Exact 4 columns in 1 row on medium & desktop
                },
                gap: 1.5,
                width: "100%",
                mb: 3.5,
              }}
            >
              {[
                { label: "Market Cap", val: `₹${selectedStock.marketData?.marketCap?.toLocaleString()} Cr.` },
                { label: "Current Price", val: `₹${selectedStock.marketData?.currentPrice?.toLocaleString()}` },
                { label: "High / Low", val: `₹${selectedStock.marketData?.high52Week} / ${selectedStock.marketData?.low52Week}` },
                { label: "Stock P/E", val: selectedStock.marketData?.peRatio },
                { label: "Book Value", val: `₹${selectedStock.marketData?.bookValue}` },
                { label: "Dividend Yield", val: `${selectedStock.marketData?.dividendYield}%` },
                { label: "ROCE", val: `${selectedStock.ratios?.[selectedStock.ratios.length - 1]?.roce || 0}%` },
                { label: "ROE", val: `${selectedStock.growth?.profitGrowth?.ttm || 0}%` },
                { label: "Face Value", val: `₹${selectedStock.marketData?.faceValue}` },
                { label: "OPM", val: `${selectedStock.quarterlyResults?.[selectedStock.quarterlyResults.length - 1]?.opm || 0}%` },
                { label: "Debt", val: `₹${selectedStock.balanceSheet?.[selectedStock.balanceSheet.length - 1]?.borrowings?.toLocaleString() || 0} Cr.` },
                { label: "Debt to equity", val: "0.45" },
                { label: "Return on equity", val: `${selectedStock.growth?.profitGrowth?.ttm || 0}%` },
                { label: "Promoter holding", val: `${selectedStock.shareholding?.[selectedStock.shareholding.length - 1]?.promoters || 0}%` },
                { label: "EPS", val: `₹${selectedStock.marketData?.eps}` },
              ].map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: "14px 18px",
                    bgcolor: "#0b0f17",
                    border: "1px solid #1f2937",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: 52,
                    boxSizing: "border-box",
                    width: "100%", // Har box perfectly equal size ka hoga
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: "#ffffff", fontSize: "0.9rem", whiteSpace: "nowrap", pl: 1 }}>
                    {item.val}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* About & Key Points Section */}
            <Box sx={{ pt: 2.5, borderTop: "1px solid #1f2937" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: 0.5, mb: 1 }}>
                    ABOUT
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#9ca3af", lineHeight: 1.65, fontSize: "0.85rem" }}>
                    {selectedStock.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: 0.5, mb: 1 }}>
                    KEY POINTS
                  </Typography>
                  <Box sx={{ p: 1.8, bgcolor: "#0b0f17", borderRadius: "10px", border: "1px solid #1f2937" }}>
                    <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: "0.85rem", mb: 0.5 }}>
                      Sector: <strong style={{ color: "#ffffff" }}>{selectedStock.sector}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                      Industry: <strong style={{ color: "#ffffff" }}>{selectedStock.industry}</strong>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* 2. PURE BLACK TRADINGVIEW LIVE CANDLESTICK CHART */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              mb: 3.5,
              borderRadius: "14px",
              bgcolor: "#000000",
              borderColor: "#18181b",
              animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#ffffff", mb: 2, fontSize: "1.2rem", letterSpacing: -0.2 }}>
              📈 Interactive Live Chart (TradingView)
            </Typography>
            <TradingViewWidget symbol={selectedStock.symbol} />
          </Paper>

          {/* 3. PROS & CONS ANALYSIS */}
          {selectedStock.analysis && (
            <Grid container spacing={2.5} sx={{ mb: 3.5, animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: "12px", bgcolor: "#111827", borderColor: "#10b981" }}>
                  <Typography variant="h6" sx={{ color: "#34d399", fontWeight: "bold", mb: 1.5, fontSize: "1.05rem" }}>
                    PROS
                  </Typography>
                  {selectedStock.analysis.pros?.map((p, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: "#cbd5e1", display: "block", mb: 1, lineHeight: 1.6 }}>
                      • {p}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: "12px", bgcolor: "#111827", borderColor: "#ef4444" }}>
                  <Typography variant="h6" sx={{ color: "#f87171", fontWeight: "bold", mb: 1.5, fontSize: "1.05rem" }}>
                    CONS
                  </Typography>
                  {selectedStock.analysis.cons?.map((c, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: "#cbd5e1", display: "block", mb: 1, lineHeight: 1.6 }}>
                      • {c}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* 4. QUARTERLY RESULTS (HORIZONTAL) */}
          {selectedStock.quarterlyResults?.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3.5,
                borderRadius: "14px",
                bgcolor: "#111827",
                borderColor: "#1f2937",
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", mb: 0.5, fontSize: "1.3rem", letterSpacing: -0.3 }}>
                Quarterly Results
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af", display: "block", mb: 2.5 }}>
                Consolidated Figures in Rs. Crores
              </Typography>

              <TableContainer sx={{ overflowX: "auto", borderRadius: "10px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#0b0f17" }}>
                      <TableCell sx={{ color: "#9ca3af", fontWeight: "bold", position: "sticky", left: 0, bgcolor: "#0b0f17", minWidth: 170, zIndex: 3 }}>
                        Metric
                      </TableCell>
                      {selectedStock.quarterlyResults.map((q, idx) => (
                        <TableCell key={idx} align="right" sx={{ color: "#9ca3af", fontWeight: "bold", minWidth: 95 }}>
                          {q.period}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { label: "Sales +", key: "sales" },
                      { label: "Expenses +", key: "expenses" },
                      { label: "Operating Profit", key: "operatingProfit", bold: true },
                      { label: "OPM %", key: "opm", suffix: "%" },
                      { label: "Other Income +", key: "otherIncome" },
                      { label: "Interest", key: "interest" },
                      { label: "Depreciation", key: "depreciation" },
                      { label: "Profit before tax", key: "profitBeforeTax" },
                      { label: "Tax %", key: "taxPercentage", suffix: "%" },
                      { label: "Net Profit +", key: "netProfit", bold: true, highlight: true },
                      { label: "EPS in Rs", key: "eps" },
                    ].map((rowDef, rIdx) => (
                      <TableRow key={rIdx} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                        <TableCell sx={{ ...stickyMetricCellStyle, color: rowDef.highlight ? "#38bdf8" : "#f3f4f6", fontWeight: rowDef.bold ? "bold" : "normal" }}>
                          {rowDef.label}
                        </TableCell>
                        {selectedStock.quarterlyResults.map((q, qIdx) => (
                          <TableCell key={qIdx} align="right" sx={{ color: rowDef.highlight ? "#38bdf8" : "#cbd5e1", fontWeight: rowDef.bold ? "bold" : "normal", borderBottom: "1px solid #1f2937" }}>
                            {typeof q[rowDef.key] === "number" ? q[rowDef.key].toLocaleString() : (q[rowDef.key] ?? "-")}{rowDef.suffix || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* 5. PROFIT & LOSS (HORIZONTAL) */}
          {selectedStock.profitLoss?.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3.5,
                borderRadius: "14px",
                bgcolor: "#111827",
                borderColor: "#1f2937",
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", mb: 0.5, fontSize: "1.3rem", letterSpacing: -0.3 }}>
                Profit & Loss
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af", display: "block", mb: 2.5 }}>
                Consolidated Figures in Rs. Crores (Yearly)
              </Typography>

              <TableContainer sx={{ overflowX: "auto", borderRadius: "10px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#0b0f17" }}>
                      <TableCell sx={{ color: "#9ca3af", fontWeight: "bold", position: "sticky", left: 0, bgcolor: "#0b0f17", minWidth: 170, zIndex: 3 }}>
                        Metric
                      </TableCell>
                      {selectedStock.profitLoss.map((p, idx) => (
                        <TableCell key={idx} align="right" sx={{ color: "#9ca3af", fontWeight: "bold", minWidth: 95 }}>
                          {p.period}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { label: "Sales +", key: "sales" },
                      { label: "Expenses +", key: "expenses" },
                      { label: "Operating Profit", key: "operatingProfit", bold: true },
                      { label: "OPM %", key: "opm", suffix: "%" },
                      { label: "Other Income +", key: "otherIncome" },
                      { label: "Interest", key: "interest" },
                      { label: "Depreciation", key: "depreciation" },
                      { label: "Profit before tax", key: "profitBeforeTax" },
                      { label: "Tax %", key: "taxPercentage", suffix: "%" },
                      { label: "Net Profit +", key: "netProfit", bold: true, highlight: true },
                      { label: "EPS in Rs", key: "eps" },
                      { label: "Dividend Payout %", key: "dividendPayout", suffix: "%" },
                    ].map((rowDef, rIdx) => (
                      <TableRow key={rIdx} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                        <TableCell sx={{ ...stickyMetricCellStyle, color: rowDef.highlight ? "#38bdf8" : "#f3f4f6", fontWeight: rowDef.bold ? "bold" : "normal" }}>
                          {rowDef.label}
                        </TableCell>
                        {selectedStock.profitLoss.map((p, pIdx) => (
                          <TableCell key={pIdx} align="right" sx={{ color: rowDef.highlight ? "#38bdf8" : "#cbd5e1", fontWeight: rowDef.bold ? "bold" : "normal", borderBottom: "1px solid #1f2937" }}>
                            {typeof p[rowDef.key] === "number" ? p[rowDef.key].toLocaleString() : (p[rowDef.key] ?? "-")}{rowDef.suffix || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* 6. BALANCE SHEET (HORIZONTAL) */}
          {selectedStock.balanceSheet?.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3.5,
                borderRadius: "14px",
                bgcolor: "#111827",
                borderColor: "#1f2937",
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", mb: 0.5, fontSize: "1.3rem", letterSpacing: -0.3 }}>
                Balance Sheet
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af", display: "block", mb: 2.5 }}>
                Consolidated Figures in Rs. Crores
              </Typography>

              <TableContainer sx={{ overflowX: "auto", borderRadius: "10px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#0b0f17" }}>
                      <TableCell sx={{ color: "#9ca3af", fontWeight: "bold", position: "sticky", left: 0, bgcolor: "#0b0f17", minWidth: 170, zIndex: 3 }}>
                        Metric
                      </TableCell>
                      {selectedStock.balanceSheet.map((b, idx) => (
                        <TableCell key={idx} align="right" sx={{ color: "#9ca3af", fontWeight: "bold", minWidth: 95 }}>
                          {b.period}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { label: "Equity Capital", key: "equityCapital" },
                      { label: "Reserves", key: "reserves" },
                      { label: "Borrowings +", key: "borrowings", highlightColor: "#f87171" },
                      { label: "Other Liabilities +", key: "otherLiabilities" },
                      { label: "Total Liabilities", key: "totalLiabilities", bold: true },
                      { label: "Fixed Assets +", key: "fixedAssets" },
                      { label: "CWIP", key: "cwip" },
                      { label: "Investments", key: "investments" },
                      { label: "Other Assets +", key: "otherAssets" },
                      { label: "Total Assets", key: "totalAssets", bold: true, highlight: true },
                    ].map((rowDef, rIdx) => (
                      <TableRow key={rIdx} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                        <TableCell sx={{ ...stickyMetricCellStyle, color: rowDef.highlight ? "#38bdf8" : "#f3f4f6", fontWeight: rowDef.bold ? "bold" : "normal" }}>
                          {rowDef.label}
                        </TableCell>
                        {selectedStock.balanceSheet.map((b, bIdx) => (
                          <TableCell
                            key={bIdx}
                            align="right"
                            sx={{
                              color: rowDef.highlightColor || (rowDef.highlight ? "#38bdf8" : "#cbd5e1"),
                              fontWeight: rowDef.bold ? "bold" : "normal",
                              borderBottom: "1px solid #1f2937",
                            }}
                          >
                            {typeof b[rowDef.key] === "number" ? b[rowDef.key].toLocaleString() : (b[rowDef.key] ?? "-")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* 7. CASH FLOW (HORIZONTAL) */}
          {selectedStock.cashFlow?.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3.5,
                borderRadius: "14px",
                bgcolor: "#111827",
                borderColor: "#1f2937",
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", mb: 0.5, fontSize: "1.3rem", letterSpacing: -0.3 }}>
                Cash Flows
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af", display: "block", mb: 2.5 }}>
                Consolidated Figures in Rs. Crores
              </Typography>

              <TableContainer sx={{ overflowX: "auto", borderRadius: "10px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#0b0f17" }}>
                      <TableCell sx={{ color: "#9ca3af", fontWeight: "bold", position: "sticky", left: 0, bgcolor: "#0b0f17", minWidth: 170, zIndex: 3 }}>
                        Metric
                      </TableCell>
                      {selectedStock.cashFlow.map((c, idx) => (
                        <TableCell key={idx} align="right" sx={{ color: "#9ca3af", fontWeight: "bold", minWidth: 95 }}>
                          {c.period}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { label: "Cash from Operating Activity +", key: "cashFromOperatingActivity" },
                      { label: "Cash from Investing Activity +", key: "cashFromInvestingActivity" },
                      { label: "Cash from Financing Activity +", key: "cashFromFinancingActivity" },
                      { label: "Net Cash Flow", key: "netCashFlow", bold: true },
                      { label: "Free Cash Flow", key: "freeCashFlow", bold: true, highlight: true },
                      { label: "CFO/OP", key: "cfoToOperatingProfit", suffix: "%" },
                    ].map((rowDef, rIdx) => (
                      <TableRow key={rIdx} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                        <TableCell sx={{ ...stickyMetricCellStyle, color: rowDef.highlight ? "#34d399" : "#f3f4f6", fontWeight: rowDef.bold ? "bold" : "normal" }}>
                          {rowDef.label}
                        </TableCell>
                        {selectedStock.cashFlow.map((c, cIdx) => (
                          <TableCell
                            key={cIdx}
                            align="right"
                            sx={{
                              color: rowDef.highlight ? "#34d399" : "#cbd5e1",
                              fontWeight: rowDef.bold ? "bold" : "normal",
                              borderBottom: "1px solid #1f2937",
                            }}
                          >
                            {typeof c[rowDef.key] === "number" ? c[rowDef.key].toLocaleString() : (c[rowDef.key] ?? "-")}{rowDef.suffix || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* 8. RATIOS (HORIZONTAL) */}
          {selectedStock.ratios?.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3.5,
                borderRadius: "14px",
                bgcolor: "#111827",
                borderColor: "#1f2937",
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", mb: 0.5, fontSize: "1.3rem", letterSpacing: -0.3 }}>
                Ratios
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af", display: "block", mb: 2.5 }}>
                Efficiency & Return Metrics
              </Typography>

              <TableContainer sx={{ overflowX: "auto", borderRadius: "10px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#0b0f17" }}>
                      <TableCell sx={{ color: "#9ca3af", fontWeight: "bold", position: "sticky", left: 0, bgcolor: "#0b0f17", minWidth: 170, zIndex: 3 }}>
                        Metric
                      </TableCell>
                      {selectedStock.ratios.map((r, idx) => (
                        <TableCell key={idx} align="right" sx={{ color: "#9ca3af", fontWeight: "bold", minWidth: 95 }}>
                          {r.period}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { label: "ROCE %", key: "roce", suffix: "%", bold: true, highlight: true },
                      { label: "Debtor Days", key: "debtorDays" },
                      { label: "Cash Conversion Cycle", key: "cashConversionCycle" },
                      { label: "Working Capital Days", key: "workingCapitalDays" },
                    ].map((rowDef, rIdx) => (
                      <TableRow key={rIdx} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                        <TableCell sx={{ ...stickyMetricCellStyle, color: rowDef.highlight ? "#38bdf8" : "#f3f4f6", fontWeight: rowDef.bold ? "bold" : "normal" }}>
                          {rowDef.label}
                        </TableCell>
                        {selectedStock.ratios.map((r, rIdx2) => (
                          <TableCell
                            key={rIdx2}
                            align="right"
                            sx={{
                              color: rowDef.highlight ? "#38bdf8" : "#cbd5e1",
                              fontWeight: rowDef.bold ? "bold" : "normal",
                              borderBottom: "1px solid #1f2937",
                            }}
                          >
                            {typeof r[rowDef.key] === "number" ? r[rowDef.key].toLocaleString() : (r[rowDef.key] ?? "-")}{rowDef.suffix || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* 9. SHAREHOLDING PATTERN (HORIZONTAL) */}
          {selectedStock.shareholding?.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3.5,
                borderRadius: "14px",
                bgcolor: "#111827",
                borderColor: "#1f2937",
                animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", mb: 0.5, fontSize: "1.3rem", letterSpacing: -0.3 }}>
                Shareholding Pattern
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af", display: "block", mb: 2.5 }}>
                Numbers in percentages
              </Typography>

              <TableContainer sx={{ overflowX: "auto", borderRadius: "10px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#0b0f17" }}>
                      <TableCell sx={{ color: "#9ca3af", fontWeight: "bold", position: "sticky", left: 0, bgcolor: "#0b0f17", minWidth: 170, zIndex: 3 }}>
                        Shareholder
                      </TableCell>
                      {selectedStock.shareholding.map((s, idx) => (
                        <TableCell key={idx} align="right" sx={{ color: "#9ca3af", fontWeight: "bold", minWidth: 95 }}>
                          {s.period}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { label: "Promoters +", key: "promoters", suffix: "%", bold: true },
                      { label: "FIIs +", key: "fiis", suffix: "%" },
                      { label: "DIIs +", key: "diis", suffix: "%" },
                      { label: "Government +", key: "government", suffix: "%" },
                      { label: "Public +", key: "public", suffix: "%" },
                      { label: "No. of Shareholders", key: "numberOfShareholders" },
                    ].map((rowDef, rIdx) => (
                      <TableRow key={rIdx} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                        <TableCell sx={{ ...stickyMetricCellStyle, color: "#f3f4f6", fontWeight: rowDef.bold ? "bold" : "normal" }}>
                          {rowDef.label}
                        </TableCell>
                        {selectedStock.shareholding.map((s, sIdx) => (
                          <TableCell key={sIdx} align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>
                            {typeof s[rowDef.key] === "number" ? s[rowDef.key].toLocaleString() : (s[rowDef.key] ?? "-")}{rowDef.suffix || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      ) : (
        /* ========================================================= */
        /* DEFAULT WATCHLIST TABLE (INITIAL LOAD) */
        /* ========================================================= */
        <Box sx={{ animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "14px", bgcolor: "#111827", borderColor: "#1f2937" }}>
            <Table size="small" sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#0b0f17" }}>
                  <TableCell sx={{ color: "#9ca3af", fontWeight: "bold" }}>S.No. ↑</TableCell>
                  <TableCell sx={{ color: "#9ca3af", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold" }}>CMP Rs.</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold" }}>Mar Cap Rs.Cr.</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold" }}>P/E</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold" }}>CMP / BV</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold" }}>Div Yld %</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold" }}>ROCE %</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold" }}>Sales Rs.Cr.</TableCell>
                  <TableCell align="right" sx={{ color: "#9ca3af", fontWeight: "bold" }}>Debt Rs.Cr.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.length > 0 ? (
                  stocks.map((row) => (
                    <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#1f2937" } }}>
                      <TableCell sx={{ color: "#f3f4f6", borderBottom: "1px solid #1f2937" }}>{row.sNo}.</TableCell>
                      <TableCell component="th" scope="row" sx={{ borderBottom: "1px solid #1f2937" }}>
                        <Link
                          component="button"
                          underline="hover"
                          onClick={() => {
                            setSearchQuery(row.symbol);
                            fetchStocks(row.symbol);
                          }}
                          sx={{ fontWeight: "medium", color: "#60a5fa" }}
                        >
                          {row.name}
                        </Link>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold", color: "#f3f4f6", borderBottom: "1px solid #1f2937" }}>
                        {row.cmp?.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>
                        {row.marCap?.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>{row.pe?.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>{row.cmpBv?.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>{row.divYld?.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>{row.roce?.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>{row.sales?.toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ color: "#cbd5e1", borderBottom: "1px solid #1f2937" }}>{row.debt?.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 5, color: "#9ca3af" }}>
                      {loading ? "Searching stocks..." : "Invalid company Name"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ========================================================= */}
      {/* FOOTER SECTION */}
      {/* ========================================================= */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          pt: 4,
          pb: 3,
          px: 2,
          borderTop: "1px solid #1f2937",
          animation: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: "#2563eb", fontSize: "0.85rem" }}>W</Avatar>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
                WealthNova Financials
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 450, fontSize: "0.82rem" }}>
              Comprehensive Indian stock screener, fundamental ratios analysis, live TradingView charting and quarterly financials tracking.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Stack direction="row" spacing={2.5} justifyContent={{ xs: "flex-start", md: "flex-end" }} sx={{ mb: 1 }}>
              <Link href="#" underline="hover" sx={{ color: "#9ca3af", fontSize: "0.82rem" }}>Feed</Link>
              <Link href="#" underline="hover" sx={{ color: "#9ca3af", fontSize: "0.82rem" }}>Screens</Link>
              <Link href="#" underline="hover" sx={{ color: "#9ca3af", fontSize: "0.82rem" }}>Tools</Link>
              <Link href="#" underline="hover" sx={{ color: "#9ca3af", fontSize: "0.82rem" }}>Privacy & Terms</Link>
            </Stack>
            <Typography variant="caption" sx={{ color: "#4b5563" }}>
              © 2026 WealthNova Analytics. Data provided for educational and analytical purposes.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}