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
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWalletRounded,
  ShowChartRounded,
  PieChartRounded,
  SavingsRounded,
  ArrowForwardRounded,
  RefreshRounded,
  BookmarkBorderRounded,
  AddRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const indicesData = [
  { name: "NIFTY 50", value: "24,856.20", change: "+148.65", percent: "+0.60%", positive: true },
  { name: "SENSEX", value: "81,745.80", change: "+432.10", percent: "+0.53%", positive: true },
  { name: "BANK NIFTY", value: "52,380.40", change: "+195.20", percent: "+0.37%", positive: true },
  { name: "NIFTY IT", value: "39,120.75", change: "-84.30", percent: "-0.21%", positive: false },
];

const topMovers = [
  { symbol: "TCS", company: "Tata Consultancy Services", price: "₹4,285.50", change: "+2.85%", positive: true, volume: "1.8M", mktCap: "₹15.5T" },
  { symbol: "RELIANCE", company: "Reliance Industries Ltd", price: "₹2,940.10", change: "+1.92%", positive: true, volume: "3.4M", mktCap: "₹19.9T" },
  { symbol: "HDFCBANK", company: "HDFC Bank Ltd", price: "₹1,684.20", change: "+1.25%", positive: true, volume: "5.1M", mktCap: "₹12.8T" },
  { symbol: "INFY", company: "Infosys Ltd", price: "₹1,780.00", change: "-0.64%", positive: false, volume: "2.2M", mktCap: "₹7.4T" },
  { symbol: "TATAMOTORS", company: "Tata Motors Ltd", price: "₹965.80", change: "+3.42%", positive: true, volume: "6.7M", mktCap: "₹3.5T" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", pb: 4 }}>
      {/* Top Banner & Greetings */}
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Market & Wealth Overview
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Welcome back! Here is a real-time summary of your portfolio and market dynamics.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<BookmarkBorderRounded />}
            onClick={() => navigate("/home/watchlist")}
            sx={{
              borderColor: "divider",
              color: "text.primary",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            Watchlist
          </Button>

          <Button
            variant="contained"
            size="medium"
            startIcon={<AddRounded />}
            onClick={() => navigate("/home/calculator")}
            sx={{
              background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
            }}
          >
            SIP Calculator
          </Button>
        </Stack>
      </Box>

      {/* Market Indices Ticker Bar */}
      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        {indicesData.map((idx) => (
          <Grid item xs={6} sm={3} key={idx.name}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(15, 23, 42, 0.6)"
                    : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(8px)",
                borderColor: "divider",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px -6px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {idx.name}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, my: 0.5 }}>
                {idx.value}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {idx.positive ? (
                  <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: "error.main" }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: idx.positive ? "success.main" : "error.main",
                    fontWeight: 700,
                  }}
                >
                  {idx.change} ({idx.percent})
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 4 Key Portfolio Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {/* Card 1: Total Net Worth */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(14, 116, 144, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)"
                  : "linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(56, 189, 248, 0.2)"
                  : "rgba(2, 132, 199, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Total Net Worth
              </Typography>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  bgcolor: "primary.main",
                  color: "#ffffff",
                  display: "flex",
                }}
              >
                <AccountBalanceWalletRounded fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
              ₹18,45,280
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Chip
                size="small"
                label="+1.79% Today"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.15)",
                  color: "success.main",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                +₹32,450.00
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Card 2: Unrealized Gain */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(6, 95, 70, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)"
                  : "linear-gradient(135deg, #dcfce7 0%, #ffffff 100%)",
              border: "1px solid",
              borderColor: "rgba(16, 185, 129, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Total Returns
              </Typography>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  bgcolor: "success.main",
                  color: "#ffffff",
                  display: "flex",
                }}
              >
                <ShowChartRounded fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px", color: "success.main" }}>
              +₹3,85,620
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Chip
                size="small"
                label="+26.4% All-Time"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.15)",
                  color: "success.main",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                CAGR: 18.2%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Card 3: Invested Value */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)"
                  : "linear-gradient(135deg, #ede9fe 0%, #ffffff 100%)",
              border: "1px solid",
              borderColor: "rgba(99, 102, 241, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Invested Capital
              </Typography>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  bgcolor: "secondary.main",
                  color: "#ffffff",
                  display: "flex",
                }}
              >
                <SavingsRounded fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
              ₹14,59,660
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Active in 14 bluechip securities
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Card 4: Liquid Cash */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)"
                  : "linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)",
              border: "1px solid",
              borderColor: "rgba(245, 158, 11, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Available Cash
              </Typography>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  bgcolor: "warning.main",
                  color: "#ffffff",
                  display: "flex",
                }}
              >
                <PieChartRounded fontSize="small" />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
              ₹2,18,500
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                Ready to deploy in opportunities
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Grid: Stock Movers + Asset Allocation */}
      <Grid container spacing={3}>
        {/* Left Column: Top Market Movers Table */}
        <Grid item xs={12} lg={8}>
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
                  High Growth Movers & Watchlist
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Active large-cap securities tracked on NSE
                </Typography>
              </Box>

              <Button
                size="small"
                endIcon={<ArrowForwardRounded />}
                onClick={() => navigate("/home/watchlist")}
                sx={{ fontWeight: 700 }}
              >
                View Full Watchlist
              </Button>
            </Box>

            <TableContainer>
              <Table size="medium">
                <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Company / Symbol</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Day Change</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Volume</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Market Cap</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topMovers.map((stock) => (
                    <TableRow
                      key={stock.symbol}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {stock.symbol}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {stock.company}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {stock.price}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={stock.change}
                          sx={{
                            fontWeight: 700,
                            bgcolor: stock.positive ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)",
                            color: stock.positive ? "success.main" : "error.main",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: "text.secondary" }}>
                        {stock.volume}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {stock.mktCap}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Column: Asset Allocation & Intelligence Score */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Asset Allocation Card */}
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: "16px",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Asset Allocation
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                Portfolio diversification across asset classes
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Equities & Large Cap (68%)
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      ₹12.54 L
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={68}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": { bgcolor: "primary.main" },
                    }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Mutual Funds & ETFs (18%)
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      ₹3.32 L
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={18}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": { bgcolor: "secondary.main" },
                    }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Liquid Cash & Arbitrage (14%)
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      ₹2.58 L
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={14}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": { bgcolor: "warning.main" },
                    }}
                  />
                </Box>
              </Stack>
            </Paper>

            {/* AI Wealth Health Score Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                color: "#ffffff",
                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
              }}
            >
              <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 700, letterSpacing: 0.5 }}>
                WEALTH INTELLIGENCE
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, mb: 1 }}>
                Portfolio Health: 92/100
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 2.5, lineHeight: 1.5 }}>
                Your holdings reflect exceptional sector balance, strong dividend returns, and healthy margin of safety.
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/home/portfolio")}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(8px)",
                  color: "#ffffff",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                }}
              >
                Analyze Deep Health
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;