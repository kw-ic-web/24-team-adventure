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

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/room/:roomId" element={<RoomDetail />} />
        {/*video/end 변경 예정*/}
        <Route path="/games" element={<GameStart />} />
        {/* 게임 api가 만들어지면, 각 동화(게임)별로 URL이동 ex. /games/:gameId*/}
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path="/gameplay/:story_id" element={<GamePlay />} />
        {/*마찬가지로 /games/:gameId/result 변경 예정*/}
        <Route path="/testgpt" element={<Testgpt />} />
        <Route path="/gameend" element={<GameEnd />} />
        <Route path="/board" element={<StoryGrid />} />
        <Route path="/board/:story_id" element={<BoardPage />} />
        {/*post는 수정 예정*/}
        <Route path="/board/:story_id/post/:geul_id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
