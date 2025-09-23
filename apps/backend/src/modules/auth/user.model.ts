import { Schema, model, InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, index: true, unique: true, sparse: true },
    phone: { type: String, index: true, unique: true, sparse: true },
    passwordHash: { type: String }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: string };
export const User = model('User', UserSchema);
