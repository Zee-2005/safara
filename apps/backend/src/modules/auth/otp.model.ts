import { Schema, model } from 'mongoose';

const OtpSchema = new Schema(
  {
    phone: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const OtpRequest = model('OtpRequest', OtpSchema);
