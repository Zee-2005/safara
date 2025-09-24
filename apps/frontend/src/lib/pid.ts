type RegisterResponse = {
  applicationId: string;
  status: 'pending_verification' | 'manual_review' | 'verified' | 'rejected';
  createdAt: string;
};

const BASE = '/api/v1/pid';

export async function registerBasic(fullName: string, mobile: string, email: string) {
  const res = await fetch(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName,
      mobile: mobile.startsWith('+') ? mobile : `+91${mobile}`,
      email
    })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
  return (await res.json()) as RegisterResponse;
}


export async function verifyPidEmail(applicationId: string, idToken: string) {
  const res = await fetch('/api/v1/pid/email/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId, idToken })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Email verification failed');
  return await res.json() as { applicationId: string; emailVerified: boolean; status: string; updatedAt: string };
}

