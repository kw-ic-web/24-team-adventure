import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { BoardContext } from "../../context/BoardContext";
import Loader from "../../components/Loader";
import HomeButton from "../../components/HomeButton";
import "./BoardPage.css"; // 보드 페이지 스타일링 CSS

// Post의 타입 정의
interface Post {
  geul_id: number;
  id: number;
  story_id: number;
  content: string;
  final_pic: string;
  title: string;
  uploaded_time: string;
  author: string;
}

const BoardPage: React.FC = () => {
  const { story_id } = useParams<{ story_id: string }>(); // URL에서 story_id 추출
  const { posts, loading, error } = useContext(BoardContext); // 컨텍스트에서 게시물 데이터 가져오기
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // 필터링된 게시물 상태

  useEffect(() => {
    if (story_id) {
      const parsedStoryId = parseInt(story_id);
      if (!isNaN(parsedStoryId)) {
        // story_id에 해당하는 게시물 필터링
        const filtered = posts.filter((post) => post.story_id === parsedStoryId);
        setFilteredPosts(filtered);
      } else {
        console.error("Invalid story_id:", story_id);
      }
    }
  }, [story_id, posts]);

  // 데이터 로딩 중일 때 로더 표시
  if (loading) {
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );
  }

  // 에러 발생 시 에러 메시지 및 다시 시도 버튼 표시
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()} // 페이지 새로고침
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="board-page-container">

      <div className="main-content">
        <h1>게시물 목록 (Story ID: {story_id})</h1>
        {filteredPosts.length > 0 ? (
          <div className="post-list">
            {filteredPosts.map((post) => (
              <Link to={`/board/${post.story_id}/post/${post.geul_id}`} key={post.geul_id} className="post-link">
                <div className="post-item">
                  <h3>{post.title}</h3>
                  <p>{post.content.substring(0, 100)}...</p>
                  <div className="post-meta">
                    <span>작성자: {post.author}</span>
                    <span>업로드 시간: {new Date(post.uploaded_time).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </div>

      <HomeButton />
    </div>
  );
};

export default BoardPage;
