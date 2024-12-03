import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchAllUserStatuses,
  updateUserStatus,
} from '../../utils/userStatusApi';

interface UserStatusContextType {
  statuses: any[];
  setOnlineStatus: (online: boolean) => Promise<void>;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(
  undefined,
);

export const UserStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [statuses, setStatuses] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await fetchAllUserStatuses();
        setStatuses(data);
      } catch (error) {
        console.error('Failed to fetch user statuses:', error);
      }
    };

    fetchStatuses();
  }, []);

  const setOnlineStatus = async (online: boolean) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found.');
      return;
    }

    try {
      await updateUserStatus(online, token);
      const data = await fetchAllUserStatuses();
      setStatuses(data);
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  return (
    <UserStatusContext.Provider value={{ statuses, setOnlineStatus }}>
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatus = () => {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error('useUserStatus must be used within a UserStatusProvider');
  }
  return context;
};
