//src/pages/Mypage/index.tsx
import { useNavigate } from 'react-router-dom';
import homeBtnImg from '../../assets/images/homeBtn.png';
import PostCard from '../../components/myPage/PostCard';
import { useGeulData } from '../../hooks/mypage/useGeulData';

interface MypageProps {
  user_id: string;
}

export default function Mypage({ user_id }: MypageProps) {
  const navigate = useNavigate();

  // React Query로 geul 데이터를 가져옴
  const { userGeul, isLoading, isError } = useGeulData(user_id);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>오류 발생</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-600 to-emerald-700">
      {/* 스크롤 가능한 흰색 직사각형 박스 */}
      <div className="w-full max-w-5xl bg-white p-6 shadow-lg rounded-lg max-h-[80vh] flex relative">
        {/* Left Side: 게시물 리스트 */}
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="grid grid-cols-2 gap-4">
            {userGeul.map((post: any) => (
              <PostCard
                key={post.id}
                imageUrl={post.final_pic}
                title={post.geul_title}
                description={post.geul_content}
              />
            ))}
          </div>
        </div>

        {/* Right Side: 사용자 정보 섹션 */}
        <div className="w-64 h-80 flex-shrink-0 bg-gray-100 p-4 shadow-md rounded-lg ml-4">
          <img
            src="https://via.placeholder.com/100"
            alt="프로필 사진"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h3 className="text-center text-lg font-semibold">사용자 이름</h3>
          <p className="text-center text-gray-500">user@example.com</p>
          <div className="flex justify-center mt-4 space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              이동
            </button>
            <button className="bg-gray-300 px-4 py-2 rounded-lg">설정</button>
          </div>
        </div>

        {/* 홈으로 이동 버튼 */}
        <button
          onClick={() => navigate('/home')}
          className="absolute bottom-1 right-1 p-4 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110 "
          title="홈으로 이동"
          aria-label="홈으로 이동"
        >
          <img src={homeBtnImg} alt="홈으로 이동" className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
