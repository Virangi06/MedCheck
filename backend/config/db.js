const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds to find a server
      socketTimeoutMS: 45000,          // 45 seconds for socket ops
      connectTimeoutMS: 10000,         // 10 seconds to establish connection
      maxPoolSize: 10,                 // max 10 connections in pool
      retryWrites: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Graceful disconnect on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed on app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);

    // Provide a clearer hint for the most common Atlas errors
    if (err.message.includes('IP') || err.message.includes('whitelist') || err.message.includes('Atlas')) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('🔧 FIX REQUIRED — MongoDB Atlas IP Whitelist:');
      console.error('   1. Go to https://cloud.mongodb.com');
      console.error('   2. Click your Cluster → Security → Network Access');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('      OR add only your current IP for better security');
      console.error('   5. Click Confirm and wait ~30 seconds');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
    }

    if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('🔧 FIX REQUIRED — Wrong MongoDB credentials in .env');
      console.error('   Check MONGO_URI username and password in .env file');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
    }

    process.exit(1);
  }
};

module.exports = connectDB;