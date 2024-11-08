import React, { useState, useEffect } from 'react';

import { startSpeechRecognition } from '../../utils/game/SpeechRecognition'; // 음성 인식 함수
import { generateStoryContinuation } from '../../services/StoryService'; // 스토리 진행 함수

export default function GamePlay() {
  const pages = [
    { backgroundImage: '', text: '첫 번째 이야기' },
    { backgroundImage: '/path/to/image2.jpg', text: '두 번째 이야기' },
    { backgroundImage: '/path/to/image3.jpg', text: '세 번째 이야기' },
    { backgroundImage: '/path/to/image4.jpg', text: '사용자 스토리 1' },
    { backgroundImage: '/path/to/image5.jpg', text: '사용자 스토리 2' },
    { backgroundImage: '/path/to/image6.jpg', text: '사용자 스토리 3' },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [blurLevel, setBlurLevel] = useState(0);
  const [textBoxVisible, setTextBoxVisible] = useState(false);
  const [textBoxOpacity, setTextBoxOpacity] = useState(0);
  const [nextTextBoxVisible, setNextTextBoxVisible] = useState(false);

  // 사용자 스토리와 음성 인식 결과
  const [userStory, setUserStory] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [continuation1, setContinuation1] = useState('');
  const [continuation2, setContinuation2] = useState('');

  const startGame = () => {
    setShowModal(true);
  };

  const confirmStart = () => {
    setShowModal(false);
    setGameStarted(true);
    setCurrentPage(0);
    resetEffects();
  };

  const resetEffects = () => {
    setBlurLevel(0);
    setTextBoxVisible(false);
    setTextBoxOpacity(0);
    setNextTextBoxVisible(false);

    const blurInterval = setInterval(() => {
      setBlurLevel((prev) => {
        if (prev < 70) return prev + 1;
        clearInterval(blurInterval);
        return prev;
      });
    }, 30);

    const textBoxTimer = setTimeout(() => {
      setTextBoxVisible(true);
      const fadeInInterval = setInterval(() => {
        setTextBoxOpacity((prev) => {
          if (prev < 1) return prev + 0.05;
          clearInterval(fadeInInterval);
          return prev;
        });
      }, 30);

      return () => clearInterval(fadeInInterval);
    }, 2000);

    return () => {
      clearInterval(blurInterval);
      clearTimeout(textBoxTimer);
    };
  };

  useEffect(() => {
    if (gameStarted) {
      resetEffects();
    }
  }, [currentPage, gameStarted]);

  useEffect(() => {
    if (currentPage >= 3) {
      const nextTextBoxTimer = setTimeout(() => {
        setNextTextBoxVisible(true);
      }, 2000);

      return () => clearTimeout(nextTextBoxTimer);
    }
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      resetEffects();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      resetEffects();
    }
  };

  // 음성 인식 결과를 받아서 스토리 업데이트
  const onVoiceResult = async (transcript: string) => {
    setUserStory(transcript); // 음성 인식 결과를 사용자 스토리에 저장
    await fetchStoryContinuation(transcript); // 사용자 스토리로 연속 이야기와 키워드 생성
  };

  // GPT API를 호출하여 스토리와 키워드 가져오기
  const fetchStoryContinuation = async (userInput: string) => {
    try {
      const { continuation1, continuation2, keywords } =
        await generateStoryContinuation(userInput);
      setContinuation1(continuation1); // 연속 이야기 1
      setContinuation2(continuation2); // 연속 이야기 2
      setKeywords(keywords); // 키워드 업데이트
    } catch (error) {
      console.error('Error fetching story continuation:', error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      {!gameStarted && (
        <div
          className="flex flex-col items-center justify-center h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/path/to/start-image.jpg)' }}
        >
          <h1 className="text-4xl font-bold mb-4 text-center">
            아마도 동화제목이 나올꺼에요
          </h1>
          <button
            onClick={startGame}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            시작하기
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold mb-4 text-white">안내</h2>
            <p className="mb-4 text-white">
              이 게임은 동화를 만들어 나갈꺼에요 <br />
              ~~ 이렇게 진행될꺼야 방법이~~~~ 되겠지~ <br />
              끝나고는 화상채팅으로 이어짐 <br />
              너의 이야기는 저장되고 공유될꺼야~ <br />
              -----------------------------------------
              <br />
              근데 음성인식도 쓰고 gpt도 쓸꺼임,
              <br />
              카메라도 씀 시작전에 알려줬음 주의하셈!
              <br />
              (뭔가 주의표시가 아이콘 추가예정+버튼모양도 교체예정)
            </p>
            <button
              onClick={confirmStart}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
            >
              시작
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg ml-2"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 게임 진행 화면 */}
      {gameStarted && (
        <div className="relative w-full h-full bg-cover bg-center">
          {/* 프로그레스 바 */}
          <div className="fixed top-0 left-4 h-full flex flex-col justify-center items-center space-y-2 px-2 z-10">
            {Array.from({ length: pages.length }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-10 rounded-full transition-colors duration-300 ${
                  index < currentPage + 1
                    ? index < 3
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                    : 'bg-gray-700'
                }`}
              ></div>
            ))}
          </div>

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${pages[currentPage].backgroundImage})`,
              backgroundSize: 'cover',
            }}
          ></div>

          {blurLevel > 0 && (
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundColor: 'black',
                opacity: blurLevel / 100,
              }}
            ></div>
          )}

          {/* 첫 3페이지는 텍스트 표시 */}
          {textBoxVisible && currentPage < 3 && (
            <div className="absolute inset-x-0 bottom-8 flex items-end justify-center">
              <div
                className="bg-white bg-opacity-80 p-6 rounded-lg transition-opacity duration-700"
                style={{
                  opacity: textBoxOpacity,
                }}
              >
                <p className="text-lg md:text-2xl font-semibold text-black text-center">
                  {pages[currentPage].text}
                </p>
              </div>
            </div>
          )}

          {/* 사용자가 음성으로 이야기 작성 후 키워드와 연속된 스토리 보여주기 */}
          {nextTextBoxVisible && currentPage >= 3 && (
            <div className="absolute inset-x-0 bottom-8 flex items-center justify-center">
              <div className="w-full max-w-md p-8 bg-white rounded-lg font-mono flex flex-col space-y-4 items-center shadow-lg">
                <div className="flex flex-col space-y-2 items-center">
                  <div className="flex space-x-2">
                    <div
                      className="text-sm px-3 bg-yellow-200 text-gray-800 rounded-full"
                      style={{ paddingTop: '0.1em', paddingBottom: '0.1rem' }}
                    >
                      Badge
                    </div>
                    <div
                      className="text-sm px-3 bg-red-200 text-red-800 rounded-full"
                      style={{ paddingTop: '0.1em', paddingBottom: '0.1rem' }}
                    >
                      Badge
                    </div>
                    <div
                      className="text-sm px-3 bg-orange-200 text-orange-800 rounded-full"
                      style={{ paddingTop: '0.1em', paddingBottom: '0.1rem' }}
                    >
                      Badge
                    </div>
                  </div>
                </div>

                <div className="flex items-center w-full">
                  <img src={''} alt="Mic icon" className="w-8 h-8 mr-4" />
                  <input
                    className="text-lg w-full px-6 py-4 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-400 hover:shadow-xl hover:border-blue-400 bg-gray-100"
                    placeholder="Enter text here"
                    type="text"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {gameStarted && (
        <>
          {currentPage > 0 && (
            <button
              onClick={prevPage}
              className="fixed bottom-10 left-10 p-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              뒤로가기
            </button>
          )}
          <button
            onClick={nextPage}
            className="fixed bottom-10 right-10 p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            다음
          </button>
        </>
      )}
    </div>
  );
}
