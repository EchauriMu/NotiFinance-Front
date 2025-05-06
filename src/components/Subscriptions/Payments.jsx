import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Card, Button, Divider, Space, Form, Input, Alert, notification, Spin, Switch } from 'antd';
import { ArrowLeftOutlined, CreditCardOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text, Paragraph } = Typography;

const Payments = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false); // Estado para el auto-cobro

  const plan = state?.plan;

  if (!plan) {
    return (
      <Alert
        message="No se ha seleccionado un plan"
        description="Por favor, regresa y selecciona un plan de suscripción antes de continuar con el pago."
        type="warning"
        showIcon
        action={
          <Button type="primary" onClick={() => navigate('/subscription')} icon={<ArrowLeftOutlined />} >
            Volver
          </Button>
        }
        style={{ margin: 60 }}
      />
    );
  }

  // Función para manejar el proceso de pago (simulación)
  const handlePayment = async (values) => {
    setLoading(true);
    setIsFormDisabled(true); // Deshabilita el formulario

    try {
      // Simulación del pago
      const paymentResponse = await simulatePayment(values);

      if (paymentResponse.success) {
        // Calcular la fecha de cobro (30 días desde hoy)
        const currentDate = new Date();
        const nextBillingDate = new Date(currentDate.setDate(currentDate.getDate() + 30));
        const formattedNextBillingDate = nextBillingDate.toISOString().split('T')[0]; // Formateo de fecha a YYYY-MM-DD

        // Simular actualización de suscripción
        const response = await updateSubscription(plan, values, autoRenew); // Pasamos autoRenew al backend

        // Guardar la información del pago en el localStorage
        localStorage.setItem('paymentInfo', JSON.stringify({
          planName: plan.name,
          paymentMethod: 'Tarjeta de Crédito', // Aquí puedes cambiar el método si es necesario
          planPrice: plan.price,
        }));

        // Redirigir a la página de agradecimiento
        navigate('/thank-you');

        // Notificación de éxito
        notification.success({
          message: `Pago procesado con éxito`,
          description: `Se ha realizado el pago para el plan ${plan.name} usando el método de pago ${'Tarjeta de Crédito'}.`,
          icon: <CreditCardOutlined style={{ color: '#108ee9' }} />,
        });
      } else {
        notification.error({
          message: 'Error al procesar el pago',
          description: paymentResponse.message,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error al procesar el pago',
        description: 'Hubo un problema al realizar el pago, por favor intente nuevamente.',
      });
    } finally {
      setLoading(false);
      setIsFormDisabled(false); // Habilita nuevamente el formulario
    }
  };

  // Simula el proceso de pago (puedes reemplazarlo con una API real)
  const simulatePayment = (values) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Pago realizado con éxito' }); // Simulación exitosa del pago
      }, 1000); // Simula un tiempo de espera
    });
  };

  // Actualizar la suscripción en el backend
  const updateSubscription = async (plan, values, autoRenew) => {
    try {
      const response = await axiosInstance.put('/subs/update', {
        plan: plan.name, // Solo el nombre del plan se pasa al backend
        last4: values.cardNumber.slice(-4), // Últimos 4 dígitos de la tarjeta
        cvv: values.cvv, // CVV ingresado
        FC: values.expirationDate, // Fecha de expiración de la tarjeta
        autoRenew: autoRenew, // Estado de auto-renovación
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al actualizar la suscripción');
      }
    } catch (error) {
      throw new Error('No se pudo actualizar la suscripción');
    }
  };

  return (
    <div style={{ padding: '40px 60px', maxWidth: 700, margin: '0 auto' }}>
      <Title>Resumen de tu plan</Title>
      <Paragraph>Estás a punto de contratar el siguiente plan:</Paragraph>

      <Card
        bordered
        style={{ borderTop: `8px solid ${plan.color}`, borderRadius: 16, marginBottom: 40 }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={3} style={{ color: plan.color }}>{plan.name}</Title>
          <Text strong style={{ fontSize: 20 }}>{plan.price}</Text>
          <Divider />
          <ul>
            {plan.features.map((f, i) => (
              <li key={i}><Text>{f}</Text></li>
            ))}
          </ul>
        </Space>
      </Card>

      <Title level={4}>Método de pago</Title>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <CreditCardOutlined style={{ fontSize: 24, color: '#108ee9', marginRight: 8 }} />
        <Text style={{ fontSize: 16 }}>Pago con Tarjeta de Crédito</Text>
      </div>

      <Spin spinning={loading} tip="Procesando pago..." size="large">
        <Form form={form} onFinish={handlePayment} layout="vertical">
          <Form.Item
            name="cardHolderName"
            label="Titular de la tarjeta"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del titular de la tarjeta' }]} >
            <Input placeholder="Nombre completo" disabled={isFormDisabled} />
          </Form.Item>

          <Form.Item
            name="cardNumber"
            label="Número de tarjeta"
            rules={[{ required: true, message: 'Por favor ingresa el número de la tarjeta' },
              { len: 16, message: 'El número de tarjeta debe tener 16 dígitos', pattern: /^[0-9]+$/ }]} >
            <Input placeholder="1234 5678 9012 3456" maxLength={16} disabled={isFormDisabled} />
          </Form.Item>

          <Form.Item
            name="expirationDate"
            label="Fecha de expiración"
            rules={[{ required: true, message: 'Por favor ingresa la fecha de expiración' }]} >
            <Input placeholder="MM/AA" disabled={isFormDisabled} />
          </Form.Item>

          <Form.Item
            name="cvv"
            label="CVV"
            rules={[{ required: true, message: 'Por favor ingresa el código CVV' }]} >
            <Input placeholder="123" maxLength={3} disabled={isFormDisabled} />
          </Form.Item>

          {/* Switch para Auto-renovación */}
          <Form.Item label="¿Activar auto-cobro?">
            <Switch
              checked={autoRenew}
              onChange={(checked) => setAutoRenew(checked)}
            />
            <Text style={{ marginLeft: 10 }}>
              {autoRenew ? 'Auto-cobro activado' : 'Auto-cobro desactivado'}
            </Text>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: plan.color, borderColor: plan.color }}
            block
            disabled={isFormDisabled}>
            Confirmar y proceder al pago
          </Button>
        </Form>
      </Spin>
    </div>
  );
};

export default Payments;
