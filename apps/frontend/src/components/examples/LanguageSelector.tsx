import LanguageSelector from '../LanguageSelector';

export default function LanguageSelectorExample() {
  return (
    <LanguageSelector
      onLanguageSelect={(lang) => console.log('Selected language:', lang)}
      onContinue={() => console.log('Continue clicked')}
    />
  );
}