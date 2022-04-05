import { useTranslation } from 'react-i18next';

const languages = {
  en: '🇺🇸',
  de: '🇩🇪',
};

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  return (
    <>
      {Object.entries(languages).map(([lang, flag]) => (
        <i
          key={lang}
          role="img"
          className="LanguageSelector flag"
          onClick={() => i18n.changeLanguage(lang)}
        >
          {flag}
        </i>
      ))}
    </>
  );
}
