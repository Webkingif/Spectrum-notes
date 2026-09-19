import express from "express";
import {askAi} from "../controllers/aiController";
import { protect } from '../middlewares/authMiddleware'; 

const router = express.Router();

router.post("/chat", protect, askAi);



export default router;
