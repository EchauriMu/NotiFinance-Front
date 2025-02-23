import React from 'react';
import { Space, Typography, Avatar, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const styles = {
  userSection: {
    padding: '0px 15px 15px 15px',
    borderRadius: '8px',
    background: '#141414',
  },
};

const UserInfo = ({ userData, loading }) => {
  return (
    <div style={styles.userSection}>
      {loading ? (
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Skeleton.Avatar active size={64} shape="circle" />
          <Skeleton.Input style={{ width: 140, height: 15 }} active />
          <Skeleton.Input style={{ width: 220, height: 15 }} active />
        </Space>
      ) : (
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          {/* Avatar del usuario */}
          <Avatar
            size={84}
            src={
              userData?.username
                ? `https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(userData.username)}`
                : null
            }
            icon={!userData?.username && <UserOutlined />}
          />
          {/* Nombre y correo del usuario */}
          <Text style={{ color: 'white', fontSize: '16px' }}>
            {userData?.username || 'Nombre de Usuario'}
          </Text>
          <Text type="secondary">{userData?.email || 'Correo electrónico'}</Text>
        </Space>
      )}
    </div>
  );
};

export default UserInfo;
