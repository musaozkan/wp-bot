// src/App.jsx
import React, { useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import "./App.css";

// Fake API Functions
const fakeLoginApi = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === "user" && credentials.password === "pass") {
        resolve({ success: true });
      } else {
        reject({ success: false, message: "Invalid username or password" });
      }
    }, 1000); // Simulate network delay
  });
};

const fakeLogoutApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500); // Simulate network delay for logout
  });
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (credentials) => {
    try {
      const response = await fakeLoginApi(credentials);
      if (response.success) {
        setLoggedIn(true);
        navigate("/"); // Redirect to home after login
      }
    } catch (error) {
      alert(error.message); // Display error if login fails
    }
  };

  const handleLogout = async () => {
    const response = await fakeLogoutApi();
    if (response.success) {
      setLoggedIn(false);
      navigate("/sign-in");
    }
  };

  const navLinks = [];

  const authenticatedRoutes = (
    <>
      <Header
        title="WhatsApp Bot"
        onLogout={handleLogout}
        navLinks={navLinks}
      />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );

  const unauthenticatedRoutes = (
    <AuthLayout>
      <Routes>
        <Route path="/sign-in" element={<SignIn onLogin={handleLogin} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/sign-in" />} />
      </Routes>
    </AuthLayout>
  );

  return (
    <div className="app-container">
      {loggedIn ? authenticatedRoutes : unauthenticatedRoutes}
    </div>
  );
}

export default App;
