import { Request, Response } from "express";
import mongoose from "mongoose";
import { Address } from "../models/address.model.js";
import { User } from "../models/user.model.js";

// Add a new address for a user
export const addAddress = async (req: Request, res: Response) => {
  try {
    const { userId, street, city, state, zipCode, country, phoneNumber, addressType } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Cast userId to ObjectId (since req.body fields are typically strings)
    const userObjectId = new mongoose.Types.ObjectId(userId as string);

    // Validate user existence
    const user = await User.findById(userObjectId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new address
    const newAddress = new Address({
      user: userObjectId,
      street,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
      addressType,
    });

    // Save address to DB
    await newAddress.save();

    // Update user's addresses (for future population convenience)
    user.addresses.push(newAddress._id as mongoose.Types.ObjectId);
    await user.save();

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// Update an existing address for a user
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const { street, city, state, zipCode, country, phoneNumber, addressType, userId } = req.body;

    console.log(req.body)
    if (!mongoose.Types.ObjectId.isValid(addressId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid address ID or user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the address exists
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Check how many users reference this address
    const addressReferenceCount = await User.countDocuments({ addresses: addressId });

    if (addressReferenceCount === 1) {
      // If only one user references the address, update it directly
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        {
          $set: {
            street: street || address.street,
            city: city || address.city,
            state: state || address.state,
            zipCode: zipCode || address.zipCode,
            country: country || address.country,
            phoneNumber: phoneNumber || address.phoneNumber,
            addressType: addressType || address.addressType
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }

      return res.status(200).json({
        message: "Address updated successfully (no cloning needed).",
        address: updatedAddress,
      });
    } else {
      // If more than one user references the address, clone it for the current user

      // Remove the reference of the old address from the user's addresses array
      user.addresses = user.addresses.filter(addrId => addrId.toString() !== addressId);
      await user.save();

      // Create a new address
      const newAddress = new Address({
        street: street || address.street,
        city: city || address.city,
        state: state || address.state,
        zipCode: zipCode || address.zipCode,
        country: country || address.country,
        phoneNumber: phoneNumber || address.phoneNumber,
        addressType: addressType || address.addressType
      });

      // Save the new address
      await newAddress.save();

      // Add the new address reference to the user's profile (cast _id as ObjectId)
      user.addresses.push(newAddress._id as mongoose.Types.ObjectId);
      await user.save();

      return res.status(200).json({
        message: "Address cloned and updated successfully.",
        address: newAddress,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      // Narrow down the error type to access `message`
      res.status(500).json({ message: "Server error", error: error.message });
    } else {
      // If the error is of an unknown type, send a generic error message
      res.status(500).json({ message: "Server error occurred" });
    }
  }
};

// Delete an address for a user
export const deleteAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params;
  const { userId } = req.body;  // Assuming userId is passed in the request body or from authentication
  try {
    // Validate addressId and userId
    if (!mongoose.Types.ObjectId.isValid(addressId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid address or user ID" });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the address exists
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Remove the address reference from the user's addresses array
    user.addresses = user.addresses.filter(addrId => addrId.toString() !== addressId);
    await user.save();

    // Check if any other users are still referencing this address
    const isAddressStillReferenced = await User.exists({ addresses: addressId });

    // If no other users reference this address, delete the address from the database
    if (!isAddressStillReferenced) {
      await Address.findByIdAndDelete(addressId);
      res.status(200).json({ message: "Address deleted successfully from both user and database." });
    } else {
      // If other users still reference it, just return a success message
      res.status(200).json({ message: "Address deleted successfully from your profile, but other users are still using it." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// Get all addresses for a user

export const getAddressesForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // console.log(userId);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find all addresses for the user
    const addresses = await Address.find({ user: userId }).lean();

    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// Get a specific address for a user
export const getAddressById = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    // Find address by ID
    const address = await Address.findById(addressId).lean();

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ address });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
