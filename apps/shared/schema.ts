import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// SOS Emergency schema
export const sosEmergencies = pgTable("sos_emergencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  userPhone: text("user_phone"),
  location: json("location").$type<{ lat: number; lng: number }>(),
  description: text("description"),
  status: text("status").$type<'active' | 'escalated' | 'resolved'>().default('active'),
  emergencyContacts: json("emergency_contacts").$type<Array<{name: string; phone: string; relationship: string}>>(),
  createdAt: timestamp("created_at").defaultNow(),
  escalatedAt: timestamp("escalated_at"),
  resolvedAt: timestamp("resolved_at"),
  audioRecordingUrl: text("audio_recording_url"),
  photoUrls: json("photo_urls").$type<string[]>(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSOSEmergencySchema = createInsertSchema(sosEmergencies).omit({
  id: true,
  createdAt: true,
  escalatedAt: true,
  resolvedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SOSEmergency = typeof sosEmergencies.$inferSelect;
export type InsertSOSEmergency = z.infer<typeof insertSOSEmergencySchema>;
