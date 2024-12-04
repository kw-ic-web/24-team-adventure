import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../apis/axiosInstance.ts';
import { showToast } from '../../components/Toast';
import './PostDetail.css';
import { useUserData } from '../../hooks/auth/useUserData.ts';
import { useNavigate } from 'react-router-dom';
import Background from '../../components/ui/Background';
import BigBox from '../../components/ui/BigBox.tsx';

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
  const { data: userData } = useUserData();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>(''); // 새로운 댓글 입력 상태
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState<number | null>(null); // 삭제 메뉴 표시 상태

  useEffect(() => {
    if (userData && userData.user_id) {
      setLoggedInUserId(userData.user_id); // userData에서 user_id를 가져와 설정
    }
  }, [userData]);

  useEffect(() => {
    // 게시물 데이터를 가져오는 함수
    const fetchPost = async () => {
      try {
        const postResponse = await axiosInstance.get(
          `/board/${story_id}/post/${geul_id}`,
        );
        setPost(postResponse.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    // 댓글 데이터를 가져오는 함수
    const fetchComments = async () => {
      try {
        const commentsResponse = await axiosInstance.get(
          `/board/${story_id}/post/${geul_id}/comments`,
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
      const response = await axiosInstance.post(
        `/board/${story_id}/post/${geul_id}/comments`,
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
      await axiosInstance.delete(
        `/board/${story_id}/post/${geul_id}/comments/${comment_id}`,
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

      <BigBox >
        <div className="mt-[1%]">
        <button
        onClick={() => navigate('/board')}
        className="absolute top-[-10%] right-[-7%] p-4 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110  origin-center "
        title="나가기"
        aria-label="나가기"
      >
        <img src="/images/xBtn.png" alt="나가기" className="w-8 h-8" />
      </button>


          {post ? (
            <div className="post-detail">
              {/* 게시물 제목 */}
              <h2 className="post-title-pd">{post.geul_title}</h2>

              {/* 작성자 이름과 업로드 시간 */}
              <div className="post-meta-row-pd">
                <span className="post-author-pd">작성자: {post.user.name}</span>
                <span className="post-time-pd">
                  업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
                </span>
              </div>

              {/* 게시물 본문 */}
              <p className="intro-text-pd">{post.intro1}</p>
              <p className="intro-text-pd">{post.intro2}</p>
              <p className="intro-text-pd">{post.intro3}</p>
              <p className="post-content-pd preserve-spacing">{post.geul_content}</p>

              <hr className="divider" />

              {/* 댓글 목록 */}
              {comments.map((comment) => (
                <div key={comment.comment_id} className="comment">
                  <div className="comment-meta-row">
                    <span className="comment-author">
                      작성자: {comment.user.name}
                    </span>
                    <span className="comment-time">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>

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
                  <p className="comment-content">{comment.comm_content}</p>
                </div>
              ))}

              {/* 댓글 입력 */}
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
        </div>
        
      </BigBox>

    </div>
  );
};

export default PostDetail;
