import React, { useState, useEffect } from 'react';
import {
  Card, Button, Modal, Form, Input, Space, Typography, notification, Badge, Tooltip
} from 'antd';
import {
  DiscordOutlined, SettingOutlined, CheckCircleOutlined, DeleteOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const DiscordConfig = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDiscordVerified, setIsDiscordVerified] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isReloadModalVisible, setReloadModalVisible] = useState(false);

  useEffect(() => {
    const notificationSettings = JSON.parse(sessionStorage.getItem('notificationSettings')) || {};
    const discordUrl = notificationSettings.discord;

    if (discordUrl && discordUrl !== '') {
      setWebhookUrl(discordUrl);
      setIsDiscordVerified(true);
      fetchWebhookDetails(discordUrl);
    }
  }, []);

  const fetchWebhookDetails = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.name) {
        setWebhookName(data.name);
      }
    } catch (error) {
      console.error("Error al obtener detalles del webhook:", error);
    }
  };

  const notifySuccess = (msg) => {
    notification.success({
      message: 'Éxito',
      description: msg,
      placement: 'bottomRight',
    });
  };

  const notifyError = (msg) => {
    notification.error({
      message: 'Error',
      description: msg,
      placement: 'bottomRight',
    });
  };

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

      await axiosInstance.post('/user/settings/discord', {
        discord: trimmedUrl,
      });

      sessionStorage.setItem('notificationSettings', JSON.stringify({ discord: trimmedUrl }));
      setIsDiscordVerified(true);
      notifySuccess("Webhook de Discord guardado correctamente.");
      setModalOpen(false);
      setReloadModalVisible(true);
    } catch (error) {
      console.error("Error al guardar webhook:", error);
      notifyError("Hubo un error al guardar el webhook");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotificationSetting = async () => {
    try {
      await axiosInstance.delete('/user/deleted/notisetting', {
        data: { type: 'discord' }
      });

      setIsDiscordVerified(false);
      setWebhookUrl('');
      setWebhookName('');
      sessionStorage.removeItem('notificationSettings');

      notifySuccess("La configuración de Discord ha sido eliminada correctamente.");
      setReloadModalVisible(true);
    } catch (error) {
      notifyError(error.response?.data?.message || "Ocurrió un error al intentar eliminar la configuración.");
    }
  };

  const handleDeleteModalOk = () => {
    handleDeleteNotificationSetting();
    setDeleteModalVisible(false);
  };

  const handleForceReload = () => {
    window.location.reload();
  };

  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DiscordOutlined style={{ fontSize: '24px', color: '#5865F2' }} />
            <strong style={{ marginLeft: '8px' }}>Discord</strong>
            <Tooltip title="¿Cómo obtener tu Webhook de Discord?">
              <QuestionCircleOutlined
                style={{ fontSize: '18px', color: '#1677ff', marginLeft: 8, cursor: 'pointer' }}
                onClick={() => window.open('https://www.youtube.com/watch?v=TrMzEfVYBxI', '_blank')}
              />
            </Tooltip>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              count={isDiscordVerified ? 'Activo' : 'Sin registrar'}
              style={{ backgroundColor: isDiscordVerified ? '#52c41a' : '#f5222d' }}
            />
            {isDiscordVerified && (
              <Tooltip title="Eliminar configuración de Discord">
                <DeleteOutlined
                  style={{ fontSize: '20px', color: '#f5222d', marginLeft: '8px', cursor: 'pointer' }}
                  onClick={() => setDeleteModalVisible(true)}
                />
              </Tooltip>
            )}
          </div>
        </div>

        {webhookName && (
          <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
            WebHook: {webhookName}
          </div>
        )}

        {!isDiscordVerified && (
          <Button type="primary" onClick={() => setModalOpen(true)} block style={{ marginTop: '8px' }}>
            Configurar Discord
          </Button>
        )}
      </Card>

      {/* Modal de configuración */}
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

      {/* Modal de confirmación de eliminación */}
      <Modal
        title="Confirmar eliminación"
        open={isDeleteModalVisible}
        onOk={handleDeleteModalOk}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Eliminar"
        cancelText="Cancelar"
      >
        <p>Al eliminar esta configuración, tus alertas de Discord se eliminarán permanentemente. ¿Deseas continuar?</p>
      </Modal>

      {/* Modal de recarga forzosa */}
      <Modal
        title="Recargar página"
        open={isReloadModalVisible}
        onOk={handleForceReload}
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        maskClosable={false}
        okText="Recargar ahora"
      >
        <p>La operación se completó correctamente. La página debe recargarse para aplicar los cambios.</p>
      </Modal>
    </>
  );
};

export default DiscordConfig;
