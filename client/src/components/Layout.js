import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import AuthBox from "./AuthBox";
import Dashboard from "./Dashboard";
import Header from "./Header";

function Layout() {
  const { fetchingUser } = useContext(GlobalContext);
  return fetchingUser ? (
    <div className="loading">
      <h1>Loading...</h1>
    </div>
  ) : (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<AuthBox />} />
        <Route path="/register" element={<AuthBox register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default Layout;
