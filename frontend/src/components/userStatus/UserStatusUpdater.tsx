import React, { useEffect } from 'react';
import { fetchAllUserStatuses } from '../../utils/userStatusApi';

interface User {
  id: number;
  name: string;
  online: boolean;
}

interface UserStatusUpdaterProps {
  onUpdate: (users: User[]) => void;
}

export default function UserStatusUpdater({
  onUpdate,
}: UserStatusUpdaterProps) {
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await fetchAllUserStatuses();
        onUpdate(data);
      } catch (error) {
        console.error('Failed to fetch user statuses:', error);
      }
    };

    fetchStatuses();
    const interval = setInterval(fetchStatuses, 5000); // 5초마다 갱신

    return () => clearInterval(interval);
  }, [onUpdate]);

  return null;
}
