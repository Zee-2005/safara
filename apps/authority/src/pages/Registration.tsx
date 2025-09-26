import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Upload,
  Shield,
  Eye,
  EyeOff,
  MapPin,
  Building,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";

// ---------------- Types ----------------
type UploadedFile = {
  file: File;
  preview: string;
  name: string;
  size: number;
};
type DigiLockerDocument = {
  id: string;
  name: string;
  url: string;
  type: string;
  issuedBy: string;
  issuedDate: string;
};

type VerificationStatus = {
  aiVerification: {
    status: "pending" | "processing" | "verified" | "failed";
    confidence: number;
    issues: string[];
    extractedData?: Record<string, string>;
  };
  digiLockerVerification: {
    status: "pending" | "processing" | "verified" | "failed";
    documents: DigiLockerDocument[];
    error?: string;
  };
  faceVerification: {
    status: "pending" | "processing" | "verified" | "failed";
    confidence: number;
  };
};


type FormData = {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    bloodGroup: string;
  };
  addressInfo: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    permanentAddress: {
      isSameAsCurrent: boolean;
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  };
  departmentInfo: {
    department: string;
    division: string;
    designation: string;
    employeeId: string;
    joiningDate: string;
    reportingOfficer: string;
    workLocation: string;
    officeAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
    previousExperience: string[];
  };
  identityProof: {
    type: string;
    number: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  };
  accountDetails: {
    username: string;
    password: string;
    confirmPassword: string;
    requestedRole: string;
  };
  consent: {
    digiLockerConsent: boolean;
    dataProcessingConsent: boolean;
    termsAndConditions: boolean;
    backgroundVerificationConsent: boolean;
  };
};

type SubmitStatus = {
  success: boolean;
  requestId?: string;
  message: string;
  estimatedProcessingTime?: string;
  error?: string;
};

// --------------- Defaults ----------------
const defaultFormData: FormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Indian",
    bloodGroup: "",
  },
  addressInfo: {
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    permanentAddress: {
      isSameAsCurrent: true,
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  },
  departmentInfo: {
    department: "",
    division: "",
    designation: "",
    employeeId: "",
    joiningDate: "",
    reportingOfficer: "",
    workLocation: "",
    officeAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    previousExperience: [],
  },
  identityProof: {
    type: "",
    number: "",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
  },
  accountDetails: {
    username: "",
    password: "",
    confirmPassword: "",
    requestedRole: "officer",
  },
  consent: {
    digiLockerConsent: false,
    dataProcessingConsent: false,
    termsAndConditions: false,
    backgroundVerificationConsent: false,
  },
};

// ------------- Component ------------------
const Registration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({
    profilePhoto: null,
    idProof: null,
    addressProof: null,
    departmentLetter: null,
    joiningLetter: null,
  });

  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    aiVerification: { status: "pending", confidence: 0, issues: [] },
    digiLockerVerification: { status: "pending", documents: [] },
    faceVerification: { status: "pending", confidence: 0 },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [digiLockerUrl, setDigiLockerUrl] = useState<string>("");

  const steps = [
    { id: 1, title: "Personal Details", icon: User },
    { id: 2, title: "Address & Contact", icon: MapPin },
    { id: 3, title: "Department Info", icon: Building },
    { id: 4, title: "Identity Proof", icon: CreditCard },
    { id: 5, title: "Document Upload", icon: Upload },
    { id: 6, title: "Account Setup", icon: Lock },
    { id: 7, title: "Verification", icon: Shield },
  ];

  const departments = [
    "Tamil Nadu Police",
    "Tourism Department",
    "Revenue Department",
    "Municipal Corporation",
    "Fire and Rescue Services",
    "Health Department",
    "Transport Department",
    "Coastal Security",
    "Archaeological Survey",
    "Forest Department",
  ];

  const designations = [
    "Sub Inspector",
    "Inspector",
    "Assistant Commissioner",
    "Deputy Commissioner",
    "Assistant Director",
    "Deputy Director",
    "Joint Director",
    "Additional Director",
    "District Collector",
    "Assistant Collector",
    "Tehsildar",
    "Block Development Officer",
    "Tourist Officer",
    "Security Officer",
  ];

  const idProofTypes = [
    { value: "aadhar", label: "Aadhaar Card", digiLocker: true },
    { value: "pan", label: "PAN Card", digiLocker: true },
    { value: "passport", label: "Passport", digiLocker: true },
    { value: "voter_id", label: "Voter ID", digiLocker: true },
    { value: "driving_license", label: "Driving License", digiLocker: true },
  ];

  // ---------- Helpers ----------
 const updateFormData = <
  S extends keyof FormData,
  F extends keyof FormData[S]
