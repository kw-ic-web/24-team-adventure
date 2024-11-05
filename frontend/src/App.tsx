import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StoryGrid from "./pages/Board/StoryGrid";
import BoardListByStory from "./pages/Board/BoardListByStory";
import PostDetail from "./pages/Board/PostDetail"; // 새로운 컴포넌트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<StoryGrid />} />
        <Route path="/board/:id" element={<BoardListByStory />} />
        <Route path="/board/:storyId/post/:postId" element={<PostDetail />} /> {/* 게시물 세부 정보 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;
