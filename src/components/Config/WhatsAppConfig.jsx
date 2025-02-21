// WhatsAppConfig.js
import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input, Alert, Steps } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';

const { Step } = Steps;

const WhatsAppConfig = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [whatsappStep, setWhatsappStep] = useState(0);

  return (
    <>
      <Card>
        <WhatsAppOutlined style={{ fontSize: '24px', color: 'green' }} />
        <strong style={{ marginLeft: '8px' }}>WhatsApp</strong>
        <Button type="primary" onClick={() => setModalOpen(true)} block style={{ marginTop: '8px' }}>
          Configurar WhatsApp
        </Button>
      </Card>

      <Modal
        title="Verificación de WhatsApp"
        open={isModalOpen}
        onCancel={() => {
          setModalOpen(false);
          setWhatsappStep(0);
        }}
        footer={null}
      >
        <Steps current={whatsappStep}>
          <Step title="Número" description="Ingresa tu número de WhatsApp" />
          <Step title="Código" description="Verifica el código recibido" />
          <Step title="Completado" description="WhatsApp verificado" />
        </Steps>

        <Form layout="vertical" style={{ marginTop: '16px' }}>
          {whatsappStep === 0 && (
            <>
              <Form.Item label="Número de WhatsApp">
                <Input placeholder="+52 123 456 7890" />
              </Form.Item>
              <Button type="primary" onClick={() => setWhatsappStep(1)} block>
                Enviar Código
              </Button>
            </>
          )}

          {whatsappStep === 1 && (
            <>
              <Form.Item label="Código de Verificación">
                <Input placeholder="Ingresa el código recibido" />
              </Form.Item>
              <Button type="primary" onClick={() => setWhatsappStep(2)} block>
                Confirmar Código
              </Button>
            </>
          )}

          {whatsappStep === 2 && (
            <Alert
              message="WhatsApp Verificado"
              description="Tu número ha sido confirmado correctamente."
              type="success"
              showIcon
            />
          )}

          {whatsappStep > 0 && (
            <Button onClick={() => setWhatsappStep(whatsappStep - 1)} block style={{ marginTop: '8px' }}>
              Regresar
            </Button>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default WhatsAppConfig;
