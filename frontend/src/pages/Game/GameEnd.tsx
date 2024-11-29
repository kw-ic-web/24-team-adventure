import React, { useState } from 'react';
import './GameEnd.css';
function GameEnd() {
  const [bookState, setBookState] = useState({
    isOpen: false,
    isFullyOpen: false,
  });

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
          <h2>당신의 여정을 돌아보며</h2>
          <p>
            "당신의 여정이 마침내 완성되었습니다. <br />
            이제 모든 것이 끝났습니다. 이 순간을 기억하세요."
          </p>
          <p>
            로드맵에서 모든 결정을 마주하고, 스토리를 만들어낸 당신의 이야기는
            지금부터 전설이 됩니다...
          </p>
        </div>
      ) : (
        <div className={`book ${bookState.isOpen ? 'open' : ''}`}>
          <div className="book-content">
            <div className="cover">
              <h1>최종 스토리</h1>
              <p>작성자</p>
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
