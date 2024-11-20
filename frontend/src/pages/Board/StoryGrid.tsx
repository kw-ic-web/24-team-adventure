import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StoryGrid.css';

// 스토리 데이터 타입 정의
interface Story {
  story_id: number; // 스토리 ID
  story_title: string; // 스토리 제목
  cover_pic: string; // 스토리 커버 이미지 경로
}

// 게시물 데이터 타입 정의
interface Post {
  geul_id: number; // 게시물 ID
  story_id: number; // 게시물이 속한 스토리 ID
  geul_title: string; // 게시물 제목
  geul_content: string; // 게시물 내용
  uploaded_time: string; // 게시물 업로드 시간
  user: { name: string }; // 작성자 이름
}

const StoryGrid: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]); // 스토리 목록 상태
  const [posts, setPosts] = useState<Post[]>([]); // 게시물 목록 상태
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null); // 선택된 스토리 ID

  // 스토리 데이터를 가져오는 함수
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stories'); // 스토리 API 호출
        setStories(response.data); // 스토리 데이터 상태 업데이트
      } catch (error) {
        console.error('Error fetching stories:', error); // 에러 로그 출력
      }
    };
    fetchStories(); // 스토리 데이터 호출 실행
  }, []);

  // 게시물 데이터를 가져오는 함수
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts'); // 게시물 API 호출
        setPosts(response.data); // 게시물 데이터 상태 업데이트
      } catch (error) {
        console.error('Error fetching posts:', error); // 에러 로그 출력
      }
    };
    fetchPosts(); // 게시물 데이터 호출 실행
  }, []);

  // 특정 스토리를 선택했을 때 실행되는 함수
  const handleStorySelect = (storyId: number) => {
    setSelectedStoryId(storyId); // 선택된 스토리 ID 업데이트
  };

  // 모든 게시물 보기 버튼 클릭 시 실행되는 함수
  const handleShowAllPosts = () => {
    setSelectedStoryId(null); // 선택된 스토리를 초기화하여 모든 게시물을 표시
  };

  // 선택된 스토리에 따라 게시물을 필터링
  const filteredPosts = selectedStoryId
    ? posts.filter((post) => post.story_id === selectedStoryId)
    : posts;

  return (
    <div className="story-grid-container">
      {/* 스토리 제목 */}
      <h1 className="story-grid-title">Story Board</h1>

      {/* 스토리 목록 */}
      <div className="story-grid">
        {stories.map((story) => (
          <div
            key={story.story_id} // 스토리 ID를 key로 사용
            onClick={() => handleStorySelect(story.story_id)} // 클릭 시 스토리 선택
            className="story-card" // 스타일 클래스
          >
            {/* 스토리 이미지 */}
            <img
              src={`http://localhost:3000/${story.cover_pic}`} // 스토리 커버 이미지 경로
              alt={story.story_title}
              className="story-image"
            />
            {/* 스토리 제목 */}
            <p className="story-title">{story.story_title}</p>
          </div>
        ))}
      </div>

      {/* 게시물 목록 제목 */}
      <h2 className="posts-title">Latest Posts</h2>

      {/* 전체 게시물 보기 버튼 */}
      {selectedStoryId && (
        <div className="show-all-button-container">
          <button onClick={handleShowAllPosts} className="show-all-button">
            전체 게시물 보기
          </button>
        </div>
      )}

      {/* 게시물 목록 */}
      <div className="posts-list">
        {filteredPosts.map((post) => (
          <Link
            key={post.geul_id} // 게시물 ID를 key로 사용
            to={`/board/${post.story_id}/post/${post.geul_id}`} // 게시물 상세 페이지로 이동
            className="post-link"
          >
            {/* 게시물 제목 */}
            <h3 className="post-title">{post.geul_title}</h3>
            {/* 게시물 내용 */}
            <p className="post-content">
              {post.geul_content.substring(0, 100)}...
            </p>
            {/* 작성자 이름 */}
            <p className="post-author">작성자: {post.user.name}</p>
            {/* 게시물 업로드 시간 */}
            <p className="post-time">
              업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoryGrid;
