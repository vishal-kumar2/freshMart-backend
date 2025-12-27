import asyncHandler from "express-async-handler";
import { Product } from "../models/productModel.js";

/* ================= CREATE PRODUCT (ADMIN ONLY) ================= */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

/* ================= GET SINGLE PRODUCT ================= */
export const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/* ================= UPDATE PRODUCT (ADMIN ONLY) ================= */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Update fields
  Object.assign(product, req.body);

  // IMPORTANT: save() triggers pre("save") hook
  await product.save();

  res.status(200).json({
    success: true,
    product,
  });
});

/* ================= DELETE PRODUCT (ADMIN ONLY) ================= */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

/* ================= GET ALL PRODUCTS ================= */
// Search + Filter + Pagination
export const getAllProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Search
  const keyword = req.query.keyword
    ? { $text: { $search: req.query.keyword } }
    : {};

  // Category filter
  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const filter = {
    ...keyword,
    ...category,
    isAvailable: true,
  };

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalProducts = await Product.countDocuments(filter);

  res.status(200).json({
    success: true,
    totalProducts,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),
    products,
  });
});
