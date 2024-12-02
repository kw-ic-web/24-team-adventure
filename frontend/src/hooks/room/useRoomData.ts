// frontend/src/hooks/room/useRoomData.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../apis/axiosInstance';
import { Room } from '../../models/room.model';
import { showToast } from '../../components/Toast';
import { useUserData } from '../auth/useUserData'; // 사용자 정보 가져오는 커스텀 훅

interface CreateRoomData {
  roomName: string;
}

interface CreateRoomResponse {
  room: Room;
}

export function useRoomData() {
  const queryClient = useQueryClient();
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
  const mutation = useMutation<CreateRoomResponse, Error, string>({
    mutationFn: async (roomName: string) => {
      if (!user || !user.id) {
        throw new Error('User is not authenticated');
      }
      const response = await axiosInstance.post('/rooms', { roomName });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rooms']);
      showToast('방이 성공적으로 생성되었습니다!', 'success');
    },
    onError: () => {
      showToast('방 생성에 실패했습니다.', 'error');
    },
  });

  const handleCreateRoom = (roomName: string) => {
    if (isUserLoading) {
      showToast('사용자 정보를 불러오는 중입니다.', 'info');
      return;
    }

    if (isUserError || !user) {
      showToast('사용자 정보가 필요합니다.', 'error');
      return;
    }

    mutation.mutate(roomName);
  };

  return {
    rooms,
    isLoading,
    isError,
    handleCreateRoom,
  };
}
