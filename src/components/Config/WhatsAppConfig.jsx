import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Alert, Steps, Spin, Badge } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance'; 

const { Step } = Steps;

const WhatsAppConfig = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [whatsappStep, setWhatsappStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); 
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);
  const [whatsappPhoneNumber, setWhatsappPhoneNumber] = useState('');


  useEffect(() => {
    const notificationSettings = JSON.parse(sessionStorage.getItem('notificationSettings')) || {};

        // Verificar si WhatsApp ya está configurado en sessionStorage
        const whatsappUrl = notificationSettings.whatsapp;
    
     // Si la URL de WhatsApp está disponible, extraemos el número de teléfono de la URL
     if (whatsappUrl && whatsappUrl.includes('alert/')) {
      const phoneNumberFromUrl = whatsappUrl.split('alert/')[1];
      setWhatsappPhoneNumber(phoneNumberFromUrl); // Establecer el número de teléfono desde la URL
      setIsWhatsappVerified(true); // WhatsApp ya está verificado
    }
  }, []);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    // Permitir solo números y limitar a 10 dígitos
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSendCode = async () => {
    if (phoneNumber.length !== 10) {
      setErrorMessage('El número de teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/whatsapp/send', { phone: phoneNumber });

      if (response.status === 200) {
        setWhatsappStep(1);
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al enviar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!/^\d{6}$/.test(verificationCode)) {
      setErrorMessage('El código debe ser un número de 6 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/whatsapp/verify-code', { code: verificationCode });

      if (response.status === 200) {
        setWhatsappStep(2);
        setErrorMessage('');
        
        sessionStorage.setItem('whatsappVerified', 'true');
        setIsWhatsappVerified(true);

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <WhatsAppOutlined style={{ fontSize: '24px', color: 'green' }} />
            <strong style={{ marginLeft: '8px' }}>WhatsApp</strong>
          </div>
          
          <Badge count={isWhatsappVerified ? "Activo" : "Inactivo"} style={{ backgroundColor: isWhatsappVerified ? '#52c41a' : '#f5222d' }} />
          
        </div>
        <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 'bold' }}>{whatsappPhoneNumber}</div>
        {/* Solo mostramos el botón si WhatsApp no está configurado */}
        {!isWhatsappVerified && (
          <Button type="primary" onClick={() => setModalOpen(true)} block style={{ marginTop: '8px' }}>
            Configurar WhatsApp
          </Button>
        )}
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
                <Input
                  placeholder="Ingresa los 10 dígitos de tu número"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength={10}
                />
              </Form.Item>
              {errorMessage && <Alert message={errorMessage} type="error" />}
              <Button type="primary" onClick={handleSendCode} block disabled={loading || phoneNumber.length !== 10}>
                {loading ? <Spin /> : 'Enviar Código'}
              </Button>
            </>
          )}

          {whatsappStep === 1 && (
            <>
              <Form.Item label="Código de Verificación">
                <Input
                  placeholder="Ingresa el código recibido"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </Form.Item>
              {errorMessage && <Alert message={errorMessage} type="error" />}
              <Button type="primary" onClick={handleVerifyCode} block disabled={loading || !/^\d{6}$/.test(verificationCode)}>
                {loading ? <Spin /> : 'Confirmar Código'}
              </Button>
            </>
          )}

          {whatsappStep === 2 && (
            <Alert
              message="WhatsApp Verificado"
              description="Tu número ha sido confirmado correctamente. Recargando la página..."
              type="success"
              showIcon
            />
          )}
        </Form>
      </Modal>
    </>
  );
};

export default WhatsAppConfig;
