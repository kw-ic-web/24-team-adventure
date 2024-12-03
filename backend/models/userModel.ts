export interface User {
  user_id: string; // 사용자 ID (기본 키)
  online: boolean; // 온라인 상태
  icon: string; // 사용자 아이콘 (이미지 URL 등)
  email: string; // 이메일 주소
  name: string; // 사용자 이름
  updated_at: Date; // 마지막 업데이트 시간
}
