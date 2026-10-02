import { useEffect, useMemo, useState, useRef, memo } from "react";
import {
  Box,
  Button,
  Container,
  InputBase,
  Link,
  Paper,
  Typography,
  Stack,
  Card,
  Chip,
  Fab,
  Zoom,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";


/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const HEADER_H = 64;
const TICKER_H = 36;
const CHROME_H = HEADER_H + TICKER_H;

const FONT =
  '"Plus Jakarta Sans", "Inter", "Segoe UI", system-ui, -apple-system, sans-serif';
const HERO_VIDEO = "/perfect_hai_but_ekdum_HD_vdieo.mp4";

const MARKET = [
  { name: "NIFTY 50", symbol: "NIFTY", value: "22,145.00", change: 1.2 },
  { name: "SENSEX", symbol: "SENSEX", value: "73,850.00", change: 1.1 },
  { name: "BANK NIFTY", symbol: "BANKNIFTY", value: "46,780.00", change: -0.5 },
  { name: "RELIANCE", symbol: "RELIANCE", value: "2,950.00", change: 1.5 },
  { name: "HDFC BANK", symbol: "HDFCBANK", value: "1,450.00", change: -0.8 },
  { name: "TCS", symbol: "TCS", value: "4,100.00", change: 0.9 },
  { name: "INFOSYS", symbol: "INFY", value: "1,650.00", change: 1.1 },
  { name: "ICICI BANK", symbol: "ICICIBANK", value: "1,080.00", change: 2.1 },
  { name: "SBI", symbol: "SBIN", value: "750.00", change: 0.4 },
  { name: "NIFTY IT", symbol: "NIFTYIT", value: "37,200.00", change: 2.4 },
];

const TOP_GAINERS = [
  { name: "ICICI BANK", desc: "Private Sector Bank", price: "₹1,080.00", change: "+2.1%" },
  { name: "NIFTY IT", desc: "Tech Sector Index", price: "₹37,200.00", change: "+2.4%" },
  { name: "RELIANCE", desc: "Energy & Retail", price: "₹2,950.00", change: "+1.5%" },
  { name: "TCS", desc: "IT Consulting", price: "₹4,100.00", change: "+0.9%" },
  { name: "BHARTIARTL", desc: "Telecommunications", price: "₹1,150.00", change: "+0.7%" },
];

const TOP_LOSERS = [
  { name: "HDFC BANK", desc: "Private Sector Bank", price: "₹1,450.00", change: "-0.8%" },
  { name: "BANK NIFTY", desc: "Banking Index", price: "₹46,780.00", change: "-0.5%" },
  { name: "INFOSYS", desc: "IT Services", price: "₹1,650.00", change: "-0.3%" },
  { name: "SBI", desc: "Public Sector Bank", price: "₹750.00", change: "-0.2%" },
  { name: "ITC", desc: "FMCG & Tobacco", price: "₹410.00", change: "-0.4%" },
];

const NEWS = [
  {
    id: 1,
    title: "Reliance Industries announces strong Q3 results, beats market estimates",
    description: "The conglomerate reported robust performance across all major business segments.",
    category: "Corporate",
    date: "2 hours ago",
    url: "https://www.moneycontrol.com/",
  },
  {
    id: 2,
    title: "Indian tech sector rallies as AI adoption accelerates globally",
    description: "Major IT companies see significant stock gains as AI integration drives growth.",
    category: "Technology",
    date: "5 hours ago",
    url: "https://www.livemint.com/",
  },
  {
    id: 3,
    title: "RBI maintains repo rate at 6.5% in latest monetary policy meeting",
    description: "Central bank keeps interest rates unchanged amid global economic uncertainty.",
    category: "Policy",
    date: "1 day ago",
    url: "https://www.rbi.org.in/",
  },
  {
    id: 4,
    title: "HDFC Bank net profit rises 20% YoY in Q4, beats estimates",
    description: "Private sector lender reports strong growth driven by retail banking advances.",
    category: "Banking",
    date: "1 day ago",
    url: "https://www.hdfcbank.com/",
  },
];

const PLATFORM_LINKS = [
  { label: "Live Market", to: "/markets" },
  { label: "AI Predictions", to: "/predictions" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "News & Analysis", to: "/news" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Risk Disclosure", to: "/risk-disclosure" },
];

/* -------------------------------------------------------------------------- */
/* Design tokens                                                              */
/* -------------------------------------------------------------------------- */

const PRIMARY_BLUE = "#00245b";
const DARK_BLUE = "#041125";
const LIGHT_BLUE = "#3B82F6";
const CREAM = "#e1d7d7";
const WHITE = "#ffffff";
const ACCENT_BLUE = "#3B82F6";
const BRAND = "#3B82F6"; // same blue as the logo

const hexToRgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const makeTone = (bg, fg, accent) => ({
  bg,
  fg,
  accent: accent || fg,
  muted: hexToRgba(fg, 0.7),
  border: hexToRgba(fg, 0.15),
  soft: hexToRgba(fg, 0.05),
  hover: hexToRgba(fg, 0.08),
});

const getTokens = () => ({
  page: makeTone(DARK_BLUE, CREAM, LIGHT_BLUE),
  band: makeTone(PRIMARY_BLUE, CREAM, LIGHT_BLUE),
});

const focusRing = (color) => ({
  "&:focus-visible": { outline: `2px solid ${color}`, outlineOffset: 2 },
});

/* One card look for the whole site (navy glass, blue border) */
const GLASS = "linear-gradient(145deg, rgba(0,36,91,0.55) 0%, rgba(4,17,37,0.92) 100%)";

const panelSx = {
  background: GLASS,
  border: "1px solid rgba(59,130,246,0.22)",
  borderRadius: "16px",
  boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
};

const cardSx = {
  ...panelSx,
  transition: "transform .25s ease, border-color .25s ease, box-shadow .25s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: "rgba(59,130,246,0.6)",
    boxShadow: "0 14px 34px rgba(59,130,246,0.18)",
  },
};

const searchBtnSx = {
  bgcolor: BRAND,
  color: "#fff",
  fontWeight: 700,
  textTransform: "none",
  borderRadius: "8px",
  px: 3.5,
  py: 1.2,
  boxShadow: "none",
  "&:hover": { bgcolor: "#2563EB", boxShadow: "none" },
  "&.Mui-disabled": { bgcolor: BRAND, color: "#fff", opacity: 0.85 },
};

/* TradingView symbol: NIFTY 50 -> SENSEX, plain ticker -> BSE:ticker */
const toTvSymbol = (s) =>
  s === "NIFTY 50" ? "BSE:SENSEX" : s.includes(":") ? s : `BSE:${s}`;

/* -------------------------------------------------------------------------- */
/* Scroll reveal                                                              */
/* -------------------------------------------------------------------------- */

const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Reveal = ({ children, delay = 0, amount = 0.2, once = true, sx }) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <Box sx={sx}>{children}</Box>;
  return (
    <Box
      component={motion.div}
      custom={delay}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      sx={sx}
    >
      {children}
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

export const Logo = ({ tone = { fg: WHITE, bg: DARK_BLUE }, size = 40 }) => (
  <Link
    component={RouterLink}
    to="/"
    underline="none"
    aria-label="WealthNova home"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 1.25,
      color: tone?.fg || WHITE,
      borderRadius: 1,
      textDecoration: "none",
      ...focusRing(tone?.fg || LIGHT_BLUE),
    }}
  >
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "10px",
        bgcolor: "#3B82F6",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <TrendingUpIcon sx={{ color: "#ffffff", fontSize: size * 0.6 }} />
    </Box>
    <Typography
      component="span"
      sx={{ fontWeight: 800, fontSize: size * 0.5, letterSpacing: "-0.02em", color: "#ffffff" }}
    >
      WealthNova
    </Typography>
  </Link>
);

