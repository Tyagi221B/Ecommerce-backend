// controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { client, serviceSid } from '../utils/twilio.config.js';
import { TryCatch } from '../middlewares/error.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error while generating refresh and access tokens', error);
    throw new Error('Token generation failed');
  }
};

export const sendOtp = TryCatch(async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `${phone}`, channel: 'sms' });

    res.status(200).json({ message: 'OTP sent successfully', status: verification.status});
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

export const verifyOtp = TryCatch(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  // Ensure that both phone and otp are present
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    // Verify OTP using Twilio's verification service
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `${phone}`, code: otp });

    console.log(verificationCheck); // Log the verification result

    // If OTP is approved
    if (verificationCheck.status === 'approved') {
      // Check if user already exists
      let user = await User.findOne({ phone });
      console.log(user); // Log the user object

      // If user exists, generate access and refresh tokens
      if (user) {
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id as string);

        // Set cookies for tokens
        res.cookie('refreshToken', refreshToken, {
          httpOnly: false, // Prevents client-side JavaScript access for security
          secure: false, // Only send cookie over HTTPS in production
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.cookie('accessToken', accessToken, {
          httpOnly: false, // This could be false if you need the accessToken on the client-side
          secure: false,
          maxAge: 60 * 60 * 1000 * 24, // a day
        });

        return res.status(200).json({
          message: 'User logged in successfully',
          status: "OK",
          user,
        });
      } else {
        // If user doesn't exist, return success with a register flag
        return res.status(200).json({
          message: 'User verified successfully, but user not found. Please register.',
          status: "VERIFIED",
          register: true, // This flag will indicate that the user should register
        });
      }
    } else {
      // OTP not approved (invalid or expired OTP)
      return res.status(400).json({ message: 'Invalid OTP', status: "OTP_FAILED" });
    }
  } catch (error: any) {
    // Error occurred during verification
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});

// controllers/authController.ts


export const sendReAuthOtp = TryCatch(async (req: Request, res: Response) => {
  const { phone } = (req as any).user; // Assuming phone number is stored in user object

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `${phone}`, channel: "sms" });

    res.status(200).json({ message: "OTP sent successfully", status: verification.status });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
});

// controllers/authController.ts

export const verifyReAuthOtp = TryCatch(async (req: Request, res: Response) => {
  const { otp } = req.body;
  const { phone, _id } = (req as any).user; // Get phone and user ID from authenticated user

  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `${phone}`, code: otp });

    if (verificationCheck.status === "approved") {
      // Generate a re-authentication token
      const reAuthToken = jwt.sign({ _id }, process.env.RE_AUTH_TOKEN_SECRET!, { expiresIn: "5m" });

      res.status(200).json({ message: "Re-authentication successful", reAuthToken });
    } else {
      return res.status(400).json({ message: "Invalid OTP", status: "OTP_FAILED" });
    }
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
});


