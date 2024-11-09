import React, { useState, useEffect } from 'react';
import { startSpeechRecognition } from '../../utils/game/SpeechRecognition';  // 음성 인식 함수
import { generateStoryContinuation } from '../../services/StoryService'; // front/스토리 진행 함수

export default function GamePlay() {
  const pages = [
    { backgroundImage: '', text: '첫 번째 이야기' },
    { backgroundImage: '/path/to/image2.jpg', text: '두 번째 이야기' },
    { backgroundImage: '/path/to/image3.jpg', text: '세 번째 이야기' },
    { backgroundImage: '/path/to/image4.jpg', text: '' },
    { backgroundImage: '/path/to/image5.jpg', text: '' },
    { backgroundImage: '/path/to/image6.jpg', text: '' },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [blurLevel, setBlurLevel] = useState(0);
  const [textBoxVisible, setTextBoxVisible] = useState(false);
  const [textBoxOpacity, setTextBoxOpacity] = useState(0);
  const [nextTextBoxVisible, setNextTextBoxVisible] = useState(false);

  
  const [keywords, setKeywords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');//userinput상태 업데이트 함수
  


  // 각 페이지별 음성 인식 상태와 스토리 관리
  const [recognizing, setRecognizing] = useState(false);
  const [userStories, setUserStories] = useState({
    4: '',
    5: '',
    6: '',
  });

  const startStopSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (recognizing) {
      recognition.stop();
      setRecognizing(false);
    } else {
      recognition.onstart = () => setRecognizing(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserStories((prev) => ({
          ...prev,
          [currentPage]:
            (prev[currentPage] ? prev[currentPage] + ' ' : '') + transcript,
        }));
      };
      recognition.onend = () => setRecognizing(false);
      recognition.start();
    }
  };


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
      if (recognizing) {
        const recognition = new (window.SpeechRecognition ||
          window.webkitSpeechRecognition)();
        recognition.stop();
        setRecognizing(false);
      }
      setCurrentPage(currentPage + 1);
      resetEffects();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      if (recognizing) {
        const recognition = new (window.SpeechRecognition ||
          window.webkitSpeechRecognition)();
        recognition.stop();
        setRecognizing(false);
      }
      setCurrentPage(currentPage - 1);
      resetEffects();
    }
  };


const handleStopButtonClick = () => {
  // 음성 인식이 끝났다고 가정하고, 정지 버튼을 클릭했을 때 실행할 코드

  stopSpeechRecognition();  // 음성 인식 종료

  // 음성 인식 결과를 바탕으로 이야기 생성
  generateStoryContinuation(userInput).then((story) => {
    setKeywords(story.keywords);  // GPT로 받은 새로운 키워드를 업데이트
    setTextBoxVisible(true);  // 새로운 이야기 박스를 보여줌
    setCurrentPage(currentPage + 1);  // 다음 페이지로 넘어감
  });
};

  const handleStoryChange = (e) => {
    setUserStories((prev) => ({
      ...prev,
      [currentPage]: e.target.value,
    }));
  };


  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      {/* Start Screen */}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold mb-4 text-white">안내</h2>
            <p className="mb-4 text-white">
              이 게임은 동화를 만들어 나갈꺼에요 <br />
              ~~ 이렇게 진행될꺼야 방법이~~~~ 되겠지~ <br />
              끝나고는 화상채팅으로 이어짐 <br />
              너의 이야기는 저장되고 공유될꺼야~ <br />
              ----------------------------------------- <br />
              근데 음성인식도 쓰고 gpt도 쓸꺼임, <br />
              카메라도 씀 시작전에 알려줬음 주의하셈!
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

      {/* Game Content */}
      {gameStarted && (
        <div className="relative w-full h-full bg-cover bg-center">
          {/* Progress Bar */}
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

          {/* Background Image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${pages[currentPage].backgroundImage})`,
              backgroundSize: 'cover',
            }}
          ></div>

          {/* Blur Effect */}
          {blurLevel > 0 && (
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundColor: 'black',
                opacity: blurLevel / 100,
              }}
            ></div>
          )}

          {/* Story Text Box */}
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

          {/* 4페이지 이후(음성인식) 이야기박스 전체 */}
          {nextTextBoxVisible && currentPage >= 3 && (
            <div className="absolute inset-x-0 bottom-5 flex items-center justify-center">
              <div className="w-full h-35 max-w-4xl p-3 bg-white rounded-lg shadow-lg">
                {/* 프롬프트 위에 힌트들 */}
                <div className="w-full flex justify-center mr-10 mb-2">
                  <div className="flex space-x-2">
                  {keywords[0] && (
                    <div
                      className="text-2xl px-4 bg-yellow-200 text-blue-800 rounded-full"
                      style={{ paddingTop: '0.1em', paddingBottom: '0.1rem' }}
                    >

                      {keywords[0]}

                   

                    </div>
                     )}
                    {keywords[1] && (
                    <div
                      className="text-2xl px-4 bg-red-200 text-red-800 rounded-full"
                      style={{ paddingTop: '0.1em', paddingBottom: '0.1rem' }}
                    >

                     {keywords[1]}

                    

                    </div>
                     )}
                    {keywords[2] && (
                    <div
                      className="text-2xl px-4 bg-orange-200 text-orange-800 rounded-full"
                      style={{ paddingTop: '0.1em', paddingBottom: '0.1rem' }}
                    >

                     {keywords[2]}

                  

                    </div>
                      )}
                  </div>
                  <textarea
                  //userInput에는 전체 내용 들어가있으니 여기선 인식된 문장만 변수에 넣고 나중에 userinput에 추가해줘야함
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="mt-4 p-3 w-full h-24 text-lg rounded-md bg-gray-100 focus:outline-none"
                    placeholder="음성인식 되고 있는 문장"
                  />
                  <button
                    onClick={handleStopButtonClick}
                    className="mt-2 p-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                  >
                    음성인식 완료
                  </button>
                  
                </div>

               {/*마이크 버튼이랑 handleStopButtonClick연결해야함(지금은 서로 다른 걸로 되어있음)*/}       
                 <div className="flex items-center w-full">
                  <img src={''} alt="Mic icon" className="w-8 h-8 mr-4" />
                  <input
                    className="text-lg w-full px-6 py-4 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-blue-400 hover:shadow-xl hover:border-blue-400 bg-gray-100"
                    placeholder="위에 나오는 문장 여기로 위치 옮기기"
                    type="text"
                  />


                {/* 음성인식버튼과 프롬프트 */}
                <div className="flex w-full max-w-4xl space-x-4 items-center">
                  {/* 음성인식버튼 */}
                  <button
                    onClick={startStopSpeechRecognition}
                    className="bg-green-500 p-4 rounded-full shadow-lg text-white font-bold mr-1"
                  >
                    {recognizing ? '인식 정지' : '인식 시작'}
                  </button>

                  {/* 프롬프트 내부 */}
                  <div className="w-full p-8 bg-white rounded-lg shadow-lg">
                    <textarea
                      className="w-full h-30 p-4 border-2 border-gray-300 rounded-lg text-black"
                      value={userStories[currentPage] || ''}
                      onChange={handleStoryChange}
                      placeholder="버튼을 누르고 이야기를 말해보세요."
                    />
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      )}

         {/*음성인식, 내용생성 된 후 다음 페이지로 이동 구현 필요*/} 


      {/* Navigation */}

      {gameStarted && (
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
      )}
    </div>
  );
}