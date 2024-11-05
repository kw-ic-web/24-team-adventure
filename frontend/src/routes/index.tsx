import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import StoryGrid from '../pages/Board/StoryGrid';
import BoardListByStory from '../pages/Board/BoardListByStory';
import BoardDetail from '../pages/Board/BoardDetail';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<StoryGrid />} />
        <Route path="/board/:story_id" element={<BoardListByStory />} />
        <Route path="/post/:geul_id" element={<BoardDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
