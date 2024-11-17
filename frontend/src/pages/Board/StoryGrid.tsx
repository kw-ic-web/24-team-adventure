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
  // 스토리 목록 상태 관리
  const [stories, setStories] = useState<Story[]>([]); // 서버에서 가져온 스토리 목록 데이터를 저장
  const [posts, setPosts] = useState<Post[]>([]); // 서버에서 가져온 전체 게시물 목록 데이터를 저장
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null); // 현재 선택된 스토리 ID를 저장 (초기값은 null)

  /**
   * 스토리 데이터를 서버에서 가져오는 useEffect
   * 컴포넌트가 처음 렌더링될 때 실행된다.
   */
  useEffect(() => {
    const fetchStories = async () => {
      try {
        // GET 요청으로 스토리 데이터를 가져옴
        const response = await axios.get('http://localhost:3000/stories');
        setStories(response.data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching stories:', error); // 에러 발생 시 콘솔에 출력
      }
    };
    fetchStories(); // 스토리 데이터를 가져오는 함수 호출
  }, []); // 빈 배열로 두어 컴포넌트가 마운트될 때만 실행

  /**
   * 게시물 데이터를 서버에서 가져오는 useEffect
   * 컴포넌트가 처음 렌더링될 때 실행된다.
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // GET 요청으로 게시물 데이터를 가져옴
        const response = await axios.get('http://localhost:3000/posts');
        setPosts(response.data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching posts:', error); // 에러 발생 시 콘솔에 출력
      }
    };
    fetchPosts(); // 게시물 데이터를 가져오는 함수 호출
  }, []); // 빈 배열로 두어 컴포넌트가 마운트될 때만 실행

  /**
   * 특정 스토리를 선택했을 때 실행되는 함수
   * 선택된 스토리의 ID를 상태로 저장하여 게시물을 필터링한다.
   */
  const handleStorySelect = (storyId: number) => {
    setSelectedStoryId(storyId); // 선택된 스토리 ID를 업데이트
  };

  /**
   * 전체 게시물 보기 버튼을 클릭했을 때 실행되는 함수
   * 선택된 스토리를 해제하여 모든 게시물을 표시하게 한다.
   */
  const handleShowAllPosts = () => {
    setSelectedStoryId(null); // 선택된 스토리 ID를 null로 설정하여 필터링 해제
  };

  /**
   * 선택된 스토리 ID에 따라 게시물을 필터링
   * 선택된 스토리가 있으면 해당 스토리에 속한 게시물만 반환
   * 선택된 스토리가 없으면 모든 게시물을 반환
   */
  const filteredPosts = selectedStoryId
    ? posts.filter((post) => post.story_id === selectedStoryId)
    : posts;

  return (
    <div className="story-grid-container">
      {/* 페이지 제목 */}
      <h1 className="story-grid-title">Story Board</h1>

      {/* 스토리 목록을 출력하는 그리드 */}
      <div className="story-grid">
        {stories.map((story) => (
          <div
            key={story.story_id} // 각 스토리의 고유 ID를 key로 사용
            onClick={() => handleStorySelect(story.story_id)} // 클릭 시 해당 스토리를 선택
            className="story-card" // 카드 스타일 클래스
          >
            {/* 스토리 제목 */}
            <p className="story-title">{story.story_title}</p>
            {/* 스토리 커버 이미지 */}
            <img
              src={`http://localhost:3000/${story.cover_pic}`} // 서버에서 가져온 커버 이미지 경로
              className="story-image"
              alt={story.story_title} // 대체 텍스트
            />
          </div>
        ))}
      </div>

      {/* 게시물 리스트 제목 */}
      <h2 className="posts-title">Latest Posts</h2>

      {/* 전체 게시물 보기 버튼 */}
      {selectedStoryId && (
        <div className="show-all-button-container">
          <button onClick={handleShowAllPosts} className="show-all-button">
            전체 게시물 보기
          </button>
        </div>
      )}

      {/* 게시물 목록을 출력하는 리스트 */}
      <div className="posts-list">
        {filteredPosts.map((post) => (
          <Link
            key={post.geul_id} // 각 게시물의 고유 ID를 key로 사용
            to={`/board/${post.story_id}/post/${post.geul_id}`} // 클릭 시 게시물 상세 페이지로 이동
            className="post-link" // 게시물 링크 스타일 클래스
          >
            {/* 게시물 제목 */}
            <h3 className="post-title">{post.geul_title}</h3>
            {/* 게시물 내용 */}
            <p className="post-content">{post.geul_content}</p>
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
