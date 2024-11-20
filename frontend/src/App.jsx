// src/App.jsx
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import { checkSession } from "./services/UserService";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const navLinks = [];

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await checkSession();
        if (response.status === 200 && response.data.loggedIn) {
          setLoggedIn(true);
          navigate("/");
        } else {
          setLoggedIn(false);
          navigate("/sign-in");
        }
      } catch (error) {
        setLoggedIn(false);
        navigate("/sign-in");
      }
    };

    checkLoggedIn();
  }, []);

  const authenticatedRoutes = (
    <>
      <Header
        title="WhatsApp Bot"
        setLoggedIn={setLoggedIn}
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
        <Route path="/sign-in" element={<SignIn setLoggedIn={setLoggedIn} />} />
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
