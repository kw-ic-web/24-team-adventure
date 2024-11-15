import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import HomeButton from '../../components/HomeButton';
import './BoardPage.css';

// 게시물 데이터 타입 정의
interface Post {
  geul_id: number;
  user_id: string;
  story_id: number;
  geul_content: string;
  final_pic: string;
  geul_title: string;
  uploaded_time: string;
}

const BoardPage: React.FC = () => {
  // URL 파라미터에서 story_id를 가져온다.
  const { story_id } = useParams<{ story_id: string }>();

  // 게시물 목록 상태
  const [posts, setPosts] = useState<Post[]>([]);
  // 로딩 상태
  const [loading, setLoading] = useState<boolean>(true);
  // 에러 메시지 상태
  const [error, setError] = useState<string>('');

  // 선택된 스토리 ID에 해당하는 게시물을 가져오는 useEffect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 서버에서 특정 스토리 ID에 해당하는 게시물 목록을 가져온다.
        const response = await axios.get(
          `http://localhost:3000/board/${story_id}`,
        );
        setPosts(response.data); // 가져온 데이터를 posts 상태에 저장
        setError(''); // 에러 메시지를 초기화
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('게시물을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    if (story_id) {
      fetchPosts(); // 스토리 ID가 있을 경우 게시물 데이터를 가져오는 함수 호출
    }
  }, [story_id]); // story_id가 변경될 때마다 실행

  // 로딩 중일 때 로더 컴포넌트 출력
  if (loading) {
    return <Loader />;
  }

  // 에러가 발생했을 경우 에러 메시지 출력
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()} // 페이지를 새로고침하여 다시 시도
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
              to={`/board/${post.story_id}/post/${post.geul_id}`} // 각 게시물 상세 페이지로 연결되는 링크
              key={post.geul_id} // 각 게시물을 식별하기 위한 key
              className="post-card"
            >
              <h3 className="post-title">{post.geul_title}</h3>{' '}
              {/* 게시물 제목 */}
              <p className="post-content">
                {post.geul_content.substring(0, 100)}...{' '}
                {/* 게시물 내용 일부 */}
              </p>
              <div className="post-meta">
                <span>작성자 ID: {post.user_id}</span> {/* 작성자 ID */}
                <span>
                  업로드 시간: {new Date(post.uploaded_time).toLocaleString()}{' '}
                  {/* 업로드 시간 */}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-posts-message">게시물이 없습니다.</p>
      )}
      <HomeButton /> {/* 홈으로 돌아가는 버튼 */}
    </div>
  );
};

export default BoardPage;
