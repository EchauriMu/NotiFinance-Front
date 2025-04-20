// src/components/Resources.js
import React from "react";
import { Row, Col, Typography, Card } from "antd";

const { Title, Link, Text } = Typography;

const Resources = () => {
  return (
    <Card style={{ marginTop: 24 }}>
      <Title level={4}>Recursos para usuarios</Title>
      <Row gutter={[24, 24]}>
        {/* Columna Izquierda */}
        <Col xs={24} sm={8} md={6}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="#">Introducción a NotiFinance</Link>
            <Link href="#">Cómo crear tu primera alerta</Link>
            <Link href="#">Guía de planes y beneficios</Link>
            <Link href="#">Documentación de API GraphQL</Link>
            <Link href="#">Conexión WebSocket (beta)</Link>
          </div>
        </Col>

        {/* Columna Derecha */}
        <Col xs={24} sm={16} md={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                title="Área de prueba GraphQL"
                extra={<Link href="#">Probar</Link>}
                bordered={false}
              >
                <Text>Consulta precios de criptos y convierte monedas desde aquí.</Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="Soporte y feedback"
                extra={<Link href="#">Ir</Link>}
                bordered={false}
              >
                <Text>¿Dudas o sugerencias? Escríbenos y recibe ayuda inmediata.</Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="Simulador de alertas"
                extra={<Link href="#">Probar</Link>}
                bordered={false}
              >
                <Text>Simula notificaciones según tu plan para visualizar su comportamiento.</Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="Complementos"
                extra={<Link href="#">Ver</Link>}
                bordered={false}
              >
                <Text>Extensiones y herramientas para integrar NotiFinance en otras plataformas.</Text>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Resources;
