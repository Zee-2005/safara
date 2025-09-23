type Tokens = { access: string; refresh: string };
type User = { id: string; email?: string | null; phone?: string | null };

const BASE = '/api/v1/auth';

export async function signup(email: string, password: string, phone?: string) {
  const res = await fetch(`${BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, phone })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Signup failed');
  const data: { user: User } & Tokens = await res.json();
  saveTokens(data);
  return data.user;
}

export async function loginEmail(email: string, password: string) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
  const data: { user: User } & Tokens = await res.json();
  saveTokens(data);
  return data.user;
}

export async function requestOtp(phone: string) {
  const res = await fetch(`${BASE}/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phone.startsWith('+') ? phone : `+91${phone}` })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'OTP request failed');
  return (await res.json()) as { requestId: string };
}

export async function verifyOtp(requestId: string, code: string) {
  const res = await fetch(`${BASE}/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId, code })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'OTP verification failed');
  const data: { user: User } & Tokens = await res.json();
  saveTokens(data);
  return data.user;
}

export async function getMe() {
  const tokens = loadTokens();
  if (!tokens?.access) return null;
  const res = await fetch(`${BASE}/me`, { headers: { Authorization: `Bearer ${tokens.access}` } });
  if (!res.ok) return null;
  return (await res.json()).user as User;
}

function saveTokens({ access, refresh }: Tokens) {
  localStorage.setItem('sft_access', access);
  localStorage.setItem('sft_refresh', refresh);
}
function loadTokens() {
  const access = localStorage.getItem('sft_access') || '';
  const refresh = localStorage.getItem('sft_refresh') || '';
  return { access, refresh };
}
