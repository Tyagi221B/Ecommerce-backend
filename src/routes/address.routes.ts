import express from "express";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  getAddressesForUser,
  getAddressById
} from "../controllers/address.controller.js";

const router = express.Router();

// POST - Add a new address
router.post("/addresses", addAddress);

// PUT - Update an address by ID
router.put("/addresses/:addressId", updateAddress);

// DELETE - Delete an address by ID (userId may not be necessary here)
router.delete("/addresses/:addressId", deleteAddress);

// GET - Get all addresses for a specific user
router.get("/addresses/user/:userId", getAddressesForUser);

// GET - Get a specific address by ID
router.get("/addresses/:addressId", getAddressById);

export default router;
