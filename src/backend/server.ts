// src/server.js

import express, {Application} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import noteRoutes from './routes/noteRoutes';
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import {apiLimiter} from "./middlewares/rateLimiter";

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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ message: 'AI Note-taking backend is running!' });
});

//app.use(express.static(path.join(__dirname, "../../dist")));

//app.get("*", (req,res)=>{
//	res.sendFile(path.join(__dirname, "../../dist/index.html"));
//})

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});