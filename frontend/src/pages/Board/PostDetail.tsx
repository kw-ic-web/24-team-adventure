import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../../components/Toast'; // 토스트 팝업을 보여주는 유틸리티 함수
import './PostDetail.css';

// 댓글(Comment) 데이터 구조 정의
interface Comment {
  comment_id: number; // 댓글 ID
  comm_content: string; // 댓글 내용
  created_at: string; // 댓글 생성 시간
  user_id: string; // 댓글 작성자 ID
}

// 게시물(Post) 데이터 구조 정의
interface Post {
  geul_title: string; // 게시물 제목
  geul_content: string; // 게시물 내용
  uploaded_time: string; // 게시물 업로드 시간
  final_pic: string; // 게시물 이미지 URL
  intro1: string; // 소개 텍스트 1
  intro2: string; // 소개 텍스트 2
  intro3: string; // 소개 텍스트 3
  user_id: string; // 게시물 작성자 ID
}

const PostDetail: React.FC = () => {
  const { story_id, geul_id } = useParams<{
    story_id: string; // URL 파라미터로 받은 Story ID
    geul_id: string; // URL 파라미터로 받은 Post ID
  }>();

  // 상태 선언
  const [post, setPost] = useState<Post | null>(null); // 게시물 데이터 상태
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 데이터 상태
  const [newComment, setNewComment] = useState<string>(''); // 새로운 댓글 입력 상태
  const [loggedInUserId, setLoggedInUserId] = useState<string>('1'); // 현재 로그인된 사용자 ID (임시)

  // 게시물 및 댓글 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(
          `http://localhost:3000/board/${story_id}/post/${geul_id}`, // 특정 게시물을 가져오는 API 호출
        );
        setPost(postResponse.data); // 게시물 데이터 설정
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsResponse = await axios.get(
          `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`, // 특정 게시물의 댓글 가져오는 API 호출
        );
        setComments(commentsResponse.data); // 댓글 데이터 설정
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPost(); // 게시물 데이터 가져오기 실행
    fetchComments(); // 댓글 데이터 가져오기 실행
  }, [story_id, geul_id]); // story_id와 geul_id 변경 시 실행

  // 새로운 댓글을 서버에 추가하는 함수
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      // 댓글 내용이 비어있으면 에러 토스트 출력
      showToast('댓글 내용을 입력하세요.', 'error');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
        {
          user_id: loggedInUserId, // 댓글 작성자 ID
          comm_content: newComment, // 댓글 내용
        },
      );

      // 서버에서 반환된 댓글 데이터를 로컬 상태에 추가
      const savedComment = response.data.data;
      setComments((prevComments) => [...prevComments, savedComment]);
      setNewComment(''); // 입력 필드 초기화
      showToast('댓글이 성공적으로 추가되었습니다.', 'success'); // 성공 토스트 출력
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast('댓글 추가에 실패했습니다.', 'error'); // 실패 토스트 출력
    }
  };

  // 특정 댓글을 서버에서 삭제하는 함수
  const handleDeleteComment = async (comment_id: number) => {
    try {
      await axios.delete(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments/${comment_id}`,
      );

      // 로컬 상태에서 댓글 삭제
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comment_id !== comment_id),
      );
      showToast('댓글이 삭제되었습니다.', 'success'); // 성공 토스트 출력
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('댓글 삭제에 실패했습니다.', 'error'); // 실패 토스트 출력
    }
  };

  return (
    <div className="post-detail-container">
      {post ? (
        <div className="post-detail">
          {/* 게시물 제목 */}
          <h2 className="post-title">{post.geul_title}</h2>

          {/* 작성자 ID */}
          <p className="post-meta">작성자 ID: {post.user_id}</p>

          {/* 업로드 시간 */}
          <p className="post-time">
            업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
          </p>

          {/* 게시물 이미지 */}
          {post.final_pic && (
            <img
              src={`http://localhost:3000/${post.final_pic}`} // 이미지 URL
              alt="Final"
              className="final-image"
            />
          )}

          {/* 게시물 소개 텍스트 */}
          <p className="intro-text">{post.intro1}</p>
          <p className="intro-text">{post.intro2}</p>
          <p className="intro-text">{post.intro3}</p>
          <p className="post-content">{post.geul_content}</p>

          <hr className="divider" />

          {/* 댓글 섹션 */}
          {comments.map((comment) => (
            <div key={comment.comment_id} className="comment">
              {/* 댓글 내용 */}
              <p>{comment.comm_content}</p>
              {/* 댓글 생성 시간 */}
              <p className="comment-time">
                {new Date(comment.created_at).toLocaleString()}
              </p>
              {/* 댓글 작성자 ID */}
              <p className="comment-author">작성자 ID: {comment.user_id}</p>
              {comment.user_id === loggedInUserId && (
                // 댓글 삭제 버튼 (로그인된 사용자와 댓글 작성자가 일치할 경우에만 표시)
                <button
                  onClick={() => handleDeleteComment(comment.comment_id)}
                  className="delete-button"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          {/* 새로운 댓글 작성 섹션 */}
          <div className="new-comment">
            <input
              type="text"
              className="new-comment-input"
              placeholder="Add a comment"
              value={newComment} // 입력된 댓글 내용
              onChange={(e) => setNewComment(e.target.value)} // 입력 필드 업데이트
            />
            <button onClick={handleCommentSubmit} className="submit-button">
              Submit
            </button>
          </div>
        </div>
      ) : (
        <p>Loading post...</p> // 게시물 데이터를 로드 중일 때 표시
      )}
    </div>
  );
};

export default PostDetail;
