// backend/models/Room.ts

export interface Room {
  roomId: string;
  roomName: string;
  createdBy: string;
  users: string[];
  // 필요한 다른 속성들 추가 가능
}
