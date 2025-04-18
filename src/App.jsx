import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register"; // Importa el componente de Registro
import VerifyToken from "./components/auth/Verify"; // Importa el componente de Verificación
import MainLayout from "./components/Layout";
import Subscription from "./components/Subscriptions/Subscription";
import Payments from "./components/Subscriptions/Payments";
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
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
      />
      <Route path="/register" element={<Register />} />
      <Route path="/verify/:userId" element={<VerifyToken />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route 
        path="/payments" 
        element={isAuthenticated ? <Payments /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
      />
    </Routes>
  </Router>
  );
};

export default App;
