import React, { useState } from "react";
import { Form, Input, Button, Card, Spin, notification } from "antd";
import axiosInstance from "../../api/axiosInstance";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/reset/send", {
        username: values.username,
      });

      if (response.status === 200) {
        notification.success({
          message: "Correo enviado",
          description: "Revisa tu correo electrónico para restablecer tu contraseña.",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error al enviar el correo";

      notification.error({
        message: "Error",
        description: errorMessage,
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="¿Olvidaste tu contraseña?" style={{ width: 350 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Nombre de Usuario"
            name="username"
            rules={[{ required: true, message: "Ingresa tu nombre de usuario" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : "Enviar Correo de Recuperación"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
