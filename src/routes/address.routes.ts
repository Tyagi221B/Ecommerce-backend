import express from "express";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  getAddressesForUser,
  getAddressById
} from "../controllers/address.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { requireReAuth } from "../middlewares/requireReAuth.js";

const router = express.Router();

router.post("/addresses",addAddress);

router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

// GET - Get all addresses for a specific user
router.get("/addresses/user/:userId", getAddressesForUser);

// GET - Get a specific address by ID
router.get("/addresses/:addressId", getAddressById);

export default router;
