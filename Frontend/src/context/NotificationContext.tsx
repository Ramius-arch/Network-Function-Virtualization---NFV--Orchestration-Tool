import React, { createContext, useState, useContext, useCallback } from 'react';

export type AlertType = 'error' | 'warning' | 'info' | 'success';

export interface AlertMessage {
  id: string;
  title: string;
  type: AlertType;
  cause: string;
  nextStep: string;
  link?: string;
  linkText?: string;
}

interface NotificationContextType {
  alerts: AlertMessage[];
  addAlert: (alert: Omit<AlertMessage, 'id'>) => void;
  removeAlert: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const addAlert = useCallback((alert: Omit<AlertMessage, 'id'>) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert: AlertMessage = { ...alert, id };
    
    // Add alert to active stack
    setAlerts((prev) => [...prev, newAlert]);

    // Auto dismiss after 12 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 12000);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
