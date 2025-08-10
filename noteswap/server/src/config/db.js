import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: mongoUri.split('/').pop()?.split('?')[0],
  });
  console.log('Connected to MongoDB');
}