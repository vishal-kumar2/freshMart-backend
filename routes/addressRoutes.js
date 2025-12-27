import { Router } from "express";
import {
  addAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

/* ================= ADDRESS ROUTES (AUTH REQUIRED) ================= */

router.use(authMiddleware);

// Add new address
router.post("/addresses", addAddress);

// Get all addresses of logged-in user
router.get("/addresses", getUserAddresses);

// Get single address
router.get("/addresses/:id", getAddressById);

// Update address
router.put("/addresses/:id", updateAddress);

// Delete address
router.delete("/addresses/:id", deleteAddress);

// Set default address
router.patch("/addresses/:id/default", setDefaultAddress);

export const address= router;
