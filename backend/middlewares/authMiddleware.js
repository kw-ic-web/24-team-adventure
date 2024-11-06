const authMiddleware = (req, res, next) => {
  // 인증 로직을 여기에 추가
  // 예: 토큰 확인
  next();
};

module.exports = authMiddleware;
