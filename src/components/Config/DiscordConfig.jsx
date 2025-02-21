// DiscordConfig.js
import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input, Space, Typography } from 'antd';
import { DiscordOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const DiscordConfig = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleSave = () => {
    console.log("Webhook Guardado:", webhookUrl);
    setModalOpen(false);
  };

  return (
    <>
      <Card>
        <DiscordOutlined style={{ fontSize: '24px', color: '#5865F2' }} />
        <strong style={{ marginLeft: '8px' }}>Discord</strong>
        <Button type="primary" onClick={() => setModalOpen(true)} block style={{ marginTop: '8px' }}>
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
          >
            Guardar Webhook
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default DiscordConfig;
