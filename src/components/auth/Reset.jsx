import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Spin, notification } from "antd";
import { useParams, useNavigate } from "react-router-dom";  
import axiosInstance from "../../api/axiosInstance";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();  // Obtener el token de la URL
  const navigate = useNavigate();  // Usar useNavigate

  useEffect(() => {
    // Si no se recibe un token, redirigir a la página de inicio de sesión o error.
    if (!token) {
      notification.error({
        message: "Error",
        description: "Token inválido o no proporcionado.",
        placement: "bottomRight",
      });
      navigate("/login"); 
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Enviar el nuevo password y el token al backend
      const response = await axiosInstance.post("/reset/reset-password", {
        token: token,         // Token obtenido de la URL
        newPassword: values.password,  // Nueva contraseña
      });

      if (response.status === 200) {
        notification.success({
          message: "Contraseña Restablecida",
          description: "Tu contraseña ha sido cambiada exitosamente.",
          placement: "bottomRight",
        });

        // Redirigir al login después de restablecer la contraseña
        navigate("/successchange");  // Usar navigate en lugar de history.push
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error al restablecer la contraseña.";

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
      <Card title="Restablecer Contraseña" style={{ width: 350 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Nueva Contraseña"
            name="password"
            rules={[
              { required: true, message: "Ingresa tu nueva contraseña" },
              { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirmar Contraseña"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "Confirma tu nueva contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : "Restablecer Contraseña"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
