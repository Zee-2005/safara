// apps/backend/src/modules/pid/pid.model.ts
import { Schema, model, InferSchemaType } from 'mongoose';

const EncryptedDocSchema = new Schema({
  path: { type: String, required: true },        // server-side storage path (not public)
  mime: { type: String, required: true },
  size: { type: Number, required: true },
  iv: { type: String, required: true },          // base64
  tag: { type: String, required: true },         // base64 (GCM auth tag)
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const PersonalIdApplicationSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },

    mobileVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    documentVerified: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ['pending_verification', 'manual_review', 'verified', 'rejected'],
      default: 'pending_verification'
    },

    aadhaarDoc: { type: EncryptedDocSchema },     // NEW: encrypted at rest
    // Extracted fields (never store raw Aadhaar; only hash)
    aadhaarHash: { type: String },    // SHA-256 of Aadhaar number
    dob: { type: String }  ,
    // inside schema definition
personalId: { type: String, unique: true }, // NEW

  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type PersonalIdApplicationDoc = InferSchemaType<typeof PersonalIdApplicationSchema> & { _id: string };
export const PersonalIdApplication = model('PersonalIdApplication', PersonalIdApplicationSchema);
