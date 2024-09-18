import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";

interface IAddress extends Document {
  user: mongoose.Schema.Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
  addressType?: "home" | "work" | "billing" | "shipping";
}

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      validate: [validator.isMobilePhone, "Please enter a valid phone number"],
    },
    addressType: {
      type: String,
      enum: ["home", "work", "billing", "shipping"],
      default: "home", 
    },
  },
  {
    timestamps: true,
  }
);

export const Address = mongoose.model<IAddress>("Address", addressSchema);
