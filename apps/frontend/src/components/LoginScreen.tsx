import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Phone, Lock, User } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (phone: string) => void;
  onGuestMode: () => void;
}

export default function LoginScreen({ onLogin, onGuestMode }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStep('otp');
      setIsLoading(false);
      console.log('OTP sent to:', phone);
    }, 1000);
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(phone);
      setIsLoading(false);
      console.log('Login successful');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-safety-blue/10 to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-safety-blue rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SaFara</h1>
            <p className="text-muted-foreground mt-2">
              {step === 'phone' ? 'Enter your mobile number' : 'Enter verification code'}
            </p>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Mobile Number
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="rounded-l-none"
                    data-testid="input-phone"
                  />
                </div>
              </div>
              <Button 
                onClick={handlePhoneSubmit}
                disabled={phone.length !== 10 || isLoading}
                className="w-full"
                data-testid="button-send-otp"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  data-testid="input-otp"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Code sent to +91 {phone}
                </p>
              </div>
              <Button 
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6 || isLoading}
                className="w-full"
                data-testid="button-verify-otp"
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setStep('phone')}
                className="w-full"
                data-testid="button-back"
              >
                Change Number
              </Button>
            </>
          )}
        </Card>

        <div className="text-center space-y-2">
          <Button 
            variant="outline" 
            onClick={onGuestMode}
            className="w-full"
            data-testid="button-guest-mode"
          >
            <User className="w-4 h-4 mr-2" />
            Continue as Guest
          </Button>
          <p className="text-xs text-muted-foreground">
            Guest mode allows browsing safety information only
          </p>
        </div>
      </div>
    </div>
  );
}