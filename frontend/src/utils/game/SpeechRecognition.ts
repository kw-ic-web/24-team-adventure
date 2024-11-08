export const startSpeechRecognition = (onResultCallback: (result: string) => void): void => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ko-KR';  // 한국어 설정
  
    recognition.onresult = (event: Event) => {
      const recognitionEvent = event as SpeechRecognitionEvent;
      const transcript = recognitionEvent.results[0][0].transcript;
      console.log('음성 인식 결과:', transcript);
      onResultCallback(transcript);  // 결과를 콜백으로 전달
    };
  
    recognition.onerror = (event: Event) => {
      const recognitionErrorEvent = event as SpeechRecognitionErrorEvent;
      console.error('음성 인식 오류:', recognitionErrorEvent.error);
    };
  
    recognition.start();  // 음성 인식 시작
  };
  