import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Start from '../pages/Start';
import GameStart from '../pages/Game/GameSelect';
import GamePlay from '../pages/Game/GamePlay';
import GamePlay2 from '../pages/Game/GamePlay3';
import Testgpt from '../pages/Game/Testgpt';
import GameEnd from '../pages/Game/GameEnd';
import MyPage from '../pages/Mypage';
import VideoChat from '../pages/Video';
import VideoChatEndPage from '../pages/Video/videoChatEnd';
import StoryGrid from '../pages/Board/StoryGrid';
import BoardPage from '../pages/Board/BoardPage';
import PostDetail from '../pages/Board/PostDetail';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
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
        <Route path="/video-chat" element={<VideoChat />} />
        {/*video/end 변경 예정*/}
        <Route path="/video-end" element={<VideoChatEndPage />} />
        <Route path="/games" element={<GameStart />} />
        <Route path="/gameplay/:story_id" element={<GamePlay />} />
        {/* 게임 api가 만들어지면, 각 동화(게임)별로 URL이동 ex. /games/:gameId*/}
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path="/gameplay2" element={<GamePlay2 />} />
        {/*마찬가지로 /games/:gameId/result 변경 예정*/}
        <Route path="/testgpt" element={<Testgpt />} />
        <Route path="/gameend" element={<GameEnd />} />
        <Route path="/board" element={<StoryGrid />} />
        <Route path="/board/:story_id" element={<BoardPage />} />
        {/*post는 수정 예정*/}
        <Route path="/board/:story_id/post/:geul_id" element={<PostDetail />} />
        <Route path="/users" element={<UserList />} />
        {/* 사용자 실시간 상태 조회 */}
      </Routes>
    </BrowserRouter>
  );
}
