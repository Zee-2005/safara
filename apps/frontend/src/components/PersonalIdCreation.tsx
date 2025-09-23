import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Upload,
  CheckCircle,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface PersonalIdCreationProps {
  onComplete: (idData: any) => void;
  onBack: () => void;
}

export default function PersonalIdCreation({
  onComplete,
  onBack,
}: PersonalIdCreationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    emergencyContact: "",
    aadhaarFile: null as File | null,
    digiLockerFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // refs for hidden file inputs
  const aadhaarInputRef = useRef<HTMLInputElement | null>(null);
  const digiLockerInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete({
        ...formData,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your basic details as per government ID
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="As per Aadhaar/Government ID"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="address">Current Address</Label>
                <Input
                  id="address"
                  placeholder="Full address with PIN code"
                  value={formData.address}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a trusted contact for emergency situations
            </p>

            <div>
              <Label htmlFor="emergencyContact">
                Emergency Contact Number
              </Label>
              <Input
                id="emergencyContact"
                type="tel"
                placeholder="Trusted family member or friend"
                value={formData.emergencyContact}
                onChange={(e) =>
                  handleInputChange("emergencyContact", e.target.value)
                }
              />
            </div>

            <Card className="p-4 bg-safety-blue/5 border-safety-blue/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-safety-blue mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Privacy Notice</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your emergency contact will only be notified during actual
                    emergency situations. We follow strict data protection
                    protocols.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">
              Document Verification
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload Aadhaar Offline XML or DigiLocker documents
            </p>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-safety-blue" />
                <div>
                  <h4 className="font-medium">Aadhaar Offline XML</h4>
                  <p className="text-xs text-muted-foreground">
                    Download from UIDAI portal
                  </p>
                </div>
              </div>
              <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop or click to upload
                </p>
                <input
                  type="file"
                  accept=".xml"
                  ref={aadhaarInputRef}
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload(
                      "aadhaarFile",
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => aadhaarInputRef.current?.click()}
                >
                  Choose File
                </Button>
                {formData.aadhaarFile && (
                  <div className="mt-2 flex items-center gap-2 justify-center">
                    <CheckCircle className="w-4 h-4 text-safety-green" />
                    <span className="text-sm">
                      {formData.aadhaarFile.name}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-safety-green" />
                <div>
                  <h4 className="font-medium">DigiLocker Document</h4>
                  <p className="text-xs text-muted-foreground">
                    Official government document
                  </p>
                </div>
              </div>
              <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload DigiLocker document
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  ref={digiLockerInputRef}
                  className="hidden"
                  onChange={(e) =>
                    handleFileUpload(
                      "digiLockerFile",
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => digiLockerInputRef.current?.click()}
                >
                  Choose File
                </Button>
                {formData.digiLockerFile && (
                  <div className="mt-2 flex items-center gap-2 justify-center">
                    <CheckCircle className="w-4 h-4 text-safety-green" />
                    <span className="text-sm">
                      {formData.digiLockerFile.name}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
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
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <Badge variant="secondary" className="text-xs">
                KYC Required
              </Badge>
            </div>
          </div>
        </div>
        <Progress value={progress} className="mt-3" />
      </div>

      <div className="p-4">
        <Card className="p-6">{renderStepContent()}</Card>

        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="flex-1"
              disabled={!formData.fullName || !formData.dateOfBirth}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (!formData.aadhaarFile && !formData.digiLockerFile)
              }
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </Button>
          )}
        </div>

        <Card className="p-4 mt-4 bg-muted/50">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-safety-blue mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <strong>Security:</strong> All documents are encrypted and
              processed securely. Verification typically takes 24-48 hours.
              You'll receive SMS updates.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
