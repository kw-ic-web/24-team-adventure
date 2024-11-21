import { useNavigate } from 'react-router-dom';
import homeBtnImg from '../../assets/images/homeBtn.png';
import PostCard from '../../components/myPage/PostCard';
import { useUserGeulData } from '../../hooks/mypage/useUserGeulData';
import { useUserData } from '../../hooks/auth/useUserData';

export default function Mypage() {
  const navigate = useNavigate();

  // 사용자 데이터를 불러오는 hook
  const { data: userData, isLoading: userLoading } = useUserData();
  console.log('User data loading:', userLoading);
  console.log('User data:', userData);
  // user 데이터가 로드되었으면 글 데이터를 가져옵니다.
  const {
    userGeul,
    isLoading: geulsLoading,
    isError,
  } = useUserGeulData(userData?.user_id || '');

  // 로딩 상태 처리
  if (userLoading || geulsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader" />
          <p className="mt-4 text-gray-600">로딩 중입니다...</p>
        </div>
      </div>
    );
  }

  // 오류 처리
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 font-semibold">
            데이터를 불러오지 못했습니다.
          </p>
        </div>
      </div>
    );
  }

  // 사용자 데이터가 없을 때
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">사용자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 메인 페이지 UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-600 to-emerald-700">
      {/* 스크롤 가능한 흰색 직사각형 박스 */}
      <div className="w-full max-w-5xl bg-white p-6 shadow-lg rounded-lg max-h-[80vh] flex relative">
        {/* Left Side: 게시물 리스트 */}
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="grid grid-cols-2 gap-4">
            {userGeul && userGeul.length > 0 ? (
              userGeul.map((geul: any) => (
                <PostCard
                  key={geul.user_id}
                  imageUrl={geul.final_pic || 'https://via.placeholder.com/150'}
                  title={geul.geul_title || '제목 없음'}
                  description={geul.geul_content || '내용 없음'}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-2 text-center mt-4">
                작성한 게시물이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: 사용자 정보 섹션 */}
        <div className="w-64 h-auto flex-shrink-0 bg-gray-100 p-4 shadow-md rounded-lg ml-4">
          <img
            src={userData?.icon || 'https://via.placeholder.com/100'}
            alt="프로필 사진"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h3 className="text-center text-lg font-semibold">
            {userData?.name}
          </h3>
          <p className="text-center text-gray-500">{userData?.email}</p>
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => navigate('/settings')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              설정
            </button>
            <button
              onClick={() => navigate('/profile/edit')}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              프로필 수정
            </button>
          </div>
        </div>

        {/* 홈으로 이동 버튼 */}
        <button
          onClick={() => navigate('/home')}
          className="absolute bottom-1 right-1 p-4 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110"
          title="홈으로 이동"
          aria-label="홈으로 이동"
        >
          <img src={homeBtnImg} alt="홈으로 이동" className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
