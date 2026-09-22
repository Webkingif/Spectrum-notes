import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/authMiddleware';
import User from '../models/User';
// import User from '../models/User'; (If you need to verify anything about the user)

export const initializePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tier } = req.body;

    // 1. Set the prices (in kobo - multiply NGN by 100)
    let amount = 0;
    if (tier === 'plus') {
      amount = 200000; // ₦2,000
    } else if (tier === 'pro') {
      amount = 500000; // ₦5,000
    } else {
      res.status(400).json({ message: "Invalid tier selected" });
      return;
    }

    // 2. Generate a highly unique reference for this specific transaction
    // Combines a prefix, the current timestamp, and the user's ID
    const reference = `UPGRADE_${Date.now()}_${req.user._id}`;

    // 3. Send it back to your CheckoutButton.tsx
    res.status(200).json({
      reference,
      amount
    });

  } catch (error) {
    console.error("Initialize payment error:", error);
    res.status(500).json({ message: "Failed to initialize payment" });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { reference } = req.body;

  if (!reference) {
    res.status(400).json({ message: "Transaction reference is required" });
    return;
  }

  try {
    // 1. Ask Paystack directly if this transaction was successful
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });

    const paystackData = await paystackRes.json();

    // 2. Check if the payment status is actually 'success'
    if (paystackData.data && paystackData.data.status === 'success') {
      
      // 3. Determine the tier based on the EXACT amount Paystack charged (in kobo)
      const amountPaid = paystackData.data.amount;
      let newTier = 'free';
      
      if (amountPaid === 200000) { // ₦2,000
        newTier = 'plus';
      } else if (amountPaid === 500000) { // ₦5,000
        newTier = 'pro';
      }

      // 4. Update the user in your database
      await User.findByIdAndUpdate(req.user._id, { tier: newTier });

      // 5. Send success back to the frontend
      res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully.",
        tier: newTier
      });
      
    } else {
      res.status(400).json({ success: false, message: "Payment was not successful." });
    }

  } catch (error) {
    console.error("Paystack verification error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};