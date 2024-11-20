import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameSelect.css';
import LanguageToggle from '../../components/game/LanguageToggle.tsx';
import GameSelectCard from '../../components/game/GameSelectCard.tsx';
import { toggleLanguage, Language } from '../../utils/game/languageUtils.ts';

// 스토리 데이터 타입 정의
interface Story {
  id: number; // 스토리 ID
  name: { ko: string; en: string }; // 스토리 제목 (한국어, 영어)
  imageUrl: string; // 스토리 이미지 경로
}

const GameSelect: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ko'); // 언어 상태 관리
  const [stories, setStories] = useState<Story[]>([]); // 서버에서 가져온 스토리 데이터를 저장하는 상태

  // 언어 토글 핸들러
  const handleToggleLanguage = () => {
    setLanguage(toggleLanguage(language)); // 언어 상태 변경
  };

  // 아이템 클릭 핸들러
  const handleClick = (name: string) => {
    console.log(`${name} clicked`);
  };

  // 나가기 버튼 클릭 핸들러
  const handleExit = () => {
    console.log('Exiting...');
  };

  // 스토리 데이터를 서버에서 가져오는 함수
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stories'); // API 호출
        const fetchedStories = response.data.map((story: any) => ({
          id: story.story_id,
          name: { ko: story.story_title, en: story.story_title_en },
          imageUrl: `http://localhost:3000/${story.cover_pic}`, // 이미지 경로 설정
        }));
        setStories(fetchedStories); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories(); // 데이터 가져오기 실행
  }, []); // 컴포넌트 마운트 시 한 번 실행

  return (
    <div className="game-select-container">
      <div className="game-select-header">
        <LanguageToggle language={language} onToggle={handleToggleLanguage} />
        <h1 className="game-select-title">동화 선택</h1>
        <button className="exit-button" onClick={handleExit}>
          나가기
        </button>
      </div>
      <div className="container">
        {stories.map((story) => (
          <div key={story.id} className="card">
            <img src={story.imageUrl} alt={story.name[language]} />
            <p className="card-title">{story.name[language]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSelect;
