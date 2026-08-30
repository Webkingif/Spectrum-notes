// src/server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows Express to parse JSON bodies

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