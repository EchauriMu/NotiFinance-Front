import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Card, Button, Divider, Space, Radio, Form, Input, Alert, Col, Row, notification, Checkbox } from 'antd';
import { ArrowLeftOutlined, CreditCardOutlined, PayCircleOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Payments = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('creditCard'); // Método de pago seleccionado
  const [form] = Form.useForm(); // Formulario de pago

  const plan = state?.plan;

  if (!plan) {
    return (
      <Alert
        message="No se ha seleccionado un plan"
        description="Por favor, regresa y selecciona un plan de suscripción antes de continuar con el pago."
        type="warning"
        showIcon
        action={
          <Button type="primary" onClick={() => navigate('/subscription')} icon={<ArrowLeftOutlined />}>
            Volver
          </Button>
        }
        style={{ margin: 60 }}
      />
    );
  }

  // Función para manejar el proceso de pago (simulación)
  const handlePayment = async (values) => {
    // Aquí se simula la lógica del pago
    // Si todo es correcto, mostramos una notificación de éxito
    notification.success({
      message: `Pago procesado con éxito`,
      description: `Se ha realizado el pago para el plan ${plan.name} usando el método de pago ${paymentMethod === 'creditCard' ? 'Tarjeta de Crédito' : paymentMethod === 'paypal' ? 'PayPal' : 'Transferencia Bancaria'}.`,
      icon: <CreditCardOutlined style={{ color: '#108ee9' }} />,
    });
    
    // Si necesitas redirigir después de realizar el pago
    // navigate('/thank-you');
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

      <Form form={form} onFinish={handlePayment} layout="vertical">
        <Form.Item 
          name="cardHolderName" 
          label="Titular de la tarjeta" 
          rules={[{ required: true, message: 'Por favor ingresa el nombre del titular de la tarjeta' }]}
        >
          <Input placeholder="Nombre completo" />
        </Form.Item>

        <Form.Item 
          name="cardNumber" 
          label="Número de tarjeta" 
          rules={[
            { required: true, message: 'Por favor ingresa el número de la tarjeta' },
            { len: 16, message: 'El número de tarjeta debe tener 16 dígitos', pattern: /^[0-9]+$/ }
          ]}
        >
          <Input placeholder="1234 5678 9012 3456" maxLength={16} />
        </Form.Item>

        <Form.Item 
          name="expirationDate" 
          label="Fecha de expiración" 
          rules={[{ required: true, message: 'Por favor ingresa la fecha de expiración' }]}
        >
          <Input placeholder="MM/AA" />
        </Form.Item>

        <Form.Item 
          name="agreeTerms"
          valuePropName="checked"
          rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Debes aceptar los términos y condiciones') }]}
        >
          <Checkbox>Acepto los términos y condiciones</Checkbox>
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          style={{ backgroundColor: plan.color, borderColor: plan.color }}
          block
        >
          Confirmar y proceder al pago
        </Button>
      </Form>
    </div>
  );
};

export default Payments;
