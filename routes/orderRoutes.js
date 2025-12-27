import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  markOrderAsPaid,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

/* ================= USER ROUTES ================= */

// Place order (cart → order)
router.post("/orders", authMiddleware, placeOrder);

// Get logged-in user's orders
router.get("/orders/my-orders", authMiddleware, getMyOrders);

// Get single order (user or admin)
router.get("/orders/:id", authMiddleware, getOrderById);

// Mark order as paid (after payment)
router.put("/orders/:id/pay", authMiddleware, markOrderAsPaid);

/* ================= ADMIN ROUTES ================= */

// Get all orders
router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// Update order status
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

export const orders= router;
