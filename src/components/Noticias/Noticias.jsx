import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Skeleton, message, Pagination ,Typography} from 'antd';
import { fetchNews } from '../../functions/fetchLastNews'; // Asegúrate de que esta ruta sea correcta

const { Meta } = Card;

const NewsComponent = () => {
  const { Title, Text } = Typography;
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNews, setTotalNews] = useState(0);

  // Número de noticias por página
  const pageSize = 8;

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
        setTotalNews(data.length); // Establecemos el número total de noticias
      } catch (err) {
        setError('Error al cargar las noticias');
        message.error('Error al cargar las noticias');
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []); // Se ejecuta una sola vez cuando el componente se monta

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filtra las noticias para mostrar solo las de la página actual
  const paginatedNews = news.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div className="loading-container" style={{ padding: '0px 4px' }}>
              <Title style={{ margin:'10px 0px'}} level={3}>Noticias mas recientes...</Title>
  
      <Row gutter={[16, 16]}>
       
          {[...Array(pageSize)].map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card>
              <Skeleton loading={true} active>
              
              </Skeleton>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div style={{padding: '0px 4px'  }}>
        <Title style={{ margin:'10px 0px'}} level={3}>Noticias mas recientes...</Title>
      <Row gutter={[16, 16]}>
        {paginatedNews.map((item, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              cover={
                // Usar la imagen de la noticia si está disponible
                item.image_url ? (
                  <img alt="news" src={item.image_url} />
                ) : (
                  // Si no hay imagen, usar una imagen de placeholder
                  <img
                    alt="news"
                    src={`https://placehold.co/600x400?text=Sin portada`}
                  />
                )
              }
            >
              <Meta
                title={item.title || 'No title available'}
                description={
                  <div>
                    <p>{item.description || 'No description available'}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      Saber más...
                    </a>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Paginación */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalNews}
          onChange={handlePageChange}
          showSizeChanger={false} // No necesitamos cambiar el tamaño de la página
        />
      </div>
    </div>
  );
};

export default NewsComponent;
