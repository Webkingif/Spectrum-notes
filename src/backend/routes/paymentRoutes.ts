import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { initializePayment, verifyPayment } from '../controllers/paymentController';

const router = express.Router();

// Both routes must be protected so we know WHICH user is trying to upgrade
router.post('/initialize', protect, initializePayment);
router.post('/verify', protect, verifyPayment);

export default router;