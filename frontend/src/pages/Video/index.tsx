// src/pages/videoChat.tsx
import exitBtn from '../../assets/images/exitBtn.png';
import { handleCloseChat } from '../../utils/video/handleCloseChat';

export default function VideoChatPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700">
      {/* 스크롤이 없는 고정 크기의 흰색 직사각형 박스 */}
      <div className="w-full max-w-5xl bg-white p-6 shadow-lg rounded-lg h-[80vh] flex flex-col relative">
        {/* X 버튼: 화상 통화 종료 */}
        <button
          className="absolute top-1 right-1 p-2 bg-transparent focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110"
          onClick={handleCloseChat}
          title="화상 통화 종료"
          aria-label="화상 통화 종료"
        >
          <img src={exitBtn} alt="화상 통화 종료" className="w-10 h-10" />
        </button>

        {/* Video Section: 내 얼굴과 상대방 얼굴 */}
        <div className="flex-1 flex gap-4 mt-4">
          {/* 내 얼굴 */}
          <div className="flex-1 bg-gray-200 border border-gray-300 rounded-lg">
            <video
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              playsInline
              muted
              // src={localStream} // 로컬 비디오 스트림
            />
          </div>

          {/* 상대방 얼굴 */}
          <div className="flex-1 bg-gray-200 border border-gray-300 rounded-lg">
            <video
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              playsInline
              // src={remoteStream} // 원격 비디오 스트림
            />
          </div>
        </div>
      </div>
    </div>
  );
}
