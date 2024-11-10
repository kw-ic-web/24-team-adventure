import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Comment {
  comment_id: number;
  comm_content: string;
  created_at: string;
  user_id: number;
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
          user_id: 1, // 실제 프로젝트에서 로그인된 사용자의 ID를 여기에 전달
          comm_content: newComment, // 중복 제거
        },
      );
      setNewComment(''); // 댓글 입력 필드 초기화

      // 새로 추가된 댓글 가져오기
      const commentsResponse = await axios.get(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
      );
      setComments(commentsResponse.data); // 댓글 목록 갱신
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {post ? (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold mb-4">{post.geul_title}</h2>
          <p className="text-gray-700 mb-4">{post.geul_content}</p>
          <p className="text-gray-500 text-sm">
            업로드 시간: {new Date(post.uploaded_time).toLocaleString()}
          </p>

          <hr className="my-6" />

          <h3 className="text-2xl font-semibold mb-4">Comments:</h3>
          {comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="mb-4 p-4 border rounded-md"
            >
              <p>{comment.comm_content}</p>
              <p className="text-gray-500 text-sm">
                {new Date(comment.created_at).toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">
                작성자 ID: {comment.user_id}
              </p>
            </div>
          ))}

          <div className="mt-6">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
            >
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
