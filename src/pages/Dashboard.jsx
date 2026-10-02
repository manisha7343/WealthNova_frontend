import { useEffect, useState, useRef, memo, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  InputBase,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import BarChartIcon from "@mui/icons-material/BarChart";
import BoltIcon from "@mui/icons-material/Bolt";

const API_BASE = "http://localhost:3002";
const GREEN = "#10b981";
const RED = "#ef4444";

// ==========================================
// LAYOUT CONSTANTS
// ==========================================
// Every IPO / news card has the same fixed height so exactly 6 fit on screen.
const CARD_H = 72;
const GAP = 8;
const VISIBLE_CARDS = 5;
const SIX_ROWS_H = CARD_H * VISIBLE_CARDS + GAP * (VISIBLE_CARDS - 1); // list height for 5 cards
// Compact rows (indices, stocks, crypto)
const ROW_H = 64;
const SIX_COMPACT_H = ROW_H * 6 + 8 * 5;

const scrollSx = {
  overflowY: "auto",
  pr: 0.5,
  "&::-webkit-scrollbar": { width: 6 },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: "#374151", borderRadius: 3 },
  "&::-webkit-scrollbar-thumb:hover": { background: "#4b5563" },
  scrollbarWidth: "thin",
  scrollbarColor: "#374151 transparent",
};

