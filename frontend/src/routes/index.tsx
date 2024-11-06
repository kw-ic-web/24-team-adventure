import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GamePlay from '../pages/Game/GamePlay';
//import GamePlayf from '../pages/Game/GamePlayFirst';
//import GameEnd from '../pages/Game/GameEnd';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game_play" element={<GamePlay />} />
        {/* <Route path="/game_playf" element={<GamePlayf />} />
        <Route path="/game_end" element={<GameEnd />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
