import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Start from '../pages/Start';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
