import { useQuery } from '@tanstack/react-query';
import { fetchGetGeulData } from '../../apis/mypage.api';

export const useUserGeulData = (user_id: string) => {
  console.log('useUserGeulData called with user_id:', user_id);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userGeulData', user_id],
    queryFn: () => fetchGetGeulData(user_id),
    enabled: !!user_id, // user_id가 있을 때만 실행
  });

  return { userGeul: data, isLoading, isError };
};
