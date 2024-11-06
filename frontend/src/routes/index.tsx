import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Start from '../pages/Start';
import GameStart from '../pages/Game/GameSelect'
import MyPage from '../pages/Mypage';
import VideoChat from '../pages/Video';
import VideoChatEndPage from '../pages/Video/videoChatEnd';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
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
