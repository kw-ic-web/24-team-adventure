import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GamePlay from '../pages/Game/GamePlay';


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game_play" element={<GamePlay />} />
      </Routes>
    </BrowserRouter>
  );
}
