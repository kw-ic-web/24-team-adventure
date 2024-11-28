import React, { useState, useEffect } from 'react';
import micIcon from './mic.svg';
// 전역 타입 선언
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionProps {
  language?: string;
  onResult: (transcript: string) => void;
}

export default function SpeechRecognition({
  language = 'ko-KR',
  onResult,
}: SpeechRecognitionProps): JSX.Element {
  const [recognizing, setRecognizing] = useState<boolean>(false);
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  // 음성 인식 초기화
  useEffect(() => {
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecognizing(true);
    recognition.onend = () => setRecognizing(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
  }, [language, onResult]);

  // 음성 인식 시작/정지
  const toggleRecognition = () => {
    if (recognizing) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <button
      onClick={toggleRecognition}
      className={`p-4 rounded-full shadow-lg font-bold flex items-center justify-center ${
        recognizing
          ? 'bg-red-600 animate-pulse'
          : 'bg-gray-300 hover:bg-gray-400'
      }`}
    >
      <img
        src={micIcon}
        alt="Microphone Icon"
        className="w-6 h-6"
        style={{
          width: '40px', // 너비 48px
          height: '35px', // 높이 48px
          transition: 'transform 0.3s ease',
          transform: recognizing ? 'scale(1.2)' : 'scale(1)',
        }}
      />
    </button>
  );
}
