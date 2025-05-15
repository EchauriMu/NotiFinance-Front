import React, { useState, useEffect } from 'react';
import {
  Card, Button, Modal, Form, Input, Alert, Steps, Spin, Badge, notification
} from 'antd';
import {
  WhatsAppOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
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
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isReloadModalVisible, setReloadModalVisible] = useState(false);

  useEffect(() => {
    const notificationSettings = JSON.parse(sessionStorage.getItem('notificationSettings')) || {};
    const whatsappUrl = notificationSettings.whatsapp;

    if (whatsappUrl && whatsappUrl.includes('alert/')) {
      const phoneNumberFromUrl = whatsappUrl.split('alert/')[1];
      setWhatsappPhoneNumber(phoneNumberFromUrl);
      setIsWhatsappVerified(true);
    }
  }, []);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
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

        notification.success({
          message: 'WhatsApp Verificado',
          description: 'Tu número ha sido verificado correctamente.',
          placement: 'bottomRight',
        });

        // Mostrar modal de recarga
        setReloadModalVisible(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotificationSetting = async () => {
    try {
      const response = await axiosInstance.delete('/user/deleted/notisetting', {
        data: { type: 'whatsapp' }
      });

      if (response.status === 200) {
        setIsWhatsappVerified(false);
        setWhatsappPhoneNumber('');

        notification.success({
          message: 'Configuración de WhatsApp eliminada',
          description: 'La configuración y las alertas de WhatsApp han sido eliminadas correctamente.',
          placement: 'bottomRight',
        });

        // Mostrar modal de recarga obligatoria
        setReloadModalVisible(true);
      }
    } catch (error) {
      notification.error({
        message: 'Error al eliminar configuración de WhatsApp',
        description: error.response?.data?.message || 'Ocurrió un error al intentar eliminar la configuración.',
        placement: 'bottomRight',
      });
    }
  };

  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
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
          <div>
            <WhatsAppOutlined style={{ fontSize: '24px', color: 'green' }} />
            <strong style={{ marginLeft: '8px' }}>WhatsApp</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              count={isWhatsappVerified ? 'Activo' : 'Sin registrar'}
              style={{ backgroundColor: isWhatsappVerified ? '#52c41a' : '#f5222d' }}
            />
            {!isWhatsappVerified && (
              <ExclamationCircleOutlined style={{ fontSize: '20px', color: '#f5222d', marginLeft: '8px' }} />
            )}
            {isWhatsappVerified && (
              <DeleteOutlined
                style={{ fontSize: '20px', color: '#f5222d', marginLeft: '8px', cursor: 'pointer' }}
                onClick={showDeleteModal}
              />
            )}
          </div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 'bold' }}>{whatsappPhoneNumber}</div>

        {!isWhatsappVerified && (
          <Button type="primary" onClick={() => setModalOpen(true)} block style={{ marginTop: '8px' }}>
            Configurar WhatsApp
          </Button>
        )}
      </Card>

      <Modal
        title="Confirmar eliminación"
        visible={isDeleteModalVisible}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
        okText="Eliminar"
        cancelText="Cancelar"
      >
        <p>
          Al eliminar esta configuración, tus alertas de WhatsApp se eliminarán permanentemente. ¿Estás seguro de que
          deseas continuar?
        </p>
      </Modal>

      <Modal
        title="Recargar página"
        visible={isReloadModalVisible}
        onOk={handleForceReload}
        cancelButtonProps={{ style: { display: 'none' } }} // Ocultar botón "Cancelar"
        closable={false} // No se puede cerrar con la X
        maskClosable={false} // No se puede cerrar haciendo clic afuera
        okText="Recargar ahora"
      >
        <p>La operación se completó correctamente. La página debe recargarse para aplicar los cambios.</p>
      </Modal>

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
              <Button
                type="primary"
                onClick={handleSendCode}
                block
                disabled={loading || phoneNumber.length !== 10}
              >
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
              <Button
                type="primary"
                onClick={handleVerifyCode}
                block
                disabled={loading || !/^\d{6}$/.test(verificationCode)}
              >
                {loading ? <Spin /> : 'Confirmar Código'}
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
        </Form>
      </Modal>
    </>
  );
};

export default WhatsAppConfig;
