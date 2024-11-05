import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BoardPage.css';

function BoardPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/board')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="board-container">
      <div className="header">
        <h1>게시판 목록</h1>
      </div>
      <div className="story-thumbnails">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="thumbnail">
            <p>동화 {n}</p>
          </div>
        ))}
      </div>
      <div className="board-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link to={`/board/${post.geul_id}`} key={post.geul_id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </Link>
          ))
        ) : (
          <p className="no-posts">게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default BoardPage;
