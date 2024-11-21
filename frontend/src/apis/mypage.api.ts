import axiosInstance from './axiosInstance';

export const fetchGetGeulData = async (user_id: string) => {
  const { data } = await axiosInstance.get(`/api/geul/${user_id}`);
  return data.geul; // geul 데이터 반환
};

export const fetchGetUserInfo = async () => {
  const res = await axiosInstance.get('/api/users');

  return res.data;
};
