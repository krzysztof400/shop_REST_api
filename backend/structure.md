# Project Structure

This document outlines the structure of the REST API codebase.

## Root Directory

*   **`server.js`**: The main entry point for the application. It initializes the Express server, connects to the database, sets up middleware, and defines routes.
*   **`package.json`**: Contains project metadata, dependencies, and scripts for running and developing the application (e.g., `npm start`, `npm run dev`).
*   **`.env`**: Stores environment variables such as database connection strings, JWT secrets, and port numbers. (See [`.env`](/.env))
*   **`apiTest.js`**: A script used for testing the API endpoints. It includes functions for user registration, login, product management, and order creation. (See [`apiTest.js`](/apiTest.js))
*   **`README.md`**: This file, providing an overview of the project.

## `/config`

*   **`db.js`**: Handles the connection to the MongoDB database using Mongoose. (See [`config/db.js`](/config/db.js))

## `/controllers`

This directory contains the business logic for handling requests.

*   **`products.js`**: Manages logic for product-related operations such as creating, reading, updating, deleting products, and adding reviews. (See [`controllers/products.js`](/controllers/products.js))
*   **`orders.js`**: Manages logic for order-related operations such as creating orders, retrieving user-specific orders, and updating order statuses. (See [`controllers/orders.js`](/controllers/orders.js))
*   *(Implied)* `auth.js`: Would typically contain logic for user registration, login, and authentication status.
*   *(Implied)* `users.js`: Would typically contain logic for user profile management.

## `/middleware`

This directory contains custom middleware functions.

*   **`errorHandler.js`**: A centralized error handling middleware that processes errors occurring during request handling and sends appropriate JSON responses. (See [`middleware/errorHandler.js`](/middleware/errorHandler.js))
*   *(Implied)* `auth.js`: Would typically contain middleware for authenticating users using JWT and protecting routes.

## `/models`

This directory defines the Mongoose schemas for the database collections.

*   **`Product.js`**: Defines the schema for products, including fields like name, description, price, category, stock, and an embedded schema for reviews. It also includes methods for calculating average ratings. (See [`models/Product.js`](/models/Product.js))
*   **`Order.js`**: Defines the schema for orders, including user references, order items (with product references), shipping address, payment details, and order status. (See [`models/Order.js`](/models/Order.js))
*   *(Implied)* `User.js`: Would typically define the schema for users, including fields like name, email, password, and address.

## `/routes`

This directory defines the API routes and maps them to controller functions.

*   *(Implied)* `auth.js`: Defines routes for authentication (e.g., `/api/auth/register`, `/api/auth/login`).
*   *(Implied)* `users.js`: Defines routes for user-related actions (e.g., `/api/users/me`).
*   *(Implied)* `products.js`: Defines routes for product CRUD operations and reviews (e.g., `/api/products`, `/api/products/:id/reviews`).
*   *(Implied)* `orders.js`: Defines routes for order management (e.g., `/api/orders`, `/api/orders/myorders`).

## `/learning`

This directory appears to contain a separate, simpler Express application, possibly for learning or experimentation.

*   **`server.js`**: Entry point for the learning application. (See [`learning/server.js`](/learning/server.js))
*   **`package.json`**: Dependencies for the learning application. (See [`learning/package.json`](/learning/package.json))
*   **`/routes`**:
    *   `users.js`: Example user routes for the learning application. (See [`learning/routes/users.js`](/learning/routes/users.js))
*   *(Implied)* `/public`: Likely for static assets.
*   *(Implied)* `/views`: Likely for EJS templates.

---

This structure promotes separation of concerns, making the codebase more organized and maintainable.