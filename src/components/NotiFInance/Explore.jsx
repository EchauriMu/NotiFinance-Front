import React from 'react';
import { Card, List, Spin, Alert, Typography } from 'antd';

const { Title, Text } = Typography;

export const Explore = ({ news, loading, error }) => (
  <Card title="Explorar" >
    {loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin size="large" />
      </div>
    ) : error ? (
      <Alert message={error} type="error" showIcon />
    ) : news.length > 0 ? (
      <List
      style={{  overflowY: 'auto', maxHeight: '400px'}}
        itemLayout="vertical"
        dataSource={news}
        renderItem={(item) => (
          <List.Item key={item.article_id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
            <List.Item.Meta
              avatar={
                item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                ) : null
              }
              title={
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {item.title}
                </a>
              }
              description={
                <div>
                  <Text type="secondary">{item.source_name}</Text>
                  <br />
                  <Text type="secondary">{new Date(item.pubDate).toLocaleString()}</Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    ) : (
    <Alert
        message="Sin símbolo selecionado"
  type="warning"
        showIcon
      />
    
    )}
  </Card>
);
