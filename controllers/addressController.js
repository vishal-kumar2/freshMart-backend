import asyncHandler from "express-async-handler";
import { Address } from "../models/addressModel.js";

/* ================= ADD NEW ADDRESS ================= */
export const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    country,
    addressType,
    isDefault,
  } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    res.status(400);
    throw new Error("All required fields must be filled");
  }

  // If setting this address as default, unset previous defaults
  if (isDefault) {
    await Address.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );
  }

  const address = await Address.create({
    user: req.user.id,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    country,
    addressType,
    isDefault,
  });

  res.status(201).json({
    success: true,
    address,
  });
});

/* ================= GET ALL USER ADDRESSES ================= */
export const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user.id }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    addresses,
  });
});

/* ================= GET SINGLE ADDRESS ================= */
export const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  res.status(200).json({
    success: true,
    address,
  });
});

/* ================= UPDATE ADDRESS ================= */
export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  // If updating to default, unset others
  if (req.body.isDefault) {
    await Address.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );
  }

  Object.assign(address, req.body);
  await address.save();

  res.status(200).json({
    success: true,
    address,
  });
});

/* ================= DELETE ADDRESS ================= */
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  await address.deleteOne();

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

/* ================= SET DEFAULT ADDRESS ================= */
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  await Address.updateMany(
    { user: req.user.id },
    { isDefault: false }
  );

  address.isDefault = true;
  await address.save();

  res.status(200).json({
    success: true,
    message: "Default address updated",
    address,
  });
});
