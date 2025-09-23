import { useState } from 'react';
import { Shield, Phone, Lock, User, Mail, KeyRound, ArrowLeft, Smartphone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginEmail, signup, requestOtp, verifyOtp } from '@/lib/auth';

// If Tabs and Separator exist in your shadcn setup, import them.
// Otherwise, replace with a simple state toggle.
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface AuthScreenProps {
  onLogin: (phoneOrEmail: string) => void;
  onGuestMode: () => void;
}

export default function AuthScreen({ onLogin, onGuestMode }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'choose' | 'phone' | 'otp'>('choose'); // choose => social/options hub
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reqId, setReqId] = useState<string | null>(null);
  // Demo flows — wire to backend later
  const startPhoneFlow = () => setStep('phone');

 const handleSendOtp = async () => {
  try {
    if (phone.length !== 10) return;
    setIsLoading(true);
    const { requestId: rId } = await requestOtp(phone);
    setReqId(rId); // put requestId in component state
    setStep('otp');
  } catch (e: any) {
    alert(e.message || 'Failed to send OTP');
  } finally {
    setIsLoading(false);
  }
};

  const handleVerifyOtp = async () => {
  try {
    if (!reqId || otp.length !== 6) return;
    setIsLoading(true);
    const u = await verifyOtp(reqId, otp);
    onLogin(u.phone || u.email || '');
  } catch (e: any) {
    alert(e.message || 'OTP verification failed');
  } finally {
    setIsLoading(false);
  }
};

  const handleEmailSubmit = async () => {
  try {
    setIsLoading(true);
    if (mode === 'signup') {
      const u = await signup(email, pass);
      onLogin(u.email || u.phone || '');
    } else {
      const u = await loginEmail(email, pass);
      onLogin(u.email || u.phone || '');
    }
  } catch (e: any) {
    alert(e.message || 'Auth error');
  } finally {
    setIsLoading(false);
  }
};

  const continueWithGoogle = () => {
    // Placeholder: open your OAuth endpoint later (e.g., /api/v1/auth/google)
    alert('Google sign-in coming soon');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-safety-blue/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-safety-blue rounded-full flex items-center justify-center shadow-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">SaFara</h1>
          <p className="text-muted-foreground">Secure sign in to access safety features</p>
        </div>

        <Card className="p-6">
          {step === 'choose' && (
            <>
              <Tabs value={mode} onValueChange={(v: any) => setMode(v)}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-4">
                  <Button onClick={continueWithGoogle} className="w-full" variant="secondary">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.98h5.33a4.55 4.55 0 0 1-1.96 2.98a6.59 6.59 0 0 1-3.37.9a6.99 6.99 0 1 1 0-14a6.39 6.39 0 0 1 4.53 1.77l2.05-2.05A9.51 9.51 0 0 0 12.18 2a10.01 10.01 0 1 0 0 20a9.41 9.41 0 0 0 6.44-2.33a8.84 8.84 0 0 0 2.73-6.56c0-.57-.05-1.0-.14-1.51Z"/></svg>
                    Continue with Google
                  </Button>
                  <Button onClick={startPhoneFlow} className="w-full" variant="outline">
                    <Smartphone className="w-4 h-4 mr-2" /> Continue with phone
                  </Button>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </Label>
                    <Input id="email" type="email" placeholder="name@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4" /> Password
                    </Label>
                    <Input id="password" type="password" placeholder="••••••••"
                      value={pass} onChange={(e) => setPass(e.target.value)} />
                  </div>
                  <Button onClick={handleEmailSubmit} disabled={!email || pass.length < 6 || isLoading} className="w-full">
                    {isLoading ? 'Signing in…' : 'Login'}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email2" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </Label>
                    <Input id="email2" type="email" placeholder="name@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password2" className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4" /> Password (min 6 chars)
                    </Label>
                    <Input id="password2" type="password" placeholder="Create a password"
                      value={pass} onChange={(e) => setPass(e.target.value)} />
                  </div>
                  <Button onClick={handleEmailSubmit} disabled={!email || pass.length < 6 || isLoading} className="w-full">
                    {isLoading ? 'Creating account…' : 'Create account'}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setMode('login')}>
                    Already have an account? Login
                  </Button>
                </TabsContent>
              </Tabs>
            </>
          )}

          {step === 'phone' && (
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => setStep('choose')} className="px-0 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Mobile number
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
                  />
                </div>
              </div>
              <Button onClick={handleSendOtp} disabled={phone.length !== 10 || isLoading} className="w-full">
                {isLoading ? 'Sending OTP…' : 'Send OTP'}
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => setStep('phone')} className="px-0 text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" /> Change number
              </Button>
              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Verification code
                </Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Code sent to +91 {phone}
                </p>
              </div>
              <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || isLoading} className="w-full">
                {isLoading ? 'Verifying…' : 'Verify & Continue'}
              </Button>
            </div>
          )}
        </Card>

        <div className="text-center space-y-2">
          <Button variant="outline" onClick={onGuestMode} className="w-full">
            <User className="w-4 h-4 mr-2" /> Continue as Guest
          </Button>
          <p className="text-xs text-muted-foreground">Guest mode lets you browse safety information only</p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" /> Available in multiple languages
          </div>
        </div>
      </div>
    </div>
  );
}
