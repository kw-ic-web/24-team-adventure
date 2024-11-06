// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],  // Tailwind CSS가 적용될 파일들을 지정
  theme: {
    extend: {
      fontFamily: {
        'noto': ['"Noto Sans KR"', 'sans-serif'],  // Noto Sans KR 폰트 설정 추가
      },
    },
  },
  plugins: [],
};
