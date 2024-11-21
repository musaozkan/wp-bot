import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import { checkSession } from "./services/UserService";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [splashLoading, setSplashLoading] = useState(true);

  const navLinks = [];
  const navigate = useNavigate();

  // Splash screen helper
  const showSplash = (callback) => {
    setSplashLoading(true);
    setTimeout(() => {
      setSplashLoading(false);
      if (callback) callback();
    }, 2000);
  };

  // Check session state on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      showSplash(); // Show splash while checking session
      try {
        const response = await checkSession();
        if (response.status === 200 && response.data.loggedIn) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        setLoggedIn(false);
      } finally {
        setTimeout(() => {
          setSplashLoading(false);
        }, 2000);
      }
    };

    checkLoggedIn();
  }, []);

  // Splash screen for login/logout transitions
  const handleLogin = () => {
    showSplash(() => {
      setLoggedIn(true);
      navigate("/");
    });
  };

  const handleLogout = () => {
    showSplash(() => {
      setLoggedIn(false);
      navigate("/sign-in");
    });
  };

  // Splash screen
  if (splashLoading) {
    return (
      <SplashScreen
        logo="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        title="WhatsApp Bot"
        subtitle="Mesajlaşmayı Kolaylaştırın"
        showSpinner
      />
    );
  }

  const authenticatedRoutes = (
    <>
      <Header
        title="WhatsApp Bot"
        handleLogout={handleLogout}
        navLinks={navLinks}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );

  const unauthenticatedRoutes = (
    <AuthLayout>
      <Routes>
        <Route path="/sign-in" element={<SignIn handleLogin={handleLogin} />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/sign-in" />} />
      </Routes>
    </AuthLayout>
  );

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #25d366 30%, #075e54 100%)",
      }}
    >
      {loggedIn ? authenticatedRoutes : unauthenticatedRoutes}
    </div>
  );
}

export default App;
