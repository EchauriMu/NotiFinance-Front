import React, { useState, useEffect } from 'react';
import { Space } from 'antd';
import { fetchUserData, fetchSettings } from '../../functions/fetchUserData';
import UserInfo from './UserInfo';
import LastActivity from './LastActivity';
import TrackedCoins from './TrackedCoins';
import NotificationsStatus from './NotificationsStatus';
import SubscriptionInfo from './SubscriptionInfo';

const styles = {
  sidebar: {
    backgroundColor: '#141414',
    padding: '15px',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    height: '100%'
  },
};

const SidebarMain = () => {
  const [userData, setUserData] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: false,
    whatsapp: false,
    discord: false,
  });
  const [watchlist, setWatchlist] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const userDataResponse = await fetchUserData();
        setUserData(userDataResponse);

        // Obtener configuración y lista de seguimiento
        const { notificationSettings, watchlist } = await fetchSettings();
        setNotificationSettings(notificationSettings);
        setWatchlist(watchlist);
      } catch (error) {
        console.error('❌ Error al obtener los datos:', error);
      } finally {
       
        setTimeout(() => {
          setLoadingUserData(false);
          setLoadingSettings(false);
        }, 3000); 
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.sidebar}>
      <UserInfo userData={userData} loading={loadingUserData} />
      <LastActivity />
      <TrackedCoins watchlist={watchlist} loading={loadingSettings} /> {/* Cargando watchlist */}
      <NotificationsStatus loading={loadingSettings} notificationSettings={notificationSettings} />
      <SubscriptionInfo userData={userData} loading={loadingUserData} /> {/* Pasamos los datos del usuario aquí */}
    </div>
  );
};

export default SidebarMain;
