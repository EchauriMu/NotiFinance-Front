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
  const [loading, setLoading] = useState(false); // Estado para controlar el loading
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false); // Estado para verificar si WhatsApp está configurado

  useEffect(() => {
    // Obtener la configuración de notificaciones desde sessionStorage
    const notificationSettings = JSON.parse(sessionStorage.getItem('notificationSettings')) || {};

    // Verificar si la URL de WhatsApp no está vacía
    if (notificationSettings.whatsapp && notificationSettings.whatsapp !== "") {
      setIsWhatsappVerified(true); // Si está configurado, marcar como activo
    }
  }, []);


  // Manejar la entrada del número de teléfono
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    // Aceptamos solo dígitos y limitamos a 10
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSendCode = async () => {
    // Verificar si el número tiene 10 dígitos
    if (phoneNumber.length !== 10) {
      setErrorMessage('El número de teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    setLoading(true); // Iniciar carga
    try {
      // Llamar al endpoint para enviar el código de verificación usando axiosInstance
      const response = await axiosInstance.post('/whatsapp/send', {
        phone: phoneNumber, // enviar los 10 digitos
      });

      // Si el código es enviado pasamos al paso 2 del modal
      if (response.status === 200) {
        setWhatsappStep(1);
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al enviar el código.');
    } finally {
      setLoading(false); // Detener carga
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true); // Iniciar carga
    try {
      // Verificar el código con el backend usando axiosInstance
      const response = await axiosInstance.post('/whatsapp/verify-code', {
        code: verificationCode, // Código que el usuario ingresó
      });

      if (response.status === 200) {
        setWhatsappStep(2); // Avanzar al paso completado
        setErrorMessage('');
        
        // Guardamos el estado de verificación en sessionStorage
        sessionStorage.setItem('whatsappVerified', 'true');

        // Marcamos como activo
        setIsWhatsappVerified(true);

        setTimeout(() => {
          // Recargar la página después de 3 segundos
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al verificar el código.');
    } finally {
      setLoading(false); // Detener carga
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
                <Input
                  placeholder="Ingresa los 10 dígitos de tu número"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength={10} // Solo permite ingresar 10 dígitos
                />
              </Form.Item>
              {errorMessage && <Alert message={errorMessage} type="error" />}
              <Button type="primary" onClick={handleSendCode} block disabled={loading}>
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
              <Button type="primary" onClick={handleVerifyCode} block disabled={loading}>
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
