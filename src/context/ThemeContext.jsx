import { createContext, useState, useMemo, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
  
const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ThemeContextProvider = ({ children }) => {
  // LocalStorage se mode read karo (Default 'light')
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("appTheme") || "light";
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
                  default: "#121212",
                  paper: "#1e1e1e",
                },
              }
            : {
                background: {
                  default: "#f5f5f5",
                  paper: "#ffffff",
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Theme ke hisab se background color auto-change karega */}
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

// Custom Hook to use theme toggle anywhere
// This hook intentionally lives with the provider because this file is the
// single source of truth for the theme context.
// eslint-disable-next-line react-refresh/only-export-components
export const useColorMode = () => useContext(ColorModeContext);