export type Language = 'ko' | 'en';

export const toggleLanguage = (currentLanguage: Language): Language => {
  return currentLanguage === 'ko' ? 'en' : 'ko';
};
