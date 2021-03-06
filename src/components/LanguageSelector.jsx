import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

const languages = {
  en: 'πΊπΈ',
  de: 'π©πͺ',
};

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  return (
    <div className="LanguageSelector">
      {Object.entries(languages).map(([lang, flag]) => (
        <i
          key={lang}
          role="img"
          className={classNames('flag', {
            active: lang === i18n.language,
          })}
          onClick={() => i18n.changeLanguage(lang)}
        >
          {flag}
        </i>
      ))}
    </div>
  );
}
