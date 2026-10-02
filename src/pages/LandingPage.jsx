import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  InputBase,
  Link,
  Paper,
  Typography,
  // Grid,
  Card,
  Chip,
  Fab,
  Zoom,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

/* -------------------------------------------------------------------------- */
/* Constants                                                                 */
/* -------------------------------------------------------------------------- */

const HEADER_H = 64;
const TICKER_H = 36;
const CHROME_H = HEADER_H + TICKER_H;

const FONT =
  '"Plus Jakarta Sans", "Inter", "Segoe UI", system-ui, -apple-system, sans-serif';
const HERO_VIDEO = "/perfect_hai_but_ekdum_HD_vdieo.mp4";

const MARKET = [
  { name: "NIFTY 50", value: "22,145.00", change: 1.2 },
  { name: "SENSEX", value: "73,850.00", change: 1.1 },
  { name: "BANK NIFTY", value: "46,780.00", change: -0.5 },
  { name: "RELIANCE", value: "2,950.00", change: 1.5 },
  { name: "HDFC BANK", value: "1,450.00", change: -0.8 },
  { name: "TCS", value: "4,100.00", change: 0.9 },
  { name: "INFOSYS", value: "1,650.00", change: 1.1 },
  { name: "ICICI BANK", value: "1,080.00", change: 2.1 },
  { name: "SBI", value: "750.00", change: 0.4 },
  { name: "NIFTY IT", value: "37,200.00", change: 2.4 },
];

const TOP_GAINERS = [
  {
    name: "ICICI BANK",
    desc: "Private Sector Bank",
    price: "₹1,080.00",
    change: "+2.1%",
    volume: "12.5M",
  },
  {
    name: "NIFTY IT",
    desc: "Tech Sector Index",
    price: "₹37,200.00",
    change: "+2.4%",
    volume: "8.2M",
  },
  {
    name: "RELIANCE",
    desc: "Energy & Retail",
    price: "₹2,950.00",
    change: "+1.5%",
    volume: "15.8M",
  },
  {
    name: "TCS",
    desc: "IT Consulting",
    price: "₹4,100.00",
    change: "+0.9%",
    volume: "5.3M",
  },
  {
    name: "BHARTIARTL",
    desc: "Telecommunications",
    price: "₹1,150.00",
    change: "+0.7%",
    volume: "4.1M",
  },
];

const TOP_LOSERS = [
  {
    name: "HDFC BANK",
    desc: "Private Sector Bank",
    price: "₹1,450.00",
    change: "-0.8%",
    volume: "18.2M",
  },
  {
    name: "BANK NIFTY",
    desc: "Banking Index",
    price: "₹46,780.00",
    change: "-0.5%",
    volume: "22.1M",
  },
  {
    name: "INFOSYS",
    desc: "IT Services",
    price: "₹1,650.00",
    change: "-0.3%",
    volume: "9.8M",
  },
  {
    name: "SBI",
    desc: "Public Sector Bank",
    price: "₹750.00",
    change: "-0.2%",
    volume: "25.4M",
  },
  {
    name: "ITC",
    desc: "FMCG & Tobacco",
    price: "₹410.00",
    change: "-0.4%",
    volume: "14.3M",
  },
];

const NEWS = [
  {
    id: 1,
    title:
      "Reliance Industries announces strong Q3 results, beats market estimates",
    description:
      "The conglomerate reported robust performance across all major business segments.",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    category: "Corporate",
    date: "2 hours ago",
    url: "https://www.moneycontrol.com/news/business/reliance-industries-q3-results-123456.html",
  },
  {
    id: 2,
    title: "Indian tech sector rallies as AI adoption accelerates globally",
    description:
      "Major IT companies see significant stock gains as AI integration drives growth.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    category: "Technology",
    date: "5 hours ago",
    url: "https://www.livemint.com/industry/tech-sector-ai-adoption-123456.html",
  },
  {
    id: 3,
    title: "RBI maintains repo rate at 6.5% in latest monetary policy meeting",
    description:
      "Central bank keeps interest rates unchanged amid global economic uncertainty.",
    img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
    category: "Policy",
    date: "1 day ago",
    url: "https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx",
  },
  {
    id: 4,
    title: "HDFC Bank net profit rises 20% YoY in Q4, beats estimates",
    description:
      "Private sector lender reports strong growth driven by retail banking advances.",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    category: "Banking",
    date: "1 day ago",
    url: "https://www.hdfcbank.com/about-us/media-room",
  },
];