// ==========================================
// HELPERS
// ==========================================
const toNum = (v) => {
  const n = typeof v === "string" ? parseFloat(v.replace(/,/g, "")) : Number(v);
  return Number.isFinite(n) ? n : 0;
};
const fmtPrice = (v) =>
  toNum(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (v) => {
  const num = toNum(v);
  const formatted = Math.abs(num).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${num >= 0 ? "+" : "-"}${formatted}%`;
};
const fmtVol = (v) =>
  new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 2 }).format(toNum(v));

// Maps whatever field names your DB model uses to one shape.
// If your model uses different names, add them here.
const normalizeStock = (s) => ({
  key: s._id || s.id || s.symbol || s.name,
  name: s.name || s.companyName || s.company || s.symbol || "—",
  symbol: s.symbol || s.ticker || "",
  price: toNum(s.price ?? s.ltp ?? s.lastPrice ?? s.close),
  percent: toNum(s.percentChange ?? s.changePercent ?? s.pChange ?? s.percent),
  volume: toNum(s.volume ?? s.totalVolume ?? s.tradedVolume),
});

// ==========================================
// 1. TRADINGVIEW ADVANCED CHART (DYNAMIC)
// ==========================================
const DashboardChart = memo(({ symbol }) => {
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
      symbol: symbol,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "in",
      enable_publishing: false,
      backgroundColor: "#0b0f17",
      gridColor: "#1f2937",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
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
        overflow: "hidden",
        borderTop: "1px solid #1f2937",
        borderBottom: "1px solid #1f2937",
      }}
    />
  );
});

// ==========================================
// MOCK / STATIC DATA
// ==========================================
const IPO_DATA = [
  { id: 1, name: "Swiggy Ltd.", date: "Oct 18 - Oct 20, 2026", price: "₹370 - ₹390", size: "₹10,414 Cr", status: "Upcoming" },
  { id: 2, name: "NTPC Green Energy", date: "Nov 05 - Nov 07, 2026", price: "₹100 - ₹108", size: "₹10,000 Cr", status: "Upcoming" },
  { id: 3, name: "Tata Play", date: "TBA", price: "TBA", size: "₹2,500 Cr", status: "Filed DRHP" },
  { id: 4, name: "Hyundai Motor India", date: "Closed", price: "₹1,865 - ₹1,960", size: "₹27,870 Cr", status: "Listed" },
];

const FOREIGN_NEWS = [
  { id: 1, source: "Reuters", time: "10 mins ago", title: "Federal Reserve hints at steady rates ahead of Q4", desc: "US central bank officials suggest holding the interest rates steady amidst cooling inflation data." },
  { id: 2, source: "Bloomberg", time: "1 hr ago", title: "Tech stocks rally in pre-market trading in NASDAQ", desc: "Major semiconductor companies see a 4% jump globally following strong earnings reports from Asia." },
  { id: 3, source: "Financial Times", time: "3 hrs ago", title: "ECB prepares for a strategic pivot next month", desc: "European markets brace for a potential policy shift as economic growth shows signs of stabilization." },
  { id: 4, source: "CNBC", time: "5 hrs ago", title: "Crude oil slips below $75 per barrel", desc: "Global oil prices trend downwards as non-OPEC supply increases counteract recent production cuts." },
];

// Static crypto info (no API) - illustrative only.
const CRYPTO_DATA = [
  { symbol: "BTC", name: "Bitcoin", price: "$67,420", change: 2.84, why: "Steady spot ETF inflows and expectations of lower US interest rates pushed demand higher." },
  { symbol: "ETH", name: "Ethereum", price: "$3,512", change: 1.96, why: "Growing activity on layer-2 networks and staking demand reduced the supply available on exchanges." },
  { symbol: "SOL", name: "Solana", price: "$168.40", change: 5.12, why: "Rising on-chain volumes and new app launches attracted fresh buyers to the network." },
  { symbol: "XRP", name: "XRP", price: "$0.5230", change: -2.31, why: "Profit booking after a recent rally, along with uncertainty around regulatory updates." },
  { symbol: "BNB", name: "BNB", price: "$584.10", change: -0.87, why: "Slight pullback as traders moved funds into higher-beta coins; trend remains range-bound." },
  { symbol: "DOGE", name: "Dogecoin", price: "$0.1342", change: -4.65, why: "Social media hype cooled down, so short-term speculative traders exited their positions." },
  { symbol: "ADA", name: "Cardano", price: "$0.4410", change: 1.12, why: "Mild recovery supported by broader market sentiment and upgrade announcements." },
];

// ==========================================
// REUSABLE UI PIECES
// ==========================================
const Section = ({ children, bgcolor = "transparent" }) => (
  <Box
    sx={{
      border: "1px solid #ffffff",
      borderRadius: "14px",
      p: { xs: 2, md: 3 },
      bgcolor: bgcolor,
      mb: 3,
    }}
  >
    {children}
  </Box>
);

const TwoCol = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
      gap: 3,
    }}
  >
    {children}
  </Box>
);

const PanelTitle = ({ icon, children, count }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
    {icon}
    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
      {children}
    </Typography>
    {count !== undefined && (
      <Typography variant="caption" sx={{ color: "#6b7280" }}>
        ({count})
      </Typography>
    )}
  </Stack>
);

const EmptyState = ({ text }) => (
  <Box sx={{ py: 4, textAlign: "center" }}>
    <Typography variant="caption" sx={{ color: "#6b7280" }}>
      {text}
    </Typography>
  </Box>
);

const PctBadge = ({ value, solid = false }) => {
  const up = value >= 0;
  return (
    <Box
      sx={{
        px: 1,
        py: 0.4,
        minWidth: 76,
        textAlign: "center",
        borderRadius: "6px",
        fontSize: "0.78rem",
        fontWeight: "bold",
        bgcolor: solid ? (up ? GREEN : RED) : up ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
        color: solid ? "#fff" : up ? GREEN : RED,
      }}
    >
      {fmtPct(value)}
    </Box>
  );
};

// One row used by volume / volatile / gainers / losers lists
const StockRow = ({ stock, showVolume = false, solid = false }) => {
  const initial = (stock.name || stock.symbol || "?").charAt(0).toUpperCase();
  return (
    <Paper
      elevation={0}
      sx={{
        height: ROW_H,
        px: 1.5,
        py: 0.5,
        bgcolor: "#0b0f17",
        border: "1px solid #1f2937",
        borderRadius: "8px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s",
        "&:hover": { borderColor: "#155ac8", bgcolor: "#111827" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: "bold",
            color: "#94a3b8",
            flexShrink: 0,
            border: "1px solid #334155",
          }}
        >
          {initial}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ color: "#e5e7eb" }}>
            {stock.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                bgcolor: "#1e293b",
                color: "#94a3b8",
                px: 0.8,
                py: 0.1,
                borderRadius: "4px",
                fontSize: "0.68rem",
                fontWeight: "bold",
                letterSpacing: 0.5,
              }}
            >
              {stock.symbol}
            </Box>
            {showVolume && stock.volume ? (
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Vol {fmtVol(stock.volume)}
              </Typography>
            ) : null}
          </Stack>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
        <Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>
          {fmtPrice(stock.price)}{" "}
          <span style={{ fontSize: "0.68rem", color: "#6b7280", fontWeight: "normal" }}>INR</span>
        </Typography>
        <PctBadge value={stock.percent} solid={solid} />
      </Stack>
    </Paper>
  );
};

// ==========================================
// 2. MAIN DASHBOARD COMPONENT
// ==========================================
export default function Dashboard() {
  const [marketIndices, setMarketIndices] = useState([]);
  const [ipos, setIpos] = useState(IPO_DATA);
  const [newsList, setNewsList] = useState(FOREIGN_NEWS);
  // const [cryptoList, setCryptoList] = useState(CRYPTO_DATA);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [activeSymbol, setActiveSymbol] = useState("BSE:SENSEX");
  const [displayName, setDisplayName] = useState("SENSEX");

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/market/indices`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped = json.data.map((item) => ({
          name: item.name,
          value: item.price,
          change: item.change,
          percent: item.percentChange,
          exchange: item.exchange || "NSE",
        }));
        setMarketIndices(mapped);
      } else {
        setMarketIndices([
          { name: "NIFTY 50", value: 24574.13, change: 124.6, percent: 0.51, exchange: "NSE" },
          { name: "SENSEX", value: 80742.37, change: 412.3, percent: 0.51, exchange: "BSE" },
          { name: "BANK NIFTY", value: 52847.65, change: -185.4, percent: -0.35, exchange: "NSE" },
          { name: "INDIA VIX", value: 12.84, change: -0.45, percent: -3.38, exchange: "NSE" },
          { name: "GOLD (MCX)", value: 76512.0, change: 350.0, percent: 0.46, exchange: "MCX" },
          { name: "SILVER (MCX)", value: 91000.0, change: -240.0, percent: -0.26, exchange: "MCX" },
          { name: "USD / INR", value: 83.5, change: 0.08, percent: 0.1, exchange: "FOREX" },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch market indices:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIpos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ipo`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setIpos(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch IPOs from backend:", err);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/news?limit=20`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setNewsList(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch news from backend:", err);
    }
  };

  const fetchCrypto = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/crypto`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setCryptoList(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch crypto from backend:", err);
    }
  };

  // One call feeds: highest volume, most volatile, top gainers, top losers.
  // CHANGE THIS URL to the route that returns your stocks from the DB.
  const fetchStocks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/market/stocks`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStocks(json.data.map(normalizeStock));
      }
    } catch (err) {
      console.error("Failed to fetch stocks from backend:", err);
    }
  };

  useEffect(() => {
    fetchMarketData();
    fetchIpos();
    fetchNews();
    fetchCrypto();
    fetchStocks();
  }, []);

  const handleRefresh = () => {
    fetchMarketData();
    fetchCrypto();
    fetchStocks();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const query = searchInput.trim().toUpperCase();
      const formattedSymbol = query.includes(":") ? query : `BSE:${query}`;
      setActiveSymbol(formattedSymbol);
      setDisplayName(query.replace("BSE:", "").replace("NSE:", ""));
    }
  };

  // ---- Derived lists (computed from DB data) ----
  const highestVolume = useMemo(
    () => [...stocks].filter((s) => s.volume > 0).sort((a, b) => b.volume - a.volume).slice(0, 20),
    [stocks]
  );
  const mostVolatile = useMemo(
    () => [...stocks].sort((a, b) => Math.abs(b.percent) - Math.abs(a.percent)).slice(0, 20),
    [stocks]
  );
  const gainers = useMemo(
    () => [...stocks].filter((s) => s.percent > 0).sort((a, b) => b.percent - a.percent).slice(0, 20),
    [stocks]
  );
  const losers = useMemo(
    () => [...stocks].filter((s) => s.percent < 0).sort((a, b) => a.percent - b.percent).slice(0, 20),
    [stocks]
  );

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#050914", color: "#f3f4f6", p: 0 }}>
      {/* HEADER SECTION */}
      <Box sx={{ px: { xs: 1.5, md: 2 }, pt: 1.5, pb: 0}}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: -0.5 }}>
              Market Dashboard
            </Typography>
            <Chip
              label="● LIVE"
              size="small"
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.1)",
                color: GREEN,
                fontWeight: "bold",
                fontSize: "0.7rem",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                height: 22,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 },
                },
              }}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center" sx={{ width: { xs: "100%", md: "auto" } }}>
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              elevation={0}
              sx={{
                display: "flex", alignItems: "center", width: { xs: "100%", sm: "350px", md: "450px" },
                p: 0.5, pl: 2, bgcolor: "#0b0f17", border: "1px solid #1f2937", borderRadius: "8px",
                "&:focus-within": { borderColor: "#2563eb" },
              }}
            >
              <SearchIcon sx={{ color: "#9ca3af", mr: 1, fontSize: "1.2rem" }} />
              <InputBase
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search (e.g., TCS)"
                sx={{ flex: 1, color: "#fff", fontSize: "0.9rem" }}
              />
              <Button
                type="submit" variant="contained" disableElevation
                disabled={!searchInput.trim()}
                sx={{ bgcolor: "#2563eb", color: "#fff", fontWeight: "bold", textTransform: "none", borderRadius: "6px", px: 2, py: 0.5, minWidth: "auto", "&:hover": { bgcolor: "#1d4ed8" } }}
              >
                Search
              </Button>
            </Paper>

            <Button
              size="medium"
              variant="outlined"
              startIcon={<RefreshIcon fontSize="small" />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                color: "#9ca3af", borderColor: "#374151", textTransform: "none", borderRadius: "6px", px: 2, py: 0.75,
                "&:hover": { bgcolor: "#111827", borderColor: "#6b7280" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {loading ? "Updating..." : "Refresh"}
            </Button>
          </Stack>
        </Stack>

        {/* INFINITE MARQUEE TICKER FOR MARKET INDICES */}
        <Box
          sx={{
            overflow: "hidden",
            width: "100%",
            bgcolor: "#0b0f17",
            borderTop: "1px solid #1f2937",
            borderBottom: "1px solid #1f2937",
            py: 1.5,
            mb: 2,
            whiteSpace: "nowrap",
            position: "relative",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              gap: 2,
              animation: "marquee 30s linear infinite",
              "@keyframes marquee": {
                "0%": { transform: "translateX(0%)" },
                "100%": { transform: "translateX(-50%)" },
              },
              "&:hover": { animationPlayState: "paused" },
            }}
          >
            {[...marketIndices, ...marketIndices].map((idx, i) => {
              const isPositive = idx.change >= 0;
              return (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{ minWidth: 210, p: 1.5, bgcolor: "#050914", border: "1px solid #1f2937", borderRadius: "8px", display: "inline-block" }}
                >
                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: "bold", mb: 0.5, display: "block" }}>
                    {idx.name}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff", mb: 0.5 }}>
                    {idx.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {isPositive ? <TrendingUpIcon sx={{ color: GREEN, fontSize: "0.9rem" }} /> : <TrendingDownIcon sx={{ color: RED, fontSize: "0.9rem" }} />}
                    <Typography variant="body2" fontWeight="bold" sx={{ color: isPositive ? GREEN : RED, fontSize: "0.8rem" }}>
                      {isPositive ? "+" : ""}{idx.change} ({isPositive ? "+" : ""}{idx.percent}%)
                    </Typography>
                  </Stack>
                </Paper>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* ADVANCED CHART SECTION */}
      <Box sx={{ bgcolor: "#0b0f17", mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: { xs: 1.5, md: 2 }, pt: 1.5, pb: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: 0.5 }}>
            {displayName} • LIVE CHART
          </Typography>
          <Box sx={{ px: 1, py: 0.3, bgcolor: "rgba(37, 99, 235, 0.1)", color: "#3b82f6", borderRadius: "4px", fontSize: "0.7rem", border: "1px solid rgba(37, 99, 235, 0.3)", fontWeight: "bold" }}>
            WealthNova Advance
          </Box>
        </Stack>
        <DashboardChart symbol={activeSymbol} />
      </Box>

      {/* BOTTOM SECTIONS */}
      <Box sx={{ px: { xs: 1.5, md: 2 }, pb: 4 }}>
        {/* ROW 1: IPOs + NEWS (5 visible, each scrolls on its own) */}
        <Section>
          <TwoCol>
            <Box>
              <PanelTitle icon={<RocketLaunchIcon sx={{ color: GREEN, fontSize: "1.2rem" }} />} count={ipos.length}>
                Upcoming Indian IPOs
              </PanelTitle>
              <Box sx={{ display: "flex", flexDirection: "column", gap: `${GAP}px`, maxHeight: SIX_ROWS_H, ...scrollSx }}>
                {ipos.map((ipo) => (
                  <Paper
                    key={ipo._id || ipo.id || ipo.name}
                    elevation={0}
                    sx={{
                      height: CARD_H, flexShrink: 0, width: "100%", boxSizing: "border-box",
                      px: 1.5, py: 0.5, bgcolor: "#0b0f17",
                      border: "1px solid #1f2937", borderRadius: "8px", transition: "all 0.2s",
                      display: "flex", alignItems: "center",
                      "&:hover": { borderColor: "#3b82f6", bgcolor: "#111827" },
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 1, width: "100%" }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
                          <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ color: "#e5e7eb" }}>
                            {ipo.name}
                          </Typography>
                          <Chip
                            label={ipo.status}
                            size="small"
                            sx={{
                              height: 18, fontSize: "0.65rem", fontWeight: "bold",
                              bgcolor: ipo.status === "Upcoming" ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)",
                              color: ipo.status === "Upcoming" ? GREEN : "#9ca3af",
                              border: `1px solid ${ipo.status === "Upcoming" ? "rgba(16, 185, 129, 0.3)" : "rgba(107, 114, 128, 0.3)"}`,
                            }}
                          />
                        </Stack>
                        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                          Open Date: <span style={{ color: "#e5e7eb" }}>{ipo.date}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: { xs: "left", sm: "right" }, flexShrink: 0 }}>
                        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block" }}>
                          Issue Size: <span style={{ color: "#e5e7eb", fontWeight: "bold" }}>{ipo.size}</span>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                          Price Band: <span style={{ color: "#e5e7eb", fontWeight: "bold" }}>{ipo.price}</span>
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            <Box>
              <PanelTitle icon={<PublicIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />} count={newsList.length}>
                Global Market News
              </PanelTitle>
              <Box sx={{ display: "flex", flexDirection: "column", gap: `${GAP}px`, maxHeight: SIX_ROWS_H, ...scrollSx }}>
                {newsList.map((news) => (
                  <Paper
                    key={news._id || news.id || news.title}
                    component={news.link || news.url ? "a" : "div"}
                    href={news.link || news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    elevation={0}
                    sx={{
                      display: "flex", flexDirection: "column", justifyContent: "center",
                      textDecoration: "none", height: CARD_H, flexShrink: 0, boxSizing: "border-box",
                      width: "100%", px: 1.5, py: 0.5, bgcolor: "#0b0f17", border: "1px solid #1f2937",
                      borderRadius: "8px", overflow: "hidden", transition: "transform 0.2s, border-color 0.2s",
                      "&:hover": { transform: "translateX(4px)", borderColor: "#3b82f6" },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: "bold", textTransform: "uppercase", fontSize: "0.65rem" }}>
                        {news.source || "Market Wire"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.65rem" }}>
                        {news.time || news.pubDate || "Recent"}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ color: "#e5e7eb", lineHeight: 1.3 }}>
                      {news.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#9ca3af", lineHeight: 1.4, display: "-webkit-box",
                        WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}
                    >
                      {news.desc || news.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </TwoCol>
        </Section>

        {/* ROW 2: MAJOR INDICES (left) + CRYPTO (right, static) */}
        {/* <Section>
          <TwoCol>
            <Box>
              <PanelTitle icon={<ShowChartIcon sx={{ color: "#f59e0b", fontSize: "1.2rem" }} />} count={marketIndices.length}>
                Major Indices
              </PanelTitle>
              <Stack spacing={1} sx={{ maxHeight: SIX_COMPACT_H, ...scrollSx }}>
                {marketIndices.length === 0 && <EmptyState text="No index data available." />}
                {marketIndices.map((idx, i) => {
                  const up = toNum(idx.change) >= 0;
                  return (
                    <Stack
                      key={`${idx.name}-${i}`}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        height: ROW_H, px: 1.5, flexShrink: 0, bgcolor: "#0b0f17",
                        border: "1px solid #1f2937", borderRadius: "10px",
                        "&:hover": { borderColor: "#3b82f6", bgcolor: "#111827" },
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ color: "#e5e7eb" }}>
                          {idx.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          {idx.exchange}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>
                          {fmtPrice(idx.value)}
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" sx={{ color: up ? GREEN : RED }}>
                          {up ? "+" : ""}{toNum(idx.change).toFixed(2)} ({fmtPct(idx.percent)})
                        </Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>

            <Box>
              <PanelTitle icon={<CurrencyBitcoinIcon sx={{ color: "#f59e0b", fontSize: "1.2rem" }} />} count={cryptoList.length}>
                Crypto Pulse
              </PanelTitle>
              <Stack spacing={1} sx={{ maxHeight: SIX_COMPACT_H, ...scrollSx }}>
                {cryptoList.length === 0 && <EmptyState text="No crypto data available." />}
                {cryptoList.map((c) => {
                  const up = c.change >= 0;
                  return (
                    <Box
                      key={c._id || c.symbol}
                      sx={{
                        flexShrink: 0, p: 1.5, bgcolor: "#0b0f17", borderRadius: "10px",
                        border: "1px solid #1f2937", borderLeft: `3px solid ${up ? GREEN : RED}`,
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Stack direction="row" spacing={1} alignItems="baseline">
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#e5e7eb" }}>
                            {c.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6b7280" }}>{c.symbol}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>{c.price}</Typography>
                          <PctBadge value={c.change} />
                        </Stack>
                      </Stack>
                      <Typography variant="caption" sx={{ color: "#9ca3af", lineHeight: 1.4, display: "block" }}>
                        {up ? "Why it rose: " : "Why it fell: "}{c.why}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </TwoCol>
        </Section> */}

        {/* ROW 3: HIGHEST VOLUME + MOST VOLATILE (from DB) */}
        <Section>
          <TwoCol>
            <Box>
              <PanelTitle icon={<BarChartIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />} count={highestVolume.length}>
                Highest Volume Stocks
              </PanelTitle>
              <Stack spacing={1} sx={{ maxHeight: SIX_COMPACT_H, ...scrollSx }}>
                {highestVolume.length === 0 && <EmptyState text="No volume data available." />}
                {highestVolume.map((s) => (
                  <StockRow key={s.key} stock={s} showVolume />
                ))}
              </Stack>
            </Box>

            <Box>
              <PanelTitle icon={<BoltIcon sx={{ color: "#f59e0b", fontSize: "1.2rem" }} />} count={mostVolatile.length}>
                Most Volatile Stocks
              </PanelTitle>
              <Stack spacing={1} sx={{ maxHeight: SIX_COMPACT_H, ...scrollSx }}>
                {mostVolatile.length === 0 && <EmptyState text="No stock data available." />}
                {mostVolatile.map((s) => (
                  <StockRow key={s.key} stock={s} />
                ))}
              </Stack>
            </Box>
          </TwoCol>
        </Section>

        {/* ROW 4: TOP GAINERS + TOP LOSERS (from DB) */}
        <TwoCol>
          <Section>
            <PanelTitle icon={<TrendingUpIcon sx={{ color: GREEN, fontSize: "1.2rem" }} />} count={gainers.length}>
              Top Gainers
            </PanelTitle>
            <Stack spacing={1} sx={{ maxHeight: SIX_COMPACT_H, ...scrollSx }}>
              {gainers.length === 0 && <EmptyState text="No gainers right now." />}
              {gainers.map((s) => (
                <StockRow key={s.key} stock={s} solid={false} />
              ))}
            </Stack>
          </Section>

          <Section>
            <PanelTitle icon={<TrendingDownIcon sx={{ color: RED, fontSize: "1.2rem" }} />} count={losers.length}>
              Top Losers
            </PanelTitle>
            <Stack spacing={1} sx={{ maxHeight: SIX_COMPACT_H, ...scrollSx }}>
              {losers.length === 0 && <EmptyState text="No losers right now." />}
              {losers.map((s) => (
                <StockRow key={s.key} stock={s} solid={false} />
              ))}
            </Stack>
          </Section>
        </TwoCol>
      </Box>
    </Box>
  );
}
