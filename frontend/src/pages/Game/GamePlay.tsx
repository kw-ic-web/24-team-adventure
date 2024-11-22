import React, { useState, useEffect } from 'react';


import StartModal from '../../components/game/StartModal';
import ProgressBar from '../../components/game/ProgressBar';
import SpeechRecognition from '../../components/game/SpeechRecognition';
import back from './동화배경5.png';

import BigBox from '../../components/ui/BigBox.tsx';
import Background from '../../components/ui/Background';
import HomeBtnforBigbox from '../../components/ui/HomeBtnforBigbox';
import HeaderLogo from '../../components/ui/HeaderLogo';

import { generateStoryContinuation } from '../../services/StoryService';

interface StoryPage {
  story_id: number;
  story_title: string;
  cover_pic: string;
  intro1: string;
  intro2: string;
  intro3: string;
}

export default function GamePlay(): JSX.Element {
  const [pages, setPages] = useState<StoryPage[]>([]); // 스토리 페이지 데이터 상태 관리
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 관리 (1부터 시작)
  const [gameStarted, setGameStarted] = useState<boolean>(false); // 게임 시작 여부 상태
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 표시 상태
  const [blurLevel, setBlurLevel] = useState<number>(0); // 블러 효과 상태 (사진에만 적용)
  const [textBoxOpacity, setTextBoxOpacity] = useState<number>(0); // 글 배경 및 텍스트의 투명도
  const [showImageOnly, setShowImageOnly] = useState<boolean>(false); // 이미지만 보기 여부

  // 각 페이지별 상태
  const [page4Text, setPage4Text] = useState<string>(''); // 4페이지 음성 인식 텍스트
  const [page4GptText, setPage4GptText] = useState<string>(''); // 4페이지 GPT 결과
  const [page5Text, setPage5Text] = useState<string>(''); // 5페이지 음성 인식 텍스트
  const [page5GptText, setPage5GptText] = useState<string>(''); // 5페이지 GPT 결과
  const [page6Text, setPage6Text] = useState<string>(''); // 6페이지 음성 인식 텍스트
  const [page6GptText, setPage6GptText] = useState<string>(''); // 6페이지 GPT 결과

  const [gptButtonDisabled, setGptButtonDisabled] = useState<boolean>(false); // GPT 버튼 비활성화 상태

  // Supabase에서 이야기 데이터를 가져오는 함수
  useEffect(() => {
    const fetchStoryData = async () => {
      const { data, error } = await supabase
        .from('story')
        .select('story_id, story_title, cover_pic, intro1, intro2, intro3')
        .order('story_id', { ascending: true });

      if (error) {
        console.error('Error fetching story data:', error);
      } else if (data) {
        setPages(data); // 가져온 데이터를 상태에 저장
      }
    };

    fetchStoryData();
  }, []);

  const handleSpeechResult = (transcript: string) => {
    if (currentPage === 4) {
      setPage4Text((prev) => (prev ? prev + ' ' : '') + transcript);
    } else if (currentPage === 5) {
      setPage5Text((prev) => (prev ? prev + ' ' : '') + transcript);
    } else if (currentPage === 6) {
      setPage6Text((prev) => (prev ? prev + ' ' : '') + transcript);
    }
  };

  const fetchGptResult = async () => {
    setGptButtonDisabled(true); // GPT 버튼 비활성화
    try {
      let gptResponse = '';
      if (currentPage === 4) {
        const response = await generateStoryContinuation(page4Text);
        gptResponse = response.continuation;
        setPage4GptText(gptResponse);
      } else if (currentPage === 5) {
        const response = await generateStoryContinuation(page5Text);
        gptResponse = response.continuation;
        setPage5GptText(gptResponse);
      } else if (currentPage === 6) {
        const response = await generateStoryContinuation(page6Text);
        gptResponse = response.continuation;
        setPage6GptText(gptResponse);
      }
    } catch (error) {
      console.error('Error fetching GPT result:', error);
    } finally {
      setGptButtonDisabled(false); // GPT 버튼 활성화
    }
  };

  const openModal = () => setShowModal(true); // 모달 열기
  const confirmStart = () => {
    setShowModal(false);
    setGameStarted(true); // 게임 시작
  };
  const closeModal = () => setShowModal(false); // 모달 닫기

  const applyEffects = () => {
    // 사진 블러 효과
    setBlurLevel(0);
    setTextBoxOpacity(0); // 글 배경 및 텍스트는 투명도 0부터 시작

    setTimeout(() => {
      const blurInterval = setInterval(() => {
        setBlurLevel((prev) => {
          if (prev < 70) return prev + 1; // 블러 효과 증가
          clearInterval(blurInterval);
          return prev;
        });
      }, 30);

      // 글 배경 및 텍스트 페이드 인 효과
      const textFadeInterval = setInterval(() => {
        setTextBoxOpacity((prev) => {
          if (prev < 1) return prev + 0.05; // 글 배경 및 텍스트 투명도 증가
          clearInterval(textFadeInterval);
          return prev;
        });
      }, 50);
    }, 1000);
  };

  useEffect(() => {
    if (gameStarted) {
      applyEffects();
    }
  }, [currentPage, gameStarted]);

  const nextPage = () => {
    if (currentPage < pages.length + 2) {
      setShowImageOnly(false);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setShowImageOnly(false);
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleImageVisibility = () => setShowImageOnly((prev) => !prev);

  return (
    <div > <Background />
    <div><HeaderLogo/></div>

    <BigBox>
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
          <ProgressBar
            currentPage={currentPage - 1}
            totalPages={pages.length + 2}
          />

          {/* 이미지 영역 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `blur(${blurLevel}px)`, // 블러 효과 적용
            }}
          >
            <img
              src={pages[currentPage - 1]?.cover_pic || ''}
              alt="Cover Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 글자 배경 및 텍스트 */}
          {!showImageOnly && (
            <div
              className="absolute inset-x-0 bottom-0 flex justify-center mb-10"
              style={{
                opacity: textBoxOpacity,
                transition: 'opacity 0.5s',
              }}
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
                    {currentPage <= 3
                      ? pages[currentPage - 1]?.intro1
                      : currentPage === 4
                        ? page4Text || page4GptText
                        : currentPage === 5
                          ? page5Text || page5GptText
                          : page6Text || page6GptText}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 음성 인식 및 프롬프터 */}
          {currentPage >= 4 && (
            <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-4">
              <SpeechRecognition
                language="ko-KR"
                onResult={handleSpeechResult}
              />
              <textarea
                value={
                  currentPage === 4
                    ? page4Text
                    : currentPage === 5
                      ? page5Text
                      : page6Text
                }
                onChange={(e) =>
                  currentPage === 4
                    ? setPage4Text(e.target.value)
                    : currentPage === 5
                      ? setPage5Text(e.target.value)
                      : setPage6Text(e.target.value)
                }
                className="w-3/5 p-4 border-2 border-gray-300 rounded-lg text-black"
                placeholder="버튼을 눌러 이야기를 말해보세요."
              />
              <button
                onClick={fetchGptResult}
                disabled={gptButtonDisabled}
                className={`p-4 rounded-full ${
                  gptButtonDisabled
                    ? 'bg-gray-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {gptButtonDisabled ? 'GPT 처리 중...' : 'GPT로 보내기'}
              </button>
            </div>
          )}

          {/* 전환 버튼 */}
          <button
            onClick={toggleImageVisibility}
            className="absolute top-4 right-4 p-4 bg-blue-600 text-white rounded-full z-10"
          >
            {showImageOnly ? '글 보기' : '이미지 보기'}
          </button>

          {/* 이전/다음 버튼 */}
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
      </BigBox>
      <div><HomeBtnforBigbox/></div>
    </div>
  );
}
