// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { sendPhoneOtp } from '@/lib/firebase';
// import { verifyPidMobile } from '@/lib/pid';
// import { ArrowLeft } from 'lucide-react';

// interface Props {
//   applicationId: string;
//   mobile: string;           // 10 digits collected in step 1
//   onBack: () => void;
//   onVerified: () => void;   // navigate to next step (documents)
// }

// export default function PersonalIdMobileOtp({ applicationId, mobile, onBack, onVerified }: Props) {
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [confirmation, setConfirmation] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const conf = await sendPhoneOtp(mobile);
//         setConfirmation(conf);
//       } catch (e: any) {
//         setError(e?.message || 'Failed to send OTP');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [mobile]);

//   const verify = async () => {
//     if (!confirmation || otp.length !== 6) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const cred = await confirmation.confirm(otp);
//       const token = await cred.user.getIdToken(true);
//       await verifyPidMobile(applicationId, token);
//       onVerified();
//     } catch (e: any) {
//       setError(e?.message || 'Invalid OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="bg-card border-b p-4 flex items-center gap-3">
//         <Button size="icon" variant="ghost" onClick={onBack}>
//           <ArrowLeft className="w-5 h-5" />
//         </Button>
//         <h1 className="text-xl font-bold">Verify Mobile</h1>
//         <div id="recaptcha-container" className="ml-auto" />
//       </div>

//       <div className="p-4">
//         <Card className="p-6 space-y-4">
//           <div>
//             <Label htmlFor="otp">Enter 6‑digit code sent to +91 {mobile}</Label>
//             <Input
//               id="otp"
//               inputMode="numeric"
//               placeholder="123456"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//               className="text-center tracking-widest"
//             />
//           </div>
//           {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
//           <Button onClick={verify} disabled={loading || otp.length !== 6} className="w-full">
//             {loading ? 'Verifying…' : 'Verify Number'}
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// }
