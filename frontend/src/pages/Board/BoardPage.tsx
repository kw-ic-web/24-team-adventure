import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader'; // 로딩 중 표시할 컴포넌트
import HomeButton from '../../components/HomeButton'; // 홈으로 이동하는 버튼 컴포넌트
import './BoardPage.css';

// 게시물 데이터 타입 정의
interface Post {
  geul_id: number; // 게시물 ID
  user_id: string; // 게시물 작성자 ID
  story_id: number; // 게시물이 속한 스토리 ID
  geul_content: string; // 게시물 내용
  final_pic: string; // 게시물 이미지 URL
  geul_title: string; // 게시물 제목
  uploaded_time: string; // 게시물 업로드 시간
}

const BoardPage: React.FC = () => {
  // URL 파라미터에서 story_id를 가져온다.
  const { story_id } = useParams<{ story_id: string }>();

  // 게시물 목록 상태
  const [posts, setPosts] = useState<Post[]>([]); // 게시물 데이터 배열
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 플래그
  const [error, setError] = useState<string>(''); // 에러 메시지 상태

  // 스토리 ID에 해당하는 게시물을 가져오는 useEffect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 서버 API 호출: 특정 스토리 ID에 해당하는 게시물 데이터를 가져옴
        const response = await axios.get(
          `http://localhost:3000/board/${story_id}`, // REST API URL
        );
        setPosts(response.data); // 서버에서 받은 게시물 데이터를 상태에 저장
        setError(''); // 에러 메시지를 초기화
      } catch (error) {
        console.error('Error fetching posts:', error); // 에러 로그 출력
        setError('게시물을 불러오는 데 실패했습니다.'); // 에러 메시지 상태 업데이트
      } finally {
        setLoading(false); // 로딩 상태 플래그를 false로 설정
      }
    };

    if (story_id) {
      fetchPosts(); // 스토리 ID가 있을 경우 게시물 데이터를 가져오는 함수 호출
    }
  }, [story_id]); // story_id가 변경될 때마다 useEffect 실행

  // 로딩 중일 때 로더 컴포넌트 출력
  if (loading) {
    return <Loader />; // 로딩 스피너 컴포넌트 표시
  }

  // 에러가 발생했을 경우 에러 메시지 출력
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p> {/* 에러 메시지 */}
        <button
          className="retry-button"
          onClick={() => window.location.reload()} // 페이지 새로고침으로 재시도
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="board-page">
      {/* 페이지 제목 및 선택된 스토리 ID 표시 */}
      <h1 className="board-title">게시물 목록 (Story ID: {story_id})</h1>
      {/* 게시물 목록이 있을 경우 게시물 리스트 출력 */}
      {posts.length > 0 ? (
        <div className="post-grid">
          {posts.map((post) => (
            <Link
              to={`/board/${post.story_id}/post/${post.geul_id}`} // 게시물 상세 페이지 링크
              key={post.geul_id} // React에서 각 게시물을 식별하기 위한 고유 key
              className="post-card" // 게시물 카드 스타일 클래스
            >
              <h3 className="post-title">{post.geul_title}</h3>{' '}
              {/* 게시물 제목 */}
              <p className="post-content">
                {post.geul_content.substring(0, 100)}...{' '}
                {/* 게시물 내용을 100자까지만 출력 */}
              </p>
              <div className="post-meta">
                <span>작성자 ID: {post.user_id}</span> {/* 작성자 ID 출력 */}
                <span>
                  업로드 시간: {new Date(post.uploaded_time).toLocaleString()}{' '}
                  {/* 업로드 시간을 로컬 시간 형식으로 출력 */}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // 게시물이 없을 경우 메시지 출력
        <p className="no-posts-message">게시물이 없습니다.</p>
      )}
      <HomeButton /> {/* 홈으로 이동하는 버튼 */}
    </div>
  );
};

export default BoardPage;
