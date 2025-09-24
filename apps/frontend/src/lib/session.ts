// src/lib/session.ts
type Session = { userId: string; displayName?: string };

const SESSION_KEY = 'session_user';

export function setSession(userId: string, displayName?: string) {
  const s: Session = { userId, displayName };
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  return s;
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Session; } catch { return null; }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function userKey(key: string, s: Session | null = getSession()) {
  if (!s) return key;
  return `${s.userId}:${key}`;
}

export function setUserItem(key: string, value: string, s: Session | null = getSession()) {
  if (!s) return;
  localStorage.setItem(userKey(key, s), value);
}

export function getUserItem(key: string, s: Session | null = getSession()) {
  if (!s) return null;
  return localStorage.getItem(userKey(key, s));
}

export function removeUserItem(key: string, s: Session | null = getSession()) {
  if (!s) return;
  localStorage.removeItem(userKey(key, s));
}

export function clearUserPidData(s: Session | null = getSession()) {
  if (!s) return;
  const keys = [
    'pid_application_id',
    'pid_personal_id',
    'pid_full_name',
    'pid_mobile',
    'pid_email',
  ];
  keys.forEach(k => localStorage.removeItem(userKey(k, s)));
}
