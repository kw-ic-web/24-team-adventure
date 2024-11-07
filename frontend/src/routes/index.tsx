import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Start from '../pages/Start';
import GameStart from '../pages/Game/GameSelect';
import GamePlay from '../pages/Game/GamePlay';
import GameEnd from '../pages/Game/GameEnd';
import MyPage from '../pages/Mypage';
import VideoChat from '../pages/Video';
import VideoChatEndPage from '../pages/Video/videoChatEnd';
import StoryGrid from '../pages/Board/StoryGrid';
import BoardPage from '../pages/Board/BoardPage';
import PostDetail from '../pages/Board/PostDetail';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 페이지 경로 */}
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />

        {/* 개인 페이지 경로 */}
        <Route path="/mypage" element={<MyPage />} />

        {/* 화상 채팅 경로 */}
        <Route path="/video-chat" element={<VideoChat />} />
        <Route path="/video-end" element={<VideoChatEndPage />} />

        {/* 게임 관련 경로 */}
        <Route path="/games" element={<GameStart />} />
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path="/gameend" element={<GameEnd />} />

        {/* 게시판 경로 */}
        <Route path="/board" element={<StoryGrid />} />
        <Route path="/board/:story_id" element={<BoardPage />} />
        <Route path="/board/:story_id/post/:geul_id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
