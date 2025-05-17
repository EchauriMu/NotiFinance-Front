import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { fetchUserData, fetchSettings } from '../../functions/fetchUserData';
import UserInfo from './UserInfo';
import LastActivity from './LastActivity';
import TrackedCoins from './TrackedCoins';
import NotificationsStatus from './NotificationsStatus';
import SubscriptionInfo from './SubscriptionInfo';
import LogoutButton from './Logout';
import SubscriptionWarning from '../Subscriptions/SubsWarning';
import SubscriptionExpiredNotice from '../Subscriptions/SubsExpired';
import ExpiredSessionModal from '../../ExpiredSessionModal';
import { message } from 'antd'; // Importamos message para mostrar notificaciones

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
  const [socket, setSocket] = useState(null); // Estado para el socket
  const [isModalVisible, setModalVisible] = useState(false); // Estado para el modal

  useEffect(() => {
    // Crear la conexión con el WebSocket
    const newSocket = io('https://ntlogout.onrender.com'); // Asegúrate de usar la URL correcta
    setSocket(newSocket); // Establecer socket en el estado

    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const userDataResponse = await fetchUserData();
        setUserData(userDataResponse);

        // Emitir al WebSocket para suscribirse a los cambios del usuario
        newSocket.emit('subscrisibeUserChanges', userDataResponse.id);
        console.log('✅ Suscrito a cambios del usuario:', userDataResponse.id);

        // Obtener configuración de notificaciones y lista de seguimiento
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

    // Escuchar el evento 'userUpdated' del WebSocket
    newSocket.on('userUpdated', (data) => {
      console.log('⚠️ Cambio detectado, mostrando modal');
      setModalVisible(true); // Mostrar el modal cuando haya un cambio
    });

        // Escuchar el evento 'userUpdated' del WebSocket
    newSocket.on('userDeleted', (data) => {
      console.log('⚠️ Cambio detectado, mostrando modal');
      setModalVisible(true); // Mostrar el modal cuando haya un cambio
    });

    // Limpiar la conexión del WebSocket cuando el componente se desmonte
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div style={styles.sidebar}>
      <div style={styles.content}>
        <UserInfo userData={userData} loading={loadingUserData} />
        <LastActivity />
        <TrackedCoins watchlist={watchlist} loading={loadingSettings} />
        <NotificationsStatus loading={loadingSettings} notificationSettings={notificationSettings} />
        <SubscriptionInfo userData={userData} loading={loadingUserData} />
        <LogoutButton containerStyle={{ marginTop: '20px', padding: '15px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }} setIsAuthenticated={setIsAuthenticated} />

        {/* Solo renderiza estos si los datos ya están listos */}
        {dataReady && (
          <>
            <SubscriptionWarning />
            <SubscriptionExpiredNotice />
          </>
        )}
      </div>

      {/* Mostrar el modal cuando haya un cambio de usuario */}
      {isModalVisible && (
        <ExpiredSessionModal
          socket={socket}
          setIsAuthenticated={setIsAuthenticated}
          setModalVisible={setModalVisible}
        />
      )}
    </div>
  );
};

export default SidebarMain;
