import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import axiosInstance from "../../api/axiosInstance";

const VerifyToken = () => {
  const [loading, setLoading] = useState(false);
  const { userId } = useParams(); // Captura el ID del usuario desde la URL
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    if (!userId) {
      message.error("⚠️ No se encontró el ID de usuario en la URL.");
    }
  }, [userId]);

  const onFinish = async (values) => {
    if (!userId) {
      message.error("❌ No se encontró el ID de usuario.");
      return;
    }

    setLoading(true);
    try {
      // 🔥 Corrige la URL: Usa `userId` en lugar de `:userId`
      await axiosInstance.post(`/auth/verify/${userId}`, {
        token: values.token, // Ya no es necesario enviar userId en el body
      });

      message.success({
        content: "✅ ¡Cuenta verificada con éxito! Redirigiendo a login...",
        duration: 2, // Muestra la notificación por 2 segundos
        style: { bottom: 50, right: 50 },
      });

      setTimeout(() => {
        navigate("/login"); // 🔀 Redirige después de 2 segundos
      }, 2000);
    } catch (error) {
      message.error(error.response?.data?.error || "❌ Error al verificar el token.");
    }
    setLoading(false);
  };

  return (
    <Card title="Verificación de Token" style={{ width: 400, margin: "50px auto", textAlign: "center" }}>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Código de Verificación"
          name="token"
          rules={[
            { required: true, message: "Por favor, ingresa el código de 6 dígitos." },
            { pattern: /^[0-9]{6}$/, message: "El código debe tener exactamente 6 dígitos." },
          ]}
        >
          <Input maxLength={6} placeholder="123456" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Verificar Cuenta
        </Button>
      </Form>
    </Card>
  );
};

export default VerifyToken;
