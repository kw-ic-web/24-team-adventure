import { useEffect } from 'react';
import { useUserStatus } from './UserStatusContext';

function IdleHandler() {
  const { setOnlineStatus } = useUserStatus();
  const IDLE_TIMEOUT = 5 * 60 * 1000; // 5분

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setOnlineStatus(false); // 유휴 상태로 전환
        console.log('User went idle.');
      }, IDLE_TIMEOUT);
    };

    window.onload = resetIdleTimer;
    window.onmousemove = resetIdleTimer;
    window.onkeydown = resetIdleTimer;

    return () => {
      clearTimeout(idleTimer);
      window.onload = null;
      window.onmousemove = null;
      window.onkeydown = null;
    };
  }, [setOnlineStatus]);

  return null;
}

export default IdleHandler;
