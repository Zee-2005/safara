import mongoose from 'mongoose';
import { env } from '../config/env.js';

export async function connectMongo() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  return mongoose.connection;
}

export async function disconnectMongo() {
  await mongoose.disconnect();
}
