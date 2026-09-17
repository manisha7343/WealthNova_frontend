import { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ThemeContextProvider = ({ children }) => {
  // LocalStorage se mode read karo (Default 'dark')
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("appTheme") || "dark";
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("appTheme", newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  // Dynamic MUI Theme Object
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#080c14",
                  paper: "#0f1624",
                },
                primary: {
                  main: "#38bdf8",
                  light: "#7dd3fc",
                  dark: "#0284c7",
                },
                secondary: {
                  main: "#818cf8",
                },
                success: {
                  main: "#10b981",
                  light: "#34d399",
                },
                error: {
                  main: "#f43f5e",
                  light: "#fb7185",
                },
                warning: {
                  main: "#f59e0b",
                },
                text: {
                  primary: "#f8fafc",
                  secondary: "#94a3b8",
                },
                divider: "rgba(255, 255, 255, 0.08)",
              }
            : {
                background: {
                  default: "#f1f5f9",
                  paper: "#ffffff",
                },
                primary: {
                  main: "#0284c7",
                  light: "#38bdf8",
                  dark: "#0369a1",
                },
                secondary: {
                  main: "#6366f1",
                },
                success: {
                  main: "#059669",
                },
                error: {
                  main: "#e11d48",
                },
                warning: {
                  main: "#d97706",
                },
                text: {
                  primary: "#0f172a",
                  secondary: "#64748b",
                },
                divider: "rgba(0, 0, 0, 0.08)",
              }),
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          h1: { fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
          h2: { fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
          h3: { fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
          h4: { fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
          h5: { fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
          h6: { fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", fontWeight: 600 },
          button: { textTransform: "none", fontWeight: 600 },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                textTransform: "none",
                fontWeight: 600,
                transition: "all 0.2s ease-in-out",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);