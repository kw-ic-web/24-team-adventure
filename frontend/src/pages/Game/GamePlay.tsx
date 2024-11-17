import React, { useState, useEffect } from 'react';
import backgroundImage1 from './Wish_1.jpg';
import backgroundImage2 from './Wish_2.jpg';
import backgroundImage3 from './Wish_3.jpg';
import back from './동화배경5.png';

interface Page {
  backgroundImage: string;
  text: string;
}

const pages: Page[] = [
  {
    backgroundImage: backgroundImage1,
    text: '하늘에서 빛나는 작은 별이었던 루미는 누구보다 사람들의 소원을 들어주는 일을 소중히 여겼습니다. 하지만 어느 날 밤, 갑자기 마법의 힘을 잃고 지구로 떨어지게 된 루미는 자신이 이제 아무도 도울 수 없다는 절망에 빠졌습니다. 소원을 들어줄 수 없다는 사실에 슬픔에 잠긴 루미는 다시는 밤하늘로 돌아갈 수 없을 거라 생각하며 홀로 외로움을 느끼고 있었습니다.',
  },
  {
    backgroundImage: backgroundImage2,
    text: '그러던 중, 숲속을 거닐던 용감한 나무 요정 피노가 루미의 곁에 다가왔습니다. 피노는 루미가 슬픔에 빠진 이유를 듣고는 “소원을 들어주는 능력이 아니더라도, 함께라면 다른 방법으로도 생명들을 도울 수 있어,”라며 따뜻하게 격려했습니다. 피노의 말에 힘을 얻은 루미는 다시 희망을 품기 시작했고, 피노와 함께 작은 도움을 주는 모험을 시작하기로 결심했습니다.',
  },
  {
    backgroundImage: backgroundImage3,
    text: '그 후, 루미와 피노는 길을 잃은 새를 위해 길을 안내하고, 시들어가는 꽃들에게 물을 주어 생명을 불어넣으며 숲속 친구들에게 친절을 베풀었습니다. 그렇게 작은 일들을 하나씩 해나가며 루미는 자신이 마법이 없어도 다른 생명들에게 큰 기쁨과 도움을 줄 수 있다는 사실을 깨닫게 되었습니다.',
  },
];

export default function GamePlay(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [blurLevel, setBlurLevel] = useState<number>(0);
  const [textBoxVisible, setTextBoxVisible] = useState<boolean>(false);
  const [textOpacity, setTextOpacity] = useState<number>(0);
  const [showImageOnly, setShowImageOnly] = useState<boolean>(false);

  // "시작하기" 버튼 클릭 시 모달 창 열기
  const openModal = () => {
    setShowModal(true);
  };

  // 모달에서 "시작" 버튼 클릭 시 게임 시작
  const confirmStart = () => {
    setShowModal(false);
    setGameStarted(true);
  };

  // 모달에서 "취소" 버튼 클릭 시 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  // 서서히 블러 효과 적용 후 텍스트 박스를 서서히 표시
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
    }, 2000);
  };

  // 텍스트 박스 서서히 나타나게 하기
  const fadeInTextBox = () => {
    const fadeInInterval = setInterval(() => {
      setTextOpacity((prev) => {
        if (prev < 1) return prev + 0.05;
        clearInterval(fadeInInterval);
        return prev;
      });
    }, 50);
  };

  // "이미지 보기" 버튼 클릭 처리
  const toggleImageVisibility = () => {
    setShowImageOnly((prev) => !prev);
  };

  // 페이지 변경 시 블러 효과 적용
  useEffect(() => {
    if (gameStarted) {
      applyBlurEffect();
    }
  }, [currentPage, gameStarted]);

  // 페이지 이동
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
      {/* 게임 시작 화면 */}
      {!gameStarted && (
        <div
          className="flex flex-col items-center justify-center h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/start-image.jpg)' }}
        >
          <h1 className="text-4xl font-bold mb-4">동화 이야기 시작</h1>
          <button
            onClick={openModal}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full"
          >
            시작하기
          </button>
        </div>
      )}

      {/* 모달 창 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold mb-4 text-white">안내</h2>
            <p className="mb-4 text-white">게임을 시작하시겠습니까?</p>
            <button
              onClick={confirmStart}
              className="p-2 bg-blue-600 text-white font-bold rounded-lg"
            >
              시작
            </button>
            <button
              onClick={closeModal}
              className="p-2 bg-gray-300 text-gray-800 font-bold rounded-lg ml-2"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 게임 화면 */}
      {gameStarted && (
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${pages[currentPage].backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* 서서히 블러 효과 */}
          {!showImageOnly && blurLevel > 0 && (
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundColor: 'black',
                opacity: blurLevel / 100,
              }}
            />
          )}

          {/* 텍스트 박스 (서서히 나타나기) */}
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
                    {pages[currentPage].text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 이미지 보기 버튼 */}
          {textBoxVisible && (
            <button
              onClick={toggleImageVisibility}
              className="absolute top-4 right-4 p-2 bg-blue-600 text-white font-bold rounded-full z-10"
            >
              {showImageOnly ? '글 보기' : '이미지 보기'}
            </button>
          )}

          {/* 페이지 전환 버튼 */}
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
