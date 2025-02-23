import React from 'react';
import { Card, Form, Select, Input, Row, Col, Alert, Button } from 'antd';
import { MailOutlined, DiscordOutlined, WhatsAppOutlined } from '@ant-design/icons';

const { Option } = Select;

export const Watchlist = ({ form, cryptoOptions, selectedNotification, selectNotification, setSelectedCrypto }) => (
  <Card title="Configurar Alerta de Precio">
    <Alert
      message="Instrucciones"
      description="Seleccione una criptomoneda, ingrese un precio umbral y elija un solo medio de notificación."
      type="info"
      showIcon
      style={{ marginBottom: '16px' }}
    />
    <Form form={form} layout="vertical">
      <Form.Item name="crypto" label="Seleccionar Criptomoneda" rules={[{ required: true }]}>
        <Select
          placeholder="Selecciona una crypto"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          onChange={setSelectedCrypto}
        >
          {cryptoOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="threshold" label="Precio Umbral" rules={[{ required: true }]}>
        <Input prefix="$" placeholder="Ingresa el precio umbral" type="number" />
      </Form.Item>

      <Form.Item name="notifications" label="Medios de Notificación">
        <Row gutter={[16, 16]}>
          {[
            { type: 'email', label: 'Email', icon: <MailOutlined style={{ color: '#faad14', fontSize: '36px' }} /> },
            { type: 'discord', label: 'Discord', icon: <DiscordOutlined style={{ color: '#1890ff', fontSize: '36px' }} /> },
            { type: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppOutlined style={{ color: 'green', fontSize: '36px' }} /> },
          ].map(({ type, label, icon }) => (
            <Col span={8} key={type}>
              <Card
                hoverable
                onClick={() => selectNotification(type)}
                style={{
                  textAlign: 'center',
                  border: selectedNotification === type ? '5px solid green' : '1px solid #d9d9d9',
                }}
              >
                {icon}
                <p style={{ margin: 0 }}>{label}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Crear Alerta
        </Button>
      </Form.Item>
    </Form>
  </Card>
);
