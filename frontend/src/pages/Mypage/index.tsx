import homeBtn from '../../assets/images/homeBtn.png';
import PostCard from '../../components/myPage/PostCard';

export default function Mypage() {
  // 임시 데이터
  const posts = [
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '게시물 제목 1',
      description: '게시판 설명 예시 텍스트 1',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '게시물 제목 2',
      description: '게시판 설명 예시 텍스트 2',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '게시물 제목 3',
      description: '게시판 설명 예시 텍스트 3',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '게시물 제목 4',
      description: '게시판 설명 예시 텍스트 4',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '게시물 제목 5',
      description: '게시판 설명 예시 텍스트 5',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '게시물 제목 6',
      description: '게시판 설명 예시 텍스트 6',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '게시물 제목 7',
      description: '게시판 설명 예시 텍스트 7',
    },
    {
      imageUrl: 'https://via.placeholder.com/150',
      title: '게시물 제목 8',
      description: '게시판 설명 예시 텍스트 8',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-700">
      {/* 스크롤 가능한 흰색 직사각형 박스 */}
      <div className="w-full max-w-5xl bg-white p-6 shadow-lg rounded-lg max-h-[80vh] flex relative">
        {/* Left Side: 게시물 리스트 */}
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="grid grid-cols-2 gap-4">
            {posts.map((post, index) => (
              <PostCard
                key={index}
                imageUrl={post.imageUrl}
                title={post.title}
                description={post.description}
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
          className="absolute bottom-1 right-1 p-4 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110 "
          title="홈으로 이동"
          aria-label="홈으로 이동"
        >
          <img src={homeBtn} alt="홈으로 이동" className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
