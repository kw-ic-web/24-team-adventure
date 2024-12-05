import { Room } from "../models/Room";
import { getUserById } from "./userService"; // 사용자 정보를 가져오는 함수 임포트

// 인메모리 방 저장소 (실제 프로젝트에서는 데이터베이스를 사용)
const rooms: Room[] = [];

/**
 * 유니크한 방 ID를 생성하는 함수
 * @returns {string} 유니크한 방 ID
 */
function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * 새로운 방을 생성하고 저장하는 함수
 * @param {string} roomName - 생성할 방의 이름
 * @param {string} userId - 방을 생성한 사용자의 ID
 * @returns {Promise<Room>} 생성된 방 객체
 */
export async function addRoom(roomName: string, userId: string): Promise<Room> {
  const newRoom: Room = {
    roomId: generateUniqueId(),
    roomName,
    createdBy: userId,
    users: [userId], // 방 생성자 자동 추가
    // 필요한 다른 속성들 추가 가능
  };

  rooms.push(newRoom);
  return newRoom;
}

/**
 * 모든 방 목록을 반환하는 함수
 * @returns {Promise<Room[]>} 모든 방의 배열
 */
export async function getRooms(): Promise<Room[]> {
  return rooms;
}

/**
 * 특정 방을 ID로 조회하는 함수
 * @param {string} roomId - 조회할 방의 ID
 * @returns {Promise<Room | undefined>} 찾은 방 객체 또는 undefined
 */
export async function getRoom(roomId: string): Promise<Room | undefined> {
  return rooms.find((room) => room.roomId === roomId);
}

/**
 * 특정 방을 삭제하는 함수
 * @param {string} roomId - 삭제할 방의 ID
 * @returns {Promise<void>}
 */
export async function removeRoom(roomId: string): Promise<void> {
  const index = rooms.findIndex((room) => room.roomId === roomId);
  if (index !== -1) {
    rooms.splice(index, 1);
  }
}

/**
 * 특정 방에 사용자를 추가하는 함수
 * @param {string} roomId - 사용자를 추가할 방의 ID
 * @param {string} userId - 추가할 사용자의 ID
 * @returns {Promise<Room>} 업데이트된 방 객체
 * @throws {Error} 방이 이미 최대 인원(2명)으로 가득 찼을 경우
 */
export async function addUserToRoom(
  roomId: string,
  userId: string
): Promise<Room> {
  const room = await getRoom(roomId);
  if (!room) {
    throw new Error("방이 존재하지 않습니다.");
  }

  if (room.users.length >= 2) {
    throw new Error("방이 이미 가득 찼습니다.");
  }

  if (!room.users.includes(userId)) {
    room.users.push(userId);
  }

  return room;
}

/**
 * 특정 방에서 사용자를 제거하는 함수
 * @param {string} roomId - 사용자를 제거할 방의 ID
 * @param {string} userId - 제거할 사용자의 ID
 * @returns {Promise<Room | undefined>} 업데이트된 방 객체 또는 undefined
 */
export async function removeUserFromRoom(
  roomId: string,
  userId: string
): Promise<Room | undefined> {
  const room = await getRoom(roomId);
  if (room) {
    room.users = room.users.filter((id) => id !== userId);
    return room;
  }
  return undefined;
}

/**
 * 특정 방에 있는 사용자 목록을 반환하는 함수
 * @param {string} roomId - 사용자 목록을 조회할 방의 ID
 * @returns {Promise<{ userId: string; userName: string }[]>} 사용자 정보 배열
 */
export async function getUsersInRoom(
  roomId: string
): Promise<{ userId: string; userName: string }[]> {
  const room = await getRoom(roomId);
  if (!room) {
    throw new Error("방이 존재하지 않습니다.");
  }

  const users = await Promise.all(
    room.users.map(async (userId) => {
      const user = await getUserById(userId);
      return { userId, userName: user ? user.name : "Unknown" };
    })
  );

  return users;
}

/**
 * 사용자가 모두 나간 방을 삭제하는 함수
 * @returns {Promise<void>}
 */
export async function removeEmptyRooms(): Promise<void> {
  for (let i = rooms.length - 1; i >= 0; i--) {
    if (rooms[i].users.length === 0) {
      rooms.splice(i, 1);
    }
  }
}
