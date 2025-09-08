import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

  // ✅ show Navbar only on login & register
  const showNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={loggedIn ? <Dashboard setLoggedIn={setLoggedIn} /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
