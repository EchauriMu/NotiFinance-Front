import React, { useState } from 'react';
import {
  Layout, Typography, Button, Card, Row, Col, Statistic,
  Tag, Divider, Avatar, Input, Carousel, Form, notification, Drawer, Grid
} from 'antd';
import {
  ArrowUpOutlined, ArrowDownOutlined, BellOutlined, UserOutlined,
  LineChartOutlined, StarOutlined, DollarOutlined, RocketOutlined,
  SafetyOutlined, ThunderboltOutlined, MailOutlined, MenuOutlined
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';




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
      nombre: "Sergio Alberto",
      rol: "Inversor de Cripto",
      contenido: "NotiFinance ha revolucionado cómo monitoreo mis inversiones. Las alertas en tiempo real me han ayudado a tomar decisiones oportunas.",
      avatar: "https://avatars.githubusercontent.com/u/164229629?v=4"
    },
    {
      nombre: "Amir Orozco",
      rol: "Trader diario",
      contenido: "He probado muchos servicios de notificación de cripto, pero NotiFinance destaca por su precisión y opciones de personalización.",
      avatar: "https://avatars.githubusercontent.com/u/164288215"
    },
    {
      nombre: "Eduardo Echauri",
      rol: "Analista Financiero",
      contenido: "Las herramientas de análisis de mercado de NotiFinance me brindan información que no podría obtener en otro lugar.",
      avatar: "https://avatars.githubusercontent.com/u/163820326?u=4243f52d4bcd47ffdc7fcac5b3eb26da167b8232&v=4"
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
    padding: '20px',
    marginBottom: '30px'
  };

  const { useBreakpoint } = Grid;


  const [open, setOpen] = useState(false);
  const screens = useBreakpoint();


  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false); // cerrar el drawer en móvil
  };

  const menuButtons = (
    <>
      <Button type="link" style={{ color: 'white' }} onClick={() => handleNavigate('/subscription')}>Precios</Button>
      <Button type="link" style={{ color: 'white' }} onClick={() => handleNavigate('/about')}>Nosotros</Button>
      <Button type="primary" onClick={() => handleNavigate('/login')}>Iniciar Sesión</Button>
      <Button onClick={() => handleNavigate('/register')}>Registrarse</Button>
    </>
  );
  const navigate = useNavigate(); // ✅ DENTRO del componente


  return (


    <Layout className="notifinance-landing">


      {/* ------------------------------------ Sección: Header (Encabezado) ------------------------------------ */}
      <Header style={estiloHeader}>

        {/* ------------------------------------ Sección: Logo y Nombre de Marca ------------------------------------ */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 , fontWeight:700}}>
            <span style={{ color: 'white' }}>Noti</span>
            <span style={{ color: '#fa8c16' }}>Finance</span>
          </Title>
        </div>

        {/* ------------------------------------ Sección: Menú de Navegación Responsivo ------------------------------------ */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {screens.md ? (
            // 🌐 Vista de escritorio: mostrar los botones directamente
            <div style={{ display: 'flex', gap: '10px' }}>
              {menuButtons}
            </div>
          ) : (
            // 📱 Vista móvil: ícono de menú y Drawer lateral
            <>
              <MenuOutlined
                onClick={() => setOpen(true)}
                style={{ fontSize: '24px', color: 'white' }}
              />
              <Drawer
                title="Menú"
                placement="right"
                onClose={() => setOpen(false)}
                open={open}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {menuButtons}
                </div>
              </Drawer>
            </>
          )}
        </div>

      </Header>



      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        {/* Sección Hero */}
        <div style={estiloHero}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={3} style={{ color: 'white', marginBottom: '20px' }}>
              Mantente Adelante en el<br />Mercado Cripto
            </Title>
            <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: '10px' }}>
              Notificaciones en tiempo real y análisis de mercado
            </Paragraph>
            <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: '10px' }}>
              para ayudarte a tomar decisiones informadas,
            </Paragraph>
            <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: '30px' }}>
              Todo en una sola plataforma.
            </Paragraph>
            <div>
              <Button onClick={() => navigate('/register')} type="primary" size="large" style={{ marginRight: '15px', height: '40px', fontSize: '16px' }}>
                Comenzar Gratis
              </Button>
              <Button size="large" style={{ marginTop:10,height: '40px', fontSize: '16px' }}>
                Saber Más
              </Button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src="https://itt0resources.blob.core.windows.net/notifinance/1.png"
              alt="Vista previa del Panel NotiFinance"
              style={{
                maxWidth: '90%',
                maxHeight: '100%',
                borderRadius: '40px',
              }}
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
              <Card onClick={() => navigate('/list')}  bordered={false} style={{
                height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', background: 'linear-gradient(135deg, #001529 0%, #003366 100%)', cursor: 'pointer'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Button  type="primary" shape="circle" icon={<RocketOutlined />} size="large" style={{ marginBottom: '10px' }} />
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
        <Card style={{ marginBottom: '50px', background: 'linear-gradient(135deg, #001529 0%, #003366 100%)', }} bodyStyle={{ padding: '40px' }}>
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
              <Button onClick={() => navigate('/register')}  type="default" size="large" style={{ height: '50px', width: '200px', fontSize: '16px' }}>
                Comenzar Ahora
              </Button>
            </Col>
          </Row>
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
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Precios</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Sobre Nosotros</a></li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Recursos</Title>
            <ul style={{ listStyle: 'none', padding: 0, color: '#ccc' }}>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Guías</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Documentación API</a></li>
              <li style={{ marginBottom: '10px' }}><a style={{ color: '#ccc' }}>Preguntas Frecuentes</a></li>
            </ul>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Contacto</Title>
            <ul style={{ listStyle: 'none', padding: 0, color: '#ccc' }}>
              <li style={{ marginBottom: '10px' }}>notifinance.mx@gmail.com</li>
              <li style={{ marginBottom: '10px' }}>+52 311 162 5934</li>
              <li style={{ marginBottom: '10px' }}>Calle Cripto 777</li>
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