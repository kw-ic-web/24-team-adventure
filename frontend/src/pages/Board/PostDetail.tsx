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
}

const PostDetail: React.FC = () => {
  const { story_id, geul_id } = useParams<{
    story_id: string;
    geul_id: string;
  }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loggedInUserId, setLoggedInUserId] = useState<string>('1');

  useEffect(() => {
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
          <h2 className="post-title">{post.geul_title}</h2>
          <p className="post-content">{post.geul_content}</p>
          <p className="post-time">
            업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
          </p>

          <hr className="divider" />

          <h3 className="comments-title">Comments:</h3>
          {comments.map((comment) => (
            <div key={comment.comment_id} className="comment">
              <p>{comment.comm_content}</p>
              <p className="comment-time">
                {new Date(comment.created_at).toLocaleString()}
              </p>
              <p className="comment-author">작성자 ID: {comment.user_id}</p>
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
