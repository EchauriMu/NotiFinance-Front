import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";
import Login from "./components/Login/Login";
import MainLayout from "./components/Layout";
import { Spin } from "antd"; // Puedes usar un Spinner de Ant Design para la carga

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Inicializamos en false
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/protected");
        console.log('revisando...');

        if (response.status === 200) {
          console.log('Autenticado');
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('No autorizado');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '50px' }}><Spin size="large" /></div>; // Spinner de carga

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
