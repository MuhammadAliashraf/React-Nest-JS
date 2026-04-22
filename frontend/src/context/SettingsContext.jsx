import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApi } from '../services/api';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    appName: 'Generic App',
    currency: '$',
    appEmail: '',
    supportPhone: '',
    heroImage: '',
    heroVideo: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await getApi('system/settings', {}, false, {}, false);
      if (res.success) {
        // res.data is expected to be a map { appName: '...', currency: '...', ... }
        setSettings((prev) => ({ 
          ...prev, 
          ...res.data 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch system settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
