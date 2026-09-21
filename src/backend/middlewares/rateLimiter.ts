import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
	windowMs: 15*60*1000,
	max: 50,
	message: {message: "Too many requests from this IP, please try again later"},
	standardHeaders: true,
	legacyHeaders: false,
	
})


export const authLimiter = rateLimit({
	windowMs: 60*60*1000,
	max: 53,
	message: {message: "Too many account attempts from this IP. Try again after an hour"},
	standardHeaders: true,
	legacyHeaders: false
})