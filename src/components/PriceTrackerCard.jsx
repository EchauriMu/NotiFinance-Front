
// Nuevo componente PriceTrackerCard
import { Card, Row, Col, Button } from 'antd';

const cardStyles = {
  border: '1px solid rgba(255,255,255,0.1)',
  marginBottom: '20px',
};

const PriceTrackerCard = () => {
  return (
    <Card style={cardStyles} title="Rastreo de precios">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Button type="primary" block>
            Iniciar
          </Button>
        </Col>
        <Col xs={24} sm={12}>
          <Button danger block>
            Detener
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PriceTrackerCard;
