import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    brand: { type: String, default: "Generic" },

    category: {
      type: String,
      required: true,
      enum: [
        "Fruits & Vegetables",
        "Dairy & Bakery",
        "Beverages",
        "Snacks",
        "Grains & Pulses",
        "Personal Care",
        "Household",
      ],
    },

    price: { type: Number, required: true },

    discount: { type: Number, default: 0, min: 0, max: 100 },

    finalPrice: { type: Number },

    stock: { type: Number, required: true, min: 0 },

    unit: {
      type: String,
      enum: ["kg", "gm", "ltr", "ml", "pcs"],
      required: true,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    expiryDate: Date,

    isAvailable: { type: Boolean, default: true },

    ratings: { type: Number, default: 0, min: 0, max: 5 },

    numOfReviews: { type: Number, default: 0 },

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Hooks
productSchema.pre("save", function (next) {
  this.finalPrice =
    this.discount > 0
      ? this.price - (this.price * this.discount) / 100
      : this.price;

  this.isAvailable = this.stock > 0;

  next();
});

// Search optimization
productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
