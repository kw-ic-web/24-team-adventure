import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameEnd.css';

function GameEnd() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [bookState, setBookState] = useState({
    isOpen: false,
    isFullyOpen: false,
  });

  useEffect(() => {
    const savedTitle = localStorage.getItem('storyTitle');
    const savedContent = localStorage.getItem('storyContent');
    const savedAuthor = localStorage.getItem('userName');

    if (savedTitle && savedContent) {
      setTitle(savedTitle);
      setContent(savedContent);
      setAuthor(savedAuthor); // 작성자 이름 설정
    } else {
      navigate('/'); // 데이터가 없으면 홈으로 리다이렉트
    }
  }, [navigate]);

  const handleBookClick = () => {
    if (!bookState.isOpen) {
      setBookState({ ...bookState, isOpen: true });
      setTimeout(() => {
        setBookState({ isOpen: true, isFullyOpen: true });
      }, 1000);
    }
  };

  return (
    <div className="container" onClick={handleBookClick}>
      {bookState.isFullyOpen ? (
        <div className="story-screen">
          <h2>{title}</h2>
          <div className="story-content">
            <p className="text-content">{content}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/home');
            }}
            className="webrtc-button"
          >
            화상채팅하러가기
          </button>
        </div>
      ) : (
        <div className={`book ${bookState.isOpen ? 'open' : ''}`}>
          <div className="book-content">
            <div className="cover">
              <h1>{title || '최종 스토리'}</h1>
              <p>작성자: {author || '알 수 없음'}</p> {/* 작성자 이름 표시 */}
            </div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`page page-${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameEnd;
