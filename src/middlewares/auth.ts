import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  // console.log(req.query)

  if (!id) return next(new ErrorHandler("Please Login first", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid user ID", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("Only admin can make this request", 403));

  next();
});
