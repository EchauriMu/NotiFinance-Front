import React from "react";
import { Row, Col, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const { Title, Link, Text } = Typography;

const Resources = () => {
  const navigate = useNavigate(); // Inicializa navigate

  const handleLinkClick = (path) => {
    navigate(path); // Redirige a la ruta correspondiente
  };

  return (
    <Card title='Recursos y Ayuda' style={{ marginTop: 24 }}>

      <Row gutter={[24, 24]}>
        {/* Columna Izquierda */}
        <Col xs={24} sm={8} md={6}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <Title level={5}>Recursos para usuarios</Title>
            <Link onClick={() => handleLinkClick("/intro")}>Introducción a NotiFinance</Link>
            <Link onClick={() => handleLinkClick("/guia")}>Cómo crear tu primera alerta</Link>
            <Link onClick={() => handleLinkClick("/subscription")}>Guía de planes y beneficios</Link>
            <Link onClick={() => handleLinkClick("/list")}>Monedas disponibles</Link>
          </div>
        </Col>

        {/* Columna Derecha - */}
        <Col xs={24} sm={16} md={18}>
          <Row gutter={[16, 16]}>
            {/* Nuevos Cards para las nuevas páginas */}
            <Col xs={24} md={12}>
              <Card
                title="Términos y Condiciones"
                extra={<Link onClick={() => handleLinkClick("/terminos")}>Ver</Link>}
                bordered={false}
              >
                <Text>Lee los términos y condiciones de uso de NotiFinance.</Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="Ayuda y Preguntas Frecuentes"
                extra={<Link onClick={() => handleLinkClick("/ayuda")}>Ver</Link>}
                bordered={false}
              >
                <Text>Consulta las preguntas frecuentes o contáctanos si necesitas ayuda personalizada.</Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="Soporte por Gmail"
                extra={
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=notifinance.mx@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir Gmail
                  </a>
                }
                bordered={false}
              >
                <Text>Haz clic en “Abrir Gmail” para escribirnos desde tu cuenta de Google.</Text>
              </Card>

            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default Resources;
