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
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path="/gameend" element={<GameEnd />} />
        <Route path="/board" element={<StoryGrid />} />
        <Route path="/board/:story_id" element={<BoardPage />} />
        <Route path="/board/:story_id/post/:geul_id" element={<PostDetail />} />
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/video" element={<VideoChat />} />
        <Route path="/videoEnd" element={<VideoChatEndPage />} />
        <Route path="/GameSelect" element={<GameStart />} />
      </Routes>
    </BrowserRouter>
  );
}
