import React, { useState } from 'react';
import { Typography, Card, Input, Button, notification, Divider, Tooltip } from 'antd';
import { MailOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text } = Typography;

const AdminSettings = ({ userData }) => {
  const [email, setEmail] = useState(userData?.email || '');
  const [loading, setLoading] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSetEmail = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/admin/set-email', { email });
      notification.success({
        message: 'Correo enviado',
        description: response.data.message,
        placement: 'bottomRight',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el correo.',
        placement: 'bottomRight',
      });
    }
    setLoading(false);
  };

  const handlePasswordRecovery = async () => {
    setRecoveryLoading(true);
    try {
      const response = await axiosInstance.post('/reset/send-auth');
      notification.success({
        message: 'Correo enviado',
        description: 'Revisa tu correo electrónico para restablecer tu contraseña.',
        placement: 'bottomRight',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'No se pudo enviar el correo de recuperación.',
        placement: 'bottomRight',
      });
    }
    setRecoveryLoading(false);
  };

  return (
    <Card
      title={<Title level={4} style={{ margin: 0 }}>Configuración de Administrador</Title>}
 >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Usuario:</Text> <Text>{userData?.username}</Text>
        <br />
        <Text strong>Rol:</Text> <Text>{userData?.role}</Text>
      </div>
      <Divider />
      {!userData?.email ? (
        <>
          <Text>
            <MailOutlined style={{ color: '#1890ff', marginRight: 6 }} />
            No tienes un correo electrónico registrado. Regístralo para poder recuperar tu cuenta y recibir notificaciones importantes.
          </Text>
          <div style={{ marginTop: 18, marginBottom: 8 }}>
            <Text strong>
              <EditOutlined style={{ color: '#faad14', marginRight: 6 }} />
              Registrar correo electrónico
            </Text>
          </div>
          <Input
            style={{ width: '100%', maxWidth: 320 }}
            value={email}
            onChange={handleEmailChange}
            placeholder="Escribe tu correo electrónico"
            type="email"
            autoComplete="email"
          />
          <Button
            type="primary"
            style={{ marginTop: 12, width: '100%', maxWidth: 320 }}
            loading={loading}
            onClick={handleSetEmail}
            disabled={!email}
          >
            Registrar correo
          </Button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 8 }}>
            <Text strong>
              <MailOutlined style={{ color: '#1890ff', marginRight: 6 }} />
              Correo electrónico registrado:
            </Text>
            <br />
            <Text type="secondary">{userData.email}</Text>
          </div>
          <Tooltip title="Puedes actualizar tu correo si cambias de dirección o necesitas corregirlo.">
            <div style={{ marginTop: 18, marginBottom: 8 }}>
              <Text strong>
                <EditOutlined style={{ color: '#faad14', marginRight: 6 }} />
                Actualizar correo electrónico
              </Text>
            </div>
          </Tooltip>
          <Input
            style={{ width: '100%', maxWidth: 320 }}
            value={email}
            onChange={handleEmailChange}
            placeholder="Escribe tu nuevo correo electrónico"
            type="email"
            autoComplete="email"
          />
          <Button
            type="primary"
            style={{ marginTop: 12, width: '100%', maxWidth: 320 }}
            loading={loading}
            onClick={handleSetEmail}
            disabled={!email || email === userData.email}
          >
            Actualizar correo
          </Button>
          <Divider />
          <Tooltip title="Recibirás un correo para restablecer tu contraseña.">
            <Button
              type="default"
              icon={<KeyOutlined />}
              style={{ width: '100%', maxWidth: 320 }}
              loading={recoveryLoading}
              onClick={handlePasswordRecovery}
            >
              Cambiar o recuperar contraseña
            </Button>
          </Tooltip>
        </>
      )}
      <Divider />
      <Text type="secondary" style={{ fontSize: 13 }}>
        Tu correo electrónico se usará para notificaciones importantes y recuperación de cuenta. 
        Asegúrate de que esté actualizado y sea accesible solo por ti.
      </Text>
    </Card>
  );
};

export default AdminSettings;