>(
  section: S,
  field: F,
  value: FormData[S][F]
) => {
  setFormData((prev) => ({
    ...prev,
    [section]: {
      ...prev[section],
      [field]: value,
    },
  }));
};


  const handleFileUpload = async (fileType: string, file?: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [fileType]: "Only JPEG, PNG and PDF files are allowed" }));
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, [fileType]: "File size must be less than 5MB" }));
      return;
    }

    const preview = URL.createObjectURL(file);

    setUploadedFiles((prev) => ({
      ...prev,
      [fileType]: { file, preview, name: file.name, size: file.size },
    }));

    setErrors((prev) => ({ ...prev, [fileType]: "" }));

    // Trigger simulated verification
    if (fileType === "idProof") {
      performAIVerification(fileType, file);
    }
  };

  useEffect(() => {
    // if both profilePhoto and idProof exist, run face match simulation
    const id = uploadedFiles["idProof"];
    const pf = uploadedFiles["profilePhoto"];
    if (id && pf) {
      // simulate face match
      setVerificationStatus((prev) => ({ ...prev, faceVerification: { status: "processing", confidence: 0 } }));
      setTimeout(() => {
        const confidence = Math.round((Math.random() * 0.2 + 0.8) * 100); // 80-100
        setVerificationStatus((prev) => ({ ...prev, faceVerification: { status: confidence > 80 ? "verified" : "failed", confidence } }));
      }, 2000);
    }
    // cleanup previews when component unmounts
    return () => {
      Object.values(uploadedFiles).forEach((f) => {
        if (f && f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [uploadedFiles]);

  const performAIVerification = async (fileType: string, file: File) => {
    if (fileType !== "idProof") return;
    setVerificationStatus((prev) => ({ ...prev, aiVerification: { status: "processing", confidence: 0, issues: [] } }));

    setTimeout(() => {
      const confidence = Math.round((Math.random() * 0.3 + 0.7) * 100); // 70-100
      const issues = confidence < 80 ? ["Low image quality"] : [];
      setVerificationStatus((prev) => ({
        ...prev,
        aiVerification: {
          status: confidence > 75 ? "verified" : "failed",
          confidence,
          issues,
          extractedData: {
            name: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.trim(),
            number: formData.identityProof.number,
            dateOfBirth: formData.personalInfo.dateOfBirth,
          },
        },
      }));
    }, 2500);
  };

  const initiateDigiLockerVerification = async () => {
    setVerificationStatus((prev) => ({ ...prev, digiLockerVerification: { status: "processing", documents: [] } }));
    const mockUrl = `https://api.digilocker.gov.in/oauth?client_id=sentinelview&redirect_uri=${encodeURIComponent(
      window.location.origin
    )}/auth/digilocker/callback&state=${Date.now()}`;
    setDigiLockerUrl(mockUrl);

    setTimeout(() => {
      setVerificationStatus((prev) => ({
  ...prev,
  digiLockerVerification: {
    status: "verified",
    documents: [
      {
        id: `doc-${Date.now()}`,
        name: formData.identityProof.type,
        type: formData.identityProof.type,
        issuer: getDocumentIssuer(formData.identityProof.type),
        issuedBy: getDocumentIssuer(formData.identityProof.type),
        issuedDate: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        uri: `DL-${formData.identityProof.type}-${Date.now()}`,
        url: `/mock-docs/${formData.identityProof.type}.pdf`,
      },
    ],
  },
}));

    }, 3500);
  };

  const getDocumentIssuer = (type: string) => {
    const issuers: Record<string, string> = {
      aadhar: "UIDAI",
      pan: "Income Tax Department",
      passport: "Ministry of External Affairs",
      voter_id: "Election Commission of India",
      driving_license: "Transport Department",
    };
    return issuers[type] || "Government Authority";
  };

  // ---------- Validation ----------
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (!formData.personalInfo.firstName) newErrors.firstName = "First name is required";
        if (!formData.personalInfo.lastName) newErrors.lastName = "Last name is required";
        if (!formData.personalInfo.email) newErrors.email = "Email is required";
        if (!formData.personalInfo.phone) newErrors.phone = "Phone number is required";
        if (!formData.personalInfo.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.personalInfo.gender) newErrors.gender = "Gender is required";
        break;
      case 2:
        if (!formData.addressInfo.street) newErrors.street = "Street is required";
        if (!formData.addressInfo.city) newErrors.city = "City is required";
        if (!formData.addressInfo.state) newErrors.state = "State is required";
        if (!formData.addressInfo.pincode) newErrors.pincode = "Pincode is required";
        break;
      case 3:
        if (!formData.departmentInfo.department) newErrors.department = "Department is required";
        if (!formData.departmentInfo.designation) newErrors.designation = "Designation is required";
        if (!formData.departmentInfo.employeeId) newErrors.employeeId = "Employee ID is required";
        if (!formData.departmentInfo.joiningDate) newErrors.joiningDate = "Joining date is required";
        if (!formData.departmentInfo.reportingOfficer) newErrors.reportingOfficer = "Reporting officer is required";
        break;
      case 4:
        if (!formData.identityProof.type) newErrors.idType = "ID proof type is required";
        if (!formData.identityProof.number) newErrors.idNumber = "ID proof number is required";
        break;
      case 5:
        if (!uploadedFiles.profilePhoto) newErrors.profilePhoto = "Profile photo is required";
        if (!uploadedFiles.idProof) newErrors.idProof = "ID proof document is required";
        if (!uploadedFiles.addressProof) newErrors.addressProof = "Address proof is required";
        if (!uploadedFiles.departmentLetter) newErrors.departmentLetter = "Department letter is required";
        break;
      case 6:
        if (!formData.accountDetails.username) newErrors.username = "Username is required";
        if (!formData.accountDetails.password) newErrors.password = "Password is required";
        if (formData.accountDetails.password !== formData.accountDetails.confirmPassword)
          newErrors.confirmPassword = "Passwords do not match";
        if (!formData.accountDetails.requestedRole) newErrors.role = "Role is required";
        break;
      case 7:
        if (!formData.consent.digiLockerConsent) newErrors.digiLocker = "DigiLocker consent is required";
        if (!formData.consent.dataProcessingConsent) newErrors.dataProcessing = "Data processing consent is required";
        if (!formData.consent.termsAndConditions) newErrors.terms = "Accept terms & conditions";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Submit ----------
  const handleSubmit = async () => {
    if (!validateStep(7)) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      // Replace with real API integration
      await new Promise((res) => setTimeout(res, 2500));
      const requestId = `REQ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(
        Math.floor(Math.random() * 9999) + 1
      ).padStart(4, "0")}`;
      setSubmitStatus({ success: true, requestId, message: "Registration request submitted successfully!", estimatedProcessingTime: "3-5 business days" });
    } catch (err: unknown) {
  if (err instanceof Error) {
    setSubmitStatus({ success: false, message: "Registration submission failed. Please try again.", error: err.message });
  } else {
    setSubmitStatus({ success: false, message: "Registration submission failed. Please try again.", error: "Unknown error" });
  }
}
 finally {
      setIsSubmitting(false);
    }
  };

  // ---------- UI rendering per step ----------
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Please provide your personal details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <Input value={formData.personalInfo.firstName} onChange={(e) => updateFormData("personalInfo", "firstName", e.target.value)} />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <Input value={formData.personalInfo.lastName} onChange={(e) => updateFormData("personalInfo", "lastName", e.target.value)} />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input type="email" value={formData.personalInfo.email} onChange={(e) => updateFormData("personalInfo", "email", e.target.value)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <Input type="tel" value={formData.personalInfo.phone} onChange={(e) => updateFormData("personalInfo", "phone", e.target.value)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                <Input type="date" value={formData.personalInfo.dateOfBirth} onChange={(e) => updateFormData("personalInfo", "dateOfBirth", e.target.value)} />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select value={formData.personalInfo.gender} onChange={(e) => updateFormData("personalInfo", "gender", e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Blood Group</label>
                <select value={formData.personalInfo.bloodGroup} onChange={(e) => updateFormData("personalInfo", "bloodGroup", e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nationality</label>
                <Input value={formData.personalInfo.nationality} onChange={(e) => updateFormData("personalInfo", "nationality", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold">Address & Contact</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
              <h3 className="font-medium text-blue-900 mb-2">Current Address *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street *</label>
                  <Input value={formData.addressInfo.street} onChange={(e) => updateFormData("addressInfo", "street", e.target.value)} />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <Input value={formData.addressInfo.city} onChange={(e) => updateFormData("addressInfo", "city", e.target.value)} />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <Input value={formData.addressInfo.state} onChange={(e) => updateFormData("addressInfo", "state", e.target.value)} />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <Input value={formData.addressInfo.pincode} onChange={(e) => updateFormData("addressInfo", "pincode", e.target.value)} />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                </div>

                <div>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="mr-2" checked={formData.addressInfo.permanentAddress.isSameAsCurrent} onChange={(e) => setFormData(prev => ({
                      ...prev,
                      addressInfo: {
                        ...prev.addressInfo,
                        permanentAddress: {
                          ...prev.addressInfo.permanentAddress,
                          isSameAsCurrent: e.target.checked
                        }
                      }
                    }))} />
                    Same as Current Address
                  </label>
                </div>

                {!formData.addressInfo.permanentAddress.isSameAsCurrent && (
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium">Permanent Address</label>
                    <Input placeholder="Street" value={formData.addressInfo.permanentAddress.street} onChange={(e) => setFormData(prev => ({
                      ...prev,
                      addressInfo: {
                        ...prev.addressInfo,
                        permanentAddress: {
                          ...prev.addressInfo.permanentAddress,
                          street: e.target.value
                        }
                      }
                    }))} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input placeholder="City" value={formData.addressInfo.permanentAddress.city} onChange={(e) => setFormData(prev => ({
                        ...prev,
                        addressInfo: {
                          ...prev.addressInfo,
                          permanentAddress: {
                            ...prev.addressInfo.permanentAddress,
                            city: e.target.value
                          }
                        }
                      }))} />
                      <Input placeholder="State" value={formData.addressInfo.permanentAddress.state} onChange={(e) => setFormData(prev => ({
                        ...prev,
                        addressInfo: {
                          ...prev.addressInfo,
                          permanentAddress: {
                            ...prev.addressInfo.permanentAddress,
                            state: e.target.value
                          }
                        }
                      }))} />
                      <Input placeholder="Pincode" value={formData.addressInfo.permanentAddress.pincode} onChange={(e) => setFormData(prev => ({
                        ...prev,
                        addressInfo: {
                          ...prev.addressInfo,
                          permanentAddress: {
                            ...prev.addressInfo.permanentAddress,
                            pincode: e.target.value
                          }
                        }
                      }))} />
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="w-16 h-16 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold">Department Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department *</label>
                <select value={formData.departmentInfo.department} onChange={(e) => updateFormData("departmentInfo", "department", e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Designation *</label>
                <select value={formData.departmentInfo.designation} onChange={(e) => updateFormData("departmentInfo", "designation", e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="">Select Designation</option>
                  {designations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Employee ID *</label>
                <Input value={formData.departmentInfo.employeeId} onChange={(e) => updateFormData("departmentInfo", "employeeId", e.target.value)} />
                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Joining Date *</label>
                <Input type="date" value={formData.departmentInfo.joiningDate} onChange={(e) => updateFormData("departmentInfo", "joiningDate", e.target.value)} />
                {errors.joiningDate && <p className="text-red-500 text-xs mt-1">{errors.joiningDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Reporting Officer *</label>
                <Input value={formData.departmentInfo.reportingOfficer} onChange={(e) => updateFormData("departmentInfo", "reportingOfficer", e.target.value)} />
                {errors.reportingOfficer && <p className="text-red-500 text-xs mt-1">{errors.reportingOfficer}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Work Location</label>
                <Input value={formData.departmentInfo.workLocation} onChange={(e) => updateFormData("departmentInfo", "workLocation", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCard className="w-16 h-16 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold">Identity Proof</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ID Proof Type *</label>
                <select value={formData.identityProof.type} onChange={(e) => updateFormData("identityProof", "type", e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="">Select ID Proof</option>
                  {idProofTypes.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                {errors.idType && <p className="text-red-500 text-xs mt-1">{errors.idType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ID Number *</label>
                <Input value={formData.identityProof.number} onChange={(e) => updateFormData("identityProof", "number", e.target.value)} />
                {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Issuing Authority</label>
                <Input value={formData.identityProof.issuingAuthority} onChange={(e) => updateFormData("identityProof", "issuingAuthority", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Issue Date</label>
                <Input type="date" value={formData.identityProof.issueDate} onChange={(e) => updateFormData("identityProof", "issueDate", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <Input type="date" value={formData.identityProof.expiryDate} onChange={(e) => updateFormData("identityProof", "expiryDate", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="w-16 h-16 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold">Document Upload</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "profilePhoto", label: "Profile Photo" },
                { key: "idProof", label: "ID Proof Document" },
                { key: "addressProof", label: "Address Proof" },
                { key: "departmentLetter", label: "Department Letter" },
                { key: "joiningLetter", label: "Joining Letter" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1">{f.label} *</label>
                  <input type="file" accept="image/*,.pdf" className="w-full" onChange={(e) => handleFileUpload(f.key, e.target.files?.[0] || null)} />
                  {uploadedFiles[f.key] && (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploadedFiles[f.key]?.preview && uploadedFiles[f.key]?.name.endsWith(".pdf") ? (
                          <span className="text-xs">PDF: {uploadedFiles[f.key]?.name}</span>
                        ) : (
                          <img src={uploadedFiles[f.key]?.preview} alt="preview" className="w-16 h-16 object-cover rounded-md" />
                        )}
                        <div className="text-sm">
                          <div className="font-medium">{uploadedFiles[f.key]?.name}</div>
                          <div className="text-xs text-muted-foreground">{Math.round((uploadedFiles[f.key]!.size / 1024) * 10) / 10} KB</div>
                        </div>
                      </div>
                      <button className="text-red-500" onClick={() => setUploadedFiles(prev => ({ ...prev, [f.key]: null }))}><X /></button>
                    </div>
                  )}
                  {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Lock className="w-16 h-16 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold">Account Setup</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username *</label>
                <Input value={formData.accountDetails.username} onChange={(e) => updateFormData("accountDetails", "username", e.target.value)} />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={formData.accountDetails.password} onChange={(e) => updateFormData("accountDetails", "password", e.target.value)} />
                  <button type="button" className="absolute right-2 top-2" onClick={() => setShowPassword(p => !p)}>{showPassword ? <EyeOff /> : <Eye />}</button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} value={formData.accountDetails.confirmPassword} onChange={(e) => updateFormData("accountDetails", "confirmPassword", e.target.value)} />
                  <button type="button" className="absolute right-2 top-2" onClick={() => setShowConfirmPassword(p => !p)}>{showConfirmPassword ? <EyeOff /> : <Eye />}</button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Requested Role</label>
                <select value={formData.accountDetails.requestedRole} onChange={(e) => updateFormData("accountDetails", "requestedRole", e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold">Verification & Consent</h2>
            </div>

            <div className="p-4 border rounded-md bg-yellow-50">
              <h3 className="font-medium mb-2">DigiLocker Verification</h3>
              {verificationStatus.digiLockerVerification.status === "processing" ? (
                <div className="flex items-center gap-2">Processing <Loader2 className="w-4 h-4 animate-spin" /></div>
              ) : verificationStatus.digiLockerVerification.status === "verified" ? (
                <div className="text-green-600 flex items-center gap-2"><CheckCircle /> Verified</div>
              ) : (
                <Button onClick={initiateDigiLockerVerification}>Verify via DigiLocker</Button>
              )}
            </div>

            <div className="p-4 border rounded-md bg-blue-50">
              <h3 className="font-medium mb-2">AI & Face Verification</h3>
              <div>ID Proof: {verificationStatus.aiVerification.status} ({verificationStatus.aiVerification.confidence}%)</div>
              <div>Face Match: {verificationStatus.faceVerification.status} ({verificationStatus.faceVerification.confidence}%)</div>
              {verificationStatus.aiVerification.issues.length > 0 && (
                <ul className="text-red-500 list-disc pl-5 mt-2">
                  {verificationStatus.aiVerification.issues.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              )}
            </div>

            <div className="p-4 border rounded-md bg-green-50 space-y-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" checked={formData.consent.digiLockerConsent} onChange={(e) => setFormData(prev => ({ ...prev, consent: { ...prev.consent, digiLockerConsent: e.target.checked } }))} />
                Consent for DigiLocker Verification *
              </label>

              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" checked={formData.consent.dataProcessingConsent} onChange={(e) => setFormData(prev => ({ ...prev, consent: { ...prev.consent, dataProcessingConsent: e.target.checked } }))} />
                Consent for Data Processing *
              </label>

              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" checked={formData.consent.termsAndConditions} onChange={(e) => setFormData(prev => ({ ...prev, consent: { ...prev.consent, termsAndConditions: e.target.checked } }))} />
                Accept Terms & Conditions *
              </label>

              {errors.digiLocker && <p className="text-red-500 text-xs">{errors.digiLocker}</p>}
              {errors.dataProcessing && <p className="text-red-500 text-xs">{errors.dataProcessing}</p>}
              {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Stepper */}
      <div className="flex justify-between mb-6">
        {steps.map((s) => (
          <div key={s.id} className="flex-1 text-center">
            <s.icon className={`w-5 h-5 mx-auto ${currentStep === s.id ? "text-primary" : "text-gray-300"}`} />
            <div className={`text-xs mt-1 ${currentStep === s.id ? "font-semibold text-primary" : "text-gray-400"}`}>{s.title}</div>
          </div>
        ))}
      </div>

      <div>{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setCurrentStep(p => Math.max(p - 1, 1))} disabled={currentStep === 1}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>

        {currentStep < 7 ? (
          <Button onClick={() => { if (validateStep(currentStep)) setCurrentStep(p => Math.min(p + 1, 7)); }}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Submit
          </Button>
        )}
      </div>

      {/* Submission Status */}
      {submitStatus && (
        <div className="mt-4">
          <Alert>
            <div className="flex items-start gap-3">
              {submitStatus.success ? <CheckCircle className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
              <AlertDescription>
                <div className="font-medium">{submitStatus.message}</div>
                {submitStatus.requestId && <div className="text-xs text-muted-foreground">Request ID: {submitStatus.requestId}</div>}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default Registration;
