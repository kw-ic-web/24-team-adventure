import React, { useState } from 'react';
import {
  generateStoryContinuation,
  generateStoryContinuation_end,
  generateStoryKeywords,
  generateStoryImage,
} from '../../services/StoryService'; // StoryService에서 가져오기

export default function Testgpt() {
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

  const [keywords, setKeywords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [generated, setgenerated] = useState<string>('');
  const [speechInput, setspeechInput] = useState<string>('');
  const [continuation, setContinuation] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  //userInput: 전체 누적 스토리
  //generated: 현재 생성/입력 스토리

  //1. 이야기 시작 전 userInput,generated 초기 저장되어있는 내용으로 업데이트하기

  const init_generated_userInput = () => {
    const newText = '백설공주가 살았는데 여왕과 사이가 좋았습니다.';
    setUserInput(newText); // userInput 업데이트
    setgenerated(newText); // generated 업데이트
  };

  //2. 음성인식 전 generated로 키워드 3개 생성

  const keyword_generated_bygpt = async () => {
    try {
      const response = await generateStoryKeywords(generated);

      // keywords 배열만 추출하여 상태에 저장
      const threekeyword = response.keywords; // response에서 keywords만 추출
      setKeywords(threekeyword);

      console.log('키워드:', threekeyword);
    } catch (error) {
      console.error('키워드 생성 중 에러 발생:', error); // 에러 발생 시 확인
    }
  };

  //3. 음성인식한 내용 speechInput으로 넣기 -> generated에는 대입(초기화), userInput에는 추가

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setspeechInput(e.target.value);
  };

  const handleSaveInput = () => {
    setgenerated(speechInput);
    setUserInput((prev) => prev + speechInput); // 기존 값에 새 값을 추가
  };

  //4. 누적스토리userInput으로 다음 내용 생성, 해당 내용 generated,userInput에 추가(덧붙이기)

  const story_generated_bygpt = async () => {
    if (!userInput.trim()) {
      console.warn('사용자가 입력을 하지 않았습니다.');
      return;
    }
    try {
      console.log('스토리 생성 요청 중...');

      const storyData = await generateStoryContinuation(userInput);

      const continuation = storyData.continuation; // 생성된 내용
      setContinuation(continuation);
      setUserInput((prev) => prev + continuation); // userInput 업데이트
      setgenerated((prev) => prev + continuation); // generated 업데이트
      console.log('스토리 생성 완료');
    } catch (error) {
      console.error('스토리 생성 중 에러 발생:', error); // 에러 발생 시 확인
    }
  };

  //5. (인식+생성)현재스토리generated로 다음 이미지 생성

  const image_generated_bygpt = async () => {
    try {
      console.log('이미지 생성 요청 중...');
     console.log('이미지 내용:',generated);
      const imageData = await generateStoryImage(generated);

      const imageurl = imageData.imageUrl; // 생성된 내용
      setImageUrl(imageurl);

      console.log('이미지 생성 완료:', imageData.imageUrl);
    } catch (error) {
      console.error('이미지 생성 중 에러 발생:', error); // 에러 발생 시 확인
    }
  };

  //6. 이미지와 글 2페이지에 걸쳐 보여줌

  //7. 2번부터 반복

  //8. (결말에선4번대신) 결말 내용 생성, 해당 내용 generated,userInput에 추가(덧붙이기)

  const end_story_generated_bygpt = async () => {
    try {
      console.log('결말 생성 요청 중...');

      const storyData = await generateStoryContinuation_end(userInput);

      const continuation = storyData.continuation; // 생성된 내용
      setContinuation(continuation);

      console.log('결말 생성 완료');
    } catch (error) {
      console.error('결말 생성 중 에러 발생:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Testgpt</h2>

      {/* 음성인식 필드 */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={speechInput}
          onChange={handleInputChange}
          placeholder="Type something..."
          className="border border-gray-300 rounded px-2 py-1 mb-4"
        />
        {/* 음성인식 저장 버튼 */}
        <button
          onClick={handleSaveInput}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
      {/* 버튼 5개 */}

      {/* 변수 초기화 */}
      <div className="flex flex-col gap-2">
        <button
          onClick={init_generated_userInput}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {userInput || 'Initialize userInput & Generated'}
        </button>

        <div className="mt-4">
          <p>
            <strong>User Input:</strong> {userInput}
          </p>
          <p>
            <strong>Generated:</strong> {generated}
          </p>
        </div>

        {/* 키워드 생성 */}
        <button
          onClick={keyword_generated_bygpt}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Generate Keywords
        </button>
        {/* 키워드 출력 */}
        <div className="mt-4">
          <p>
            <strong>Generated Keywords:</strong>
          </p>
          {keywords.length > 0 ? (
            <ul>
              {keywords.map((keyword, index) => (
                <li key={index} className="text-blue-500">
                  {keyword}
                </li>
              ))}
            </ul>
          ) : (
            <p>No keywords generated.</p>
          )}
        </div>

        {/* 이야기 생성 */}
        <button
          onClick={story_generated_bygpt}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate Story
        </button>
        {/* 생성된 스토리 표시 */}
        {continuation && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <p>
              <strong>Story Continuation:</strong>
            </p>
            <p>{continuation}</p>
          </div>
        )}

        {/* 결말 생성 */}
        <button
          onClick={end_story_generated_bygpt}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Generate End Story
        </button>
        {/* 생성된 스토리 표시 */}
        {continuation && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <p>
              <strong>The End:</strong>
            </p>
            <p>{continuation}</p>
          </div>
        )}

        {/* 이미지 생성 */}
        <button
          onClick={image_generated_bygpt}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Generate Image
        </button>
        {imageUrl && (
          <div>
            <h3>생성된 이미지:</h3>
            <img src={imageUrl} alt="Generated Image" />
          </div>
        )}
      </div>
    </div>
  );
}
