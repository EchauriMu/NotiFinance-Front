import React, { useState } from 'react';
import { Card, Button, Typography, Progress, Row, Col } from 'antd';

const { Title } = Typography;

const pasos = [
    {
        title: 'Paso 1',
        description: (
            <>
                <b>Bienvenido a la guía interactiva de NotiFinance.</b>
                <br /><br />
                Aquí aprenderás paso a paso cómo aprovechar las funciones principales de la plataforma.
                <br /><br />
                Haz clic en <b>Siguiente</b> para comenzar el recorrido y aprender de manera visual.
            </>
        ),
        img: null, // No hay imagen para el paso 1
    },
    {
        title: 'Paso 2',
        description:
            'Al ingresar a tu cuenta verás un panel administrativo donde podrás consultar rápidamente tus alertas creadas. Si aún no tienes ninguna, no te preocupes, en el siguiente paso aprenderás cómo crear una.',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/2.jpg',
    },
    {
        title: 'Paso 3',
        description:
            'Ubica la barra de navegación superior y haz clic en la pestaña "NotiFinance" para acceder a la configuración de alertas.',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/3.jpg',
    },
    {
        title: 'Paso 4',
        description:
            'En esta sección podrás ver tus alertas configuradas y crear nuevas. Si aún no tienes ninguna, haz clic en el desplegable "Creación de Alerta" para comenzar.',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/4.jpg',
    },
    {
        title: 'Paso 5',
        description:
            'Se mostrará un formulario que debes completar con la información de tu alerta, comenzando por la selección del símbolo deseado.',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/5.jpg',
    },
    {
        title: 'Paso 6',
        description:
            'Al hacer clic, se desplegarán las múltiples opciones que ofrece nuestra plataforma para personalizar tu alerta.',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/6.jpg',
    },
    {
        title: 'Paso 7',
        description:
            'Continúa ingresando el precio y elige el medio de notificación: correo electrónico, WhatsApp o Discord, según tu preferencia y cuenta.',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/7.jpg',
    },
    {
        title: 'Paso 8',
        description:
            'Luego, haz clic en el botón "Crear Alerta" para generar tu alerta personalizada.',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/8.jpg',
    },
    {
        title: 'Paso 9',
        description:
            'Una vez creada la alerta, podrás ver todas tus alertas activas en el panel superior de la pestaña "NotiFinance". Por defecto estarán inactivas, pero puedes activarlas fácilmente presionando el botón "Activar".',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/9.jpg',
    },
    {
        title: 'Paso 10',
        description:
            '¡Listo! Ya puedes disfrutar de tus alertas personalizadas sin preocupaciones. Consulta el detalle de tus alertas en la sección NotiFinance o revisa un resumen rápido en el dashboard.',
        img: 'https://itt0resources.blob.core.windows.net/notifinance/NOTIFINANCE-ALERTAS ACTIVAS/10.jpg',
    },
];

const GuiaInteractiva = () => {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);

    const paso = pasos[current];

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 0,
            }}
        >
            <Row justify="center" align="middle" style={{ minHeight: '100vh', width: '100%', margin: 0 }}>
                <Col
                    xs={24}
                    sm={22}
                    md={18}
                    lg={16}
                    xl={16}
                    xxl={16}
                    style={{ padding: '48px 8px 0 8px', width: '100%' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12,
                        }}
                    >
                        <Title
                            level={2}
                            style={{
                                margin: 0,
                                fontWeight: 700,
                                letterSpacing: 1,
                            }}
                        >
                            <span style={{ color: 'white' }}>Noti</span>
                            <span style={{ color: '#ffa500' }}>Finance</span>
                        </Title>
                    </div>
                    <Card
                        className="tutorial-card"
                        style={{
                            borderRadius: 16,
                            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                            background: '#181818',
                            color: '#fff',
                            marginBottom: 32,
                            minHeight: 420,
                            
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    color: '#ffa500',
                                    textAlign: 'center',
                                    marginBottom: 18,
                                    fontWeight: 700,
                                }}
                            >
                                Guía Interactiva - Aprende a usar la plataforma
                            </h2>
                            <Progress
                                percent={Math.round(((current + 1) / pasos.length) * 100)}
                                showInfo={false}
                                strokeColor="#ffa500"
                                style={{ marginBottom: 18 }}
                            />
                            <Title level={4} style={{ color: '#ffa500', marginBottom: 8 }}>
                                {paso.title}
                            </Title>
                            <div style={{ marginBottom: 12, color: '#fff', fontSize: 16 }}>
                                {paso.description}
                            </div>
                            {paso.img && (
                                <div style={{ textAlign: 'center' }}>
                                    <img
                                        src={paso.img}
                                        alt={`Imagen del ${paso.title}`}
                                        style={{
                                            width: '100%',
                                            maxWidth: 1000, // Aumenta el ancho máximo
                                            maxHeight: 700, // Aumenta la altura máxima
                                            borderRadius: 10,
                                            boxShadow: '0 2px 12px rgba(255,165,0,0.10)',
                                            margin: '0 auto',
                                            background: '#232526',
                                            border: '1px solid #ffa50022',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div
                            className="tutorial-buttons"
                            style={{
                                marginTop: 32,
                                textAlign: 'center',
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={prev}
                                disabled={current === 0}
                                style={{
                                    marginRight: 16,
                                    background: '#ffa500',
                                    borderColor: '#ffa500',
                                    fontWeight: 600,
                                }}
                            >
                                Anterior
                            </Button>
                            <Button
                                type="primary"
                                onClick={next}
                                disabled={current === pasos.length - 1}
                                style={{
                                    background: '#ffa500',
                                    borderColor: '#ffa500',
                                    fontWeight: 600,
                                }}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default GuiaInteractiva;