const FEATURES = [
  {
    Icon: ShowChartIcon,
    title: "Real-time Market Data",
    desc: "Access live stock prices, indices, and trading volumes across NSE and BSE with sub-second updates. Stay ahead with instant market movements.",
    color: "#3B82F6",
  },
  {
    Icon: AutoAwesomeIcon,
    title: "AI-Powered Insights",
    desc: "Leverage advanced machine learning algorithms for predictive analytics. Get data-driven forecasts with transparent methodology you can trust.",
    color: "#8B5CF6",
  },
  {
    Icon: AccountBalanceWalletOutlinedIcon,
    title: "Smart Portfolio Management",
    desc: "Track all your investments in one unified dashboard. Monitor performance, analyze diversification, and optimize your portfolio strategy.",
    color: "#10B981",
  },
  {
    Icon: SecurityIcon,
    title: "Bank-Grade Security",
    desc: "Your financial data is protected with enterprise-level encryption. Multi-factor authentication and continuous monitoring ensure your information stays safe.",
    color: "#EF4444",
  },
  {
    Icon: ReceiptLongOutlinedIcon,
    title: "Transparent Pricing",
    desc: "No hidden fees or surprise charges. Clear, upfront pricing for all services. Pay only for what you use with flexible subscription options.",
    color: "#F59E0B",
  },
  {
    Icon: SupportAgentIcon,
    title: "Expert Support",
    desc: "Get help when you need it from our dedicated support team. Access comprehensive documentation, tutorials, and personalized assistance.",
    color: "#EC4899",
  },
];

const STEPS = [
  {
    title: "Search & Discover",
    desc: "Enter any stock ticker to instantly access comprehensive data including price history, technical indicators, and market performance metrics.",
    icon: SearchIcon,
  },
  {
    title: "Analyze with AI",
    desc: "Review AI-powered predictions alongside traditional technical analysis. Compare forecasts with historical accuracy to make informed decisions.",
    icon: AnalyticsIcon,
  },
  {
    title: "Build & Track",
    desc: "Create watchlists, build portfolios, and set up automated alerts. Monitor your investments with real-time notifications and performance tracking.",
    icon: AccountBalanceWalletOutlinedIcon,
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
/* Design tokens                                                             */
/* -------------------------------------------------------------------------- */

const PRIMARY_BLUE = "#00245b";
const DARK_BLUE = "#041125";
const LIGHT_BLUE = "#3B82F6";
const CREAM = "#e1d7d7";
const WHITE = "#ffffff";
const ACCENT_BLUE = "#3B82F6";

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
  card: makeTone(hexToRgba(PRIMARY_BLUE, 0.3), CREAM, LIGHT_BLUE),
  up: "#34D399",
  down: "#F87171",
  accent: LIGHT_BLUE,
});

// const solidBtn = (tone, accent = false) => {
//   const bgColor = accent ? tone.accent || tone.fg : tone.fg;
//   return {
//     bgcolor: bgColor,
//     color: tone.bg,
//     fontWeight: 700,
//     textTransform: "none",
//     borderRadius: 2,
//     px: 3,
//     py: 1.2,
//     boxShadow: accent
//       ? `0 4px 14px ${hexToRgba(bgColor, 0.4)}`
//       : "0 4px 14px rgba(0,0,0,0.15)",
//     "&:hover": {
//       bgcolor: bgColor,
//       transform: "translateY(-2px)",
//       boxShadow: accent
//         ? `0 6px 20px ${hexToRgba(bgColor, 0.5)}`
//         : "0 6px 20px rgba(0,0,0,0.2)",
//     },
//     "&:active": { transform: "translateY(0)" },
//     transition: "all 0.2s ease",
//     "&.Mui-disabled": {
//       bgcolor: tone.soft,
//       color: tone.muted,
//       boxShadow: "none",
//     },
//   };
// };

const focusRing = (color) => ({
  "&:focus-visible": { outline: `2px solid ${color}`, outlineOffset: 2 },
});

