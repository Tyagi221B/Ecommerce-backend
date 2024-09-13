import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

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


export const registerUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, phone } = req.body;

    try {
      let user = await User.findOne({phone});
      console.log("This is User", user);
  
      if (user)
        return res.status(200).json({
          success: true,
          message: `Welcome again, ${user.name}`,
        });
  
      if (!name || !email || !phone)
        return next(new ErrorHandler("Please add all fields", 400));
  
      user = await User.create({
        name,
        email,
        phone
      });
  
      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id as string);
          return res.status(200).json({
            message: 'User logged in successfully',
            accessToken,
            refreshToken,
            user: { id: user._id, fullname: user.name, email: user.email, phone: user.phone },
          });
    } catch (error) {
      console.error("Error registering user", error);
      res.status(500).json({message: "Error registering user", error});
      
    }
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const {phone} = req.params;
  const user = await User.findOne({phone});

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
