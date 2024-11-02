//로그인 안해도 볼 수 있는 route 처리
import { Navigate } from 'react-router';

export default function PublicRoute(children: any) {
  return children;
}
