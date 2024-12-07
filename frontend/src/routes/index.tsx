import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Start from '../pages/Start';
import GameStart from '../pages/Game/GameSelect';
import GamePlay from '../pages/Game/GamePlay';
import Testgpt from '../pages/Game/Testgpt';
import GameEnd from '../pages/Game/GameEnd';
import MyPage from '../pages/Mypage';
import StoryGrid from '../pages/Board/StoryGrid';
import BoardPage from '../pages/Board/BoardPage';
import PostDetail from '../pages/Board/PostDetail';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import RoomPage from '../pages/Room/RoomPage';
import RoomDetail from '../pages/Room/RoomDetail';
import IdleHandler from '../components/userStatus/IdleHandler';
import UserList from '../components/userStatus/UserList';

export default function Router() {
  return (
    <BrowserRouter>
      <IdleHandler />
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/games" element={<GameStart />} />
        {/* 게임 api가 만들어지면, 각 동화(게임)별로 URL이동 ex. /games/:gameId*/}
        <Route path="/gameplay/:story_id" element={<GamePlay />} />
        {/*마찬가지로 /games/:gameId/result 변경 예정*/}
        <Route path="/testgpt" element={<Testgpt />} />
        <Route path="/gameend" element={<GameEnd />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/room/:roomId" element={<RoomDetail />} />
        <Route path="/board" element={<StoryGrid />} />
        <Route path="/board/:story_id" element={<BoardPage />} />
        <Route path="/board/:story_id/post/:geul_id" element={<PostDetail />} />
        <Route path="/users" element={<UserList />} />
        {/* 사용자 실시간 상태 조회 */}
      </Routes>
    </BrowserRouter>
  );
}
