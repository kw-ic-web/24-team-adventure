import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';

// 댓글의 데이터 구조 정의
interface Comment {
  comment_id: number;
  comm_content: string;
  created_at: string;
  user_id: string;
}

// 게시물의 데이터 구조 정의
interface Post {
  geul_title: string;
  geul_content: string;
  uploaded_time: string;
  final_pic: string;
  intro1: string;
  intro2: string;
  intro3: string;
}

const PostDetail: React.FC = () => {
  // URL의 story_id와 geul_id를 추출
  const { story_id, geul_id } = useParams<{
    story_id: string;
    geul_id: string;
  }>();

  // 상태 변수 정의
  const [post, setPost] = useState<Post | null>(null); // 게시물 정보 저장
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 목록 저장
  const [newComment, setNewComment] = useState<string>(''); // 새 댓글 입력값 저장
  const [loggedInUserId, setLoggedInUserId] = useState<string>('1'); // 로그인된 사용자 ID (임시 값)

  // 페이지 로딩 시 게시물과 댓글 데이터를 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // 게시물 데이터를 서버에서 가져오기
        const postResponse = await axios.get(
          `http://localhost:3000/board/${story_id}/post/${geul_id}`,
        );
        setPost(postResponse.data); // 가져온 데이터를 post 상태에 저장
      } catch (error) {
        console.error('Error fetching post:', error); // 오류 발생 시 로그 출력
      }
    };

    const fetchComments = async () => {
      try {
        // 댓글 데이터를 서버에서 가져오기
        const commentsResponse = await axios.get(
          `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
        );
        setComments(commentsResponse.data); // 가져온 데이터를 comments 상태에 저장
      } catch (error) {
        console.error('Error fetching comments:', error); // 오류 발생 시 로그 출력
      }
    };

    // 데이터 가져오기 함수 호출
    fetchPost();
    fetchComments();
  }, [story_id, geul_id]); // story_id와 geul_id가 변경될 때마다 실행

  // 새로운 댓글 추가 처리 함수
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // 댓글이 비어 있으면 리턴

    try {
      // 서버에 새 댓글 추가 요청
      await axios.post(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
        {
          user_id: loggedInUserId, // 현재 로그인된 사용자 ID
          comm_content: newComment, // 새 댓글 내용
        },
      );
      setNewComment(''); // 댓글 입력창 초기화

      // 새로 추가된 댓글 목록을 다시 가져와서 갱신
      const commentsResponse = await axios.get(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
      );
      setComments(commentsResponse.data); // 갱신된 댓글 데이터 저장
    } catch (error) {
      console.error('Error adding comment:', error); // 오류 발생 시 로그 출력
    }
  };

  // 댓글 삭제 처리 함수
  const handleDeleteComment = async (comment_id: number) => {
    try {
      // 서버에 댓글 삭제 요청
      await axios.delete(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments/${comment_id}`,
      );

      // 삭제된 댓글을 제외한 목록으로 상태 갱신
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comment_id !== comment_id),
      );
    } catch (error) {
      console.error('Error deleting comment:', error); // 오류 발생 시 로그 출력
    }
  };

  // 렌더링할 JSX
  return (
    <div className="post-detail-container">
      {post ? (
        <div className="post-detail">
          {/* 게시물 제목 */}
          <h2 className="post-title">{post.geul_title}</h2>

          {/* 게시물 이미지 */}
          {post.final_pic && (
            <img
              src={`http://localhost:3000/${post.final_pic}`} // 이미지 경로 설정
              alt="Final"
              className="final-image"
            />
          )}

          {/* 게시물 소개 문구 */}
          <p className="intro-text">{post.intro1}</p>
          <p className="intro-text">{post.intro2}</p>
          <p className="intro-text">{post.intro3}</p>

          {/* 게시물 본문 */}
          <p className="post-content">{post.geul_content}</p>

          {/* 업로드 시간 */}
          <p className="post-time">
            업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
          </p>

          {/* 구분선 */}
          <hr className="divider" />

          {/* 댓글 목록 표시 */}
          <h3 className="comments-title"></h3>
          {comments.map((comment) => (
            <div key={comment.comment_id} className="comment">
              {/* 댓글 내용 */}
              <p>{comment.comm_content}</p>

              {/* 댓글 시간과 작성자 정보 */}
              <p className="comment-time">
                {new Date(comment.created_at).toLocaleString()}
              </p>
              <p className="comment-author">작성자 ID: {comment.user_id}</p>

              {/* 삭제 버튼 (로그인된 사용자와 댓글 작성자가 동일한 경우에만 표시) */}
              {comment.user_id === loggedInUserId && (
                <button
                  onClick={() => handleDeleteComment(comment.comment_id)}
                  className="delete-button"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {/* 새 댓글 입력창과 제출 버튼 */}
          <div className="new-comment">
            <input
              type="text"
              className="new-comment-input"
              placeholder="Add a comment"
              value={newComment} // 입력한 댓글 내용
              onChange={(e) => setNewComment(e.target.value)} // 입력 변화 감지
            />
            <button onClick={handleCommentSubmit} className="submit-button">
              Submit
            </button>
          </div>
        </div>
      ) : (
        // 게시물 로딩 중 표시
        <p>Loading post...</p>
      )}
    </div>
  );
};

export default PostDetail;
