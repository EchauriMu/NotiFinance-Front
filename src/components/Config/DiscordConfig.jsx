import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Space, Typography, message, notification, Badge } from 'antd';
import { DiscordOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance'; 

const DiscordConfig = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDiscordVerified, setIsDiscordVerified] = useState(false); // Estado para verificar si el webhook de Discord está configurado

  useEffect(() => {
    // Obtener la configuración de notificaciones desde sessionStorage
    const notificationSettings = JSON.parse(sessionStorage.getItem('notificationSettings')) || {};

    // Verificar si la URL del webhook de Discord está configurada
    if (notificationSettings.discord && notificationSettings.discord !== "") {
      setIsDiscordVerified(true); // Si está configurado, marcar como activo
    } else {
      setIsDiscordVerified(false); // Si no está configurado, marcar como inactivo
    }
  }, []);

  // Notificación de éxito
  const notifySuccess = () => {
    notification.success({
      message: "Webhook de Discord guardado",
      description: "Tu webhook de Discord ha sido configurado correctamente.",
      placement: "bottomRight",
    });
  };

  // Notificación de error
  const notifyError = (message) => {
    notification.error({
      message: "Error",
      description: message,
      placement: "bottomRight",
    });
  };

  // Notificación de recarga
  const notifyReload = () => {
    notification.info({
      message: "Recarga en 3 segundos",
      description: "La página se recargará automáticamente en 3 segundos para reflejar los cambios.",
      placement: "bottomRight",
      duration: 3, // Duración de 3 segundos
    });
  };

  // Verificar si la URL del webhook es válida
  const isValidDiscordWebhook = (url) => {
    return /^https:\/\/discord\.com\/api\/webhooks\/[\w-]+\/[\w-]+$/.test(url.trim());
  };

  const handleSave = async () => {
    const trimmedUrl = webhookUrl.trim();

    if (!isValidDiscordWebhook(trimmedUrl)) {
      notifyError("El webhook no es válido. Debe ser una URL de Discord.");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post('/user/settings/discord', {
        discord: trimmedUrl,
      });

      notifySuccess(); // Mostrar notificación de éxito
      setModalOpen(false);

      // Guardamos la configuración en sessionStorage
      sessionStorage.setItem('notificationSettings', JSON.stringify({ discord: trimmedUrl }));

      // Marcamos como activo
      setIsDiscordVerified(true);

      // Notificación de recarga
      notifyReload();

      setTimeout(() => {
        // Recargar la página después de 3 segundos
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error al guardar webhook:", error);
      notifyError("Hubo un error al guardar el webhook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <DiscordOutlined style={{ fontSize: '24px', color: '#5865F2' }} />
            <strong style={{ marginLeft: '8px' }}>Discord</strong>
          </div>
          <Badge 
            count={isDiscordVerified ? "Activo" : "Inactivo"} 
            style={{ backgroundColor: isDiscordVerified ? '#52c41a' : '#f5222d' }} 
          />
        </div>
        <Button 
          type="primary" 
          onClick={() => setModalOpen(true)} 
          block 
          style={{ marginTop: '8px' }}
        >
          Configurar Discord
        </Button>
      </Card>

      <Modal
        title={
          <Space>
            <SettingOutlined style={{ color: "#1677ff" }} />
            <Typography.Text strong>Configuración de Discord</Typography.Text>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
      >
        <Form layout="vertical">
          <Form.Item label={<Typography.Text strong>URL del Webhook de Discord</Typography.Text>}>
            <Input
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              allowClear
            />
          </Form.Item>
          <Button 
            type="primary" 
            block 
            icon={<CheckCircleOutlined />} 
            onClick={handleSave}
            disabled={!webhookUrl.trim()}
            loading={loading}
          >
            Guardar Webhook
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default DiscordConfig;
