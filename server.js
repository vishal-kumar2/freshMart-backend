import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "dotenv/config";
import cookieParser from "cookie-parser";

import { users } from "./routes/userRoutes.js";
import { products } from "./routes/productRoutes.js";
import { search } from "./routes/searchRoutes.js";
import { orders } from "./routes/orderRoutes.js";
import { cart } from "./routes/cartRoutes.js";
import { address } from "./routes/addressRoutes.js";

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
app.use(cookieParser());

app.use(express.json());

/* ================= DATABASE ================= */
connectDB();

/* ================= ROUTES ================= */
app.use("/api/users", users);

app.use("/api", products);
app.use("/api", search);
app.use("/api", orders);
app.use("/api", cart);
app.use("/api", address);

/* ================= DEFAULT ROUTE ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FreshMart API is running 🚀",
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
