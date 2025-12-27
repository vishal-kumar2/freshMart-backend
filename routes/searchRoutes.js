import { Router } from "express";
import { searchProducts } from "../controllers/searchController.js";

const router = Router();

/*
GET /api/search
Query params:
- q        → keyword
- category → category filter
- minPrice → minimum price
- maxPrice → maximum price
- sort     → price_asc | price_desc | rating | newest
- page     → page number
- limit    → items per page
*/
router.get("/search", searchProducts);

export const search= router;
