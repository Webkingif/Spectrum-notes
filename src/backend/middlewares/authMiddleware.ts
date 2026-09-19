import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend the Express Request type to include our user object
export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // 1. Check if the token was sent in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token using your secret key
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // 4. Find the user in the DB and attach them to the request (minus the password)
      req.user = await User.findById(decoded.id).select('-password');
      
      next(); // Move on to the controller!
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
  
};


