// apps/backend/src/modules/tourist/tourist.model.ts
import { Schema, model, InferSchemaType } from 'mongoose';

const EncryptedDocSchema = new Schema(
  {
    path: { type: String, required: true },
    mime: { type: String, required: true },
    size: { type: Number, required: true },
    iv: { type: String, required: true },   // base64
    tag: { type: String, required: true },  // base64
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const IndianDocsSchema = new Schema(
  {
    travelTicketDoc: { type: EncryptedDocSchema, required: false },
    hotelBookingDoc: { type: EncryptedDocSchema, required: false },
    specialPermitsDoc: { type: EncryptedDocSchema, required: false },
  },
  { _id: false }
);

const InternationalDocsSchema = new Schema(
  {
    passportDoc: { type: EncryptedDocSchema, required: false },
    visaDoc: { type: EncryptedDocSchema, required: false },
    travelTicketDoc: { type: EncryptedDocSchema, required: false },
    hotelBookingDoc: { type: EncryptedDocSchema, required: false },
  },
  { _id: false }
);
const TouristTripSchema = new Schema(
  {
    tid: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },             // logged-in user identifier
    holderPid: { type: String, required: true, index: true },          // personal ID reference

    travelerType: { type: String, enum: ['indian', 'international'], default: 'indian' },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    destination: { type: String, required: false },
    status: { type: String, enum: ['active','scheduled','expired'], index: true },

    itinerary: { type: String },
    agencyId: { type: String },
    homeCity: { type: String },

    // Optional documents (encrypted-at-rest, like PID docs)
    indian: { type: IndianDocsSchema, default: {} },
    international: { type: InternationalDocsSchema, default: {} },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export type TouristTripDoc = InferSchemaType<typeof TouristTripSchema> & { _id: string };

export const TouristTrip = model<TouristTripDoc>('TouristTrip', TouristTripSchema);
