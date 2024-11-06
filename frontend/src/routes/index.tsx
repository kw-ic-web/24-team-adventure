import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GamePlay from '../pages/Game/GamePlay';
import GameEnd from '../pages/Game/GameEnd';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gameplay" element={<GamePlay />} />
        <Route path="/gameend" element={<GameEnd />} />
      </Routes>
    </BrowserRouter>
  );
}
