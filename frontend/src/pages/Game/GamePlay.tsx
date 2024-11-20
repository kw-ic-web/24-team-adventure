import React, { useState, useEffect } from 'react';
import supabase from '../Game/supabaseClient';

import StartModal from '../../components/game/StartModal';
import ProgressBar from '../../components/game/ProgressBar';
import SpeechRecognition from '../../components/game/SpeechRecognition';
import back from './동화배경5.png';

interface StoryPage {
  story_id: number;
  story_title: string;
  cover_pic: string;
  intro1: string;
  intro2: string;
  intro3: string;
  intro_pic1: string;
  intro_pic2: string;
  intro_pic3: string;
}

export default function GamePlay(): JSX.Element {
  const [pages, setPages] = useState<StoryPage[]>([]); // 스토리 페이지 데이터 상태 관리
  const [currentPage, setCurrentPage] = useState<number>(0); // 현재 페이지 관리
  const [gameStarted, setGameStarted] = useState<boolean>(false); // 게임 시작 여부 상태
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 표시 상태
  const [blurLevel, setBlurLevel] = useState<number>(0); // 블러 효과 상태
  const [textBoxVisible, setTextBoxVisible] = useState<boolean>(false); // 텍스트 박스 표시 여부
  const [textOpacity, setTextOpacity] = useState<number>(0); // 텍스트의 투명도 상태
  const [showImageOnly, setShowImageOnly] = useState<boolean>(false); // 이미지만 보기 여부
  const [userText, setUserText] = useState<string>(''); // 음성 인식 텍스트 상태

  // Supabase에서 이야기 데이터를 가져오는 함수
  useEffect(() => {
    const fetchStoryData = async () => {
      const { data, error } = await supabase
        .from('story') // 'story' 테이블에서 데이터 조회
        .select(
          'story_id, story_title, cover_pic, intro1, intro2, intro3, intro_pic1, intro_pic2, intro_pic3', // 필요한 컬럼 선택
        )
        .order('story_id', { ascending: true }); // story_id 순서대로 정렬

      if (error) {
        console.error('Error fetching story data:', error);
      } else if (data) {
        console.log('Story Data:', data); // 데이터 확인
        setPages(data); // 가져온 데이터를 상태에 저장
      }
    };

    fetchStoryData(); // 데이터 가져오기 실행
  }, []);

  // 음성 인식 결과 처리 함수
  const handleSpeechResult = (transcript: string) => {
    setUserText((prev) => (prev ? prev + ' ' : '') + transcript);
  };

  const openModal = () => setShowModal(true); // 모달 열기
  const confirmStart = () => {
    setShowModal(false);
    setGameStarted(true); // 게임 시작
  };
  const closeModal = () => setShowModal(false); // 모달 닫기

  // 블러 효과 적용 함수
  const applyBlurEffect = () => {
    setBlurLevel(0);
    setTextBoxVisible(false);
    setTextOpacity(0);

    setTimeout(() => {
      const blurInterval = setInterval(() => {
        setBlurLevel((prev) => {
          if (prev < 70) return prev + 1;
          clearInterval(blurInterval);
          setTextBoxVisible(true);
          fadeInTextBox();
          return prev;
        });
      }, 30);
    }, 1000);
  };

  // 텍스트 박스 페이드 인 효과 함수
  const fadeInTextBox = () => {
    const fadeInInterval = setInterval(() => {
      setTextOpacity((prev) => {
        if (prev < 1) return prev + 0.05;
        clearInterval(fadeInInterval);
        return prev;
      });
    }, 50);
  };

  // 이미지 보이기/숨기기 토글 함수
  const toggleImageVisibility = () => setShowImageOnly((prev) => !prev);

  // 페이지 전환
  useEffect(() => {
    if (gameStarted) {
      applyBlurEffect(); // 게임 시작 시 블러 효과 적용
    }
  }, [currentPage, gameStarted]);

  // 다음 페이지로 이동
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setShowImageOnly(false);
      setCurrentPage(currentPage + 1);
    }
  };

  // 이전 페이지로 이동
  const prevPage = () => {
    if (currentPage > 0) {
      setShowImageOnly(false);
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      {!gameStarted && (
        <div
          className="flex flex-col items-center justify-center h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/start-image.jpg)' }}
        >
          <h1 className="text-4xl font-bold mb-4">동화 제목</h1>
          <button
            onClick={openModal}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full"
          >
            시작하기
          </button>
        </div>
      )}

      {showModal && (
        <StartModal
          isOpen={showModal}
          title="안내"
          message="게임을 시작하시겠습니까?"
          onConfirm={confirmStart}
          onClose={closeModal}
        />
      )}

      {gameStarted && pages.length > 0 && (
        <div className="relative w-full h-full">
          <ProgressBar currentPage={currentPage} totalPages={pages.length} />

          {/* 이미지가 정상적으로 보이도록 수정 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* 이미지 로드가 되지 않으면 대체 텍스트와 함께 확인 */}
            <img
              src={
                'https://dlocvyyvttlltaybmexy.supabase.co/storage/v1/object/sign/pic/New_Wish_1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwaWMvTmV3X1dpc2hfMS5qcGciLCJpYXQiOjE3MzE5MjcyNjcsImV4cCI6MTc2MzQ2MzI2N30.cZM0jHG0lul-X1f5UpDeru8IuNXeiJlprllR0QvX-Kw&t=2024-11-18T10%3A54%3A27.944Z'
              }
              alt="Cover Image"
              className="w-full h-full object-cover"
              onError={() => console.log('이미지 로드 오류')}
            />
          </div>

          {!showImageOnly && blurLevel > 0 && (
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundColor: 'black',
                opacity: blurLevel / 100,
              }}
            />
          )}

          {textBoxVisible && !showImageOnly && (
            <div
              className="absolute inset-x-0 bottom-0 flex justify-center mb-10"
              style={{ opacity: textOpacity, transition: 'opacity 0.5s' }}
            >
              <div className="relative w-4/5 max-w-3xl mx-auto rounded-xl mt-10 overflow-hidden">
                <img
                  src={back}
                  alt="글자 배경"
                  className="w-full h-auto object-cover rounded-xl"
                  style={{ opacity: 0.9 }}
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <p className="text-black text-2xl font-bold text-center break-words leading-relaxed">
                    {pages[currentPage]?.intro1}
                  </p>
                </div>
              </div>
            </div>
          )}

          {gameStarted && currentPage >= 3 && textBoxVisible && (
            <div className="absolute inset-x-0 bottom-5 flex items-center justify-center">
              <SpeechRecognition
                language="ko-KR"
                onResult={handleSpeechResult}
              />
              <textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg text-black ml-4"
                placeholder="버튼을 누르고 이야기를 말해보세요."
              />
            </div>
          )}

          <button
            onClick={toggleImageVisibility}
            className="absolute top-4 right-4 p-2 bg-blue-600 text-white font-bold rounded-full z-10"
          >
            {showImageOnly ? '글 보기' : '이미지 보기'}
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
            <button
              onClick={prevPage}
              className="p-2 bg-gray-600 text-white font-bold rounded-full"
            >
              이전
            </button>
            <button
              onClick={nextPage}
              className="p-2 bg-blue-600 text-white font-bold rounded-full"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
