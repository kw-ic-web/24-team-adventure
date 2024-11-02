import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from '../pages/Main';
import Home from '../pages/Home';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}
