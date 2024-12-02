import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  const { data: userData, isLoading: userLoading } = useUserData();

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    loadRooms();
    checkAuth();

    newSocket.on('roomUpdated', (updatedRooms: Room[]) => {
      setRooms(updatedRooms);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const loadRooms = async () => {
    try {
      const res = await axios.get('/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load rooms', err);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
    } else {
      try {
        const res = await axios.get('/api/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(res.data.username);
      } catch (err) {
        alert('로그인이 필요합니다.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName) {
      try {
        await axios.post('/api/rooms', {
          title: roomName,
          maxParticipants: 3,
        });
        alert('방이 생성되었습니다.');
        setShowModal(false);
        setRoomName('');
      } catch (err) {
        console.error('Failed to create room', err);
        alert('방 생성에 실패했습니다.');
      }
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

  return (
    <div className="container">
      <h2 className="mt-4">환영합니다!</h2>
      <p>접속한 ID: {username}</p>
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
