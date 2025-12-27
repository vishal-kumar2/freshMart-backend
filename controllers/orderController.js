import asyncHandler from "express-async-handler";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { Address } from "../models/addressModel.js";

/* ================= PLACE ORDER ================= */
export const placeOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  if (!addressId || !paymentMethod) {
    res.status(400);
    throw new Error("Address and payment method are required");
  }

  // Get user cart
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  // Get selected address
  const address = await Address.findOne({
    _id: addressId,
    user: req.user.id,
  });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    orderItems: cart.items,
    shippingAddress: {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    },
    paymentMethod,
    itemsPrice: cart.totalPrice,
    deliveryFee: cart.totalPrice > 500 ? 0 : 40,
    totalPrice: cart.totalPrice + (cart.totalPrice > 500 ? 0 : 40),
  });

  // Reduce product stock
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

/* ================= GET USER ORDERS ================= */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

/* ================= GET SINGLE ORDER ================= */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "username email"
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Security check
  if (
    order.user._id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.status(200).json({
    success: true,
    order,
  });
});

/* ================= MARK ORDER AS PAID ================= */
export const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = "Paid";
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    email: req.body.email,
  };

  await order.save();

  res.status(200).json({
    success: true,
    message: "Payment successful",
    order,
  });
});

/* ================= ADMIN: GET ALL ORDERS ================= */
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

/* ================= ADMIN: UPDATE ORDER STATUS ================= */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated",
    order,
  });
});
