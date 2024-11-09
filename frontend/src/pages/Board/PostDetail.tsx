import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // Axios 인스턴스 임포트
import HomeButton from "../../components/HomeButton";

interface Comment {
  comment_id: number;
  comm_content: string;
  author: string;
  created_at: string;
}

interface Post {
  geul_id: number;
  id: number;
  story_id: number;
  content: string;
  final_pic: string;
  title: string;
  uploaded_time: string;
  author: string;
}

const PostDetail: React.FC = () => {
  const { story_id, geul_id } = useParams<{ story_id: string; geul_id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!story_id || !geul_id) {
      setError("유효하지 않은 story_id 또는 geul_id입니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const postResponse = await api.get(`/board/${story_id}/post/${geul_id}`);
        setPost(postResponse.data);

        const commentsResponse = await api.get(`/board/${story_id}/post/${geul_id}/comments`);
        setComments(commentsResponse.data);
      } catch (err: any) {
        console.error("Error fetching post or comments:", err);
        setError("게시물 또는 댓글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [story_id, geul_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

    try {
      await axios.post(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
        {
          user_id: 1, // 실제 프로젝트에서 로그인된 사용자의 ID를 여기에 전달
          comm_content: newComment,
        },
      );
      setNewComment(''); // 댓글 입력 필드 초기화
      const commentsResponse = await axios.get(
        `http://localhost:3000/board/${story_id}/post/${geul_id}/comments`,
      );
      setComments(commentsResponse.data); // 댓글 목록 갱신
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen max-w-4xl mx-auto">
      {/* 포스트 제목 */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      {/* 포스트 내용 */}
      <p className="text-lg text-gray-800">{post.content}</p>

      {/* 업로드 시간 */}
      <small className="text-gray-500">업로드 시간: {new Date(post.uploaded_time).toLocaleString()}</small>

      {/* 댓글 섹션 */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">댓글</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="bg-white p-4 rounded-lg shadow mb-4"
            >
              <p className="text-gray-800">{comment.comm_content}</p>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{comment.author}</span>
                <span>{new Date(comment.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">댓글이 없습니다.</p>
        )}
      </div>

      <HomeButton />
    </div>
  );
};

export default PostDetail;
