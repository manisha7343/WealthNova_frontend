import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  PieChartRounded,
  AddRounded,
  FilterListRounded,
  FileDownloadRounded,
} from "@mui/icons-material";

const holdings = [
  { symbol: "TCS", company: "Tata Consultancy Services", qty: 45, avgPrice: "₹3,450.00", cmp: "₹4,285.50", currentVal: "₹1,92,847.50", pnl: "+₹37,597.50", pnlPercent: "+24.22%", positive: true, sector: "IT" },
  { symbol: "RELIANCE", company: "Reliance Industries Ltd", qty: 120, avgPrice: "₹2,420.00", cmp: "₹2,940.10", currentVal: "₹3,52,812.00", pnl: "+₹62,412.00", pnlPercent: "+21.49%", positive: true, sector: "Energy" },
  { symbol: "HDFCBANK", company: "HDFC Bank Ltd", qty: 250, avgPrice: "₹1,510.00", cmp: "₹1,684.20", currentVal: "₹4,21,050.00", pnl: "+₹43,550.00", pnlPercent: "+11.54%", positive: true, sector: "Banking" },
  { symbol: "TATAMOTORS", company: "Tata Motors Ltd", qty: 300, avgPrice: "₹680.00", cmp: "₹965.80", currentVal: "₹2,89,740.00", pnl: "+₹85,740.00", pnlPercent: "+42.03%", positive: true, sector: "Auto" },
  { symbol: "INFY", company: "Infosys Ltd", qty: 110, avgPrice: "₹1,440.00", cmp: "₹1,780.00", currentVal: "₹1,95,800.00", pnl: "+₹37,400.00", pnlPercent: "+23.61%", positive: true, sector: "IT" },
  { symbol: "ITC", company: "ITC Ltd", qty: 400, avgPrice: "₹420.00", cmp: "₹482.30", currentVal: "₹1,92,920.00", pnl: "+₹24,920.00", pnlPercent: "+14.83%", positive: true, sector: "FMCG" },
];

const Portfolio = () => {
  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
            My Stock Portfolio
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Consolidated overview of all your active investments, profit/loss, and sector weights.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" size="medium" startIcon={<FileDownloadRounded />}>
            Export CSV
          </Button>
          <Button
            variant="contained"
            size="medium"
            startIcon={<AddRounded />}
            sx={{
              background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              color: "#ffffff",
            }}
          >
            Add Transaction
          </Button>
        </Stack>
      </Box>

      {/* Summary KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "14px", borderColor: "divider" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Current Portfolio Value
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5 }}>
              ₹18,45,280
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Invested: ₹14,59,660
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "14px", borderColor: "divider" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Total Profit / Loss
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: "success.main" }}>
              +₹3,85,620
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
              <Typography variant="caption" sx={{ color: "success.main", fontWeight: 700 }}>
                +26.42% Total Return
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "14px", borderColor: "divider" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Today's Gain
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: "success.main" }}>
              +₹12,850
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
              <Typography variant="caption" sx={{ color: "success.main", fontWeight: 700 }}>
                +0.70% (1 Day)
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "14px", borderColor: "divider" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Portfolio XIRR
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: "primary.main" }}>
              21.8%
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Annualized Growth Rate
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Holdings Table */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Current Holdings ({holdings.length})
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Real-time mark to market valuation
            </Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Sector</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Qty</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Avg. Buy Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>CMP</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Current Value</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total P&L</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.map((h) => (
                <TableRow key={h.symbol} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {h.symbol}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {h.company}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip size="small" label={h.sector} variant="outlined" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {h.qty}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "text.secondary" }}>
                    {h.avgPrice}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {h.cmp}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>
                    {h.currentVal}
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        color: h.positive ? "success.main" : "error.main",
                      }}
                    >
                      {h.pnl}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: h.positive ? "success.main" : "error.main",
                      }}
                    >
                      {h.pnlPercent}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Portfolio;