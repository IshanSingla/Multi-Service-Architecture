# Cart Service

## Table of Contents
- [Overview](#overview)
- [Technology Used](#technology-used)
- [Routes](#routes)
  - [Public Routes](#public-routes)
  - [Private Routes](#private-routes)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [System Diagram](#system-diagram)

## Overview
The Cart Service is responsible for managing shopping carts and coupon validations. This service includes functionality for adding and removing items from a cart, applying various types of coupons, and verifying the eligibility of coupons for specific users. The service leverages JWT authentication to secure private routes and Prisma ORM for database interactions.

## Technology Used
- **Node.js**: JavaScript runtime for building scalable network applications.
- **Express.js**: Web application framework for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **Prisma**: ORM for data modeling and database access.
- **JWT**: JSON Web Tokens for secure authentication.
- **JWK-to-PEM**: Library for converting JSON Web Keys to PEM format.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Docker**: Container platform for building and running applications.

## Routes

### Public Routes
- **GET /public/coupons**: Fetch all available public coupons.
- **GET /public/validate/:couponId/:paymentMethod**: Validate if a specific coupon is applicable for the user, considering the user's cart and the provided payment method.

### Private Routes
- **POST /private/cart/add**: Add an item to the user's cart.
- **POST /private/cart/remove**: Remove an item from the user's cart.
- **POST /private/coupons**: Create a new coupon.
- **GET /private/coupons**: Get all coupons applicable to the user.
- **GET /private/validate/:couponId/:paymentMethod**: Validate if a specific coupon is applicable for the user.

## Database Schema

### Coupon
```prisma
model Coupon {
    id               String         @id @default(cuid())
    description      String
    discountValue    Float
    discountType     DiscountType
    validFrom        DateTime
    validUntil       DateTime
    minOrderValue    Float?
    maxDiscountValue Float?
    orderNumber      String?
    paymentMethod    PaymentMethod?
    userId           String?
    productId        String?
    categoryId       String?
    specialDay       DateTime?
    applicableDays   ApplicableDays
    createdAt        DateTime       @default(now())
    updatedAt        DateTime       @updatedAt
}

enum DiscountType {
    PERCENTAGE
    FIXED_AMOUNT
}

enum PaymentMethod {
    CREDIT_CARD
    DEBIT_CARD
    PAYPAL
    CASH_ON_DELIVERY
    BANK_TRANSFER
}

enum ApplicableDays {
    WEEKDAY
    WEEKEND
    ALL_DAYS
}
```


## Environment Variables
Create a `.env` file in the root directory and add the following environment variables:

```
AUTH_SERVICE_URL=your_auth_service_url
CART_SERVICE_URL=your_cart_service_url
DATABASE_URL=your_database_url
```

## System Diagram
```
+---------------------+       +---------------------+       +---------------------+
|                     |       |                     |       |                     |
|   Authentication    |       |     Cart Service    |       |       Database      |
|     Service         |       |                     |       |                     |
|  (Handles JWT, JWKS)|<----->|  (Handles Cart Ops, |<----->|    (Prisma ORM)     |
|                     |       |    Coupon Ops)      |       |                     |
+---------------------+       +---------------------+       +---------------------+
           ^                            ^
           |                            |
           v                            v
+---------------------+       +---------------------+
|                     |       |                     |
|       Client        |       |     External        |
|  (Sends Requests)   |       |     Services        |
|                     |       | (Product, Payment)  |
+---------------------+       +---------------------+
```