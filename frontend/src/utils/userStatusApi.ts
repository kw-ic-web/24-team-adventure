const API_BASE_URL = 'https://team05.server.duckdns.org/api'; // 백엔드 API URL

/**
 * 모든 사용자 상태 가져오기
 */
export async function fetchAllUserStatuses(): Promise<any[]> {
  try {
    console.log('Fetching all user statuses...');
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Error fetching user statuses:', errorMessage);
      throw new Error(`Failed to fetch user statuses: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Fetched user statuses:', data);
    return data; // 사용자 상태 리스트 반환
  } catch (error) {
    console.error('Error in fetchAllUserStatuses:', error);
    throw error;
  }
}

/**
 * 사용자 상태 업데이트 (online/offline)
 * @param online - 사용자 상태 (true: 온라인, false: 오프라인)
 * @param token - 인증 토큰
 */
export async function updateUserStatus(
  online: boolean,
  token: string,
): Promise<any> {
  try {
    console.log('Updating user status to:', online);
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // JWT 토큰
      },
      body: JSON.stringify({ online }), // 전송할 데이터
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Error updating user status:', errorMessage);
      throw new Error(`Failed to update user status: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('User status updated successfully:', data);
    return data; // 성공 메시지 반환
  } catch (error) {
    console.error('Error in updateUserStatus:', error);
    throw error;
  }
}

/**
 * 사용자 로그아웃
 * @param userId - 로그아웃할 사용자 ID
 */
export async function logoutUser(user_id: string, token: string): Promise<any> {
  try {
    console.log('Logging out user with ID:', user_id);
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // JWT 토큰
      },
      body: JSON.stringify({ user_id }), // 전송할 데이터
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Error logging out:', errorMessage);
      throw new Error(`Failed to log out: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('User logged out successfully:', data);
    return data; // 성공 메시지 반환
  } catch (error) {
    console.error('Error in logoutUser:', error);
    throw error;
  }
}
