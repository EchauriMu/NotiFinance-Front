// src/pages/Intro.js
import React from "react";
import { Card, Typography, Row, Col, Button, Image, Space, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const Intro = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/howtocreate"); // Redirige a la página para crear alertas
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Bienvenida */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Card
        title={<Title level={3}>Bienvenido a NotiFinance</Title>}
        bordered={false}
        style={{ marginBottom: 24, textAlign: "center" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} // Comienza pequeño y opaco
          animate={{ opacity: 1, scale: 1 }} // Se anima a su tamaño original con opacidad total
          transition={{ duration: 1.2 }} // Duración de la animación
        >
          <Image
            src="https://itt0resources.blob.core.windows.net/notifinance/1.png"
            alt="NotiFinance"
            preview={false}
            style={{  width: 190, borderRadius:'50px',}}
          />
        </motion.div>
          <Title level={2} style={{ marginTop: 20 }}>
            Recibe alertas personalizadas en tiempo real sobre criptomonedas
          </Title>
          <Paragraph>
            <strong>NotiFinance</strong> es una plataforma de notificaciones personalizadas que te permite
            estar al tanto de los movimientos de las criptomonedas que más te interesan. 
            Configura alertas específicas y recibe actualizaciones instantáneas directamente en tu
            dispositivo, para que nunca pierdas una oportunidad en el mercado.
          </Paragraph>
          <Space size="large">
       
            <Button onClick={() => navigate("/howtocreate")}>¿Cómo crear alertas?</Button>
          </Space>
        </Card>
      </motion.div>

      {/* Sección de Características */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <Card title="Características Principales" bordered={false} style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col span={24} md={12} lg={6}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.8 }}
              >
                <Card bordered={false} style={{ textAlign: "center" }}>
                  <CheckCircleOutlined style={{ fontSize: "36px", color: "#52c41a" }} />
                  <Title level={4}>Alertas en Tiempo Real</Title>
                  <Text>
                    Recibe notificaciones instantáneas sobre variaciones de precios de criptomonedas,
                    permitiéndote reaccionar rápidamente ante cualquier cambio importante.
                  </Text>
                </Card>
              </motion.div>
            </Col>
            <Col span={24} md={12} lg={6}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card bordered={false} style={{ textAlign: "center" }}>
                  <InfoCircleOutlined style={{ fontSize: "36px", color: "#1890ff" }} />
                  <Title level={4}>Fácil Configuración</Title>
                  <Text>
                    Personaliza tus alertas según tus preferencias: establece valores objetivos, 
                    intervalos de tiempo y más, todo a través de una interfaz intuitiva.
                  </Text>
                </Card>
              </motion.div>
            </Col>
            <Col span={24} md={12} lg={6}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card bordered={false} style={{ textAlign: "center" }}>
                  <ClockCircleOutlined style={{ fontSize: "36px", color: "#faad14" }} />
                  <Title level={4}>Notificaciones Rápidas</Title>
                  <Text>
                    Las alertas se envían sin demoras, para que puedas tomar decisiones rápidas con
                    la información más actualizada posible.
                  </Text>
                </Card>
              </motion.div>
            </Col>
            <Col span={24} md={12} lg={6}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Card bordered={false} style={{ textAlign: "center" }}>
                  <Tag color="geekblue" style={{ fontSize: "36px" }}>+</Tag>
                  <Title level={4}>Integración Multiplataforma</Title>
                  <Text>
                    Accede a tus alertas desde cualquier dispositivo y plataforma, ya sea móvil, tablet o web.
                  </Text>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Sección de Beneficios */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
      >
        <Card title="Beneficios Clave de NotiFinance" bordered={false} style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col span={24} md={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card bordered={false} style={{ textAlign: "center" }}>
                  <Title level={4} style={{ color: "#1890ff" }}>Mejora Tu Toma de Decisiones</Title>
                  <Text>
                    Mantente informado al instante sobre las fluctuaciones del mercado para tomar decisiones
                    financieras más acertadas y maximizar tus oportunidades de inversión.
                  </Text>
                </Card>
              </motion.div>
            </Col>
            <Col span={24} md={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card bordered={false} style={{ textAlign: "center" }}>
                  <Title level={4} style={{ color: "#faad14" }}>Personalización Total</Title>
                  <Text>
                    Controla el tipo de notificación que deseas recibir, ajustando las alertas a tus necesidades
                    y hábitos de inversión.
                  </Text>
                </Card>
              </motion.div>
            </Col>
            <Col span={24} md={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card bordered={false} style={{ textAlign: "center" }}>
                  <Title level={4} style={{ color: "#52c41a" }}>Ahorra Tiempo y Esfuerzo</Title>
                  <Text>
                    Automatiza el seguimiento de tus criptomonedas sin tener que monitorear constantemente
                    los precios. Las alertas lo hacen por ti.
                  </Text>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Sección de Próximos Pasos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.8 }}
      >
        <Card title="¿Qué Sigue?" bordered={false} style={{ marginBottom: 24 }}>
          <Paragraph>
            Ya estás listo para comenzar a configurar tus alertas y aprovechar al máximo NotiFinance. Si eres nuevo,
            te recomendamos comenzar con nuestra guía para configurar tu primera alerta y explorar todas las
            funcionalidades de la plataforma.
          </Paragraph>
          <Button type="primary" onClick={handleGetStarted}>Configura tu primera alerta</Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default Intro;

