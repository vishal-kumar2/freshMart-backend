import mongoose from "mongoose";

/* ================= CART ITEM SCHEMA ================= */
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    price: {
      type: Number,
      required: true, // snapshot price
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    unit: {
      type: String,
      enum: ["kg", "gm", "ltr", "ml", "pcs"],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

/* ================= CART SCHEMA ================= */
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },

    items: [cartItemSchema],

    totalItems: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ================= AUTO CALCULATIONS ================= */
cartSchema.pre("save", function (next) {
  let totalItems = 0;
  let totalPrice = 0;

  this.items.forEach((item) => {
    item.subtotal = item.price * item.quantity;
    totalItems += item.quantity;
    totalPrice += item.subtotal;
  });

  this.totalItems = totalItems;
  this.totalPrice = totalPrice;

  next();
});

export const Cart = mongoose.model("Cart", cartSchema);
