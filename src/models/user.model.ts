import mongoose, {Document} from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";


interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  photo?: string;
  role: "admin" | "user";
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      unique: [true, "User with this email already exists"],
      required: [true, "Please enter Email"],
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    phone:{
      type: String,
      required: [true, "Please enter Phone Number"],
      index: true,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    
  },
  {
    timestamps: true,
  }
);
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          phone: this.phone,
          name: this.name,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
      {
          _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
  );
};


export const User = mongoose.model<IUser>("User", userSchema);

