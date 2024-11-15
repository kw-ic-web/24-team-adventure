import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';

interface Comment {
  comment_id: number;
  comm_content: string;
  created_at: string;
  user_id: string;
}

interface Post {
  geul_title: string;
  geul_content: string;
  uploaded_time: string;
  final_pic: string;
  intro1: string;
  intro2: string;
  intro3: string;
  user_id: string;
}

const PostDetail: React.FC = () => {
  const { story_id, geul_id } = useParams<{
    story_id: string;
    geul_id: string;
  }>();

  const [post, setPost] = useState<Post | null>(null); // 게시물 데이터 상태
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 데이터 상태
  const [newComment, setNewComment] = useState<string>(''); // 새로운 댓글 입력 상태
  const [loggedInUserId, setLoggedInUserId] = useState<string>('1'); // 로그인된 사용자 ID

  // 게시물과 댓글 데이터를 가져오는 useEffect
  useEffect(() => {
    // 게시물 데이터 가져오기 함수
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

    // 댓글 데이터 가져오기 함수
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

  // 댓글 추가 함수
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
        {
          user_id: loggedInUserId,
          comm_content: newComment,
        },
      );
      setNewComment('');
      const commentsResponse = await axios.get(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
      );
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('Error adding comment:', error);
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
    } catch (error) {
      console.error('Error deleting comment:', error);
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
              src={`http://localhost:3000/${post.final_pic}`}
              alt="Final"
              className="final-image"
            />
          )}

          {/* 각 단락 출력 */}
          <p className="intro-text">{post.intro1}</p>
          <p className="intro-text">{post.intro2}</p>
          <p className="intro-text">{post.intro3}</p>
          <p className="post-content">{post.geul_content}</p>

          <hr className="divider" />

          {/* 댓글 섹션 */}
          {comments.map((comment) => (
            <div key={comment.comment_id} className="comment">
              <p className="comment-author">작성자 ID: {comment.user_id}</p>
              <p>{comment.comm_content}</p>
              <p className="comment-time">
                {new Date(comment.created_at).toLocaleString()}
              </p>

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

          {/* 새로운 댓글 입력 섹션 */}
          <div className="new-comment">
            <input
              type="text"
              className="new-comment-input"
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit} className="submit-button">
              Submit
            </button>
          </div>
        </div>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
};

export default PostDetail;
