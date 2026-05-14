const mongoose = require('mongoose');

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

const connectDB = async (attempt = 1) => {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB connection error: MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`);

    if (attempt >= MAX_RETRIES) {
      process.exit(1);
    }

    setTimeout(() => connectDB(attempt + 1), RETRY_DELAY_MS);
  }
};

module.exports = connectDB;
