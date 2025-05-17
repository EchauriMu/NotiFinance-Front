import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import { Spin } from "antd";

// ====== AUTENTICACIÓN Y USUARIOS ======
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyToken from "./components/auth/Verify";
import ForgotPassword from "./components/auth/forgot";
import ResetPassword from "./components/auth/Reset";

// ====== LANDING Y PRINCIPAL ======
import NotiFinanceLanding from "./components/Landing";
import MainLayout from "./components/Layout";

// ====== SUSCRIPCIONES Y PAGOS ======
import Subscription from "./components/Subscriptions/Subscription";
import Payments from "./components/Subscriptions/Payments";
import ThankYou from "./components/Subscriptions/ty";

// ====== ADMINISTRACIÓN ======
import AdminPanel from "./components/Admin/AdminPanel";
import EmailVerification from "./components/Admin/EmailVerification";

// ====== OTRAS SECCIONES ======
import Succes from "./components/auth/succes";
import SuccesChange from "./components/auth/successchange";
import TermsAndConditions from "./components/Terms";
import HelpAndFAQ from "./components/help";
import AboutPage from "./components/About";
import CryptoList from "./components/List";

// ====== GUÍAS E INTRODUCCIÓN ======
import Intro from "./components/General/intro";
import GuiaInteractiva from "./components/General/Guia";

// ====== ESTILOS ======
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        // Verificamos en el backend que el token sea válido
        const response = await axiosInstance.get("/auth/protected");
        if (response.status === 200) {
          setIsAuthenticated(true);

          let roleFromStorage = localStorage.getItem("userRole");

          if (!roleFromStorage && response.data?.role) {
            roleFromStorage = response.data.role;
            localStorage.setItem("userRole", roleFromStorage);
          }

          setUserRole(roleFromStorage);
        } else {
          throw new Error("Token inválido");
        }
      } catch (error) {
        console.log("🚫 Verificación fallida:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setIsAuthenticated(false);
        setUserRole(null);
      }

      setLoading(false);
    };

    checkAuthAndRole();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ====== LANDING Y PRINCIPAL ====== */}
        <Route path="/" element={<NotiFinanceLanding />} />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              userRole === "admin" ? <Navigate to="/admin" replace /> : <MainLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ====== AUTENTICACIÓN Y USUARIOS ====== */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              userRole === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:userId" element={<VerifyToken />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />

        {/* ====== ADMINISTRACIÓN ====== */}
        <Route
          path="/admin"
          element={
            isAuthenticated && userRole === "admin" ? (
              <AdminPanel />
            ) : isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/verify-admin"
          element={
            isAuthenticated && userRole === "admin" ? (
              <EmailVerification />
            ) : isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ====== SUSCRIPCIONES Y PAGOS ====== */}
        <Route
          path="/subscription"
          element={isAuthenticated ? <Subscription /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/payments"
          element={isAuthenticated ? <Payments /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/thank-you"
          element={isAuthenticated ? <ThankYou /> : <Navigate to="/login" replace />}
        />

        {/* ====== GUÍAS E INTRODUCCIÓN ====== */}
        <Route
          path="/intro"
          element={isAuthenticated ? <Intro /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/guia"
          element={isAuthenticated ? <GuiaInteractiva /> : <Navigate to="/login" replace />}
        />

        {/* ====== OTRAS SECCIONES ====== */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/ayuda" element={<HelpAndFAQ />} />
        <Route path="/terminos" element={<TermsAndConditions />} />
        <Route path="/successchange" element={<SuccesChange />} />
        <Route path="/success" element={<Succes />} />
        <Route path="/list" element={<CryptoList />} />
      </Routes>
    </Router>
  );
};

export default App;