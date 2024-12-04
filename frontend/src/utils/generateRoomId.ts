// frontend/src/utils/generateRoomId.ts
export const generateRoomId = (): string => {
  return 'room-' + Math.random().toString(36).substr(2, 9);
};
