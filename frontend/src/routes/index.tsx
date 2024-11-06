import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoryGrid from '../pages/Board/StoryGrid';
import BoardPage from '../pages/Board/BoardPage';
import PostDetail from '../pages/Board/PostDetail';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Start from '../pages/Start';
import GameStart from '../pages/Game/GameSelect';
import MyPage from '../pages/Mypage';
import VideoChat from '../pages/Video';
import VideoChatEndPage from '../pages/Video/videoChatEnd';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export default function Router() {
  return (
    <Router>
      <Routes>
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
    </Router>
  );
};

