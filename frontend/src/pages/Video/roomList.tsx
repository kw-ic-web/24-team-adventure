import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUserData } from '../../hooks/auth/useUserData';

interface Room {
  title: string;
  participants: number;
  maxParticipants: number;
}

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const { data: userData, isLoading: userLoading } = useUserData();

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('getRooms');

    newSocket.on('roomUpdated', (updatedRooms: Room[]) => {
      setRooms(updatedRooms);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName && socket) {
      socket.emit('createRoom', { title: roomName, maxParticipants: 3 });
      setShowModal(false);
      setRoomName('');
    } else {
      alert('방 제목을 입력해주세요!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('로그아웃되었습니다.');
    window.location.href = '/login';
  };

  const handleJoinRoom = (roomTitle: string) => {
    window.location.href = `/room?title=${encodeURIComponent(roomTitle)}`;
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="mt-4">환영합니다!</h2>
      <p>접속한 ID: {userData?.name}</p>
      <div className="mb-3">2021203020 이해린</div>
      <div className="mb-3">
        <Button onClick={() => setShowModal(true)} className="me-2">
          방 만들기
        </Button>
        <Button onClick={handleLogout} variant="secondary">
          로그아웃
        </Button>
      </div>
      <hr />
      <h3>전체 방 목록</h3>
      <ListGroup className="mb-3">
        {rooms.map((room, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{room.title}</strong>
              <br />
              <small>
                참여 인원: {room.participants} / {room.maxParticipants}
              </small>
            </div>
            <Button
              size="sm"
              disabled={room.participants >= room.maxParticipants}
              onClick={() => handleJoinRoom(room.title)}
            >
              {room.participants < room.maxParticipants ? '참여' : '참여 불가'}
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>방 만들기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateRoom}>
            <Form.Group className="mb-3">
              <Form.Label>방 제목</Form.Label>
              <Form.Control
                type="text"
                placeholder="방 제목을 입력하세요"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit">생성</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
