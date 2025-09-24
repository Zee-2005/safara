// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { ArrowLeft } from 'lucide-react';
// import { sendEmailLink, completeEmailLinkSignIn } from '@/lib/firebase';
// import { verifyPidEmail } from '@/lib/pid';

// interface Props {
//   applicationId: string;
//   email: string;
//   onBack: () => void;
//   onVerified: () => void;
// }

// export default function PersonalIdEmailVerify({ applicationId, email, onBack, onVerified }: Props) {
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [linkSent, setLinkSent] = useState(false);

//   const sendLink = async () => {
//     try {
//       setSending(true);
//       setError(null);
//       await sendEmailLink(email);
//       setLinkSent(true);
//     } catch (e: any) {
//       setError(e?.message || 'Failed to send email link');
//     } finally {
//       setSending(false);
//     }
//   };

//   // If this component is mounted on the callback route, complete sign-in automatically
//   useEffect(() => {
//     const url = window.location.href;
//     if (url.includes('/personal-id-email-callback')) {
//       (async () => {
//         try {
//           const idToken = await completeEmailLinkSignIn(url);
//           await verifyPidEmail(applicationId, idToken);
//           onVerified();
//         } catch (e: any) {
//           setError(e?.message || 'Email verification failed');
//         }
//       })();
//     }
//   }, [applicationId, onVerified]);

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="bg-card border-b p-4 flex items-center gap-3">
//         <Button size="icon" variant="ghost" onClick={onBack}>
//           <ArrowLeft className="w-5 h-5" />
//         </Button>
//         <h1 className="text-xl font-bold">Verify Email</h1>
//       </div>

//       <div className="p-4">
//         <Card className="p-6 space-y-4">
//           <div>
//             <Label>Email address</Label>
//             <Input value={email} readOnly />
//             <p className="text-xs text-muted-foreground mt-1">
//               A sign‑in link will be sent to this address. Open the link on this device to continue.
//             </p>
//           </div>
//           {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}
//           <Button onClick={sendLink} disabled={sending} className="w-full">
//             {sending ? 'Sending…' : (linkSent ? 'Resend Link' : 'Send Verification Link')}
//           </Button>
//         </Card>
//       </div>
//     </div>
//   );
// }
