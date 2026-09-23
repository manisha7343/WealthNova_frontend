import { useEffect, useState, useRef, memo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
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
// MOCK API DATA (IPOs & NEWS)
// ==========================================
const IPO_DATA = [
  { id: 1, name: "Swiggy Ltd.", date: "Oct 18 - Oct 20, 2026", price: "₹370 - ₹390", size: "₹10,414 Cr", status: "Upcoming" },
  { id: 2, name: "NTPC Green Energy", date: "Nov 05 - Nov 07, 2026", price: "₹100 - ₹108", size: "₹10,000 Cr", status: "Upcoming" },
  { id: 3, name: "Tata Play", date: "TBA", price: "TBA", size: "₹2,500 Cr", status: "Filed DRHP" },
  { id: 4, name: "Hyundai Motor India", date: "Closed", price: "₹1,865 - ₹1,960", size: "₹27,870 Cr", status: "Listed" }
];

const FOREIGN_NEWS = [
  { id: 1, source: "Reuters", time: "10 mins ago", title: "Federal Reserve hints at steady rates ahead of Q4", desc: "US central bank officials suggest holding the interest rates steady amidst cooling inflation data." },
  { id: 2, source: "Bloomberg", time: "1 hr ago", title: "Tech stocks rally in pre-market trading in NASDAQ", desc: "Major semiconductor companies see a 4% jump globally following strong earnings reports from Asia." },
  { id: 3, source: "Financial Times", time: "3 hrs ago", title: "ECB prepares for a strategic pivot next month", desc: "European markets brace for a potential policy shift as economic growth shows signs of stabilization." },
  { id: 4, source: "CNBC", time: "5 hrs ago", title: "Crude oil slips below $75 per barrel", desc: "Global oil prices trend downwards as non-OPEC supply increases counteract recent production cuts." },
];

// ==========================================
// 2. MAIN DASHBOARD COMPONENT
// ==========================================
export default function Dashboard() {
  const [marketIndices, setMarketIndices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [activeSymbol, setActiveSymbol] = useState("BSE:SENSEX");
  const [displayName, setDisplayName] = useState("SENSEX");

  const fetchMarketData = () => {
    setLoading(true);
    setTimeout(() => {
      const generateRandomChange = (base) => {
        const change = (Math.random() * 200 - 100).toFixed(2);
        const percent = ((change / base) * 100).toFixed(2);
        return { change: Number(change), percent: Number(percent) };
      };

      const baseValues = {
        NIFTY: 24574.13, SENSEX: 80742.37, BANKNIFTY: 52847.65,
        INDIAVIX: 12.84, GOLD: 76512.00, SILVER: 91000.00, USDINR: 83.50,
      };

      setMarketIndices([
        { name: "NIFTY 50", value: baseValues.NIFTY + Number(generateRandomChange(baseValues.NIFTY).change), ...generateRandomChange(baseValues.NIFTY), exchange: "NSE" },
        { name: "SENSEX", value: baseValues.SENSEX + Number(generateRandomChange(baseValues.SENSEX).change), ...generateRandomChange(baseValues.SENSEX), exchange: "BSE" },
        { name: "BANK NIFTY", value: baseValues.BANKNIFTY + Number(generateRandomChange(baseValues.BANKNIFTY).change), ...generateRandomChange(baseValues.BANKNIFTY), exchange: "NSE" },
        { name: "INDIA VIX", value: baseValues.INDIAVIX + Number(generateRandomChange(baseValues.INDIAVIX).change), ...generateRandomChange(baseValues.INDIAVIX), exchange: "NSE" },
        { name: "GOLD (MCX)", value: baseValues.GOLD + Number(generateRandomChange(baseValues.GOLD).change), ...generateRandomChange(baseValues.GOLD), exchange: "MCX" },
        { name: "SILVER (MCX)", value: baseValues.SILVER + Number(generateRandomChange(baseValues.SILVER).change), ...generateRandomChange(baseValues.SILVER), exchange: "MCX" },
        { name: "USD / INR", value: baseValues.USDINR + (Math.random() * 0.5 - 0.25), change: (Math.random() * 0.5 - 0.25).toFixed(2), percent: ((Math.random() * 0.5 - 0.25) / baseValues.USDINR * 100).toFixed(2), exchange: "FOREX" },
      ]);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const query = searchInput.trim().toUpperCase();
      const formattedSymbol = query.includes(":") ? query : `BSE:${query}`;
      setActiveSymbol(formattedSymbol);
      setDisplayName(query.replace("BSE:", "").replace("NSE:", ""));
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#050914", color: "#f3f4f6", p: 0 }}>
      
      {/* HEADER SECTION - Tight Padding */}
      <Box sx={{ px: { xs: 1.5, md: 2 }, pt: 1.5, pb: 0 }}>
        
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
          
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff", letterSpacing: -0.5 }}>
              Market Dashboard
            </Typography>
            {/* LIVE Indicator to fill horizontal space */}
            <Chip 
              label="● LIVE" 
              size="small" 
              sx={{ 
                bgcolor: "rgba(16, 185, 129, 0.1)", 
                color: "#10b981", 
                fontWeight: "bold", 
                fontSize: "0.7rem",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                height: 22,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 }
                }
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
              onClick={fetchMarketData}
              disabled={loading}
              sx={{
                color: "#9ca3af", borderColor: "#374151", textTransform: "none", borderRadius: "6px", px: 2, py: 0.75,
                "&:hover": { bgcolor: "#111827", borderColor: "#6b7280" },
                width: { xs: "100%", sm: "auto" }
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
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {[...marketIndices, ...marketIndices].map((idx, i) => {
              const isPositive = idx.change >= 0;
              return (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    minWidth: 210,
                    p: 1.5,
                    bgcolor: "#050914",
                    border: "1px solid #1f2937",
                    borderRadius: "8px",
                    display: "inline-block",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: "bold", mb: 0.5, display: "block" }}>
                    {idx.name}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff", mb: 0.5 }}>
                    {idx.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {isPositive ? <TrendingUpIcon sx={{ color: "#10b981", fontSize: "0.9rem" }} /> : <TrendingDownIcon sx={{ color: "#ef4444", fontSize: "0.9rem" }} />}
                    <Typography variant="body2" fontWeight="bold" sx={{ color: isPositive ? "#10b981" : "#ef4444", fontSize: "0.8rem" }}>
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

      {/* BOTTOM SECTION */}
      <Box sx={{ px: { xs: 1.5, md: 2 }, pb: 4 }}>
        {/* NEW WHITE BORDER WRAPPER FOR BOTH SECTIONS */}
        <Box 
          sx={{ 
            border: "1px solid #ffffff", 
            borderRadius: "14px", 
            p: { xs: 2, md: 3 }, 
            bgcolor: "transparent" 
          }}
        >
          <Grid container spacing={3} sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>
            
            {/* LEFT: UPCOMING INDIAN IPOs */}
            <Grid item xs={12} md={6} sx={{ width: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <RocketLaunchIcon sx={{ color: "#10b981", fontSize: "1.2rem" }} />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
                  Upcoming Indian IPOs
                </Typography>
              </Stack>
              
              <Stack spacing={1.5}>
                {IPO_DATA.map((ipo) => (
                  <Paper key={ipo.id} elevation={0} sx={{ width: "100%", p: 2, bgcolor: "#0b0f17", border: "1px solid #1f2937", borderRadius: "10px", transition: "all 0.2s", "&:hover": { borderColor: "#3b82f6", bgcolor: "#111827" } }}>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#e5e7eb", whiteSpace: "nowrap" }}>
                            {ipo.name}
                          </Typography>
                          <Chip 
                            label={ipo.status} 
                            size="small" 
                            sx={{ 
                              height: 18, fontSize: "0.65rem", fontWeight: "bold",
                              bgcolor: ipo.status === "Upcoming" ? "rgba(16, 185, 129, 0.1)" : "rgba(107, 114, 128, 0.1)",
                              color: ipo.status === "Upcoming" ? "#10b981" : "#9ca3af",
                              border: `1px solid ${ipo.status === "Upcoming" ? "rgba(16, 185, 129, 0.3)" : "rgba(107, 114, 128, 0.3)"}`
                            }} 
                          />
                        </Stack>
                        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                          Open Date: <span style={{ color: "#e5e7eb" }}>{ipo.date}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block" }}>
                          Issue Size: <span style={{ color: "#e5e7eb", fontWeight: "bold" }}>{ipo.size}</span>
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                          Price Band: <span style={{ color: "#e5e7eb", fontWeight: "bold" }}>{ipo.price}</span>
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            {/* RIGHT: GLOBAL MARKET NEWS */}
            <Grid item xs={12} md={6} sx={{ width: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <PublicIcon sx={{ color: "#3b82f6", fontSize: "1.2rem" }} />
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
                  Global Market News
                </Typography>
              </Stack>

              <Stack spacing={1.5}>
                {FOREIGN_NEWS.map((news) => (
                  <Paper key={news.id} elevation={0} sx={{ width: "100%", p: 2, bgcolor: "#0b0f17", border: "1px solid #1f2937", borderRadius: "10px", transition: "transform 0.2s", "&:hover": { transform: "translateX(4px)", borderColor: "#4b5563" } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: "bold", textTransform: "uppercase", fontSize: "0.65rem" }}>
                        {news.source}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.65rem" }}>
                        {news.time}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#e5e7eb", mb: 0.5, lineHeight: 1.3 }}>
                      {news.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#9ca3af", lineHeight: 1.4, display: "block" }}>
                      {news.desc}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Grid>
            
          </Grid>
        </Box>
      </Box>

    </Box>
  );
}