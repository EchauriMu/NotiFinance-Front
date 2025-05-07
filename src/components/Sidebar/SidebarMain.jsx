import React, { useState, useEffect } from 'react';
import { Space } from 'antd';
import { fetchUserData, fetchSettings } from '../../functions/fetchUserData';
import UserInfo from './UserInfo';
import LastActivity from './LastActivity';
import TrackedCoins from './TrackedCoins';
import NotificationsStatus from './NotificationsStatus';
import SubscriptionInfo from './SubscriptionInfo';
import LogoutButton from './Logout';  
import SubscriptionWarning from '../Subscriptions/SubsWarning';
import SubscriptionExpiredNotice from '../Subscriptions/SubsExpired';

const styles = {
  sidebar: {
    backgroundColor: '#141414',
    padding: '15px',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: 1
  }
};

const SidebarMain = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    email: false,
    whatsapp: false,
    discord: false,
  });
  const [watchlist, setWatchlist] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await fetchUserData();
        setUserData(userDataResponse);

        const { notificationSettings, watchlist } = await fetchSettings();
        setNotificationSettings(notificationSettings);
        setWatchlist(watchlist);

        setDataReady(true);
      } catch (error) {
        console.error('❌ Error al obtener los datos:', error);
      } finally {
        setLoadingUserData(false);
        setLoadingSettings(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.sidebar}>
      <div style={styles.content}>
        <UserInfo userData={userData} loading={loadingUserData} />
        <LastActivity />
        <TrackedCoins watchlist={watchlist} loading={loadingSettings} />
        <NotificationsStatus loading={loadingSettings} notificationSettings={notificationSettings} />
        <SubscriptionInfo userData={userData} loading={loadingUserData} />
        <LogoutButton setIsAuthenticated={setIsAuthenticated} />

        {/* ✅ Solo renderiza estos si los datos ya están listos */}
        {dataReady && (
          <>
            <SubscriptionWarning />
            <SubscriptionExpiredNotice />
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarMain;
