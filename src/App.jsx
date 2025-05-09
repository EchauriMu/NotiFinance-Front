import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register"; // Importa el componente de Registro
import VerifyToken from "./components/auth/Verify"; // Importa el componente de Verificación
import MainLayout from "./components/Layout";
import Subscription from "./components/Subscriptions/Subscription";
import Payments from "./components/Subscriptions/Payments";
import ThankYou from "./components/Subscriptions/ty";
import NotiFinanceLanding from "./components/Landing";
import ForgotPassword from "./components/auth/forgot";
import ResetPassword from "./components/auth/Reset"
import CryptoList from "./components/List";
import Succes from "./components/auth/succes";
import SuccesChange from "./components/auth/successchange";
import TermsAndConditions from "./components/Terms";
import HelpAndFAQ from "./components/help";
import AboutPage from "./components/About";
import './App.css';

import Intro from "./components/General/intro";

import { Spin } from "antd";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Verifica si hay un token almacenado
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/protected");
        console.log("Revisando autenticación...");

        if (response.status === 200) {
          console.log("✅ Usuario autenticado.");
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log("🚫 No autorizado.");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecuta la verificación si no está autenticado en `localStorage`
    if (!isAuthenticated) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading)
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NotiFinanceLanding />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />

            <Route path="/about" element={<AboutPage />} />
        <Route path="/ayuda" element={<HelpAndFAQ />} />
        <Route path="/terminos" element={<TermsAndConditions />} />
        <Route path="/successchange" element={<SuccesChange />} />
        <Route path="/success" element={<Succes />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:userId" element={<VerifyToken />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/list" element={<CryptoList />} />


        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />

        <Route
          path="/thank-you"
          element={isAuthenticated ? <ThankYou /> : <Navigate to="/login" replace />}
        />


        <Route
          path="/payments"
          element={isAuthenticated ? <Payments /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/intro"
          element={isAuthenticated ? <Intro /> : <Navigate to="/login" replace />}
        />


        <Route
          path="/home"
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
