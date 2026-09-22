// src/server.js
import dotenv from 'dotenv';
import express from 'express';
import type {Application} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import type { Request, Response} from 'express';
import noteRoutes from './routes/noteRoutes';
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import {apiLimiter} from "./middlewares/rateLimiter";
import paymentRoutes from './routes/paymentRoutes';

// Load environment variables
dotenv.config();

const app:Application = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows Express to parse JSON bodies

app.use("/api", apiLimiter);
app.use('/api/notes', noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/payments', paymentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'AI Note-taking backend is running!' });
});

//app.use(express.static(path.join(__dirname, "../../dist")));

//app.get("*", (req,res)=>{
//	res.sendFile(path.join(__dirname, "../../dist/index.html"));
//})
console.log("GEMINI KEY STATUS:", process.env.GEMINI_API_KEY ? "✅ LOADED" : "❌ MISSING");
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});