import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './StoryGrid.css';
import Background from '../../components/ui/Background';
import SmallBox from '../../components/ui/SmallBox';
import Profile from '../../components/ui/Profile';
import UserList from '../../components/ui/Userlist';
import HomeBtn from '../../components/ui/HomeBtn';
import HeaderLogo from '../../components/ui/HeaderLogo';

// 사용자 정보 인터페이스 (임시)
interface User {
  id: number;
  name: string;
  online: boolean;
}
const users: User[] = [
  { id: 1, name: 'user1', online: true },
  { id: 2, name: 'user2', online: false },
];

// 스토리 데이터 타입 정의
interface Story {
  story_id: number;
  story_title: string;
  cover_pic: string;
}

// 게시물 데이터 타입 정의
interface Post {
  geul_id: number;
  story_id: number;
  geul_title: string;
  geul_content: string;
  uploaded_time: string;
  user: { name: string };
}

const StoryGrid: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]); // 스토리 목록 상태
  const [posts, setPosts] = useState<Post[]>([]); // 게시물 목록 상태
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null); // 선택된 스토리 ID

  // 스토리 데이터를 가져오는 함수
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stories'); // API 호출
        if (response.data.success && Array.isArray(response.data.data)) {
          setStories(response.data.data); // 스토리 데이터 상태 업데이트
        } else {
          console.error('Invalid stories data format:', response.data);
          setStories([]); // 유효하지 않은 경우 빈 배열로 설정
        }
      } catch (error) {
        console.error('Error fetching stories:', error); // 에러 로그 출력
        setStories([]); // 에러 발생 시 빈 배열로 설정
      }
    };
    fetchStories(); // 스토리 데이터 호출 실행
  }, []);

  // 게시물 데이터를 가져오는 함수
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts'); // API 호출
        setPosts(response.data); // 게시물 데이터 상태 업데이트
      } catch (error) {
        console.error('Error fetching posts:', error); // 에러 로그 출력
        setPosts([]); // 에러 발생 시 빈 배열로 설정
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
    <div>
      <Background />
      <HeaderLogo />
      <SmallBox>
        {/* 스토리 제목 */}
        <h1 className="story-grid-title">Story Board</h1>

        {/* 스토리 목록 */}
        <div className="story-grid">
          {stories.length > 0 ? (
            stories.map((story) => (
              <div
                key={story.story_id} // 스토리 ID를 key로 사용
                onClick={() => handleStorySelect(story.story_id)} // 클릭 시 스토리 선택
                className="story-card" // 스타일 클래스
              >
                {/* 스토리 이미지 */}
                <img
                  src={story.cover_pic} // 스토리 커버 이미지 경로
                  alt={story.story_title}
                  className="story-image"
                />
                {/* 스토리 제목 */}
                <p className="story-title">{story.story_title}</p>
              </div>
            ))
          ) : (
            <p>스토리가 없습니다.</p> // 스토리가 없을 때 메시지 표시
          )}
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
      </SmallBox>

      <Profile />
      <UserList users={users} />
      <HomeBtn />
    </div>
  );
};

export default StoryGrid;
