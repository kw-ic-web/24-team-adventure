// frontend/src/pages/Board/BoardDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BoardDetail() {
  const { geul_ID } = useParams<{ geul_ID: string }>();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!geul_ID) {
      console.error('geul_ID is undefined');
      return;
    }

    // 게시물 상세 정보 API 호출
    fetch(`http://localhost:3000/board/${geul_ID}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error('Error fetching post:', error));

    // 댓글 목록 API 호출
    fetch(`http://localhost:3000/board/${geul_ID}/comments`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error));
  }, [geul_ID]);

  return (
    <div>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <h3>댓글</h3>
          {comments.length ? (
            comments.map(comment => (
              <div key={comment.comment_ID}>
                <p>{comment.comm_content}</p>
              </div>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </>
      ) : (
        <p>게시물을 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default BoardDetail;
