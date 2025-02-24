import React, { useState } from "react";
import { Form, Input, Button, Card, Spin, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Login = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);

      if (response.status === 200) {
        notification.success({
          message: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente.",
          placement: "bottomRight",
        });

        console.log("redirigiendo....");
        setIsAuthenticated(true);
        navigate("/"); // Redirigir al dashboard
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error al iniciar sesión";

      notification.error({
        message: "Error de inicio de sesión",
        description: errorMessage,
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="Iniciar Sesión" style={{ width: 350 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Usuario" name="username" rules={[{ required: true, message: "Ingresa tu usuario" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Ingresa tu contraseña" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : "Iniciar Sesión"}
            </Button>
          </Form.Item>
        </Form>
         {/* 🔗 Enlace para iniciar sesión */}
         <div style={{ marginTop: 10 }}>
          ¿No tienes cuenta? <Link to="/register">Registrate aquí</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
