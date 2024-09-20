import express from 'express';
import { sendOtp, sendReAuthOtp, verifyOtp, verifyReAuthOtp } from '../controllers/authController.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp );
router.post('/verify-otp', verifyOtp );

router.post("/send-reauth-otp", verifyJWT, sendReAuthOtp);
router.post("/verify-reauth-otp", verifyJWT, verifyReAuthOtp);

export default router;