const Ticker = ({ market = [] }) => {
  const source = market && market.length > 0 ? market : MARKET;
  const items = [...source, ...source];

  return (
    <Box
      role="region"
      aria-label="Market snapshot"
      sx={{
        height: TICKER_H,
        overflow: "hidden",
        bgcolor: hexToRgba(PRIMARY_BLUE, 0.95),
        backdropFilter: "blur(8px)",
        borderTop: `1px solid ${hexToRgba(CREAM, 0.1)}`,
        borderBottom: `1px solid ${hexToRgba(CREAM, 0.1)}`,
      }}
    >
      <Box
        sx={{
          "@keyframes wn-ticker": {
            from: { transform: "translateX(0)" },
            to: { transform: "translateX(-50%)" },
          },
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "max-content",
          animation: `wn-ticker ${Math.max(60, source.length * 6)}s linear infinite`,
          "&:hover": { animationPlayState: "paused" },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        {items.map((m, i) => {
          const changeVal =
            m.change !== undefined ? m.change : m.percentChange !== undefined ? m.percentChange : 0;
          const up = Number(changeVal) >= 0;
          const formattedVal =
            m.value ||
            (m.price !== undefined
              ? typeof m.price === "number"
                ? `₹${m.price.toLocaleString("en-IN")}`
                : m.price
              : "");
          return (
            <Box
              key={`${m.name}-${i}`}
              aria-hidden={i >= source.length}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                pr: 5,
                whiteSpace: "nowrap",
                fontSize: "0.85rem",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <Box component="span" sx={{ fontWeight: 700, color: CREAM }}>
                {m.symbol || m.name}
              </Box>
              <Box component="span" sx={{ color: hexToRgba(CREAM, 0.8) }}>
                {formattedVal}
              </Box>
              <Chip
                size="small"
                label={`${up ? "+" : ""}${Math.abs(Number(changeVal)).toFixed(2)}%`}
                sx={{
                  bgcolor: up ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)",
                  color: up ? "#4ade80" : "#f87171",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  height: 20,
                  "& .MuiChip-label": { px: 1 },
                }}
                icon={
                  up ? (
                    <ArrowDropUpIcon fontSize="small" sx={{ color: "#4ade80 !important" }} />
                  ) : (
                    <ArrowDropDownIcon fontSize="small" sx={{ color: "#f87171 !important" }} />
                  )
                }
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

/* One search bar used by hero + chart section */
const SearchBar = ({ value, onChange, onSubmit, placeholder, width = 650, light = false }) => (
  <Paper
    component="form"
    role="search"
    onSubmit={onSubmit}
    elevation={0}
    sx={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      maxWidth: width,
      mx: "auto",
      p: 0.75,
      pl: 2.5,
      borderRadius: "14px",
      bgcolor: light ? CREAM : "rgba(255,255,255,0.07)",
      backdropFilter: light ? "none" : "blur(14px)",
      border: light ? `2px solid ${PRIMARY_BLUE}` : "1px solid rgba(255,255,255,0.18)",
      boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
      transition: "all .25s ease",
      "&:focus-within": {
        borderColor: "#3B82F6",
        boxShadow: "0 0 0 4px rgba(59,130,246,0.2), 0 18px 50px rgba(0,0,0,0.4)",
      },
    }}
  >
    <SearchIcon sx={{ color: light ? hexToRgba(DARK_BLUE, 0.5) : "rgba(225,215,215,0.6)", mr: 1.5 }} aria-hidden />
    <InputBase
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputProps={{ "aria-label": "Search stock ticker", maxLength: 30 }}
      sx={{
        flex: 1,
        color: light ? DARK_BLUE : CREAM,
        fontSize: "1rem",
        fontWeight: 500,
        "& input::placeholder": {
          color: light ? hexToRgba(DARK_BLUE, 0.5) : "rgba(225,215,215,0.55)",
          opacity: 1,
        },
      }}
    />
    <Button type="submit" disableElevation disabled={!value.trim()} sx={searchBtnSx}>
      Search →
    </Button>
  </Paper>
);

/* Chart is created once per symbol */
const TradingViewChart = memo(({ symbol }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    s.type = "text/javascript";
    s.async = true;
    s.innerHTML = JSON.stringify({
      autosize: true,
      symbol: toTvSymbol(symbol),
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "in",
      enable_publishing: false,
      backgroundColor: "#0b0f17",
      gridColor: "#1f2937",
      save_image: false,
      support_host: "https://www.tradingview.com",
    });
    ref.current.appendChild(s);
  }, [symbol]);

  return <Box ref={ref} sx={{ width: "100%", height: { xs: 380, md: 560 } }} />;
});

/* Row inside gainers / losers panels */
const StockRowLanding = ({ stock }) => {
  const raw = stock.percentChange !== undefined ? stock.percentChange : stock.change;
  const num = typeof raw === "string" ? parseFloat(raw.replace(/[+%]/g, "")) : Number(raw || 0);
  const pct = Number.isFinite(num) ? num : 0;
  const up = pct >= 0;
  const price =
    typeof stock.price === "number"
      ? `₹${stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : stock.price
        ? String(stock.price).startsWith("₹")
          ? stock.price
          : `₹${stock.price}`
        : "—";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        height: 58,
        px: 1.5,
        borderRadius: "12px",
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "all .2s ease",
        "&:hover": { borderColor: "rgba(59,130,246,0.55)", bgcolor: "rgba(59,130,246,0.08)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flex: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            fontSize: "0.8rem",
            fontWeight: 800,
            color: "#fff",
            bgcolor: BRAND,
          }}
        >
          {(stock.name || stock.symbol || "?").charAt(0).toUpperCase()}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            noWrap
            title={stock.name}
            sx={{ color: CREAM, fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.2 }}
          >
            {stock.name}
          </Typography>
          <Typography
            noWrap
            sx={{ color: "rgba(225,215,215,0.55)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: 0.5 }}
          >
            {stock.symbol || stock.desc || "NSE"}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>{price}</Typography>
        <Box
          sx={{
            minWidth: 66,
            px: 0.8,
            py: 0.3,
            textAlign: "center",
            borderRadius: "8px",
            fontSize: "0.74rem",
            fontWeight: 800,
            bgcolor: up ? "rgba(52,211,153,0.14)" : "rgba(248,113,113,0.14)",
            color: up ? "#34D399" : "#F87171",
          }}
        >
          {up ? "+" : ""}
          {pct.toFixed(2)}%
        </Box>
      </Box>
    </Box>
  );
};

const MoverPanel = ({ title, up, data }) => {
  const color = up ? "#34D399" : "#F87171";
  return (
    <Box sx={{ ...panelSx, p: 2, minWidth: 0 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5, pb: 1.25, borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "8px",
              display: "grid",
              placeItems: "center",
              bgcolor: up ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
            }}
          >
            {up ? (
              <TrendingUpIcon sx={{ color, fontSize: 18 }} />
            ) : (
              <TrendingDownIcon sx={{ color, fontSize: 18 }} />
            )}
          </Box>
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem" }}>{title}</Typography>
        </Stack>
        <Chip
          label={`${data.length} Stocks`}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.68rem",
            fontWeight: 700,
            color,
            bgcolor: up ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${color}55`,
          }}
        />
      </Stack>
      <Stack spacing={1}>
        {data.slice(0, 5).map((s, i) => (
          <StockRowLanding key={s.symbol || s.name || i} stock={s} />
        ))}
      </Stack>
    </Box>
  );
};

const FooterLinks = ({ title, links, tone }) => (
  <Box component="nav" aria-label={title}>
    <Typography component="h3" sx={{ fontWeight: 700, fontSize: "0.95rem", mb: 2.5, color: tone.fg }}>
      {title}
    </Typography>
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5 }}>
      {links.map(({ label, to }) => (
        <li key={label}>
          <Link
            component={RouterLink}
            to={to}
            underline="none"
            sx={{
              color: tone.muted,
              fontSize: "0.9rem",
              transition: "all 0.2s",
              "&:hover": { color: tone.fg, transform: "translateX(4px)" },
              ...focusRing(tone.fg),
            }}
          >
            {label}
          </Link>
        </li>
      ))}
    </Box>
  </Box>
);

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [query, setQuery] = useState("");
  const [chartInput, setChartInput] = useState("");
  const [chartSymbol, setChartSymbol] = useState("NIFTY 50");

  // dynamic backend data
  const [marketList, setMarketList] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [ipos, setIpos] = useState([]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "https://wealthnova-backend.onrender.com";
        const [mktRes, glRes, newsRes, ipoRes] = await Promise.allSettled([
          fetch(`${apiBase}/api/market`).then((r) => r.json()),
          fetch(`${apiBase}/api/market/gainers-losers`).then((r) => r.json()),
          fetch(`${apiBase}/api/news?limit=8`).then((r) => r.json()),
          fetch(`${apiBase}/api/ipo`).then((r) => r.json()),
        ]);

        if (mktRes.status === "fulfilled" && mktRes.value.success && Array.isArray(mktRes.value.data) && mktRes.value.data.length > 0) {
          setMarketList(mktRes.value.data);
        }
        if (glRes.status === "fulfilled" && glRes.value.success && glRes.value.data) {
          if (Array.isArray(glRes.value.data.gainers) && glRes.value.data.gainers.length > 0) {
            setGainers(glRes.value.data.gainers);
          }
          if (Array.isArray(glRes.value.data.losers) && glRes.value.data.losers.length > 0) {
            setLosers(glRes.value.data.losers);
          }
        }
        if (newsRes.status === "fulfilled" && newsRes.value.success && Array.isArray(newsRes.value.data) && newsRes.value.data.length > 0) {
          setNewsList(newsRes.value.data);
        }
        if (ipoRes.status === "fulfilled" && ipoRes.value.success && Array.isArray(ipoRes.value.data) && ipoRes.value.data.length > 0) {
          setIpos(ipoRes.value.data);
        }
      } catch (err) {
        console.error("Failed to fetch landing data:", err);
      }
    };

    fetchLandingData();
  }, []);

  const { page, band } = useMemo(() => getTokens(), []);

  const scrollToId = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  const handleSearch = (e) => {
    e.preventDefault();
    const symbol = query.trim();
    if (!symbol) return;
    setChartSymbol(symbol.toUpperCase());
    scrollToId("charts");
  };

  const handleChartSearchSubmit = (e) => {
    e.preventDefault();
    if (chartInput.trim()) setChartSymbol(chartInput.trim().toUpperCase());
  };

  const section = (tone, extra = {}) => ({
    py: { xs: 10, md: 14 },
    scrollMarginTop: `${CHROME_H}px`,
    bgcolor: tone.bg,
    color: tone.fg,
    ...extra,
  });

  const heading = {
    fontWeight: 800,
    fontSize: { xs: "2rem", md: "3rem" },
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  };

  const subHeading = {
    fontWeight: 600,
    fontSize: { xs: "1.1rem", md: "1.25rem" },
    color: page.muted,
    lineHeight: 1.6,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: page.bg,
        color: page.fg,
        overflowX: "hidden",
        "@keyframes fadeInUp": {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "& main > *": { animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both" },
        "& .MuiTypography-root, & .MuiButton-root, & .MuiInputBase-root, & .MuiChip-root": {
          fontFamily: FONT,
        },
      }}
    >
      {/* ------------------------------ HEADER ------------------------------ */}
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: "#041125",
          color: CREAM,
          borderBottom: `1px solid ${hexToRgba(CREAM, 0.1)}`,
        }}
      >
        <Box
          sx={{
            height: HEADER_H,
            px: { xs: 2, md: 4 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr auto", md: "1fr auto 1fr" },
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* LOGO - far left */}
          <Box sx={{ justifySelf: "start" }}>
            <Logo tone={band} />
          </Box>

          {/* NAV - centre */}
          <Box component="nav" aria-label="Primary" sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {[
              ["Market", "gainers-losers"],
              ["Charts", "charts"],
              ["News", "news"],
              ["IPOs", "ipos"],
            ].map(([label, id]) => (
              <Button
                key={id}
                onClick={() => scrollToId(id)}
                sx={{
                  color: band.muted,
                  fontWeight: 600,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": { color: CREAM, bgcolor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* LOGIN / SIGNUP - far right */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifySelf: "end" }}>
            <Button
              onClick={() => navigate("/login")}
              sx={{ color: CREAM, fontWeight: 600, textTransform: "none", px: 2 }}
            >
              Log in
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/signup")}
              sx={{ ...searchBtnSx, px: 2.5, py: 0.9, borderRadius: "10px" }}
            >
              Sign up
            </Button>
          </Box>
        </Box>

        <Ticker market={marketList} />
      </Box>

      <Box aria-hidden sx={{ height: CHROME_H }} />

      <main>
        {/* ------------------------------- HERO ------------------------------ */}
        <Box
          component="section"
          sx={{
            position: "relative",
            display: "grid",
            placeItems: "center",
            minHeight: `clamp(600px, calc(100svh - ${CHROME_H}px), 800px)`,
            overflow: "hidden",
            bgcolor: DARK_BLUE,
            color: CREAM,
          }}
        >
          <Box
            component="video"
            autoPlay={!reduceMotion}
            loop
            muted
            defaultMuted
            playsInline
            preload="auto"
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </Box>

          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${hexToRgba(DARK_BLUE, 0.85)} 0%, ${hexToRgba(DARK_BLUE, 0.7)} 50%, ${hexToRgba(DARK_BLUE, 0.95)} 100%)`,
            }}
          />

          <Container maxWidth="md" sx={{ position: "relative", textAlign: "center", py: { xs: 10, md: 12 } }}>
            <motion.div variants={container} initial={reduceMotion ? false : "hidden"} animate="show">
              <motion.div variants={item}>
                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", sm: "3.25rem", md: "4rem" },
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    mb: 2,
                  }}
                >
                  Smarter{" "}
                  <Box
                    component="span"
                    sx={{ color: BRAND }}
                  >
                    Stock Analysis
                  </Box>
                </Typography>
              </motion.div>

              <motion.div variants={item}>
                <Typography
                  sx={{
                    color: hexToRgba(CREAM, 0.85),
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    lineHeight: 1.7,
                    maxWidth: 650,
                    mx: "auto",
                    mb: 6,
                  }}
                >
                  Transform your investment decisions with AI-powered predictions, real-time market
                  analytics, and comprehensive insights for NSE and BSE stocks. Make data-driven choices
                  with confidence.
                </Typography>
              </motion.div>

              <motion.div variants={item}>
                <SearchBar
                  light
                  value={query}
                  onChange={setQuery}
                  onSubmit={handleSearch}
                  placeholder="Search stocks, e.g., RELIANCE, TCS, INFY"
                />
              </motion.div>

              <motion.div variants={item}>
                <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                  {["RELIANCE", "TCS", "HDFCBANK", "INFY"].map((stock) => (
                    <Chip
                      key={stock}
                      label={stock}
                      onClick={() => {
                        setQuery(stock);
                        setChartSymbol(stock);
                        scrollToId("charts");
                      }}
                      sx={{
                        bgcolor: hexToRgba(CREAM, 0.1),
                        color: CREAM,
                        border: `1px solid ${hexToRgba(CREAM, 0.2)}`,
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": { bgcolor: hexToRgba(CREAM, 0.2), transform: "translateY(-2px)" },
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            </motion.div>
          </Container>
        </Box>

        {/* ------------------------- MARKET MOVERS --------------------------- */}
        <Box component="section" id="gainers-losers" sx={{ ...section(page), py: { xs: 6, md: 10 } }}>
          <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                alignItems: { lg: "center" },
                gap: { xs: 5, lg: 6 },
              }}
            >
              {/* LEFT: heading */}
              <Reveal sx={{ flex: { lg: "0 0 30%" }, width: "100%", minWidth: 0 }}>
                <Chip
                  label="🔴 Live Market Data"
                  size="small"
                  sx={{
                    mb: 2,
                    bgcolor: hexToRgba(CREAM, 0.1),
                    color: CREAM,
                    fontWeight: 700,
                    borderRadius: 1,
                    border: `1px solid ${hexToRgba(CREAM, 0.2)}`,
                  }}
                />
                <Typography
                  component="h2"
                  sx={{ ...heading, mb: 2, fontSize: { xs: "2rem", md: "2.8rem" }, color: page.fg, lineHeight: 1.1 }}
                >
                  Market Movers
                </Typography>
                <Typography sx={{ ...subHeading, fontSize: "1.05rem", mb: 4, color: hexToRgba(CREAM, 0.8) }}>
                  Keep a pulse on the market's momentum. Track the biggest gainers and losers in real-time
                  to identify emerging trends, spot breakout opportunities, and navigate market volatility
                  like a pro.
                </Typography>
                <Button onClick={() => scrollToId("charts")} sx={searchBtnSx}>
                  Analyze on Charts →
                </Button>
              </Reveal>

              {/* RIGHT: two panels, always inside the screen */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  width: "100%",
                  display: "grid",
                  gap: 2.5,
                  gridTemplateColumns: { xs: "minmax(0,1fr)", md: "repeat(2, minmax(0,1fr))" },
                }}
              >
                <Reveal delay={0.1} sx={{ minWidth: 0 }}>
                  <MoverPanel title="Top Gainers" up data={gainers.length > 0 ? gainers : TOP_GAINERS} />
                </Reveal>
                <Reveal delay={0.2} sx={{ minWidth: 0 }}>
                  <MoverPanel title="Top Losers" up={false} data={losers.length > 0 ? losers : TOP_LOSERS} />
                </Reveal>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ----------------------------- CHART SECTION ----------------------- */}
        <Box component="section" id="charts" sx={{ ...section(page), pb: { xs: 4, md: 8 } }}>
          <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
            <Reveal sx={{ mb: 4 }}>
              <SearchBar
                value={chartInput}
                onChange={setChartInput}
                onSubmit={handleChartSearchSubmit}
                placeholder="Search company (e.g. HDFC, TCS)"
                width={560}
              />
            </Reveal>

            <Reveal delay={0.1}>
              {/* black rounded box */}
              <Box
                sx={{
                  bgcolor: DARK_BLUE,
                  border: "1px solid rgba(59,130,246,0.35)",
                  borderRadius: "20px",
                  p: { xs: 1.5, md: 2.5 },
                  boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
                }}
              >
                <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", mb: 1.5, px: 0.5 }}>
                  <Typography sx={{ color: "#fff", fontWeight: 800, letterSpacing: 0.5, fontSize: "0.85rem" }}>
                    {toTvSymbol(chartSymbol)} • LIVE CHART
                  </Typography>
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.3,
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: BRAND,
                      bgcolor: "rgba(59,130,246,0.15)",
                      border: "1px solid rgba(59,130,246,0.35)",
                    }}
                  >
                    WealthNova Advance
                  </Box>
                </Box>

                {/* chart inside the box */}
                <Box sx={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(59,130,246,0.25)" }}>
                  <TradingViewChart symbol={chartSymbol} />
                </Box>
              </Box>
            </Reveal>
          </Container>
        </Box>

        {/* ------------------------------- NEWS ------------------------------ */}
        <Box component="section" id="news" sx={{ ...section(page), py: { xs: 6, md: 8 } }}>
          <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
            <Reveal sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                component="h2"
                sx={{ ...heading, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" }, color: page.fg }}
              >
                Market News & Insights
              </Typography>
              <Typography
                sx={{ ...subHeading, fontSize: { xs: "0.9rem", md: "1rem" }, maxWidth: 600, mx: "auto" }}
              >
                Latest market developments and corporate announcements.
              </Typography>
            </Reveal>

            <Box
              sx={{
                display: "grid",
                gap: 2.5,
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              }}
            >
              {(newsList.length > 0 ? newsList : NEWS).map((n, i) => (
                <Reveal key={n._id || n.id || i} delay={i * 0.08} sx={{ height: "100%" }}>
                  <Card
                    elevation={0}
                    component="a"
                    href={n.url || n.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      ...cardSx,
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      minHeight: 220,
                      p: 2.5,
                      color: CREAM,
                      textDecoration: "none",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: BRAND,
                      },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Chip
                          label={n.category || n.source || "Market Wire"}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: BRAND,
                            bgcolor: "rgba(59,130,246,0.15)",
                            border: "1px solid rgba(59,130,246,0.3)",
                          }}
                        />
                        <Typography sx={{ color: "rgba(225,215,215,0.55)", fontSize: "0.72rem" }}>
                          {n.time || n.pubDate || n.date || "Recent"}
                        </Typography>
                      </Box>
                      <Typography
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          lineHeight: 1.4,
                          mb: 1,
                          color: "#fff",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {n.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(225,215,215,0.65)",
                          fontSize: "0.78rem",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {n.desc || n.description}
                      </Typography>
                    </Box>
                    <Box sx={{ pt: 1.5, color: BRAND, fontSize: "0.78rem", fontWeight: 700 }}>
                      Read full story →
                    </Box>
                  </Card>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ------------------------------ UPCOMING IPOS ---------------------- */}
        {ipos.length > 0 && (
          <Box
            component="section"
            id="ipos"
            sx={{
              ...section(page),
              py: { xs: 6, md: 8 },
              background: "linear-gradient(180deg, #041125 0%, #06214f 50%, #041125 100%)",
            }}
          >
            <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
              <Reveal sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  component="h2"
                  sx={{ ...heading, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" }, color: CREAM }}
                >
                  Upcoming Indian IPOs
                </Typography>
                <Typography
                  sx={{
                    ...subHeading,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    maxWidth: 600,
                    mx: "auto",
                    color: hexToRgba(CREAM, 0.8),
                  }}
                >
                  Track upcoming and recently listed Initial Public Offerings directly from our database.
                </Typography>
              </Reveal>

              <Box
                sx={{
                  display: "grid",
                  gap: 2.5,
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                }}
              >
                {ipos.map((ipo, idx) => {
                  const upcoming = ipo.status === "Upcoming";
                  return (
                    <Reveal key={ipo._id || ipo.name || idx} delay={idx * 0.06} sx={{ height: "100%" }}>
                      <Paper elevation={0} sx={{ ...cardSx, p: 2.5, height: "100%", display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 2 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff" }}>
                            {ipo.name}
                          </Typography>
                          <Chip
                            label={ipo.status}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              flexShrink: 0,
                              color: upcoming ? "#34D399" : "#93A3B8",
                              bgcolor: upcoming ? "rgba(52,211,153,0.12)" : "rgba(147,163,184,0.12)",
                              border: `1px solid ${upcoming ? "rgba(52,211,153,0.4)" : "rgba(147,163,184,0.3)"}`,
                            }}
                          />
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                          <Box>
                            <Typography sx={{ color: "rgba(225,215,215,0.5)", fontSize: "0.72rem" }}>Open Date</Typography>
                            <Typography sx={{ color: CREAM, fontWeight: 600, fontSize: "0.85rem", mt: 0.3 }}>
                              {ipo.date}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ color: "rgba(225,215,215,0.5)", fontSize: "0.72rem" }}>Issue Size</Typography>
                            <Typography sx={{ color: BRAND, fontWeight: 700, fontSize: "0.85rem", mt: 0.3 }}>
                              {ipo.size}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: "auto",
                            px: 1.5,
                            py: 1,
                            borderRadius: "10px",
                            bgcolor: "rgba(59,130,246,0.1)",
                            border: "1px solid rgba(59,130,246,0.2)",
                          }}
                        >
                          <Typography sx={{ color: "rgba(225,215,215,0.6)", fontSize: "0.75rem" }}>Price Band</Typography>
                          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "0.9rem" }}>{ipo.price}</Typography>
                        </Box>
                      </Paper>
                    </Reveal>
                  );
                })}
              </Box>
            </Container>
          </Box>
        )}

        {/* ----------------------------- CTA SECTION ------------------------- */}
        <Box
          component="section"
          sx={{ py: { xs: 8, md: 10 }, bgcolor: PRIMARY_BLUE, color: CREAM, textAlign: "center" }}
        >
          <Container maxWidth="md">
            <Reveal>
              <Typography
                component="h2"
                sx={{ fontWeight: 800, fontSize: { xs: "1.75rem", md: "2.5rem" }, mb: 2, lineHeight: 1.2 }}
              >
                Ready to Transform Your Investment Strategy?
              </Typography>
            </Reveal>
            <Reveal delay={0.1}>
              <Typography
                sx={{
                  color: hexToRgba(CREAM, 0.85),
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.6,
                  mb: 4,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Join thousands of investors making smarter decisions with AI-powered market analysis.
              </Typography>
            </Reveal>
            <Reveal delay={0.2}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => navigate("/signup")}
                  sx={{
                    bgcolor: WHITE,
                    color: PRIMARY_BLUE,
                    fontWeight: 700,
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    borderRadius: 1,
                    fontSize: "1rem",
                    "&:hover": { bgcolor: hexToRgba(WHITE, 0.9) },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: CREAM,
                    borderColor: CREAM,
                    fontWeight: 700,
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    borderRadius: 1,
                    fontSize: "1rem",
                    "&:hover": { borderColor: CREAM, bgcolor: hexToRgba(CREAM, 0.1) },
                  }}
                >
                  View Demo
                </Button>
              </Box>
            </Reveal>
          </Container>
        </Box>
      </main>

      {/* ------------------------------ FOOTER ------------------------------ */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#041125",
          color: "#e5e7eb",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Reveal>
            <Box
              sx={{
                display: "grid",
                gap: 6,
                gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
                mb: 8,
              }}
            >
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Logo tone={band} size={36} />
                </Box>
                <Typography sx={{ color: band.muted, maxWidth: 380, fontSize: "0.95rem", lineHeight: 1.7, mb: 3 }}>
                  WealthNova provides Indian investors with professional-grade market analysis, AI-powered
                  predictions, and comprehensive portfolio management tools. Make informed investment
                  decisions with data-driven insights.
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {["NSE", "BSE", "MCX"].map((x) => (
                    <Chip key={x} label={x} size="small" sx={{ bgcolor: band.soft, color: band.fg, fontWeight: 600 }} />
                  ))}
                </Box>
              </Box>
              <FooterLinks title="Platform" links={PLATFORM_LINKS} tone={band} />
              <FooterLinks title="Legal" links={LEGAL_LINKS} tone={band} />
            </Box>
          </Reveal>

          <Reveal delay={0.1}>
            <Box sx={{ borderTop: `1px solid ${band.border}`, pt: 4 }}>
              <Typography sx={{ color: band.muted, fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 900, mb: 2 }}>
                Disclaimer: Predictions and analytics on WealthNova are for educational and informational
                purposes only and should not be considered as investment advice. Always conduct your own
                research and consult with a qualified financial advisor before making investment decisions.
              </Typography>
              <Typography sx={{ color: band.muted, fontSize: "0.85rem" }}>
                © {new Date().getFullYear()} WealthNova. All rights reserved. Built with ❤️ for Indian investors.
              </Typography>
            </Box>
          </Reveal>
        </Container>
      </Box>

      {/* -------------------------- SCROLL TO TOP --------------------------- */}
      <Zoom in={showScrollTop}>
        <Fab
          size="small"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: PRIMARY_BLUE,
            color: CREAM,
            "&:hover": { bgcolor: PRIMARY_BLUE },
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default LandingPage;
