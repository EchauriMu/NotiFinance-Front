import React, { useState } from 'react';
import { 
  Layout, Typography, Button, Card, Row, Col, Statistic, 
  Tag, Divider, Avatar, Input, Carousel, Form, notification
} from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, BellOutlined, UserOutlined,
  LineChartOutlined, StarOutlined, DollarOutlined, RocketOutlined,
  SafetyOutlined, ThunderboltOutlined, MailOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function PaginaInicioNotiFinance() {
  const [form] = Form.useForm();
  const [cargando, setCargando] = useState(false);

  const criptomonedas = [
    { nombre: 'Bitcoin', simbolo: 'BTC', precio: 65432.12, cambio: 3.5, icono: '₿' },
    { nombre: 'Ethereum', simbolo: 'ETH', precio: 3521.78, cambio: -1.2, icono: 'Ξ' },
    { nombre: 'Cardano', simbolo: 'ADA', precio: 0.65, cambio: 5.8, icono: '₳' },
    { nombre: 'Solana', simbolo: 'SOL', precio: 132.45, cambio: 7.2, icono: 'ӾL' },
    { nombre: 'Ripple', simbolo: 'XRP', precio: 0.52, cambio: -0.5, icono: '✕' },
  ];

  const caracteristicas = [
    { 
      titulo: 'Alertas en tiempo real', 
      descripcion: 'Recibe notificaciones instantáneas cuando las criptomonedas alcanzan tus umbrales',
      icono: <BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    },
    { 
      titulo: 'Análisis de mercado', 
      descripcion: 'Análisis avanzados y tendencias para guiar tus decisiones de inversión',
      icono: <LineChartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    },
    { 
      titulo: 'Listas personalizadas', 
      descripcion: 'Crea listas personalizadas de criptomonedas para monitorear de cerca',
      icono: <StarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    },
    { 
      titulo: 'Plataforma segura', 
      descripcion: 'Tus datos están protegidos con los más altos estándares de seguridad',
      icono: <SafetyOutlined style={{ fontSize: 24, color: '#1890ff' }} />
    }
  ];

  const testimonios = [
    {
      nombre: "Alex Rodríguez",
      rol: "Inversor de Cripto",
      contenido: "NotiFinance ha revolucionado cómo monitoreo mis inversiones. Las alertas en tiempo real me han ayudado a tomar decisiones oportunas.",
      avatar: "/api/placeholder/64/64"
    },
    {
      nombre: "Sara Gómez",
      rol: "Trader diario",
      contenido: "He probado muchos servicios de notificación de cripto, pero NotiFinance destaca por su precisión y opciones de personalización.",
      avatar: "/api/placeholder/64/64"
    },
    {
      nombre: "Miguel Chen",
      rol: "Analista Financiero",
      contenido: "Las herramientas de análisis de mercado de NotiFinance me brindan información que no podría obtener en otro lugar.",
      avatar: "/api/placeholder/64/64"
    }
  ];

  const handleSuscribirse = (valores) => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      notification.success({
        message: 'Suscripción Exitosa',
        description: `Gracias por suscribirte con ${valores.email}. ¡Recibirás actualizaciones sobre NotiFinance!`,
      });
      form.resetFields();
    }, 1500);
  };

  const estiloHeader = { 
    background: '#001529', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: '0 50px',
    position: 'fixed',
    zIndex: 1,
    width: '100%'
  };

  const estiloHero = { 
    height: '500px', 
    background: 'linear-gradient(135deg, #001529 0%, #003366 100%)',
    borderRadius: '0 0 10px 10px',
    display: 'flex',
    padding: '50px',
    marginBottom: '30px'
  };

  return (
    <Layout className="notifinance-landing">
      <Header style={estiloHeader}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DollarOutlined style={{ fontSize: '28px', color: '#1890ff', marginRight: '10px' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>NotiFinance</Title>
        </div>
        <div>
          <Button type="link" style={{ color: 'white', marginRight: '20px' }}>Características</Button>
          <Button type="link" style={{ color: 'white', marginRight: '20px' }}>Precios</Button>
          <Button type="link" style={{ color: 'white', marginRight: '20px' }}>Nosotros</Button>
          <Button type="primary" style={{ marginRight: '10px' }}>Iniciar Sesión</Button>
          <Button>Registrarse</Button>
        </div>
      </Header>
      
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        {/* Sección Hero */}
        <div style={estiloHero}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title style={{ color: 'white', fontSize: '48px', marginBottom: '20px' }}>
              Mantente Adelante en el<br />Mercado Cripto
            </Title>
            <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: '30px' }}>
              Notificaciones en tiempo real y análisis de mercado para ayudarte a tomar decisiones informadas
            </Paragraph>
            <div>
              <Button type="primary" size="large" style={{ marginRight: '15px', height: '50px', fontSize: '16px' }}>
                Comenzar Gratis
              </Button>
              <Button size="large" style={{ height: '50px', fontSize: '16px' }}>
                Saber Más
              </Button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src="/api/placeholder/500/400" 
              alt="Vista previa del Panel NotiFinance" 
              style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
            />
          </div>
        </div>
        
        {/* Sección Tendencias del Mercado */}
        <Card title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Tendencias del Mercado</Title>
            <Text>Actualizaciones en vivo del mercado cripto</Text>
          </div>
        } style={{ marginBottom: '30px' }}>
          <Row gutter={16}>
            {criptomonedas.map(cripto => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={cripto.simbolo}>
                <Card bordered={false} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <Avatar style={{ backgroundColor: '#1890ff', marginRight: '10px' }}>{cripto.icono}</Avatar>
                    <Text strong>{cripto.nombre}</Text>
                  </div>
                  <Statistic 
                    value={cripto.precio} 
                    precision={2} 
                    prefix="$" 
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <div style={{ marginTop: '10px' }}>
                    <Tag color={cripto.cambio > 0 ? 'green' : 'red'}>
                      {cripto.cambio > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {Math.abs(cripto.cambio)}%
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card bordered={false} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', background: '#f5f5f5', cursor: 'pointer' }}>
                <div style={{ textAlign: 'center' }}>
                  <Button type="primary" shape="circle" icon={<RocketOutlined />} size="large" style={{ marginBottom: '10px' }} />
                  <br />
                  <Text strong>Ver Todos los Mercados</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
        
        {/* Sección Características */}
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          ¿Por Qué Elegir NotiFinance?
        </Title>
        
        <Row gutter={[32, 32]} style={{ marginBottom: '50px' }}>
          {caracteristicas.map((caracteristica, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card bordered={false} style={{ height: '100%' }}
                bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ marginBottom: '20px' }}>{caracteristica.icono}</div>
                <Title level={4}>{caracteristica.titulo}</Title>
                <Paragraph>{caracteristica.descripcion}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Cómo Funciona */}
        <Card style={{ marginBottom: '50px', background: '#f7f7f7' }} bodyStyle={{ padding: '40px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
            Cómo Funciona
          </Title>
          
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Avatar shape="square" size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>1. Crea una Cuenta</Title>
                <Paragraph>Regístrate gratis y personaliza tu perfil para comenzar</Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Avatar shape="square" size={80} icon={<BellOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>2. Configura tus Notificaciones</Title>
                <Paragraph>Configura alertas basadas en tu estrategia de inversión e intereses</Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Avatar shape="square" size={80} icon={<ThunderboltOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>3. Recibe Alertas en Tiempo Real</Title>
                <Paragraph>Obtén notificaciones instantáneas cuando se cumplan tus condiciones</Paragraph>
              </div>
            </Col>
          </Row>
        </Card>
        
        {/* Testimonios */}
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          Lo que Dicen Nuestros Usuarios
        </Title>
        
        <Carousel autoplay style={{ marginBottom: '50px' }}>
          {testimonios.map((testimonio, index) => (
            <div key={index}>
              <Card bordered={false} style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <Avatar size={64} src={testimonio.avatar} />
                  <div style={{ marginLeft: '20px' }}>
                    <Title level={4} style={{ margin: 0 }}>{testimonio.nombre}</Title>
                    <Text type="secondary">{testimonio.rol}</Text>
                  </div>
                </div>
                <Paragraph style={{ fontSize: '16px', fontStyle: 'italic' }}>
                  "{testimonio.contenido}"
                </Paragraph>
              </Card>
            </div>
          ))}
        </Carousel>
        
        {/* Sección CTA */}
        <Card style={{ marginBottom: '50px', background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)', padding: '40px' }}>
          <Row gutter={48} align="middle">
            <Col xs={24} md={16}>
              <Title level={2} style={{ color: 'white', marginBottom: '20px' }}>
                ¿Listo para Transformar tu Estrategia de Inversión en Criptomonedas?
              </Title>
              <Paragraph style={{ color: 'white', fontSize: '16px' }}>
                Únete a miles de inversores que se mantienen por delante del mercado con NotiFinance
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="default" size="large" style={{ height: '50px', width: '200px', fontSize: '16px' }}>
                Comenzar Ahora
              </Button>
            </Col>
          </Row>
        </Card>
        
        {/* Boletín */}
        <Card style={{ marginBottom: '50px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Mantente Actualizado con Noticias Cripto
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: '30px' }}>
            Suscríbete a nuestro boletín para recibir análisis de mercado, consejos y ofertas exclusivas
          </Paragraph>
          <Form form={form} onFinish={handleSuscribirse} layout="inline" style={{ display: 'flex', justifyContent: 'center' }}>
            <Form.Item name="email" rules={[
              { required: true, message: '¡Por favor ingresa tu email!' },
              { type: 'email', message: '¡Por favor ingresa un email válido!' }
            ]} style={{ width: '300px' }}>
              <Input placeholder="Tu dirección de email" prefix={<MailOutlined />} size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={cargando}>
                Suscribirse
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      
      <Footer style={{ textAlign: 'center', background: '#001529', color: 'white', padding: '40px 50px' }}>
        <Row gutter={[48, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <DollarOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '10px' }} />
              <Title level={4} style={{ color: 'white', margin: 0 }}>NotiFinance</Title>
            </div>
            <Paragraph style={{ color: '#ccc' }}>
              Tu plataforma completa de notificaciones y análisis de mercado de criptomonedas.
            </Paragraph>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Enlaces Rápidos</Title>
            <ul style={{ listStyle: 'none', padding: 0, color: '#ccc' }}>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Inicio</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Características</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Precios</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Sobre Nosotros</a></li>
            </ul>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Recursos</Title>
            <ul style={{ listStyle: 'none', padding: 0, color: '#ccc' }}>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Blog</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Guías</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Documentación API</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Preguntas Frecuentes</a></li>
            </ul>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Contacto</Title>
            <ul style={{ listStyle: 'none', padding: 0, color: '#ccc' }}>
              <li style={{ marginBottom: '10px' }}>contacto@notifinance.com</li>
              <li style={{ marginBottom: '10px' }}>+34 123 456 789</li>
              <li style={{ marginBottom: '10px' }}>Calle Cripto 123, Ciudad Digital</li>
            </ul>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: '#333', margin: '30px 0' }} />
        
        <div>
          <Text style={{ color: '#ccc' }}>© 2025 NotiFinance. Todos los derechos reservados.</Text>
        </div>
      </Footer>
    </Layout>
  );
}