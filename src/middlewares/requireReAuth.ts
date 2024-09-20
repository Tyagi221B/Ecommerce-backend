import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiErrors.js";

// Extend Express's Request type to include reAuth property
interface CustomRequest extends Request {
  user?: any;
  reAuth?: boolean;
}

// Middleware to check re-authentication
export const requireReAuth = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const reAuthToken = req.header("X-ReAuth-Token");

    if (!reAuthToken) {
      throw new ApiError(401, "Re-authentication required");
    }

    const decoded = jwt.verify(
      reAuthToken,
      process.env.RE_AUTH_TOKEN_SECRET!
    ) as { _id: string };

    if (decoded._id !== req.user._id.toString()) {
      throw new ApiError(401, "Invalid re-authentication token");
    }

    // Optionally, check token expiry or other validations

    next();
  } catch (error: any) {
    throw new ApiError(401, error.message || "Re-authentication required");
  }
};
