import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function BoardList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/board')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div>
      <h2>게시판 목록</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.geul_id}>
            <h3><Link to={`/board/${post.geul_id}`}>{post.title}</Link></h3>
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
