import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserList from '../../components/ui/Userlist';
import Background from '../../components/ui/Background';
import SmallBox from '../../components/ui/SmallBox';
import Profile from '../../components/ui/Profile';
import HeaderLogo from '../../components/ui/HeaderLogo';

import GameSelect from '../Game/GameSelect';
import LanguageToggle from '../../components/game/LanguageToggle.tsx';
import { toggleLanguage, Language } from '../../utils/game/languageUtils.ts';
import '../../components/ui/CommonUi.css';

/*
To do:
동화선택 화면과 연결, 호버 기능
다른 사용자 목록 박스 : 사용자 db 연결, 본인 외 나머지
*/

interface User {
  id: number;
  name: string;
  online: boolean;
}

interface Post {
  id: number;
  category: string;
  title: string;
}

// 예시 사용자 데이터
const users: User[] = [
  { id: 1, name: 'user1', online: true },
  { id: 2, name: 'user2', online: false },
  // 추가 사용자 데이터...
];

// 예시 게시글 데이터
const posts: Post[] = [
  { id: 1, category: 'tail1', title: '첫 번째 게시글입니다.' },
  { id: 2, category: 'tail2', title: '두 번째 게시글입니다.' },
  // 추가 게시글 데이터...
];
// 스토리 데이터 타입 정의
interface Story {
  id: number; // 스토리 ID
  name: { ko: string; en: string }; // 스토리 제목 (한국어, 영어)
  imageUrl: string; // 스토리 이미지 경로
}

export default function Home() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false); // hover 상태 관리
  const [language, setLanguage] = useState<Language>('ko'); // 언어 상태 관리
  const [stories, setStories] = useState<Story[]>([]); // 서버에서 가져온 스토리 데이터를 저장하는 상태

  // 언어 토글 핸들러
  const handleToggleLanguage = () => {
    setLanguage(toggleLanguage(language)); // 언어 상태 변경
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

  // MouseEnter (hover) 시 크기 변화
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // MouseLeave 시 크기 원래대로 복귀
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  // 클릭 시 페이지 이동
  const handleClick = () => {
    navigate('/gameselect');
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    console.log('로그아웃 완료: JWT 토큰 삭제됨');
    navigate('/');
  };

  return (
    <div className="">
      <Background />
      <div>
        <HeaderLogo />
      </div>
      <SmallBox>
        <button
          className="
      absolute 
      inset-0  
      bg-white 
      rounded-[50px] 
      shadow-md 
      
      cursor-pointer 
      transition-transform 
      origin-center 
      hover:scale-105 
      hover:shadow-lg
      p-16
      
    "
          onClick={() => navigate('/games')}
          
        >
          <div className="game-select-header transform scale-90" style={{ marginTop: '-20px' }}>
            <LanguageToggle
              language={language}
              onToggle={handleToggleLanguage}
            />
            <h1 className="game-select-title ">동화 선택</h1>
          </div>
          <div className="container transform scale-95">
            {stories.map((story) => (
              <div key={story.id} className="card">
                <img src={story.imageUrl} alt={story.name[language]} />
                <p className="card-title">{story.name[language]}</p>
              </div>
            ))}
          </div>
        </button>
      </SmallBox>

      {/* Profile Box */}
      <Link to="/MyPage">
        <Profile />
      </Link>
      {/* Userlist Box */}
      <div>
        <UserList users={users} />
      </div>
      {/* Board Button */}
      <Link to="/Board" className="board-link-button">
        &nbsp;게시판 이동하기
      </Link>
      {/* Board Box */}
      <div className="post-list-box">
        {posts.slice(0, 5).map((post) => (
          <div key={post.id} className="post-list-item">
            <span className="text-sm font-semibold">{post.category}</span>
            <Link
              to={`/Board/${post.id}`}
              className="ml-2 truncate"
              title={post.title}
            >
              {post.title.length > 15
                ? `${post.title.slice(0, 15)}...`
                : post.title}
            </Link>
          </div>
        ))}
      </div>
      {/* 로그아웃 버튼 */}
      <button
        className="logout-button transition-all duration-200 ease-in-out transform hover:scale-110 "
        onClick={handleLogout}
      >
        <span className="logout-text">&nbsp;LOG OUT</span>
      </button>
    </div>
  );
}
