import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
];

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void;
  onContinue: () => void;
}

export default function LanguageSelector({ onLanguageSelect, onContinue }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    onLanguageSelect(code);
    console.log('Language selected:', code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-safety-blue/10 to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-safety-blue rounded-full flex items-center justify-center">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SaFara</h1>
            <p className="text-muted-foreground mt-2">Choose your preferred language</p>
            <p className="text-sm text-muted-foreground">अपनी भाषा चुनें</p>
          </div>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
            {languages.map((language) => (
              <Button
                key={language.code}
                variant={selectedLanguage === language.code ? "default" : "outline"}
                className="h-auto p-3 flex flex-col items-center justify-center text-center"
                onClick={() => handleLanguageSelect(language.code)}
                data-testid={`button-language-${language.code}`}
              >
                <span className="font-medium text-sm">{language.name}</span>
                <span className="text-xs opacity-75">{language.nativeName}</span>
              </Button>
            ))}
          </div>
        </Card>

        <Button 
          size="lg" 
          className="w-full"
          onClick={onContinue}
          data-testid="button-continue"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}