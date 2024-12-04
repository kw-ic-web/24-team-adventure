//로그인 안해도 볼 수 있는 route 처리
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  return !isAuthenticated ? children : <Navigate to="/board" />;
};

export default PublicRoute;
