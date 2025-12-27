import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

/* ================= CART ROUTES (AUTH REQUIRED) ================= */

// Get logged-in user's cart
router.get("/cart", authMiddleware, getCart);

// Add product to cart
router.post("/cart/add", authMiddleware, addToCart);

// Update product quantity in cart
router.put("/cart/update", authMiddleware, updateCartItem);

// Remove a product from cart
router.delete("/cart/remove/:productId", authMiddleware, removeCartItem);

// Clear entire cart
router.delete("/cart/clear", authMiddleware, clearCart);

export const cart= router;
