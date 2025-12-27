import asyncHandler from "express-async-handler";
import { Product } from "../models/productModel.js";

/* ================= PRODUCT SEARCH ================= */
/*
Query params supported:
- q        → search keyword
- category → filter by category
- minPrice → minimum price
- maxPrice → maximum price
- sort     → price_asc | price_desc | newest | rating
- page     → page number
- limit    → items per page
*/
export const searchProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {
    isAvailable: true,
  };

  /* ===== TEXT SEARCH ===== */
  if (q) {
    filters.$text = { $search: q };
  }

  /* ===== CATEGORY FILTER ===== */
  if (category) {
    filters.category = category;
  }

  /* ===== PRICE FILTER ===== */
  if (minPrice || maxPrice) {
    filters.finalPrice = {};
    if (minPrice) filters.finalPrice.$gte = Number(minPrice);
    if (maxPrice) filters.finalPrice.$lte = Number(maxPrice);
  }

  /* ===== SORTING ===== */
  let sortOption = {};
  switch (sort) {
    case "price_asc":
      sortOption = { finalPrice: 1 };
      break;
    case "price_desc":
      sortOption = { finalPrice: -1 };
      break;
    case "rating":
      sortOption = { ratings: -1 };
      break;
    default:
      sortOption = { createdAt: -1 }; // newest
  }

  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(filters)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const totalResults = await Product.countDocuments(filters);

  res.status(200).json({
    success: true,
    totalResults,
    currentPage: Number(page),
    totalPages: Math.ceil(totalResults / limit),
    products,
  });
});
