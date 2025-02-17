import React, { useState } from "react";
import { Form, Input, Button, Card, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Login = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);
      if (response.status === 200) {
        message.success("Inicio de sesión exitoso");
        console.log('redirigiendo....');
        setIsAuthenticated(true);
        navigate("/"); // Redirigir al dashboard

      }
    } catch (error) {
      message.error("Usuario o contraseña incorrectos");
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
      </Card>
    </div>
  );
};

export default Login;
