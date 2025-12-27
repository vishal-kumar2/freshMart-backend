import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

/* ================= PUBLIC ROUTES ================= */
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);

/* ================= ADMIN ROUTES ================= */
router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  createProduct
);

router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct
);

router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

export const products= router;
