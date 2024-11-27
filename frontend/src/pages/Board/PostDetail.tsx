import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../../components/Toast';
import './PostDetail.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';
import SmallBox from '../../components/ui/SmallBox.tsx';
import UserList from '../../components/ui/Userlist';
import Profile from '../../components/ui/Profile';

//db연결 전 **임시** 사용자 정보
interface User {
  id: number;
  name: string;
  online: boolean;
}

const users: User[] = [
  { id: 1, name: 'user1', online: true },
  { id: 2, name: 'user2', online: false },
  // 추가 사용자 데이터...
];

// 댓글 데이터 타입 정의
interface Comment {
  comment_id: number; // 댓글 ID
  comm_content: string; // 댓글 내용
  created_at: string; // 댓글 생성 시간
  user_id: string; // 댓글 작성자 ID
  user: { name: string }; // 댓글 작성자의 이름
}

// 게시물 데이터 타입 정의
interface Post {
  geul_title: string; // 게시물 제목
  geul_content: string; // 게시물 내용
  uploaded_time: string; // 게시물 업로드 시간
  final_pic: string; // 게시물 이미지 URL
  intro1: string; // 게시물 소개 텍스트 1
  intro2: string; // 게시물 소개 텍스트 2
  intro3: string; // 게시물 소개 텍스트 3
  user: { name: string }; // 게시물 작성자의 이름
}

const PostDetail: React.FC = () => {
  const navigate = useNavigate();
  const { story_id, geul_id } = useParams<{
    story_id: string;
    geul_id: string;
  }>();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>(''); // 새로운 댓글 입력 상태
  const [loggedInUserId, setLoggedInUserId] = useState<string>('1'); // 로그인된 사용자 ID (임시)
  const [showDeleteMenu, setShowDeleteMenu] = useState<number | null>(null); // 삭제 메뉴 표시 상태

  useEffect(() => {
    // 게시물 데이터를 가져오는 함수
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(
          `http://localhost:3000/board/${story_id}/post/${geul_id}`,
        );
        setPost(postResponse.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    // 댓글 데이터를 가져오는 함수
    const fetchComments = async () => {
      try {
        const commentsResponse = await axios.get(
          `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPost();
    fetchComments();
  }, [story_id, geul_id]);

  // 새로운 댓글 추가 함수
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      showToast('댓글 내용을 입력하세요.', 'error');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
        {
          user_id: loggedInUserId,
          comm_content: newComment,
        },
      );

      const savedComment = response.data.data;
      setComments((prevComments) => [...prevComments, savedComment]);
      setNewComment('');
      showToast('댓글이 성공적으로 추가되었습니다.', 'success');
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast('댓글 추가에 실패했습니다.', 'error');
    }
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (comment_id: number) => {
    try {
      await axios.delete(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments/${comment_id}`,
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comment_id !== comment_id),
      );
      setShowDeleteMenu(null);
      showToast('댓글이 삭제되었습니다.', 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('댓글 삭제에 실패했습니다.', 'error');
    }
  };

  return (
    <div>
      {' '}
      <Background />
      {/* Profile Box */}
      <Link to="/MyPage">
        <Profile />
      </Link>
      {/* Userlist Box */}
      <div>
        <UserList users={users} />
      </div>
      <SmallBox>
        {post ? (
          <div className="post-detail" style={{ marginTop: '-30px' }}>
            {/* 게시물 제목 */}
            <h2 className="post-title">{post.geul_title}</h2>

            {/* 작성자 이름과 업로드 시간 */}
            <p className="post-meta">작성자: {post.user.name}</p>
            <p className="post-time">
              업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
            </p>

            {/* 게시물 이미지 */}
          {post.final_pic && (
            <img src={post.final_pic} alt="Final" className="final-image" />
          )}

            {/* 게시물 본문 */}
            <p className="intro-text">{post.intro1}</p>
            <p className="intro-text">{post.intro2}</p>
            <p className="intro-text">{post.intro3}</p>
            <p className="post-content">{post.geul_content}</p>

            <hr className="divider" />

            {/* 댓글 목록 */}
            {comments.map((comment) => (
              <div key={comment.comment_id} className="comment">
                <div className="comment-header">
                  {/* 댓글 작성자 이름 표시 */}
                  <p className="comment-author">작성자: {comment.user.name}</p>

                  {comment.user_id === loggedInUserId && (
                    <div className="comment-menu-container">
                      <div
                        className="comment-menu"
                        onClick={() =>
                          setShowDeleteMenu(
                            showDeleteMenu === comment.comment_id
                              ? null
                              : comment.comment_id,
                          )
                        }
                      >
                        ⋮
                      </div>
                      {showDeleteMenu === comment.comment_id && (
                        <div className="delete-menu">
                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDeleteComment(comment.comment_id)
                            }
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* 댓글 내용 및 작성 시간 */}
                <p className="comment-content">{comment.comm_content}</p>
                <p className="comment-time">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}

            {/* 댓글 입력 섹션 */}
            <div className="new-comment">
              <input
                type="text"
                className="new-comment-input"
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit} className="submit-button">
                등록
              </button>
            </div>
          </div>
        ) : (
          <p>Loading post...</p>
        )}
      </SmallBox>
      <button
        onClick={() => navigate('/board')}
        className="absolute bottom-[30px] right-[210px] w-[90px] h-[200px] p-4 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110"
        title="나가기"
        aria-label="나가기"
      >
        <img src="/images/xBtn.png" alt="나가기" className="w-30 h-30" />
      </button>
    </div>
  );
};

export default PostDetail;
