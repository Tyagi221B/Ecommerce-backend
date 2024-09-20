import { NextFunction, Request, RequestHandler, Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody, EditUserInfoRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

// Register User Controller
export const registerUser = asyncHandler(
  async (
    req: Request<{}, {}, NewUserRequestBody>, // Types for request body
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, phone } = req.body;

    // Validate that all fields are provided
    if (!name || !email || !phone) {
      throw new ApiError(400, 'Please provide name, email, and phone');
    }

    try {
      // Check if the user already exists by phone
      let user = await User.findOne({ phone });
      console.log('This is User', user);

      if (user) {
        // User already exists, return a welcome message
        const response = new ApiResponse(
          200,
          user,
          `Welcome again, ${user.name}`
        );
        return res.status(response.statusCode).json(response);
      }

      // Create new user
      user = await User.create({ name, email, phone });

      // Generate access and refresh tokens
      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id as string);

      // Set cookies for tokens
      res.cookie('accessToken', accessToken, {
        httpOnly: true, // Prevents JavaScript access to cookies
        secure: process.env.NODE_ENV === 'production', // Secure in production (HTTPS)
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 60 * 60 * 1000 * 24, // Access token valid for a day
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // Refresh token valid for 7 days
      });

      // Send success response with user details
      const response = new ApiResponse(
        201,
        { id: user._id, name: user.name, email: user.email, phone: user.phone },
        'User registered successfully'
      );
      return res.status(response.statusCode).json(response);

    } catch (error) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        next(new ApiError(500, 'Error registering user', [error.message]));
      } else {
        // If it's not an Error instance, handle it generically
        next(new ApiError(500, 'Error registering user'));
      }
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
  const { phone } = req.params;
  const user = await User.findOne({ phone }).populate('addresses');

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  return res.status(200).json({
    success: true,
    user,
  });
});

export const getUserByPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;

    // Find the user by phone and populate the addresses field
    const user = await User.findOne({ phone }).populate('addresses');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Send the response with the user and populated addresses
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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

// Edit User Info Controller
export const editUserInfo = asyncHandler(
  async (
    req, res, next
  ) => {
    const { id } = req.params; // ID comes from the URL params
    const { name, email, phone } = req.body; // Editable fields come from the request body

    // Validate input: Make sure at least one field is provided
    if (!name && !email && !phone) {
      throw new ApiError(400, 'Please provide at least one field to update: name, email, or phone');
    }

    try {
      // Find the user by their ID
      const user = await User.findById(id);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Update the user with the provided fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;

      // Save the updated user to the database
      await user.save();

      // Send a success response with the updated user details
      const response = new ApiResponse(
        200,
        { id: user._id, name: user.name, email: user.email, phone: user.phone },
        'User information updated successfully'
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      // Handle errors (e.g., database errors, validation errors)
      if (error instanceof Error) {
        next(new ApiError(500, 'Error updating user information', [error.message]));
      } else {
        next(new ApiError(500, 'Error updating user information'));
      }
    }
  }
);



