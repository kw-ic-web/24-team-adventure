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

export default function Router() {
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
        {/* video/end 변경 예정 */}
        <Route path="/video-end" element={<VideoChatEndPage />} />

        {/* 게임 관련 경로 */}
        <Route path="/games" element={<GameStart />} />
        {/* 게임 API가 만들어지면, 각 동화(게임)별로 URL 이동 ex. /games/:gameId */}
        <Route path="/gameplay" element={<GamePlay />} />
        {/* 마찬가지로 /games/:gameId/result 변경 예정 */}
        <Route path="/gameend" element={<GameEnd />} />

        {/* 게시판 경로 */}
        <Route path="/board" element={<StoryGrid />} />
        <Route path="/board/:story_id" element={<BoardPage />} />
        {/* post는 수정 예정 */}
        <Route path="/board/:story_id/post/:geul_id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
