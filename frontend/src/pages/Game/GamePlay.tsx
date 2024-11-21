import React, { useState, useEffect } from 'react';
import supabase from '../Game/supabaseClient';

import StartModal from '../../components/game/StartModal';
import ProgressBar from '../../components/game/ProgressBar';
import SpeechRecognition from '../../components/game/SpeechRecognition';
import back from './동화배경5.png';

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
  const [pages, setPages] = useState<StoryPage[]>([]); // 스토리 페이지 데이터 상태
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [gameStarted, setGameStarted] = useState<boolean>(false); // 게임 시작 여부
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 표시 상태
  const [blurLevel, setBlurLevel] = useState<number>(0); // 블러 효과
  const [textBoxOpacity, setTextBoxOpacity] = useState<number>(0); // 텍스트 투명도
  const [showImageOnly, setShowImageOnly] = useState<boolean>(false); // 이미지만 보기

  // 각 페이지별 상태
  const [pageTexts, setPageTexts] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]); // 각 페이지의 최종 텍스트
  const [promptTexts, setPromptTexts] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]); // 각 페이지의 프롬프터 상태
  const [gptButtonDisabled, setGptButtonDisabled] = useState<boolean>(false); // GPT 버튼 비활성화

  // 이야기 데이터를 가져오는 함수
  useEffect(() => {
    const fetchStoryData = async () => {
      const { data, error } = await supabase
        .from('story')
        .select('story_id, story_title, cover_pic, intro1, intro2, intro3')
        .order('story_id', { ascending: true });

      if (error) {
        console.error('Error fetching story data:', error);
      } else if (data) {
        setPages(data); // 데이터 저장
        setPageTexts([
          data[1]?.intro1 || '',
          data[2]?.intro2 || '',
          data[3]?.intro3 || '',
          '', // 4페이지는 사용자 입력으로 채움
          '', // 5페이지
          '', // 6페이지
        ]);
      }
    };

    fetchStoryData();
  }, []);

  // 음성 인식 결과 처리
  const handleSpeechResult = (transcript: string) => {
    setPromptTexts((prev) => {
      const updatedPrompts = [...prev];
      updatedPrompts[currentPage] = transcript;
      return updatedPrompts;
    });
    setPageTexts((prev) => {
      const updatedTexts = [...prev];
      updatedTexts[currentPage] =
        (updatedTexts[currentPage] || '') + ' ' + transcript;
      return updatedTexts;
    });
  };

  // GPT 결과 처리
  const fetchGptResult = async () => {
    setGptButtonDisabled(true);
    try {
      const response = await generateStoryContinuation(
        promptTexts[currentPage],
      );
      const gptResponse = response.continuation;

      setPageTexts((prev) => {
        const updatedTexts = [...prev];
        updatedTexts[currentPage] =
          (updatedTexts[currentPage] || '') + '\n' + gptResponse; // 줄바꿈 추가
        return updatedTexts;
      });
    } catch (error) {
      console.error(
        `Error fetching GPT result for page ${currentPage}:`,
        error,
      );
    } finally {
      setGptButtonDisabled(false);
    }
  };

  // 페이지 전환 시 프롬프터 초기화
  const nextPage = () => {
    if (currentPage < pages.length + 2) {
      setCurrentPage((prev) => prev + 1);
      setPromptTexts((prev) => {
        const updatedPrompts = [...prev];
        updatedPrompts[currentPage + 1] = ''; // 다음 페이지 프롬프터 초기화
        return updatedPrompts;
      });
      setShowImageOnly(false);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setShowImageOnly(false);
    }
  };

  const openModal = () => setShowModal(true);
  const confirmStart = () => {
    setShowModal(false);
    setGameStarted(true);
  };
  const closeModal = () => setShowModal(false);

  const applyEffects = () => {
    setBlurLevel(0);
    setTextBoxOpacity(0);

    setTimeout(() => {
      const blurInterval = setInterval(() => {
        setBlurLevel((prev) => {
          if (prev < 70) return prev + 1;
          clearInterval(blurInterval);
          return prev;
        });
      }, 30);

      const textFadeInterval = setInterval(() => {
        setTextBoxOpacity((prev) => {
          if (prev < 1) return prev + 0.05;
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
              filter: `blur(${blurLevel}px)`,
            }}
          >
            <img
              src={pages[currentPage - 1]?.cover_pic || ''}
              alt="Cover Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 텍스트 영역 */}
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
                  <p
                    className="text-black text-2xl font-bold text-center break-words leading-relaxed"
                    style={{ whiteSpace: 'pre-line' }} // 줄바꿈 처리
                  >
                    {pageTexts[currentPage]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 음성 인식 및 GPT */}
          {currentPage >= 4 && (
            <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-4">
              <SpeechRecognition
                language="ko-KR"
                onResult={handleSpeechResult}
              />
              <textarea
                value={promptTexts[currentPage]}
                onChange={(e) => {
                  const newPromptTexts = [...promptTexts];
                  newPromptTexts[currentPage] = e.target.value;
                  setPromptTexts(newPromptTexts);
                }}
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
            onClick={() => setShowImageOnly((prev) => !prev)}
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
    </div>
  );
}
