import React from 'react';
import { Layout, Typography, Row, Col, Card, Image, Divider, Tag, Avatar } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const AboutPage = () => {
  return (
    <Layout style={{ background: '#141414' }}>
      <Content style={{ padding: '20px 10px' }}>
        <Row justify="center" gutter={[30, 20]}>
          <Col xs={24} md={10}>
            <Image
              width="100%"
              src="https://itt0resources.blob.core.windows.net/notifinance/1.png"
              alt="Crypto illustration"
              preview={false}
              style={{ borderRadius: '36px',}}
            />
          </Col>
          <Col xs={24} md={14}>
            <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Typography>
       
                       <Title level={2} style={{ marginBottom: 20 , fontWeight:700}}>
            <span style={{ color: 'white' }}>Sobre Noti</span>
            <span style={{ color: '#ffa500' }}>Finance</span>
          </Title>
                <Paragraph>
                  <strong>NotiFinance</strong> es una plataforma inteligente de monitoreo financiero que permite a los
                  usuarios recibir alertas en tiempo real sobre cambios en criptomonedas, tendencias de mercado y señales
                  técnicas clave. A través de un diseño centrado en el usuario y tecnologías modernas, el sistema busca
                  facilitar decisiones informadas de inversión.
                </Paragraph>
                <Paragraph>
                  Este proyecto forma parte de la materia <Text strong>Gestión de Proyectos de Software</Text>, aplicando
                  principios de calidad, seguridad y usabilidad, mediante la metodología ágil <Text code>Scrum</Text>.
                </Paragraph>

         

                <Divider />

                <Title level={4}>Docente Responsable</Title>
                <Paragraph>
                  <Tag color="volcano" style={{ fontSize: '16px', padding: '5px 12px' }}>
                    Mariza Ramírez Llamas
                  </Tag>
                  <br />
                  Profesora del Departamento de Sistemas y Computación, especializada en dirección de proyectos de software y calidad en ingeniería.
                </Paragraph>

                <Divider />

                <Title level={4}>Equipo de Desarrollo</Title>
                <Row gutter={[16, 16]}>
                  {[
                    {
                      name: 'Echauri Muñoz Eduardo',
                      img: 'https://avatars.githubusercontent.com/u/163820326?u=4243f52d4bcd47ffdc7fcac5b3eb26da167b8232&v=4',
                    },
                    {
                      name: 'Orozco Estarron Amir',
                      img: 'https://avatars.githubusercontent.com/u/164288215',
                    },
                    {
                      name: 'Pardo Perez Sergio Alberto',
                      img: 'https://avatars.githubusercontent.com/u/164229629?v=4',
                    },
                  ].map((student) => (
                    <Col xs={24} sm={12} md={8} key={student.name}>
                      <Card hoverable style={{ textAlign: 'center' }}>
                        <Avatar size={100} src={student.img} alt={student.name} />
                        <Paragraph style={{ marginTop: 12, fontWeight: 'bold' }}>{student.name}</Paragraph>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Divider />

              </Typography>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AboutPage;
