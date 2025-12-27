
# 🛒 FreshMart – Grocery Website Backend

This repository contains the backend API for FreshMart, an online grocery shopping platform.
The backend is built using Node.js, Express, and MongoDB, providing secure authentication, product management, cart handling, orders, and address management.


## 🚀Features


🔐 Authentication & Authorization

* User Registration & Login

* JWT-based authentication (stored in httpOnly cookies)

* Protected routes using middleware

* Logout functionality

* Role-based access (user, admin)

🛍️ Product Management

* Add, update, delete products (Admin)

* Fetch all products

* Product search functionality

🛒 Cart System

* Add items to cart

* Update cart quantity

* Remove items from cart

* User-specific cart persistence

📦 Orders

* Place orders

* View user orders

* Order history management

🏠 Address Management

* Add multiple delivery addresses

* Update and delete addresses

* Select address during checkout

## 🧑‍💻 Tech Stack

- Backend Framework: Node.js, Express.js

- Database: MongoDB (Mongoose ODM)

- Authentication: JWT (JSON Web Token)

- Security: bcrypt, httpOnly cookies

- Environment Management: dotenv

- Other Tools: cookie-parser, cors
## Environment Variables

Create a .env file in the root directory:

| Variable Name    | Description                       | Example Value                    |
| ---------------- | --------------------------------- | -------------------------------- |
| `PORT`           | Port on which server runs         | `5001`                           |
| `MONGO_URI`      | MongoDB connection string         | `your_mongodb_connection_string` |
| `JWT_SECRET_KEY` | Secret key for JWT authentication | `your_jwt_secret`                |
| `NODE_ENV`       | Application environment           | `development`                    |



## Routes

### 👤 User & Authentication Routes

| Method | Endpoint          | Access        | Description                |
| ------ | ----------------- | ------------- | -------------------------- |
| POST   | `/users/register` | Public        | Register a new user        |
| POST   | `/users/login`    | Public        | Login user                 |
| POST   | `/users/logout`   | Authenticated | Logout user                |
| GET    | `/users/profile`  | Authenticated | Get logged-in user profile |

### 🛍️ Product Routes

| Method | Endpoint        | Access | Description              |
| ------ | --------------- | ------ | ------------------------ |
| GET    | `/products`     | Public | Get all products         |
| GET    | `/products/:id` | Public | Get single product by ID |

### Admin Product Routes

| Method | Endpoint        | Access | Description          |
| ------ | --------------- | ------ | -------------------- |
| POST   | `/products`     | Admin  | Create a new product |
| PUT    | `/products/:id` | Admin  | Update product       |
| DELETE | `/products/:id` | Admin  | Delete product       |


### 🛒 Cart Routes

| Method | Endpoint                  | Access        | Description               |
| ------ | ------------------------- | ------------- | ------------------------- |
| GET    | `/cart`                   | Authenticated | Get logged-in user cart   |
| POST   | `/cart/add`               | Authenticated | Add product to cart       |
| PUT    | `/cart/update`            | Authenticated | Update cart item quantity |
| DELETE | `/cart/remove/:productId` | Authenticated | Remove item from cart     |
| DELETE | `/cart/clear`             | Authenticated | Clear entire cart         |

### 📦 Order Routes
| Method | Endpoint            | Access        | Description                 |
| ------ | ------------------- | ------------- | --------------------------- |
| POST   | `/orders`           | Authenticated | Place a new order           |
| GET    | `/orders/my-orders` | Authenticated | Get logged-in user's orders |
| GET    | `/orders/:id`       | Authenticated | Get order details           |
| PUT    | `/orders/:id/pay`   | Authenticated | Mark order as paid          |

### Admin Order Routes

| Method | Endpoint             | Access | Description         |
| ------ | -------------------- | ------ | ------------------- |
| GET    | `/orders`            | Admin  | Get all orders      |
| PUT    | `/orders/:id/status` | Admin  | Update order status |

### 🏠 Address Routes
| Method | Endpoint                 | Access        | Description            |
| ------ | ------------------------ | ------------- | ---------------------- |
| POST   | `/addresses`             | Authenticated | Add new address        |
| GET    | `/addresses`             | Authenticated | Get all user addresses |
| GET    | `/addresses/:id`         | Authenticated | Get single address     |
| PUT    | `/addresses/:id`         | Authenticated | Update address         |
| DELETE | `/addresses/:id`         | Authenticated | Delete address         |
| PATCH  | `/addresses/:id/default` | Authenticated | Set default address    |

### 🔍 Search Routes
| Method | Endpoint  | Access | Description                  |
| ------ | --------- | ------ | ---------------------------- |
| GET    | `/search` | Public | Search products with filters |

### 🔎 Query Parameters

| Parameter  | Description                                   |
| ---------- | --------------------------------------------- |
| `q`        | Search keyword                                |
| `category` | Filter by category                            |
| `minPrice` | Minimum price                                 |
| `maxPrice` | Maximum price                                 |
| `sort`     | `price_asc`, `price_desc`, `rating`, `newest` |
| `page`     | Page number                                   |
| `limit`    | Items per page                                |

### 🔐 Access Control Summary

| Role  | Permissions                    |
| ----- | ------------------------------ |
| Guest | View products, search          |
| User  | Cart, orders, address, profile |
| Admin | Product & order management     |

## ▶️Getting Started

### 1️⃣ Clone the Repository
* git clone: https://github.com/your-username/freshmart-backend.git 
* cd freshmart-backend 

### 2️⃣ Install Dependencies
* npm install

### 3️⃣ Start the Server
* npm run dev

Server will run at: ` http://localhost:5001 `



## Project Structure

```
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── addressController.js
│
├── middleware/
│   ├── adminMiddleware.js
│   ├── authMiddleware.js
│
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   ├── cartModel.js
│   ├── orderModel.js
│   └── addressModel.js
│
├── routes/
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── addressRoutes.js
│
├── server.js
└── .env
```
