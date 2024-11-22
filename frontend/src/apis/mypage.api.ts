import axiosInstance from './axiosInstance';

export const fetchGetGeulData = async (user_id: string) => {
  console.log('Fetching geul data for user_id:', user_id);
  const { data } = await axiosInstance.get(`/api/geuls/${user_id}`);
  console.log('Fetched geul data:', data.geul);
  return data.geul; // geul 데이터 반환
};
