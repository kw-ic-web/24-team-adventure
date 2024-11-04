import React, { useEffect, useState } from 'react';
import pic1 from './elsa.jpg'; // 메인 게임 이미지
import blurredImage from './topia.png'; // 초기 흐린 이미지
// import microphoneIcon from 'path/to/microphone-icon.png';
// import arrowIcon from 'path/to/arrow-icon.png';

export default function Game_Play() {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const smallWords = [
    { text: 'Word 1', color: 'bg-red-200' },
    { text: 'Word 2', color: 'bg-green-200' },
    { text: 'Word 3', color: 'bg-yellow-200' },
  ];

  useEffect(() => {
    if (isGameStarted) {
      const timer = setTimeout(() => {
        setIsBlurred(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isGameStarted]);

  const startGame = () => {
    setIsGameStarted(true);
  };

  const handleVoiceRecognition = () => {
    // 음성 인식 기능 추가될예정
    setRecognizedText('사용자의 인식된 말이 여기에 표시됩니다.');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-10">
      <div className="bg-white rounded-lg shadow-lg w-[50rem] h-[80vh] relative p-6">
        {!isGameStarted ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="w-full h-80 overflow-hidden rounded-lg mb-8">
              <img
                src={blurredImage}
                alt="Initial"
                className={`w-full h-full transition-filter duration-500 ${isBlurred ? 'filter blur-sm' : ''}`}
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-3xl bg-black bg-opacity-50 p-4 rounded-lg">
              <p className="mb-16">동화 제목</p>
              <button
                onClick={startGame}
                className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition-all"
              >
                시작하기
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center space-y-6">
            <div className="relative w-full h-80 overflow-hidden rounded-lg mb-8">
              <img
                src={pic1}
                alt="Example"
                className={`w-full h-full transition-filter duration-500 ${isBlurred ? 'filter blur-sm' : ''}`}
              />
              {isBlurred && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xl bg-black bg-opacity-30 p-4 rounded-lg">
                  <p>첫 번째 문장</p>
                  <p>두 번째 문장</p>
                  <p>세 번째 문장</p>
                </div>
              )}
            </div>

            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2 bg-gray-200 rounded-lg p-4">
                <span className="text-gray-700 font-bold text-lg">
                  주어진 단어를 활용해보세요!
                </span>
                <div className="flex justify-center space-x-2">
                  {smallWords.map((word, index) => (
                    <span
                      key={index}
                      className={`py-1 px-3 rounded-lg ${word.color}`}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center w-full border border-gray-300 p-4 rounded-lg shadow-md">
              <div
                className="mr-4 cursor-pointer"
                onClick={handleVoiceRecognition}
              >
                🎤
              </div>
              <div className="flex-grow text-2xl text-center text-gray-800">
                {recognizedText || '음성 인식을 통해 이야기를 만들어 보세요!'}
              </div>
              <div className="ml-4 cursor-pointer">➡️</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
