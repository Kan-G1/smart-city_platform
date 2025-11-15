import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const { PORT = 4000, MONGO_URI } = process.env;

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'smartcity' });
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
  } catch (e) {
    console.error('DB connection failed:', e);
    process.exit(1);
  }
}

start();