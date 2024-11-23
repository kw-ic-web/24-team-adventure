import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameSelect.css';
import { useNavigate } from 'react-router-dom'; // React Router navigate 사용
import LanguageToggle from '../../components/game/LanguageToggle';
import { toggleLanguage, Language } from '../../utils/game/languageUtils';

// 스토리 데이터 타입 정의
interface Story {
  id: number;
  name: { ko: string; en: string };
  imageUrl: string;
}

const GameSelect = () => {
  const [language, setLanguage] = useState<Language>('ko');
  const [stories, setStories] = useState<Story[]>([]);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate hook

  const handleToggleLanguage = () => {
    setLanguage(toggleLanguage(language));
  };

  const handleClick = (id: number) => {
    navigate(`/gameplay/${id}`); // 스토리 ID를 기반으로 페이지 이동
  };

  const handleExit = () => {
    console.log('Exiting...');
    navigate('/'); // 홈 또는 다른 페이지로 이동
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/stories/select',
        );
        const fetchedStories = response.data.map((story: any) => ({
          id: story.story_id,
          name: { ko: story.story_title, en: story.story_title_en },
          imageUrl: story.cover_pic, // DB에서 가져온 URL을 그대로 사용
        }));
        setStories(fetchedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

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
          <div
            key={story.id}
            className="card"
            onClick={() => handleClick(story.id)}
          >
            <img src={story.imageUrl} alt={story.name[language]} />
            <p className="card-title">{story.name[language]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSelect;
