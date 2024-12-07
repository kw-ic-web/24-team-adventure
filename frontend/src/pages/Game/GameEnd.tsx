import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './GameEnd.css';

function GameEnd() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [bookState, setBookState] = useState({
    isOpen: false,
    isFullyOpen: false,
  });

  const effectRan = useRef(false); // useEffect 중복 실행 방지 플래그

  const saveStoryToBackend = async (storyData) => {
    console.log('전송할 데이터:', storyData);
    try {
      const { userId, storyId, title, content } = storyData;

      if (!userId || !storyId || !title || !content) {
        throw new Error('스토리 데이터를 완전히 제공하지 않았습니다.');
      }

      const response = await axios.post(
        'https://team05-server.kwweb.duckdns.org/api/saveStory',
        {
          user_id: userId,
          story_id: Number(storyId),
          geul_title: title,
          geul_content: content,
        },
      );

      if (response.status !== 201) {
        const errorData = response.data;
        throw new Error(errorData.error || '스토리 저장에 실패했습니다.');
      }

      console.log('스토리 저장 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('스토리 저장 중 오류 발생:', error.message);
      alert(`스토리 저장 실패: ${error.message}`);
      throw error;
    }
  };

  useEffect(() => {
    if (effectRan.current) return; // useEffect가 이미 실행되었으면 중단
    effectRan.current = true; // 첫 실행 이후에는 실행되지 않도록 설정

    const savedTitle = localStorage.getItem('storyTitle');
    const savedContent = localStorage.getItem('storyContent');
    const savedAuthor = localStorage.getItem('userName');

    const userId = location.state?.userId;
    const storyId = location.state?.story_id;

    if (!userId || !storyId) {
      alert('필수 데이터가 누락되었습니다. 홈으로 이동합니다.');
      navigate('/');
      return;
    }

    if (savedTitle && savedContent && savedAuthor) {
      setTitle(savedTitle);
      setContent(savedContent);

      setAuthor(savedAuthor);

      // 백엔드로 데이터 전송
      saveStoryToBackend({
        userId,
        storyId,
        title: savedTitle,
        content: savedContent,
      });
    } else {
      alert('스토리 데이터가 없습니다. 홈으로 이동합니다.');
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleBookClick = () => {
    if (!bookState.isOpen) {
      setBookState({ ...bookState, isOpen: true });
      setTimeout(() => {
        setBookState({ isOpen: true, isFullyOpen: true });
      }, 1000);
    }
  };

  return (
    <div className="GameEnd">
      <div className="container" onClick={handleBookClick}>
        {bookState.isFullyOpen ? (
          <div className="story-screen">
            <h2>{title}</h2>
            <div className="story-content">
              <p className="text-content preserve-spacing">{content}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/room');
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
                <p className="author">작성자: {author || '알 수 없음'}</p>
              </div>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`page page-${i + 1}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameEnd;
