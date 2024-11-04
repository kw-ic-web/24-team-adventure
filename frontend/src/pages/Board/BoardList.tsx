// frontend/src/pages/Board/BoardList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BoardList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/board')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const handlePostClick = (geul_ID: number) => {
    navigate(`/board/${geul_ID}`);
  };

  return (
    <div>
      <h2>게시판 목록</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.geul_ID} onClick={() => handlePostClick(post.geul_ID)}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>게시물이 없습니다.</p>
      )}
    </div>
  );
}

export default BoardList;
