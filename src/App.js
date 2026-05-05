import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from './context/AuthContext';
import { SideBarProvider } from './context/SidebarContext';
import { useEffect, useState } from 'react';
import FullPageLoader from './components/FullPageLoader';
import { ProfileImageProvider } from './context/ProfileImageContext';

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a short delay (e.g. for assets or auth checks)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: "782cee98-a208-4f55-9bb4-a98c06efadd6",
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
        autoRegister: true, // optional - automatically prompts user
      });

      OneSignal.getNotificationPermission((permission) => {
        console.log('Permission:', permission);
      });

      OneSignal.isPushNotificationsEnabled(function (enabled) {
        console.log("Push notifications enabled?", enabled);
      });
    });
  }, []);

  if (loading) return <FullPageLoader />;
  return (
    <AuthProvider >
      <SideBarProvider>
        <ProfileImageProvider>
          <RouterProvider router={router} />
        </ProfileImageProvider>
      </SideBarProvider>
    </AuthProvider >
  );
}

export default App;
