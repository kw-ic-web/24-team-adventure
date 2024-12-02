import { useNavigate, Link } from 'react-router-dom';
import PostCard from '../../components/myPage/PostCard';
import { useUserGeulData } from '../../hooks/mypage/useUserGeulData';
import { useUserData } from '../../hooks/auth/useUserData';
import React, { useState } from 'react';
import Background from '../../components/ui/Background';
import SmallBox from '../../components/ui/SmallBox';
import Profile from '../../components/ui/Profile';
import HomeBtn from '../../components/ui/HomeBtn';
import HeaderLogo from '../../components/ui/HeaderLogo';
import UserList from '../../components/userStatus/UserList';
import UserStatusUpdater from '../../components/userStatus/UserStatusUpdater';

interface User {
  id: number;
  name: string;
  online: boolean;
}

export default function Mypage() {
  const [users, setUsers] = useState<User[]>([]);
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
    <div>
      <Background />
      <div>
        <HeaderLogo />
      </div>
      {/* 스크롤 가능한 흰색 직사각형 박스 */}
      <SmallBox>
        {/* Left Side: 게시물 리스트 */}
        <div className="grid grid-cols-2 gap-4">
          {userGeul && userGeul.length > 0 ? (
            userGeul.map((geul: any) => (
              <div key={geul.user_id} className="post-card-container">
                {/* 이미지 클릭 시 이동하는 링크 */}
                <Link
                  to={`/board/${geul.story_id}/post/${geul.geul_id}`} // 게시물 상세 페이지로 이동
                >
                  <PostCard
                    imageUrl={
                      geul.final_pic || 'https://via.placeholder.com/150'
                    }
                    title={geul.geul_title || '제목 없음'}
                    description={geul.geul_content || '내용 없음'}
                  />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-2 text-center mt-4">
              작성한 게시물이 없습니다.
            </p>
          )}
        </div>
      </SmallBox>

      {/* Right Side: 사용자 정보 섹션 */}
      <div className="boxes-align">
        <Profile />
        {/* Userlist Box */}
        <div>
          <UserStatusUpdater onUpdate={setUsers} />
          <UserList users={users} />
        </div>
        <div>
          <HomeBtn />
        </div>
      </div>
    </div>
  );
}
