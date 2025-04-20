import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Card, Button, Divider, Space, Radio, Form, Input, Alert, Col, Row, notification, Checkbox, Spin } from 'antd';
import { ArrowLeftOutlined, CreditCardOutlined, PayCircleOutlined, BankOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';

const { Title, Text, Paragraph } = Typography;

const Payments = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('creditCard'); // Método de pago seleccionado
  const [form] = Form.useForm(); // Formulario de pago
  const [loading, setLoading] = useState(false); // Para el spinner de carga
  const [isFormDisabled, setIsFormDisabled] = useState(false); // Para deshabilitar el formulario

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
        // Enviar la solicitud de actualización de suscripción al backend
        const response = await updateSubscription(plan);

        if (paymentResponse.success) {
          // Almacenar la información de pago en el localStorage
          localStorage.setItem('paymentInfo', JSON.stringify({
            planName: plan.name,
            planPrice: plan.price,
            paymentMethod: paymentMethod === 'creditCard' ? 'Tarjeta de Crédito' : paymentMethod === 'paypal' ? 'PayPal' : 'Transferencia Bancaria',
          }));
        }
        // Si todo es correcto, mostramos una notificación de éxito
        notification.success({
          message: `Pago procesado con éxito`,
          description: `Se ha realizado el pago para el plan ${plan.name} usando el método de pago ${paymentMethod === 'creditCard' ? 'Tarjeta de Crédito' : paymentMethod === 'paypal' ? 'PayPal' : 'Transferencia Bancaria'}.`,
          icon: <CreditCardOutlined style={{ color: '#108ee9' }} />,
        });

        // Redirigir a la página de agradecimiento
        navigate('/thank-you');
      } else {
        // En caso de error en el pago
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
      }, 2000); // Simula un tiempo de espera
    });
  };

  // Actualizar la suscripción en el backend
  const updateSubscription = async (plan) => {
    try {
      const response = await axiosInstance.put('/subs/update', {
        plan: plan.name, // Solo el nombre del plan se pasa al backend
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
      <Radio.Group
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Radio value="creditCard">
              <CreditCardOutlined style={{ fontSize: 24, color: '#108ee9' }} />
              <Text>Tarjeta de Crédito/Débito</Text>
            </Radio>
          </Col>
          <Col span={8}>
            <Radio value="paypal">
              <PayCircleOutlined style={{ fontSize: 24, color: '#003366' }} />
              <Text>PayPal</Text>
            </Radio>
          </Col>
          <Col span={8}>
            <Radio value="bankTransfer">
              <BankOutlined style={{ fontSize: 24, color: '#2f54eb' }} />
              <Text>Transferencia Bancaria</Text>
            </Radio>
          </Col>
        </Row>
      </Radio.Group>

      <Spin spinning={loading} tip="Procesando pago..." size="large">
        <Form form={form} onFinish={handlePayment} layout="vertical">
          <Form.Item
            name="cardHolderName"
            label="Titular de la tarjeta"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del titular de la tarjeta' }]}
          >
            <Input placeholder="Nombre completo" disabled={isFormDisabled} />
          </Form.Item>

          <Form.Item
            name="cardNumber"
            label="Número de tarjeta"
            rules={[{ required: true, message: 'Por favor ingresa el número de la tarjeta' }, { len: 16, message: 'El número de tarjeta debe tener 16 dígitos', pattern: /^[0-9]+$/ }]}
          >
            <Input placeholder="1234 5678 9012 3456" maxLength={16} disabled={isFormDisabled} />
          </Form.Item>

          <Form.Item
            name="expirationDate"
            label="Fecha de expiración"
            rules={[{ required: true, message: 'Por favor ingresa la fecha de expiración' }]}
          >
            <Input placeholder="MM/AA" disabled={isFormDisabled} />
          </Form.Item>

          <Form.Item
            name="agreeTerms"
            valuePropName="checked"
            rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Debes aceptar los términos y condiciones') }]}
          >
            <Checkbox disabled={isFormDisabled}>Acepto los términos y condiciones</Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: plan.color, borderColor: plan.color }}
            block
            disabled={isFormDisabled}
          >
            Confirmar y proceder al pago
          </Button>
        </Form>
      </Spin>
    </div>
  );
};

export default Payments;
