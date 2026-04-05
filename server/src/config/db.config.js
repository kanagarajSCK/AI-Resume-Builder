// ============================================
// db.config.js - MongoDB Connection
// ============================================

import mongoose from 'mongoose'; // Mongoose ODM (MongoDB: Database Connection)

const buildMongoConnectionHelp = (mongoURI, error) => {
  const message = error?.message || 'Unknown MongoDB connection error';

  if (message.includes('querySrv')) {
    const isSrvUri = mongoURI?.startsWith('mongodb+srv://');

    return [
      message,
      isSrvUri
        ? 'Your DNS/network is refusing MongoDB Atlas SRV lookups.'
        : 'MongoDB SRV DNS lookup failed.',
      'If you are on a restricted network, try a non-SRV `mongodb://...` connection string from MongoDB Atlas or switch to a local MongoDB instance.',
      'Also check VPN, firewall, antivirus, or custom DNS settings that may block `_mongodb._tcp` lookups.',
    ].join(' ');
  }

  if (message.includes('ECONNREFUSED')) {
    return [
      message,
      'The MongoDB server refused the connection.',
      'Verify that your database is running and that the host, port, username, password, and IP access rules are correct.',
    ].join(' ');
  }

  return message;
};

// Using async/await pattern (JS Essentials: Async/Await)
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in your .env file');
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    }); // Mongoose connection (MongoDB: Database Connection)

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    return conn;
  } catch (error) {
    throw new Error(buildMongoConnectionHelp(mongoURI, error));
  }
};

export default connectDB;
