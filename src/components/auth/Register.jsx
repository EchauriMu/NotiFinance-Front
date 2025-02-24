import React, { useState } from "react";
import { Form, Input, Button, Card, Spin, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);

    // 🔥 Verifica los datos antes de enviarlos
    console.log("Datos a enviar:", values);

    try {
      const response = await axiosInstance.post("/auth/register", values);

      if (response.status === 201) {
        notification.success({
          message: "Registro Exitoso",
          description: "Se ha enviado un correo de verificación.",
          placement: "bottomRight",
        });

        // Redirigir a login después de éxito
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      notification.error({
        message: "Error en el Registro",
        description: error.response?.data?.message || "Ocurrió un error inesperado.",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="Registro" style={{ width: 400, textAlign: "center" }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Usuario" name="username" rules={[{ required: true, message: "Ingresa tu usuario" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Correo Electrónico" name="email" rules={[{ required: true, message: "Ingresa tu correo" }]}>
            <Input type="email" />
          </Form.Item>

          <Form.Item label="Teléfono" name="phone" rules={[{ required: true, message: "Ingresa tu número de teléfono" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Ingresa tu contraseña" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : "Registrarse"}
            </Button>
          </Form.Item>
        </Form>

        {/* 🔗 Enlace para iniciar sesión */}
        <div style={{ marginTop: 10 }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
