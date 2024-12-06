{
  /*임시파일입니다 사용불가능*/
}
import React, { useState, useEffect } from 'react';

// 타입 정의
interface Page {
  backgroundImage: string;
  text: string;
}

interface UserStories {
  [key: number]: string;
}

interface Story {
  keywords: string[];
}

// 전역 타입 선언
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function GamePlay(): JSX.Element {
  const pages: Page[] = [
    {
      backgroundImage:
        'url("https://team05.server.duckdns.org/images/Lia\'s Journey_1.jpg")',
      text: '첫 번째 이야기',
    },
    { backgroundImage: '', text: '두 번째 이야기' },
    { backgroundImage: '/path/to/image3.jpg', text: '세 번째 이야기' },
    { backgroundImage: '/path/to/image4.jpg', text: '' },
    { backgroundImage: '/path/to/image5.jpg', text: '' },
    { backgroundImage: '/path/to/image6.jpg', text: '' },
  ];

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [blurLevel, setBlurLevel] = useState<number>(0);
  const [textBoxVisible, setTextBoxVisible] = useState<boolean>(false);
  const [textBoxOpacity, setTextBoxOpacity] = useState<number>(0);
  const [nextTextBoxVisible, setNextTextBoxVisible] = useState<boolean>(false);

  const [keywords, setKeywords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  const [recognizing, setRecognizing] = useState<boolean>(false);
  const [userStories, setUserStories] = useState<UserStories>({
    4: '',
    5: '',
    6: '',
  });

  const stopSpeechRecognition = () => {
    if (recognizing) {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.stop();
      setRecognizing(false);
    }
  };

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
      recognition.onresult = (event: SpeechRecognitionEvent) => {
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

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserStories((prev) => ({
      ...prev,
      [currentPage]: e.target.value,
    }));
  };

  ////////////////////////////////////////////////
  /*
 userInput: 초기 내용 generated: 초기내용
 1. 3페이지 들어가면, generated으로 키워드 생성 *전체 내용으로
  -generated를 <gpt키워드생성함수>에 넣어서 키워드 받음

 2. 처음부터 음성인식 추가한 것까지 gpt에 던져서 다음 내용 생성 *전체 내용으로
 -음성인식한 내용 generated에 (*)대입, userInput에 주가. 
 -userInput을 <gpt내용생성함수> 한테 던져서 내용생성
 -<gpt내용생성함수>가 생성내용 continuation 반환
 -continuation-> generated에 추가, userInput에 추가

 3. 음성인식 끝나면 방금 음성인식한 내용+생성내용으로 이미지 생성 *현재 생성 내용으로
 -generated를 <gpt이미지생성함수>에 넣어서 다음 이미지 한장 생성

 4. 생성한 이미지랑 글 보여주고
 -continuation 글 보여줌
 -생성 이미지 보여줌

 5. 그 생성된 내용에서 키워드 생성 *현재 생성 내용으로
 -generated를 <gpt키워드생성함수>에 넣어서 키워드 받음

 (반복*3)
 
 7. 마지막에 지금까지 내용userInput이랑 맨 마지막 이미지 dp에 저장


*/
  /*
  const handleStopButtonClick = async () => {
    //음성인식 중지 버튼 클릭 하면
    stopSpeechRecognition();//음성인식 끝나면

    try {
      const story = await generateStoryContinuation(userInput);
      setKeywords(story.keywords);//새로운 키워드 업데이트
      setTextBoxVisible(true);//새로운 이야기 박스
      setCurrentPage(currentPage + 1);//다음 페이지로
    } catch (error) {
      console.error('Story generation failed:', error);
    }
  };
  */
  useEffect(() => {
    console.log('현재 userInput:', userInput);
  }, [userInput]); // userInput이 변경될 때마다 이 코드가 실행됨

  const handleStopButtonClick = async () => {
    console.log('음성 인식 종료 중...'); // 음성 인식 종료 단계 확인
    stopSpeechRecognition(); // 음성 인식 종료

    setUserInput('백설공주가 살았는데 여왕과 사이가 좋았습니다.');
    console.log('현재 userInput:', userInput);

    // userInput이 비어있으면 경고를 띄워주기
    /*if (!userInput.trim()) {
      console.warn("사용자가 입력을 하지 않았습니다.");
      return;
    }*/
    try {
      console.log('스토리 생성 요청 중...'); // 스토리 생성 요청 단계 확인
      // generateStoryContinuation 함수 호출하여 스토리 내용 생성
      const storyData = await generateStoryContinuation(userInput);

      console.log('스토리 생성 완료:', storyData); // 스토리 생성 완료 후 확인
      const continuation = storyData.continuation; // 생성된 내용

      console.log('생성된 내용:', continuation); // 생성된 내용 확인

      // 생성된 내용을 처리할 작업
      setUserStories((prev) => ({
        ...prev,
        [currentPage]:
          (prev[currentPage] ? prev[currentPage] + ' ' : '') + continuation,
      }));

      console.log('스토리 업데이트 완료'); // 스토리 업데이트 완료 확인

      // 페이지 업데이트
      setTextBoxVisible(true);
      setCurrentPage(currentPage + 1); // 다음 페이지로 이동

      console.log('페이지 업데이트 완료'); // 페이지 업데이트 완료 확인
    } catch (error) {
      console.error('스토리 생성 중 에러 발생:', error); // 에러 발생 시 확인
    }
  };

  //////////////////////////////////////////////////////////////////////

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
    }, 2000);

    return () => {
      clearInterval(blurInterval);
      clearTimeout(textBoxTimer);
    };
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      stopSpeechRecognition();
      setCurrentPage(currentPage + 1);
      resetEffects();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      stopSpeechRecognition();
      setCurrentPage(currentPage - 1);
      resetEffects();
    }
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
              게임 진행 방법 설명... <br />
              끝나고는 화상채팅으로 이어짐 <br />
              너의 이야기는 저장되고 공유될꺼야
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

      {gameStarted && (
        <div className="relative w-full h-full bg-cover bg-center">
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
              />
            ))}
          </div>

          <div
            className="absolute inset-0"
            style={{
              //backgroundImage: `url(${pages[currentPage].backgroundImage})`,
              backgroundSize: 'cover',
            }}
          />

          {blurLevel > 0 && (
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundColor: 'black',
                opacity: blurLevel / 100,
              }}
            />
          )}

          {textBoxVisible && currentPage < 3 && (
            <div className="absolute inset-x-0 bottom-8 flex items-end justify-center">
              <div
                className="bg-white bg-opacity-80 p-6 rounded-lg transition-opacity duration-700"
                style={{ opacity: textBoxOpacity }}
              >
                <p className="text-lg md:text-2xl font-semibold text-black text-center">
                  {pages[currentPage].text}
                </p>
              </div>
            </div>
          )}

          {nextTextBoxVisible && currentPage >= 3 && (
            <div className="absolute inset-x-0 bottom-5 flex items-center justify-center">
              <div className="w-full h-35 max-w-4xl p-3 bg-white rounded-lg shadow-lg">
                <div className="w-full flex justify-center mr-10 mb-2">
                  <div className="flex space-x-2">
                    {keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className={`text-2xl px-4 ${
                          index === 0
                            ? 'bg-yellow-200 text-blue-800'
                            : index === 1
                              ? 'bg-red-200 text-red-800'
                              : 'bg-orange-200 text-orange-800'
                        } rounded-full`}
                        style={{ paddingTop: '0.1em', paddingBottom: '0.1rem' }}
                      >
                        {keyword}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center w-full">
                  <textarea
                    value={userStories[currentPage] || ''}
                    onChange={handleStoryChange}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg text-black"
                    placeholder="버튼을 누르고 이야기를 말해보세요."
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={startStopSpeechRecognition}
                    className="bg-green-500 p-4 rounded-full shadow-lg text-white font-bold"
                  >
                    {recognizing ? '인식 정지' : '인식 시작'}
                  </button>
                  <button
                    onClick={handleStopButtonClick}
                    className="bg-blue-600 p-4 rounded-full shadow-lg text-white font-bold"
                  >
                    음성인식 완료
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
