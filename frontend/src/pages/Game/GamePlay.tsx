import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StartModal from '../../components/game/StartModal';
import ProgressBar from '../../components/game/ProgressBar';
import SpeechRecognition from '../../components/game/SpeechRecognition';
import back from './동화배경3.jpg';
import axiosInstance from '../../apis/axiosInstance';
import { generateStoryContinuation } from '../../services/StoryService';
import { generateStoryKeywords } from '../../services/StoryService';
import './GamePlay.css';

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
  const { story_id } = useParams<{ story_id: string }>(); // URL에서 story_id 추출
  const [pages, setPages] = useState<StoryPage[]>([]); // 스토리 페이지 데이터 상태
  const [coverImage, setCoverImage] = useState<string>(''); // 이미지 URL 상태
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [gameStarted, setGameStarted] = useState<boolean>(false); // 게임 시작 여부
  const [showModal, setShowModal] = useState<boolean>(false); // 모달 표시 상태
  const [blurLevel, setBlurLevel] = useState<number>(0); // 블러 효과
  const [textBoxOpacity, setTextBoxOpacity] = useState<number>(0); // 텍스트 투명도
  const [showImageOnly, setShowImageOnly] = useState<boolean>(false); // 이미지만 보기
  const [keywords, setKeywords] = useState<string[]>([]); // 키워드 상태 추가

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
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태
  const keyword_generated_bygpt = async () => {
    try {
      const promptText = promptTexts[currentPage - 1];
      if (!promptText) {
        alert('프롬프터에 내용을 입력해주세요.');
        return;
      }

      // StoryService에서 제공하는 generateStoryKeywords 호출
      const response = await generateStoryKeywords(promptText);
      if (response && response.keywords) {
        setKeywords(response.keywords); // 키워드 상태 업데이트
      } else {
        console.warn('No keywords received from API.');
        setKeywords([]);
      }
    } catch (error) {
      console.error('Error generating keywords:', error);
      setKeywords([]);
    }
  };
  // 이야기 데이터를 가져오는 함수
  useEffect(() => {
    const fetchStoryData = async () => {
      setIsLoading(true); // 로딩 시작
      try {
        const response = await fetch(
          `http://localhost:3000/gameplay/${story_id}`,
        ); // API 호출 수정
        const result = await response.json();

        if (result && result.length > 0) {
          const storyData = result[0];
          setPages([
            {
              story_id: storyData.story_id,
              story_title: storyData.story_title,
              cover_pic: storyData.cover_pic,
              intro_pic1: storyData.intro_pic1,
              intro_pic2: storyData.intro_pic2,
              intro_pic3: storyData.intro_pic3,
              intro1: storyData.intro1,
              intro2: storyData.intro2,
              intro3: storyData.intro3,
            },
          ]);

          // 초기 페이지 데이터 설정
          setPageTexts([
            storyData.intro1 || '',
            storyData.intro2 || '',
            storyData.intro3 || '',
            '', // 4~6 페이지는 빈값으로 초기화
            '',
            '',
          ]);
          setCurrentPage(1); // 초기 페이지 설정
        } else {
          console.error('No story data found.');
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchStoryData();
  }, [story_id]);

  // GPT와 음성 인식을 포함한 페이지 데이터 관리
  const handleSpeechResult = (transcript: string) => {
    setPromptTexts((prev) => {
      const updatedPrompts = [...prev];
      updatedPrompts[currentPage - 1] = transcript;
      return updatedPrompts;
    });
    setPageTexts((prev) => {
      const updatedTexts = [...prev];
      updatedTexts[currentPage - 1] =
        (updatedTexts[currentPage - 1] || '') + ' ' + transcript;
      return updatedTexts;
    });
  };

  const fetchGptResult = async () => {
    setGptButtonDisabled(true);
    setIsLoading(true); // 로딩 시작
    try {
      const response = await generateStoryContinuation(
        promptTexts[currentPage - 1],
      );
      const gptResponse = response.continuation;

      setPageTexts((prev) => {
        const updatedTexts = [...prev];
        updatedTexts[currentPage - 1] =
          (updatedTexts[currentPage - 1] || '') + '\n' + gptResponse; // 줄바꿈 추가
        return updatedTexts;
      });
    } catch (error) {
      console.error(
        `Error fetching GPT result for page ${currentPage}:`,
        error,
      );
    } finally {
      setGptButtonDisabled(false);
      setIsLoading(false); // 로딩 종료
    }
  };

  const changePage = (direction: 'next' | 'prev') => {
    setShowImageOnly(false);

    setCurrentPage((prev) => {
      if (direction === 'next' && prev < 6) {
        return prev + 1;
      } else if (direction === 'prev' && prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  const nextPage = () => changePage('next');
  const prevPage = () => changePage('prev');

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
          if (prev < 5) return prev + 1;
          clearInterval(blurInterval);
          return prev;
        });
      }, 20);

      const textFadeInterval = setInterval(() => {
        setTextBoxOpacity((prev) => {
          if (prev < 1) return prev + 0.5;
          clearInterval(textFadeInterval);
          return prev;
        });
      }, 30);
    }, 1500);
  };
  useEffect(() => {
    console.log('Cover Pic URL:', pages[0]?.cover_pic);
  }, [pages]);
  useEffect(() => {
    if (gameStarted) {
      applyEffects();
    }
  }, [currentPage, gameStarted]);

  //cover이미지 불러오기
  useEffect(() => {
    console.log('Pages:', pages); // 페이지 데이터 확인
    console.log('Cover Pic:', pages[0]?.cover_pic); // cover_pic 경로 확인
  }, [pages]);
  useEffect(() => {
    const fetchCoverImage = async () => {
      try {
        if (pages.length > 0 && pages[0]?.cover_pic) {
          const imageUrl = encodeURI(pages[0].cover_pic);
          console.log('Generated Image URL:', imageUrl); // 디버깅 로그
          setCoverImage(imageUrl);
        } else {
          console.warn('No cover_pic found. Using default image.');
          setCoverImage('/images/default-cover.jpg'); // 기본 이미지 설정
        }
      } catch (error) {
        console.error('Error generating cover image URL:', error);
        setCoverImage('/images/default-cover.jpg'); // 오류 시 기본 이미지 설정
      }
    };

    if (pages.length > 0 && pages[0]?.cover_pic) {
      fetchCoverImage();
    }
  }, [pages]);
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      {!gameStarted && (
        <div
          className="flex flex-col items-center justify-center h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${coverImage || '/images/default-cover.jpg'})`,
          }}
        >
          <h1 className="story-title">
            {pages[0]?.story_title || '동화 제목'}
          </h1>
          <button onClick={openModal} className="start-button">
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

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white">GPT로 처리 중...</p>
          </div>
        </div>
      )}

      {gameStarted && pages.length > 0 && (
        <div className="relative w-full h-full">
          <ProgressBar
            currentPage={currentPage - 1}
            totalPages={6} // 전체 페이지 6개
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
              src={
                currentPage === 1
                  ? pages[0]?.intro_pic1
                  : currentPage === 2
                    ? pages[0]?.intro_pic2
                    : currentPage === 3 || currentPage === 4 // 3, 4페이지 모두 intro_pic3 표시
                      ? pages[0]?.intro_pic3
                      : pages[0]?.cover_pic
              }
              alt="Page Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 텍스트 영역 */}
          {!showImageOnly && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: textBoxOpacity,
                transition: 'opacity 0.5s',
              }}
            >
              <div
                className="relative w-11/12 max-w-5xl mx-auto rounded-xl mt-10 overflow-hidden animate-slide-up"
                style={{
                  height: '85%', // 높이를 화면의 85%로 설정
                  borderRadius: '10px 10px 10px 10px', // 상단 둥글고 하단 각지게 설정
                  background: 'rgba(255, 248, 225, 0.85)', // 투명한 배경
                  backdropFilter: 'blur(10px)', // 배경 블러 효과
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // 강한 그림자 효과
                }}
              >
                <img
                  src={back}
                  alt="글자 배경"
                  className="w-full h-full object-cover rounded-xl"
                  style={{ opacity: 0.7 }}
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <p
                    className="text-black text-2xl font-bold text-center break-words leading-relaxed"
                    style={{
                      lineHeight: '1.8', // 줄 간격을 넉넉하게 설정
                      letterSpacing: '0.05em', // 글자 간 간격 추가
                      whiteSpace: 'pre-line', // 줄바꿈 처리
                      textAlign: 'left', // 변경: 왼쪽 정렬
                    }}
                  >
                    {pageTexts[currentPage - 1]}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 음성 인식 및 GPT */}
          {currentPage >= 4 && (
            <div className="fixed inset-x-0 bottom-0 px-3 pb-3">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 overflow-hidden">
                {/* 키워드 부분 */}
                <div className="px-3 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex-grow">
                      {keywords.length === 0 ? (
                        <p className="text-gray-600 font-semibold text-base pl-[230px]">
                          다음 키워드를 활용해서 이야기를 만들어도 좋아요!
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full border border-blue-200"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={keyword_generated_bygpt}
                      className="px-3.5 py-1.5 translate-x-[-13px] bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white text-base font-bold rounded-lg shadow-lg hover:from-green-500 hover:via-green-600 hover:to-green-700 transition-all duration-500 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
                    >
                      ✨힌트
                    </button>
                  </div>
                </div>

                {/* 말하기 프롬프트부분*/}
                <div className="px-6 py-4 flex items-center space-x-4">
                  <SpeechRecognition
                    language="ko-KR"
                    onResult={handleSpeechResult}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  />
                  <textarea
                    value={promptTexts[currentPage - 1]}
                    onChange={(e) => {
                      const updatedPrompt = e.target.value;

                      setPromptTexts((prev) => {
                        const updatedPrompts = [...prev];
                        updatedPrompts[currentPage - 1] = updatedPrompt;
                        return updatedPrompts;
                      });

                      setPageTexts((prev) => {
                        const updatedTexts = [...prev];
                        updatedTexts[currentPage - 1] = updatedPrompt;
                        return updatedTexts;
                      });
                    }}
                    className="flex-grow p-3 text-gray-700 rounded-xl border border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300/50 bg-gray-50 text-lg transition-all duration-300 ease-in-out"
                    placeholder="여기에 이야기를 입력하거나 음성 입력 버튼을 사용해보세요."
                  />
                  <button
                    onClick={fetchGptResult}
                    disabled={gptButtonDisabled}
                    className={`px-5 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white text-base font-bold rounded-lg shadow-lg ${
                      gptButtonDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-105'
                    } transition-all duration-500 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2`}
                  >
                    <span className="block">이야기</span>
                    <span className="block">만들기</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 전환 버튼 */}
          <button
            onClick={() => {
              setShowImageOnly((prev) => {
                if (!prev) {
                  // 이미지 보기 상태
                  setBlurLevel(0); // 블러 해제
                  setTextBoxOpacity(0); // 텍스트 박스 숨김
                } else {
                  // 글 보기 상태
                  setTextBoxOpacity(1); // 텍스트 박스를 즉시 표시
                  const blurInterval = setInterval(() => {
                    setBlurLevel((prev) => {
                      if (prev < 2) return prev + 1; // 블러 점진적 증가
                      clearInterval(blurInterval);
                      return prev;
                    });
                  }, 20); // 블러 증가 속도
                }
                return !prev;
              });
            }}
            className="next-button accent-button absolute top-4 right-4 z-button-container10"
          >
            {showImageOnly ? '글 보기' : '이미지 보기'}
          </button>

          {/* 이전/다음 버튼 */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
            <button onClick={prevPage} className="next-button">
              이전
            </button>
            <button onClick={nextPage} className="next-button">
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
