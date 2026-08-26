import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Calculators from "./pages/Calculators";
import LandingPage from "./pages/LandingPage";
import Watchlist from "./pages/Watchlist";

import { ThemeContextProvider } from "./context/ThemeContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/Signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />, // Parent Root Layout (Sidebar + Navbar + Outlet)
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "portfolio", // URL banega: /home/portfolio
        element: <Portfolio />,
      },
      {
        path: "profile", // URL banega: /home/profile
        element: <Profile />,
      },
      {
        path: "watchlist", // URL banega: /home/profile
        element: <Watchlist />,
      },
      {
        path: "dashboard", // URL banega: /home/dashboard
        element: <Dashboard />,
      },
      {
        path: "calculator",
        element: <Calculators />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ThemeContextProvider>
        <RouterProvider router={router} />
      </ThemeContextProvider>
    </>
  );
}

export default App;
