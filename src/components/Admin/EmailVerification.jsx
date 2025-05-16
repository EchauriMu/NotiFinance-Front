import React, { useState } from 'react';
import { Card, Input, Button, Typography, notification } from 'antd';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const EmailVerification = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/admin/verify-email', { token });
      notification.success({
        message: 'Correo verificado',
        description: response.data.message,
        placement: 'bottomRight',
      });
      setToken('');
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'No se pudo verificar el correo.',
        placement: 'bottomRight',
      });
    }
    setLoading(false);
  };

  return (
    <Card style={{ maxWidth: 400, margin: '40px auto' }}>
      <Title level={4}>Verificar correo de administrador</Title>
      <Text>Ingresa el código de 6 dígitos que recibiste en tu correo.</Text>
      <Input
        style={{ marginTop: 16, marginBottom: 12 }}
        maxLength={6}
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="Código de verificación"
      />
      <Button
        type="primary"
        loading={loading}
        disabled={token.length !== 6}
        onClick={handleVerify}
        block
      >
        Verificar correo
      </Button>
    </Card>
  );
};

export default EmailVerification;