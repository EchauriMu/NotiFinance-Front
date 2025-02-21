import React from 'react';
import { Space, Typography, Tag, Skeleton } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';

const { Text } = Typography;

const styles = {
  statsCard: {
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    background: '#141414',
  }
};

// Definir colores en el orden especificado
const tagColors = ["gold", "blue", "green", "purple"];

const TrackedCoins = ({ watchlist, loading }) => {

  return (
    <div style={styles.statsCard}>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space align="center">
          <ThunderboltOutlined style={{ color: '#faad14', fontSize: '20px' }} />
          <Text style={{ color: 'white' }}>Monedas en Seguimiento</Text>
        </Space>
        <Space wrap>
          {loading ? (
           
            <>
              <Skeleton.Button active size="small" shape="round" />
              <Skeleton.Button active size="small" shape="round" />
              <Skeleton.Button active size="small" shape="round" />
            </>
          ) : watchlist.length > 0 ? (
            watchlist.map((coin, index) => {
              const color = tagColors[index % tagColors.length];
               return <Tag key={index} color={color}>{coin.symbol}</Tag>;
            })
          ) : (
            <Text style={{ color: 'gray' }}>No hay monedas en seguimiento</Text>
          )}
        </Space>
      </Space>
    </div>
  );
};

// 🛠️ Default Props para evitar errores si no recibe datos
TrackedCoins.defaultProps = {
  watchlist: [],
  loading: false
};

export default TrackedCoins;
