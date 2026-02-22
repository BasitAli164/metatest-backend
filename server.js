import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import testRoutes from './src/routes/testRoutes.js';

dotenv.config();

const app = express();

// Updated CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://metatest-frontend.vercel.app',  // 👈 Apna actual Vercel URL
    'https://metatest-frontend.vercel.app/'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/metatest')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/tests', testRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: '🟢 MetaTest API is running' });
});

// Test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});