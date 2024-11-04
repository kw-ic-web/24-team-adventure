// frontend/src/routes/index.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import BoardList from '../pages/Board/BoardList';
import BoardDetail from '../pages/Board/BoardDetail';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<BoardList />} />
        <Route path="/board/:geul_ID" element={<BoardDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
