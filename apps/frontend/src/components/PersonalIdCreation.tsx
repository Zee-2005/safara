import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, ArrowLeft } from "lucide-react";
import { registerBasic } from "@/lib/pid";
import { useLocation } from "wouter";
import { setUserItem } from '@/lib/session';

interface PersonalIdCreationProps {
  onComplete: (idData: any) => void;
  onBack: () => void;
}

export default function PersonalIdCreation({ onComplete, onBack }: PersonalIdCreationProps) {
  const [, navigate] = useLocation();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 1;
  const progress = 100;

  const valid =
    fullName.trim().length >= 3 &&
    /^\d{10}$/.test(mobile) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!valid) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Register Step 1
      const res = await registerBasic(fullName.trim(), mobile.trim(), email.trim());
      setApplicationId(res.applicationId);

      // Persist Step 1 for the current session only
      setUserItem("pid_application_id", res.applicationId);
      setUserItem("pid_full_name", fullName.trim());
      setUserItem("pid_mobile", mobile.trim());
      setUserItem("pid_email", email.trim());

      // Lift minimal state to parent if needed
      onComplete({
        applicationId: res.applicationId,
        status: res.status,
        submittedAt: res.createdAt,
        fullName,
        mobile,
        email,
      });

      // Proceed to document upload (Step 2/3 handled there)
      navigate("/personal-id-docs");
    } catch (e: any) {
      setError(e?.message || "Failed to start Personal ID application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Create Personal ID</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Step 1 of {totalSteps}</span>
              <Badge variant="secondary" className="text-xs">KYC Required</Badge>
            </div>
          </div>
        </div>
        <Progress value={progress} className="mt-3" />
      </div>

      <div className="p-4">
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Basic details</h3>
            <p className="text-sm text-muted-foreground">
              Enter the details exactly as they appear on Aadhaar or your government ID.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="As per Aadhaar/Government ID"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">+91</span>
                <Input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!valid || isSubmitting}
            className="w-full"
            data-testid="pid-continue"
          >
            {isSubmitting ? "Creating application…" : "Continue"}
          </Button>
        </Card>

        <Card className="p-4 mt-4 bg-muted/50">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-safety-blue mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              We only create a temporary application at this step; document verification happens next.
            </div>
          </div>
          {applicationId && (
            <div className="mt-3 text-xs">
              Application ID: <span className="font-mono">{applicationId}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
