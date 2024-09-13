// controllers/authController.ts
import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { client, serviceSid } from '../utils/twilio.config.js';
import { TryCatch } from '../middlewares/error.js';

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

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `${phone}`, code: otp });

    if (verificationCheck.status === 'approved') {
      let user = await User.findOne({phone});

      console.log(user);

      if (user) {
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id as string);
        return res.status(200).json({
          message: 'User logged in successfully',
          accessToken,
          refreshToken,
          status: "OK",
          user,
        });
      } else {
        return res.status(404).json({ message: 'User not found, please register.', register: true });
      }
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});
