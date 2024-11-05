import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BoardDetail() {
  const { geul_id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/post/${geul_id}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error('Error fetching post details:', error));
  }, [geul_id]);

  return (
    <div>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </>
      ) : (
        <p>게시물을 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default BoardDetail;
