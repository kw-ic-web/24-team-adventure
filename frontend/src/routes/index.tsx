import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Start from '../pages/Start';
import GameStart from '../pages/Game/GameSelect'
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/GameSelect" element={<GameStart />} />
      </Routes>
    </BrowserRouter>
  );
}
