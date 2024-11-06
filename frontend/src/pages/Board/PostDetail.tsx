import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; // 백엔드 API 호출을 위한 Axios 인스턴스
import "./PostDetail.css"; // 포스트 상세 스타일링 CSS

// 댓글과 포스트의 타입 정의
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
  // URL에서 story_id와 geul_id 추출
  const { story_id, geul_id } = useParams<{ story_id: string; geul_id: string }>();

  // 디버깅용 로그
  console.log("Story ID:", story_id);
  console.log("Geul ID:", geul_id);

  // 상태 변수 설정
  const [post, setPost] = useState<Post | null>(null); // 포스트 데이터
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 데이터
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string>(""); // 에러 메시지

  useEffect(() => {
    // story_id 또는 geul_id가 없을 경우 에러 처리
    if (!story_id || !geul_id) {
      setError("Invalid story_id or geul_id");
      setLoading(false);
      return;
    }

    // 포스트와 댓글을 가져오는 비동기 함수
    const fetchData = async () => {
      try {
        // 포스트 상세 정보 조회
        const postResponse = await api.get(`/board/${story_id}/post/${geul_id}`);
        console.log("Post Response:", postResponse.data); // 디버깅용 로그
        setPost(postResponse.data);

        // 댓글 목록 조회
        const commentsResponse = await api.get(`/board/${story_id}/post/${geul_id}/comments`);
        console.log("Comments Response:", commentsResponse.data); // 디버깅용 로그
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

  // 로딩 상태일 때 로더 표시
  if (loading) return <div>Loading...</div>;

  // 에러 발생 시 에러 메시지 표시
  if (error && !post) return <div>{error}</div>;

  // 포스트가 없을 경우 메시지 표시
  if (!post) return <div>게시물이 없습니다.</div>;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>

      <p>{post.content}</p>

      <small>업로드 시간: {new Date(post.uploaded_time).toLocaleString()}</small>

      <div className="comments-section">
        <h3>댓글</h3>
        {error && <p className="error">{error}</p>}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.comment_id} className="comment">
              <p>{comment.comm_content}</p>
              <small>
                {comment.author} - {new Date(comment.created_at).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
