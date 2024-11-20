import React, { useState, useEffect } from 'react';

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
      className={`p-4 rounded-full shadow-lg font-bold ${
        recognizing ? 'bg-red-600 text-white' : 'bg-green-500 text-white'
      }`}
    >
      {recognizing ? '인식 정지' : '인식 시작'}
    </button>
  );
}
