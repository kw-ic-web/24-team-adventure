import React, { useState } from 'react';

import Background from '../../components/ui/Background';
import BigBox from '../../components/ui/BigBox.tsx';
import HeaderLogo from '../../components/ui/HeaderLogo';


//import bookImage from './book.png';
//import contentImage from './topia.png';
//import iconImage from './icon.png';

export default function GameEnd() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isScaling, setIsScaling] = useState(false);

  const handleBookClick = () => {
    setIsScaling(true);
    setTimeout(() => {
      setIsExpanded(true);
      setShowText(false);
      setTimeout(() => {
        setIsBlurred(true);
        setShowText(true);
      }, 3000);
    }, 300);
    setTimeout(() => {
      setIsScaling(false);
    }, 600);
  };

  const handleNextClick = () => {
    console.log('Next button clicked');
  };

  return (
    <div > <Background />
    <div><HeaderLogo/></div>
    <BigBox>
      {/* 초기 책 모양 이미지와 아이콘, 제목 */}
      {!isExpanded && (
        <div className="flex flex-col items-center">
          <div
            className={`relative transition-transform duration-300 ease-in-out transform ${isScaling ? 'scale-150' : 'scale-100'}`}
          >
            <img
              src={''}
              alt="Book"
              className="cursor-pointer"
              onClick={handleBookClick}
            />
            <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 flex items-center">
              <img src={''} alt="Icon" className="w-16 h-16 mr-2" />
              <h1 className="text-xl font-bold">책 제목</h1>
            </div>
          </div>
        </div>
      )}

      {/* 내용 이미지와 텍스트 표시 */}
      {isExpanded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={''}
            alt="Content"
            className={`w-full h-full object-cover transition-opacity duration-500 ${isBlurred ? 'blur-md' : 'opacity-100'}`}
          />
          {showText && (
            <div className="absolute w-3/4 md:w-1/2 p-6 rounded-lg bg-white shadow-lg max-w-lg border-2 border-gray-300 transition-transform duration-300 hover:shadow-xl hover:scale-105">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                내용 제목
              </h2>
              <p className="text-lg">
                여기에 책의 내용이 표시됩니다. 여기에 책의 내용이 표시됩니다.
                여기에 책의 내용이 표시됩니다. 여기에 책의 내용이 표시됩니다.
                여기에 책의 내용이 표시됩니다. 여기에 책의 내용이 표시됩니다.
                여기에 책의 내용이 표시됩니다. 여기에 책의 내용이 표시됩니다.
                여기에 책의 내용이 표시됩니다. <br />
                <br />
                The end
                <br />
                <br />
                The end가 특별한 글씨체로 지정될까?
                <br />
                <br />
                마지막 나오는 디자인은? 배경 사진으로 깔건가, 노트모양 불러와서
                쓸까?
                <br />
                타자기 효과가 한글적용이 이상하게됨 방법을 찾아야함
              </p>
            </div>
          )}
          {showText && (
            <button
              className="absolute bottom-8 right-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={handleNextClick}
            >
              화상채팅하러
            </button>
          )}
        </div>
      )}
      </BigBox>
    </div>
  );
}
