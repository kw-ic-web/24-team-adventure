import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StoryGrid.css';

// 스토리 데이터 타입 정의
interface Story {
  story_id: number; // 스토리 ID
  story_title: string; // 스토리 제목
  cover_pic: string; // 스토리의 커버 이미지 경로
}

// 게시물 데이터 타입 정의
interface Post {
  geul_id: number; // 게시물 ID
  story_id: number; // 게시물이 속한 스토리 ID
  geul_title: string; // 게시물 제목
  geul_content: string; // 게시물 내용
  uploaded_time: string; // 게시물 업로드 시간
}

const StoryGrid: React.FC = () => {
  // 스토리 목록 상태
  const [stories, setStories] = useState<Story[]>([]);
  // 전체 게시물 목록 상태
  const [posts, setPosts] = useState<Post[]>([]);
  // 선택된 스토리 ID 상태 (선택한 스토리에 따라 게시물 필터링)
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  // 컴포넌트가 처음 렌더링될 때 실행되는 useEffect로, 스토리 데이터를 가져온다.
  useEffect(() => {
    const fetchStories = async () => {
      try {
        // 서버에서 스토리 목록 데이터를 가져온다.
        const response = await axios.get('http://localhost:3000/stories');
        // 가져온 데이터를 stories 상태에 저장한다.
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };
    fetchStories(); // 스토리 데이터를 가져오는 함수 호출
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행

  // 컴포넌트가 처음 렌더링될 때 실행되는 useEffect로, 게시물 데이터를 가져온다.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 서버에서 전체 게시물 목록 데이터를 가져온다.
        const response = await axios.get('http://localhost:3000/posts');
        // 가져온 데이터를 posts 상태에 저장한다.
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts(); // 게시물 데이터를 가져오는 함수 호출
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행

  // 특정 스토리를 선택했을 때 실행되는 함수로, 선택된 스토리 ID를 상태로 저장한다.
  const handleStorySelect = (storyId: number) => {
    setSelectedStoryId(storyId);
  };

  // "전체 게시물 보기" 버튼을 클릭했을 때 실행되는 함수로, 선택된 스토리를 해제하여 모든 게시물을 표시하게 한다.
  const handleShowAllPosts = () => {
    setSelectedStoryId(null);
  };

  // 선택된 스토리 ID에 따라 게시물을 필터링한다.
  const filteredPosts = selectedStoryId
    ? posts.filter((post) => post.story_id === selectedStoryId) // 선택된 스토리에 해당하는 게시물만 표시
    : posts; // 선택된 스토리가 없으면 모든 게시물을 표시

  return (
    <div className="story-grid-container">
      <h1 className="story-grid-title">Story Board</h1>

      {/* 스토리 목록을 그리드 형태로 출력 */}
      <div className="story-grid">
        {stories.map((story) => (
          <div
            key={story.story_id} // 각 스토리를 식별하기 위한 key
            onClick={() => handleStorySelect(story.story_id)} // 스토리를 선택했을 때 실행되는 함수
            className="story-card"
          >
            <p className="story-title">{story.story_title}</p>{' '}
            {/* 스토리 제목 */}
            <img
              src={`http://localhost:3000/${story.cover_pic}`} // 스토리 커버 이미지
              className="story-image"
              alt={story.story_title} // 이미지 대체 텍스트
            />
          </div>
        ))}
      </div>

      <h2 className="posts-title">Latest Posts</h2>

      {/* 전체 게시물 보기 버튼 (스토리가 선택된 경우에만 표시) */}
      {selectedStoryId && (
        <div className="show-all-button-container">
          <button onClick={handleShowAllPosts} className="show-all-button">
            전체 게시물 보기
          </button>
        </div>
      )}

      {/* 게시물 목록을 출력하는 영역 */}
      <div className="posts-list">
        {filteredPosts.map((post) => (
          <Link
            key={post.geul_id} // 각 게시물을 식별하기 위한 key
            to={`/board/${post.story_id}/post/${post.geul_id}`} // 각 게시물 상세 페이지 링크
            className="post-link"
          >
            <h3 className="post-title">{post.geul_title}</h3>{' '}
            {/* 게시물 제목 */}
            <p className="post-content">{post.geul_content}</p>{' '}
            {/* 게시물 내용 */}
            <p className="post-time">
              업로드 시간: {new Date(post.uploaded_time).toLocaleString()}{' '}
              {/* 게시물 업로드 시간 */}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoryGrid;
