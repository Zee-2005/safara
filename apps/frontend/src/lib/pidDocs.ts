async function parseError(res: Response) {
  let msg = 'Request failed';
  const ct = res.headers.get('content-type') || '';
  try {
    if (ct.includes('application/json')) {
      const j = await res.json();
      msg = j?.error || msg;
    } else {
      const t = await res.text();
      if (t) msg = t;
    }
  } catch {}
  return msg;
}

export async function uploadAadhaarDoc(applicationId: string, file: File) {
  const fd = new FormData();
  fd.append('applicationId', applicationId);
  fd.append('file', file);
  const res = await fetch('/api/v1/pid/docs/aadhaar', { method: 'POST', body: fd });
  if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
  return await res.json() as { applicationId: string; uploaded: boolean; mime: string; size: number; status: string };
}

// apps/frontend/src/lib/pidDocs.ts
export async function verifyAadhaarServer(applicationId: string) {
  const res = await fetch('/api/v1/pid/docs/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId })
  });
  if (!res.ok) throw new Error(await parseError(res));
  return await res.json() as {
    applicationId: string;
    extracted: { dob: string | null; aadhaarDigits: string | null };
    checks: { verhoeff: boolean };
    status: 'verified' | 'manual_review' | 'pending_verification' | 'rejected';
    documentVerified: boolean;
  };
}

export async function finalizePersonalId(applicationId: string) {
  const res = await fetch('/api/v1/pid/finalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId })
  });
  if (!res.ok) throw new Error(await parseError(res));
  return await res.json() as {
    personalId: string;
    name: string;
    aadhaarHash: string;
    dob: string | null;
    mobile: string;
    email: string;
    mobileVerified: boolean;
    emailVerified: boolean;
    documentVerified: boolean;
    status: 'verified';
    createdAt: string;
  };
}

