import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: any; 
}

interface JwtPayload {
    _id: string;
}

export const verifyJWT = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "You are not authorized to do this request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");  
        }
        throw new ApiError(401, "Invalid access token");
    }
});