/* -------------------------------------------------------------------------- */
/* Scroll reveal: har element halka sa neeche se upar aata hai jab woh        */
/* viewport me scroll ho kar aata hai (ek baar hi chalta hai).                */
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
/* Components                                                                */
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
        borderRadius: 2,
        bgcolor: "#00b0ff",
        display: "grid",
        placeItems: "center",
        boxShadow: `0 4px 12px rgba(0, 176, 255, 0.35)`,
        flexShrink: 0,
      }}
    >
      <TrendingUpIcon
        sx={{ color: tone?.bg || DARK_BLUE, fontSize: size * 0.6 }}
      />
    </Box>
    <Typography
      component="span"
      sx={{
        fontWeight: 800,
        fontSize: size * 0.5,
        letterSpacing: "-0.02em",
        color: tone?.fg || WHITE,
      }}
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
          animation: "wn-ticker 45s linear infinite",
          "&:hover": { animationPlayState: "paused" },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        {items.map((m, i) => {
          const changeVal =
            m.change !== undefined
              ? m.change
              : m.percentChange !== undefined
                ? m.percentChange
                : 0;
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
                {m.name}
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

const FooterLinks = ({ title, links, tone }) => (
  <Box component="nav" aria-label={title}>
    <Typography
      component="h3"
      sx={{ fontWeight: 700, fontSize: "0.95rem", mb: 2.5, color: tone.fg }}
    >
      {title}
    </Typography>
    <Box
      component="ul"
      sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5 }}
    >
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
              "&:hover": {
                color: tone.fg,
                transform: "translateX(4px)",
              },
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
/* Page                                                                      */
/* -------------------------------------------------------------------------- */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Chart ke personal search box ke liye naya state
  const [chartInput, setChartInput] = useState("");

  const handleChartSearchSubmit = (e) => {
    e.preventDefault();
    if (chartInput.trim()) {
      setChartSymbol(chartInput.trim().toUpperCase());
    }
  };

  const [query, setQuery] = useState("");
  // STATE TO HOLD CURRENT CHART SYMBOL
  const [chartSymbol, setChartSymbol] = useState("NIFTY 50");

  // DYNAMIC BACKEND STATES
  const [marketList, setMarketList] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [ipos, setIpos] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dynamic data from MongoDB Backend
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [mktRes, glRes, newsRes, ipoRes] = await Promise.allSettled([
          fetch("http://localhost:3002/api/market").then((r) => r.json()),
          fetch("http://localhost:3002/api/market/gainers-losers").then((r) => r.json()),
          fetch("http://localhost:3002/api/news?limit=8").then((r) => r.json()),
          fetch("http://localhost:3002/api/ipo").then((r) => r.json()),
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

  const { page, band, card } = useMemo(() => getTokens(), []);

  const handleSearch = (e) => {
    e.preventDefault();
    const symbol = query.trim();
    if (!symbol) return;

    setChartSymbol(symbol.toUpperCase());
    scrollToId("charts");
  };

  const scrollToId = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
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
        transition: "background-color 0.3s ease, color 0.3s ease",
        overflowX: "hidden",
        "@keyframes fadeInUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(24px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "& main > *": {
          animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        },
        "& .MuiTypography-root, & .MuiButton-root, & .MuiInputBase-root, & .MuiChip-root":
        {
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
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${hexToRgba(CREAM, 0.1)}`,
          transition: "all 0.3s ease",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: HEADER_H,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Logo tone={band} />

          <Box
            component="nav"
            aria-label="Primary"
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {[
              ["Market", "gainers-losers"],
              ["Charts", "charts"],
              ["News", "news"],
              ["Features", "features"],
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
                  "&:hover": {
                    color: CREAM,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              onClick={() => navigate("/login")}
              sx={{
                color: CREAM,
                fontWeight: 600,
                textTransform: "none",
                px: 2,
              }}
            >
              Log in
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/signup")}
              sx={{
                bgcolor: WHITE,
                color: PRIMARY_BLUE,
                fontWeight: 700,
                textTransform: "none",
                px: 2.5,
                py: 1,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: hexToRgba(WHITE, 0.9),
                },
              }}
            >
              Sign up
            </Button>
          </Box>
        </Container>

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

          <Container
            maxWidth="md"
            sx={{
              position: "relative",
              textAlign: "center",
              py: { xs: 10, md: 12 },
            }}
          >
            <motion.div
              variants={container}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
            >
              <motion.div variants={item}>
                <Chip
                  label="AI-Powered Stock Analysis"
                  size="small"
                  sx={{
                    mb: 3,
                    bgcolor: hexToRgba(CREAM, 0.15),
                    color: CREAM,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    border: `1px solid ${hexToRgba(CREAM, 0.3)}`,
                  }}
                />
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
                  Smarter Stock Analysis
                  <br />
                  <Typography component="span" sx={{ color: ACCENT_BLUE }}>
                    Backed by Data
                  </Typography>
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
                  Transform your investment decisions with AI-powered
                  predictions, real-time market analytics, and comprehensive
                  insights for NSE and BSE stocks. Make data-driven choices with
                  confidence.
                </Typography>
              </motion.div>

              <motion.div variants={item}>
                <Paper
                  component="form"
                  role="search"
                  onSubmit={handleSearch}
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: 650,
                    mx: "auto",
                    p: 1,
                    pl: 1.5,
                    bgcolor: CREAM,
                    color: DARK_BLUE,
                    border: `2px solid ${PRIMARY_BLUE}`,
                    borderRadius: 2,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                    "&:focus-within": {
                      outline: `2px solid ${PRIMARY_BLUE}`,
                      outlineOffset: 2,
                      boxShadow: "0 25px 70px rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  <SearchIcon
                    sx={{ color: hexToRgba(DARK_BLUE, 0.5), mr: 1.5 }}
                    aria-hidden
                  />
                  <InputBase
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search stocks, e.g., RELIANCE, TCS, INFY"
                    inputProps={{
                      "aria-label": "Search stock ticker",
                      maxLength: 30,
                    }}
                    sx={{
                      flex: 1,
                      color: DARK_BLUE,
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={!query.trim()}
                    sx={{
                      bgcolor: "#3B82F6",
                      color: "#ffffff",
                      fontWeight: 700,
                      textTransform: "none",
                      px: 3.5,
                      py: 1.5,
                      borderRadius: 1,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: "#2563EB",
                        boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#3B82F6",
                        color: "#ffffff",
                        opacity: 0.85,
                      },
                    }}
                  >
                    Search
                  </Button>
                </Paper>
              </motion.div>

              <motion.div variants={item}>
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {["RELIANCE", "TCS", "HDFCBANK", "INFY"].map((stock) => (
                    <Chip
                      key={stock}
                      label={stock}
                      onClick={() => {
                        setQuery(stock);
                        handleSearch(new Event("submit"));
                      }}
                      sx={{
                        bgcolor: hexToRgba(CREAM, 0.1),
                        color: CREAM,
                        border: `1px solid ${hexToRgba(CREAM, 0.2)}`,
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: hexToRgba(CREAM, 0.2),
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            </motion.div>
          </Container>
        </Box>

        {/* ------------------------- TOP GAINERS & LOSERS --------------------- */}
        <Box
          component="section"
          id="gainers-losers"
          sx={{ ...section(page), py: { xs: 6, md: 10 } }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // Strict Left-Right for Desktop
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* LEFT HALF: Heading & Description (Takes 35% width) */}
              <Reveal sx={{ flex: "0 0 35%", width: "100%" }}>
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
                  sx={{
                    ...heading,
                    mb: 2,
                    fontSize: { xs: "2rem", md: "2.8rem" },
                    color: page.fg,
                    lineHeight: 1.1,
                  }}
                >
                  Market Movers
                </Typography>
                <Typography
                  sx={{
                    ...subHeading,
                    fontSize: "1.05rem",
                    mb: 4,
                    color: hexToRgba(CREAM, 0.8),
                  }}
                >
                  Keep a pulse on the market's momentum. Track the biggest
                  gainers and losers in real-time to identify emerging trends,
                  spot breakout opportunities, and navigate market volatility
                  like a pro.
                </Typography>
                <Button
                  onClick={() =>
                    document
                      .getElementById("charts")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  sx={{
                    bgcolor: CREAM,
                    color: PRIMARY_BLUE,
                    fontWeight: 700,
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    borderRadius: 1,
                    "&:hover": { bgcolor: hexToRgba(CREAM, 0.9) },
                  }}
                >
                  Analyze on Charts →
                </Button>
              </Reveal>

              {/* RIGHT HALF: Gainers & Losers Cards (Takes remaining width) */}
              <Box sx={{ flex: 1, width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 3,
                  }}
                >
                  {/* GAINERS CARD (GREEN CONTAINER) */}
                  <Reveal delay={0.1} sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        flex: 1,
                        p: 2.5,
                        bgcolor: "#023b20", // Deep Dark Green
                        border: `1px solid #065f35`,
                        borderRadius: 1,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 12px 24px rgba(2, 59, 32, 0.4)`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                          pb: 1.5,
                          borderBottom: `1px solid rgba(255,255,255,0.15)`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            bgcolor: "rgba(255,255,255,0.2)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <ArrowDropUpIcon
                            sx={{ color: "#4ade80", fontSize: 28 }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: "#4ade80",
                            fontSize: "1.1rem",
                          }}
                        >
                          Top Gainers
                        </Typography>
                      </Box>

                      {(gainers.length > 0 ? gainers : TOP_GAINERS).map((stock, index) => {
                        const formattedPrice =
                          typeof stock.price === "number"
                            ? `₹${stock.price.toLocaleString("en-IN")}`
                            : stock.price;
                        const formattedChange =
                          typeof stock.percentChange === "number"
                            ? `+${stock.percentChange}%`
                            : stock.change;
                        const listLen = gainers.length > 0 ? gainers.length : TOP_GAINERS.length;

                        return (
                          <Box
                            key={stock.symbol || stock.name || index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              py: 1.5,
                              borderBottom:
                                index < listLen - 1
                                  ? `1px solid rgba(255,255,255,0.1)`
                                  : "none",
                              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                              px: 1,
                              borderRadius: 1,
                              transition: "bgcolor 0.2s",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.95rem",
                                  color: CREAM,
                                }}
                              >
                                {stock.name}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "rgba(255,255,255,0.6)",
                                  fontSize: "0.75rem",
                                  mt: 0.2,
                                }}
                              >
                                {stock.desc || stock.symbol}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  fontSize: "0.95rem",
                                  color: CREAM,
                                }}
                              >
                                {formattedPrice}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#4ade80",
                                  fontWeight: 800,
                                  fontSize: "0.8rem",
                                  mt: 0.2,
                                }}
                              >
                                {formattedChange}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Paper>
                  </Reveal>

                  {/* LOSERS CARD (RED CONTAINER) */}
                  <Reveal delay={0.2} sx={{ flex: 1 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        flex: 1,
                        p: 2.5,
                        bgcolor: "#4a0d0d", // Deep Dark Red
                        border: `1px solid #7a1515`,
                        borderRadius: 1,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 12px 24px rgba(74, 13, 13, 0.4)`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                          pb: 1.5,
                          borderBottom: `1px solid rgba(255,255,255,0.15)`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            bgcolor: "rgba(255,255,255,0.15)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <ArrowDropDownIcon
                            sx={{ color: "#f87171", fontSize: 28 }}
                          />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: "#f87171",
                            fontSize: "1.1rem",
                          }}
                        >
                          Top Losers
                        </Typography>
                      </Box>

                      {(losers.length > 0 ? losers : TOP_LOSERS).map((stock, index) => {
                        const formattedPrice =
                          typeof stock.price === "number"
                            ? `₹${stock.price.toLocaleString("en-IN")}`
                            : stock.price;
                        const formattedChange =
                          typeof stock.percentChange === "number"
                            ? `${stock.percentChange > 0 ? "+" : ""}${stock.percentChange}%`
                            : stock.change;
                        const listLen = losers.length > 0 ? losers.length : TOP_LOSERS.length;

                        return (
                          <Box
                            key={stock.symbol || stock.name || index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              py: 1.5,
                              borderBottom:
                                index < listLen - 1
                                  ? `1px solid rgba(255,255,255,0.1)`
                                  : "none",
                              "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                              px: 1,
                              borderRadius: 1,
                              transition: "bgcolor 0.2s",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "0.95rem",
                                  color: CREAM,
                                }}
                              >
                                {stock.name}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "rgba(255,255,255,0.6)",
                                  fontSize: "0.75rem",
                                  mt: 0.2,
                                }}
                              >
                                {stock.desc || stock.symbol}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  fontSize: "0.95rem",
                                  color: CREAM,
                                }}
                              >
                                {formattedPrice}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#f87171",
                                  fontWeight: 800,
                                  fontSize: "0.8rem",
                                  mt: 0.2,
                                }}
                              >
                                {formattedChange}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Paper>
                  </Reveal>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ------------------------------ TRADINGVIEW CHART SECTION --------------------- */}
        <Box
          component="section"
          id="charts"
          sx={{ ...section(page), pb: { xs: 4, md: 8 } }}
        >
          <Container maxWidth="xl">
            {/* HEADING AUR SEARCH BAR EKDUM CENTER MEIN */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mb: 5,
                gap: 3,
              }}
            >
              {/* <Typography component="h2" sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "2.5rem" }, textAlign: "center", color: page.fg }}>
                Search Chart
              </Typography> */}

              {/* CHART WALA PERSONAL SEARCH BOX */}
              <Reveal>
                <Paper
                  component="form"
                  onSubmit={handleChartSearchSubmit}
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: { xs: "100%", md: "500px" }, // Center me thoda bada acha lagega
                    p: 0.5,
                    pl: 2,
                    bgcolor: hexToRgba("white", 0.05), // Transparent off-white
                    border: `1px solid ${hexToRgba("white", 0.2)}`,
                    borderRadius: 1, // Sharp radius
                    "&:focus-within": { borderColor: "white" },
                  }}
                >
                  <SearchIcon sx={{ color: page.muted, mr: 1.5 }} />
                  <InputBase
                    value={chartInput}
                    onChange={(e) => setChartInput(e.target.value)}
                    placeholder="Search company (e.g. HDFC, TCS)"
                    sx={{ flex: 1, color: "white", fontSize: "1rem" }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={!chartInput.trim()}
                    sx={{
                      bgcolor: "#3B82F6",
                      color: "#ffffff",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 1,
                      px: 4,
                      py: 1,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        bgcolor: "#2563EB",
                        boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#3B82F6",
                        color: "#ffffff",
                        opacity: 0.85,
                      },
                    }}
                  >
                    Search
                  </Button>
                </Paper>
              </Reveal>
            </Box>

            {/* TRANSPARENT TRADINGVIEW WIDGET */}
            <Reveal delay={0.15}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 550 },
                  borderRadius: 0,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(31, 31, 33, 0.25)",
                }}
                ref={(elem) => {
                  if (elem && elem.children.length === 0) {
                    const script = document.createElement("script");
                    script.src =
                      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
                    script.type = "text/javascript";
                    script.async = true;
                    script.innerHTML = JSON.stringify({
                      autosize: true,
                      symbol:
                        chartSymbol === "NIFTY 50" ? "BSE:SENSEX" : chartSymbol,
                      interval: "D",
                      timezone: "Asia/Kolkata",
                      theme: "dark",
                      style: "1",
                      locale: "in",
                      enable_publishing: false,
                      backgroundColor: "rgba(0, 0, 0, 0)", // Transparent background
                      gridColor: "rgba(255, 255, 255, 0.05)",
                      hide_top_toolbar: false,
                      hide_legend: false,
                      save_image: false,
                      support_host: "https://www.tradingview.com",
                    });
                    elem.appendChild(script);
                  } else if (elem && elem.children.length > 0) {
                    elem.innerHTML = "";
                    const script = document.createElement("script");
                    script.src =
                      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
                    script.type = "text/javascript";
                    script.async = true;
                    script.innerHTML = JSON.stringify({
                      autosize: true,
                      symbol:
                        chartSymbol === "NIFTY 50" ? "BSE:SENSEX" : chartSymbol,
                      interval: "D",
                      timezone: "Asia/Kolkata",
                      theme: "dark",
                      style: "1",
                      locale: "in",
                      enable_publishing: false,
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      gridColor: "rgba(255, 255, 255, 0.05)",
                      hide_top_toolbar: false,
                      hide_legend: false,
                      save_image: false,
                      support_host: "https://www.tradingview.com",
                    });
                    elem.appendChild(script);
                  }
                }}
              />
            </Reveal>
          </Container>
        </Box>

        {/* ------------------------------- NEWS ------------------------------ */}
        <Box
          component="section"
          id="news"
          sx={{ ...section(page), py: { xs: 6, md: 8 } }}
        >
          <Container maxWidth="lg">
            <Reveal sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                component="h2"
                sx={{
                  ...heading,
                  mb: 1,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: page.fg,
                }}
              >
                Market News & Insights
              </Typography>
              <Typography
                sx={{
                  ...subHeading,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Latest market developments and corporate announcements.
              </Typography>
            </Reveal>
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
              }}
            >
              {(newsList.length > 0 ? newsList : NEWS).map((n, i) => (
                <Reveal key={n._id || n.id || i} delay={i * 0.08}>
                  <Card
                    elevation={0}
                    component="a"
                    href={n.url || n.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      overflow: "hidden",
                      bgcolor: card.bg,
                      color: card.fg,
                      borderRadius: 1,
                      border: `1px solid ${card.border}`,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      textDecoration: "none",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 32px ${hexToRgba(PRIMARY_BLUE, 0.15)}`,
                        borderColor: PRIMARY_BLUE,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 140,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          n.img ||
                          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"
                        }
                        alt=""
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.3s ease",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                      <Chip
                        label={n.category || "Finance"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          bgcolor: hexToRgba(PRIMARY_BLUE, 0.9),
                          color: CREAM,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 20,
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography
                        sx={{
                          color: page.muted,
                          fontSize: "0.75rem",
                          mb: 0.5,
                          fontWeight: 500,
                        }}
                      >
                        {n.time || n.pubDate || n.date || "Recent"}
                      </Typography>
                      <Typography
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          lineHeight: 1.3,
                          mb: 1,
                        }}
                      >
                        {n.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: page.muted,
                          fontSize: "0.8rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {n.desc || n.description}
                      </Typography>
                    </Box>
                  </Card>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ------------------------------- UPCOMING IPOS ------------------------------ */}
        {ipos.length > 0 && (
          <Box
            component="section"
            id="ipos"
            sx={{ ...section(band), py: { xs: 6, md: 8 } }}
          >
            <Container maxWidth="lg">
              <Reveal sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  component="h2"
                  sx={{
                    ...heading,
                    mb: 1,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    color: band.fg,
                  }}
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
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                }}
              >
                {ipos.map((ipo, idx) => (
                  <Reveal key={ipo._id || ipo.name || idx} delay={idx * 0.06}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        bgcolor: "rgba(11, 15, 23, 0.75)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 1.5,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          borderColor: PRIMARY_BLUE,
                          boxShadow: `0 12px 28px ${hexToRgba(PRIMARY_BLUE, 0.25)}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: "1.05rem",
                            color: CREAM,
                          }}
                        >
                          {ipo.name}
                        </Typography>
                        <Chip
                          label={ipo.status}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor:
                              ipo.status === "Upcoming"
                                ? "rgba(16, 185, 129, 0.15)"
                                : "rgba(156, 163, 175, 0.15)",
                            color: ipo.status === "Upcoming" ? "#10b981" : "#9ca3af",
                            border: `1px solid ${ipo.status === "Upcoming"
                              ? "rgba(16, 185, 129, 0.4)"
                              : "rgba(156, 163, 175, 0.3)"
                              }`,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 1.5,
                          mb: 1.5,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.75rem" }}
                          >
                            Open Date
                          </Typography>
                          <Typography
                            sx={{ color: CREAM, fontWeight: 600, fontSize: "0.85rem", mt: 0.2 }}
                          >
                            {ipo.date}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.75rem" }}
                          >
                            Issue Size
                          </Typography>
                          <Typography
                            sx={{ color: "#60a5fa", fontWeight: 700, fontSize: "0.85rem", mt: 0.2 }}
                          >
                            {ipo.size}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          pt: 1.5,
                          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.75rem" }}
                        >
                          Price Band
                        </Typography>
                        <Typography
                          sx={{ color: "#34d399", fontWeight: 800, fontSize: "0.9rem" }}
                        >
                          {ipo.price}
                        </Typography>
                      </Box>
                    </Paper>
                  </Reveal>
                ))}
              </Box>
            </Container>
          </Box>
        )}

        {/* --------------------------- HOW IT WORKS -------------------------- */}
        <Box
          component="section"
          id="how-it-works"
          sx={{ ...section(band), py: { xs: 6, md: 8 } }}
        >
          <Container maxWidth="lg">
            <Reveal sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                component="h2"
                sx={{
                  ...heading,
                  mb: 1,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: band.fg,
                }}
              >
                How It Works
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
                Get started in minutes. No complex setup required.
              </Typography>
            </Reveal>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              }}
            >
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.1}>
                  <Box
                    sx={{
                      position: "relative",
                      p: 3,
                      bgcolor: hexToRgba(DARK_BLUE, 0.4),
                      border: `1px solid ${hexToRgba(CREAM, 0.2)}`,
                      borderRadius: 1,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 32px ${hexToRgba(PRIMARY_BLUE, 0.3)}`,
                        borderColor: hexToRgba(CREAM, 0.4),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -16,
                        left: 16,
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: CREAM,
                        color: PRIMARY_BLUE,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                        fontSize: "1rem",
                        boxShadow: `0 4px 12px ${hexToRgba(CREAM, 0.3)}`,
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          bgcolor: hexToRgba(CREAM, 0.15),
                          display: "grid",
                          placeItems: "center",
                          mb: 2,
                        }}
                      >
                        <step.icon sx={{ color: CREAM, fontSize: 28 }} />
                      </Box>
                    </Box>
                    <Typography
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        mb: 1,
                        color: CREAM,
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: hexToRgba(CREAM, 0.8),
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {step.desc}
                    </Typography>
                  </Box>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ----------------------------- FEATURES ---------------------------- */}
        <Box
          component="section"
          id="features"
          sx={{ ...section(page), py: { xs: 6, md: 8 } }}
        >
          <Container maxWidth="lg">
            <Reveal sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                component="h2"
                sx={{
                  ...heading,
                  mb: 1,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: page.fg,
                }}
              >
                Powerful Features
              </Typography>
              <Typography
                sx={{
                  ...subHeading,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Everything you need to analyze, track, and optimize your
                investments.
              </Typography>
            </Reveal>

            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
              }}
            >
              {FEATURES.map(({ Icon, title, desc, color }, i) => (
                <Reveal key={title} delay={i * 0.08}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: card.bg,
                      color: card.fg,
                      border: `1px solid ${card.border}`,
                      borderRadius: 1,
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 32px ${hexToRgba(color, 0.15)}`,
                        borderColor: PRIMARY_BLUE,
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        bgcolor: color,
                        transform: "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.3s ease",
                      },
                      "&:hover::before": {
                        transform: "scaleX(1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1,
                        bgcolor: hexToRgba(color, 0.15),
                        display: "grid",
                        placeItems: "center",
                        mb: 2,
                      }}
                    >
                      <Icon sx={{ color: color, fontSize: 28 }} />
                    </Box>
                    <Typography
                      component="h3"
                      sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 1 }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      sx={{
                        color: page.muted,
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {desc}
                    </Typography>
                  </Paper>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ----------------------------- CTA SECTION ------------------------- */}
        <Box
          component="section"
          sx={{
            py: { xs: 8, md: 10 },
            bgcolor: PRIMARY_BLUE,
            color: CREAM,
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Reveal>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                  mb: 2,
                  lineHeight: 1.2,
                }}
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
                Join thousands of investors making smarter decisions with
                AI-powered market analysis.
              </Typography>
            </Reveal>
            <Reveal delay={0.2}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
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
                    "&:hover": {
                      bgcolor: hexToRgba(WHITE, 0.9),
                    },
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
                    "&:hover": {
                      borderColor: CREAM,
                      bgcolor: hexToRgba(CREAM, 0.1),
                    },
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
        sx={{ bgcolor: band.bg, color: band.fg, pt: 10, pb: 6 }}
      >
        <Container maxWidth="lg">
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
                <Typography
                  sx={{
                    color: band.muted,
                    maxWidth: 380,
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    mb: 3,
                  }}
                >
                  WealthNova provides Indian investors with professional-grade
                  market analysis, AI-powered predictions, and comprehensive
                  portfolio management tools. Make informed investment decisions
                  with data-driven insights.
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Chip
                    label="NSE"
                    size="small"
                    sx={{ bgcolor: band.soft, color: band.fg, fontWeight: 600 }}
                  />
                  <Chip
                    label="BSE"
                    size="small"
                    sx={{ bgcolor: band.soft, color: band.fg, fontWeight: 600 }}
                  />
                  <Chip
                    label="MCX"
                    size="small"
                    sx={{ bgcolor: band.soft, color: band.fg, fontWeight: 600 }}
                  />
                </Box>
              </Box>
              <FooterLinks
                title="Platform"
                links={PLATFORM_LINKS}
                tone={band}
              />
              <FooterLinks title="Legal" links={LEGAL_LINKS} tone={band} />
            </Box>
          </Reveal>

          <Reveal delay={0.1}>
            <Box sx={{ borderTop: `1px solid ${band.border}`, pt: 4 }}>
              <Typography
                sx={{
                  color: band.muted,
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  maxWidth: 900,
                  mb: 2,
                }}
              >
                Disclaimer: Predictions and analytics on WealthNova are for
                educational and informational purposes only and should not be
                considered as investment advice. Always conduct your own
                research and consult with a qualified financial advisor before
                making investment decisions.
              </Typography>
              <Typography sx={{ color: band.muted, fontSize: "0.85rem" }}>
                © {new Date().getFullYear()} WealthNova. All rights reserved.
                Built with ❤️ for Indian investors.
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
