import React, { useState, useRef, useEffect } from 'react';
import micIcon from './mic.svg';

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
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    recognitionRef.current = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    const recognition = recognitionRef.current;

    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecognizing(true);
    recognition.onend = () => {
      setRecognizing(false);
    };
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [language, onResult]);

  const toggleRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (recognizing) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <button
      onClick={toggleRecognition}
      aria-label={
        recognizing ? 'Stop voice recognition' : 'Start voice recognition'
      }
      className={`p-4 rounded-full shadow-lg font-bold flex items-center justify-center transition-transform duration-300 ${
        recognizing
          ? 'bg-red-600 animate-pulse scale-110'
          : 'bg-gray-300 hover:bg-gray-400'
      }`}
    >
      <img src={micIcon} alt="Microphone Icon" className="w-10 h-10" />
    </button>
  );
}
