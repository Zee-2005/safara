// apps/frontend/src/components/PersonalIdDocsUpload.tsx
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import { uploadAadhaarDoc ,verifyAadhaarServer, finalizePersonalId} from '@/lib/pidDocs';
import { setUserItem } from '@/lib/session';

interface Props {
  applicationId: string;
  onBack: () => void;
  onDone: () => void; // proceed to next step/summary
}

export default function PersonalIdDocsUpload({ applicationId, onBack, onDone }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const aadhaarInputRef = useRef<HTMLInputElement | null>(null);

  // submit handler excerpt
// src/components/PersonalIdDocsUpload.tsx (replace submit handler)

const submit = async () => {
  if (!file) return;
  setLoading(true);
  setError(null);
  try {
    await uploadAadhaarDoc(applicationId, file);
    const verify = await verifyAadhaarServer(applicationId);
    if (!verify.documentVerified) {
      alert('Checksum failed; sent to manual review.');
      return;
    }
    const final = await finalizePersonalId(applicationId);
    setUserItem('pid_personal_id', final.personalId);
    setUserItem('pid_full_name', final.name || '');
    setUserItem('pid_mobile', final.mobile || '');
    setUserItem('pid_email', final.email || '');
    alert(`Digital Personal ID created: ${final.personalId}`);
    onDone();
  } catch (e: any) {
    setError(e?.message || 'Upload/verification/finalize failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4 flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Upload Governmend ID (Front)</h1>
      </div>

      <div className="p-4">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Accepted formats: PDF, JPG, PNG (max 5MB)</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
              <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
              <input
                ref={aadhaarInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Button variant="outline" size="sm" onClick={() => aadhaarInputRef.current?.click()}>
                Choose File
              </Button>
              {file && (
                <div className="mt-2 flex items-center gap-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-safety-green" />
                  <span className="text-sm">{file.name}</span>
                </div>
              )}
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}

          <Button onClick={submit} disabled={!file || loading} className="w-full">
            {loading ? 'Uploading…' : 'Upload & Continue'}
          </Button>
        </Card>
      </div>
    </div>
  );
}
