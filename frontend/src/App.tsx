import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트 임포트
import Home from "./pages/Home";
import StoryGrid from "./pages/Board/StoryGrid";
import BoardPage from "./pages/Board/BoardPage";
import PostDetail from "./pages/Board/PostDetail";

// 컨텍스트 제공자 임포트
import { BoardProvider } from "./context/BoardContext";

const App: React.FC = () => {
  return (
    // 라우터 설정
    <Router>
      {/* BoardProvider로 모든 하위 컴포넌트에 보드 데이터 제공 */}
      <BoardProvider>
        <Routes>
          {/* 홈 페이지 경로 */}
          <Route path="/" element={<Home />} />

          {/* 스토리 선택 그리드 페이지 경로 */}
          <Route path="/board" element={<StoryGrid />} />

          {/* 특정 스토리에 속한 게시물 목록 페이지 경로 */}
          <Route path="/board/:story_id" element={<BoardPage />} />

          {/* 특정 게시물의 상세 페이지 경로 */}
          <Route path="/board/:story_id/post/:geul_id" element={<PostDetail />} />

          {/* 추가적인 라우트는 여기서 설정 */}
        </Routes>
      </BoardProvider>
    </Router>
  );
};

export default App;
