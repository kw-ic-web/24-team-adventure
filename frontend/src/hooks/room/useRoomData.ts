import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../apis/axiosInstance';
import { Room } from '../../models/room.model';
import { showToast } from '../../components/Toast';
import { useUserData } from '../auth/useUserData'; // 사용자 정보 가져오는 커스텀 훅
import { useNavigate } from 'react-router-dom';

interface CreateRoomResponse {
  room: Room;
}

export function useRoomData() {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // 네비게이션 훅 추가

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUserData();

  // 방 목록 조회
  const {
    data: rooms,
    isLoading,
    isError,
  } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await axiosInstance.get('/rooms');
      return response.data.rooms;
    },
  });

  // 방 생성
  const mutation = useMutation({
    mutationFn: async (roomName: string) => {
      const response = await axiosInstance.post('/rooms', { roomName });
      return response.data.room; // 방 정보를 반환
    },
    onSuccess: (newRoom) => {
      queryClient.invalidateQueries(['rooms']);
      navigate(`/room/${newRoom.id}`); // 방 ID로 리다이렉트
      showToast('방이 성공적으로 생성되었습니다!', 'success');
    },
    onError: () => {
      showToast('방 생성에 실패했습니다.', 'error');
    },
  });

  const handleCreateRoom = (roomName: string) => {
    mutation.mutate(roomName);
  };

  return {
    rooms,
    isLoading,
    isError,
    handleCreateRoom,
  };
}
