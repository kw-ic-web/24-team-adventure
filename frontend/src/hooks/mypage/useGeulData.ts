import { useQuery } from '@tanstack/react-query';
import { fetchGetGeulData } from '../../apis/mypage.api';

export const useGeulData = (user_id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['geul', user_id],
    queryFn: () => fetchGetGeulData(user_id),
  });
  return { userGeul: data, isLoading, isError };
};
