import asyncHandler from "express-async-handler";
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

/* ================= GET USER CART ================= */
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product",
    "name price images unit"
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
    });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

/* ================= ADD TO CART ================= */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const product = await Product.findById(productId);

  if (!product || !product.isAvailable) {
    res.status(404);
    throw new Error("Product not available");
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Product already in cart → update quantity
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    // New product
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price: product.finalPrice,
      quantity: quantity || 1,
      unit: product.unit,
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
});

/* ================= UPDATE CART ITEM ================= */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity < 1) {
    res.status(400);
    throw new Error("Invalid product or quantity");
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  item.quantity = quantity;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated",
    cart,
  });
});

/* ================= REMOVE ITEM FROM CART ================= */
export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cart,
  });
});

/* ================= CLEAR CART ================= */
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart,
  });
});
