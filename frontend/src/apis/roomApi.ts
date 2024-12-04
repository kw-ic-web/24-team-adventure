import axiosInstance from './axiosInstance';
import { Room } from '../models/room.model';
import { generateRoomId } from '../utils/generateRoomId';

// 방 목록 조회
export const fetchRooms = async (): Promise<Room[]> => {
  const response = await axiosInstance.get('/api/rooms');
  return response.data.rooms;
};

// 방 생성
export const createRoom = async (
  roomId: string,
  roomName: string,
): Promise<Room> => {
  const response = await axiosInstance.post('/api/rooms', { roomId, roomName });
  return response.data.room;
};
