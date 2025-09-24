import { initializeApp } from 'firebase/app';
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink
} from 'firebase/auth';

// Your provided web config
const firebaseConfig = {
  apiKey: "AIzaSyBF9O1eM973IYlKWvLkH_z4FxD5D98wico",
  authDomain: "otp-verify-e818b.firebaseapp.com",
  projectId: "otp-verify-e818b",
  storageBucket: "otp-verify-e818b.firebasestorage.app",
  messagingSenderId: "524511631352",
  appId: "1:524511631352:web:98ad8bbcc55564670b680d",
  measurementId: "G-CLFEMB9BYX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Send a passwordless sign-in link to email
export async function sendEmailLink(email: string) {
  const actionCodeSettings = {
    url: window.location.origin + '/personal-id-email-callback',
    handleCodeInApp: true
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  localStorage.setItem('pid_email_for_signin', email);
}

// Complete sign-in from callback URL and return ID token
export async function completeEmailLinkSignIn(callbackUrl: string) {
  if (!isSignInWithEmailLink(auth, callbackUrl)) {
    throw new Error('Invalid email sign-in link');
  }
  let email = localStorage.getItem('pid_email_for_signin') || '';
  if (!email) throw new Error('Missing email for sign-in');
  const cred = await signInWithEmailLink(auth, email, callbackUrl);
  const token = await cred.user.getIdToken(true);
  return token;
}
