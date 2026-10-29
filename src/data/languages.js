export const SUPPORTED_LANGUAGES = [
  // Central Asia & CIS
  { code: 'UZ', name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿', region: 'Central Asia' },
  { code: 'KZ', name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿', region: 'Central Asia' },
  { code: 'KG', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', region: 'Central Asia' },
  { code: 'TJ', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', region: 'Central Asia' },
  { code: 'AZ', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', region: 'Central Asia' },
  { code: 'RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Europe' },
  { code: 'UK', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Europe' },

  // World Major Languages
  { code: 'EN', name: 'English', nativeName: 'English (US)', flag: '🇬🇧', region: 'Americas' },
  { code: 'TR', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Middle East' },
  { code: 'AR', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East', rtl: true },
  { code: 'ZH', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', region: 'Asia' },
  { code: 'DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
  { code: 'FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Europe' },
  { code: 'ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Europe' },
  { code: 'JA', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Asia' },
  { code: 'KO', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Asia' },
  { code: 'HI', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'Asia' },
  { code: 'IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Europe' },
  { code: 'PT', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Americas' },
  { code: 'ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'FA', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', region: 'Middle East', rtl: true },
  { code: 'UR', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', region: 'Asia', rtl: true },
  { code: 'BN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'Asia' },
  { code: 'MS', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', region: 'Asia' },
  { code: 'VI', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Asia' },
  { code: 'TH', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Asia' },
  { code: 'NL', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'PL', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Europe' },
  { code: 'SV', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Europe' },
  { code: 'EL', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Europe' },
  { code: 'HE', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', region: 'Middle East', rtl: true },
  { code: 'CS', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Europe' },
  { code: 'RO', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Europe' },
  { code: 'HU', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', region: 'Europe' },
  { code: 'FI', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', region: 'Europe' }
];

export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
};
