# **Ember Restaurant (Restaurant Management Website) 🍽️**

A full-stack web application for managing restaurant operations, including reservations, orders, and menus.

## 🤔 **Table Contents**

1. Features 🚀
2. Tech Stack 🛠️
3. Installation ⚙️
4. Usage 🍔
5. Screenshots (optional) 🖼️
6. Contributing 🤝
7. Contact 📩

## **Features 🚀**

✅ **Reservation System**

- 📅 Flexible Table Booking – Customers can easily book tables online.

- 📍 Area & Table Selection – Allows customers to choose their preferred dining area and table type.

- 💎 Table Categories – Supports multiple table types, including VIP tables and standard tables, based on customer preferences.

- 💳 Fast & Secure Payment – Customers can complete their reservation payment instantly via Stripe or opt for cash payment upon arrival.

- 📜 Reservation Management – Staff can view, confirm, or cancel reservations through the system.

✅ **Order Management**

- 🍽️ Menu & Cart System – Customers can browse the menu and add selected dishes to their cart.

- 🛒 Flexible Order Selection – Customers can choose specific items from their cart to include in the final order.

- ✏️ Order Modification – Allows customers to edit their orders before finalizing.

- 💳 Fast & Secure Payment – Supports instant payment via Stripe or cash on delivery.

- 🗑️ Order Cancellation – Customers can cancel their orders if they change their minds.

- 🚚 Free Home Delivery – Orders are delivered to the customer's doorstep with no shipping fee.

- 💬 Feedback & Support – Customers can submit feedback about their orders through a dedicated feedback form.

✅ **Menu Management**

- 📜 Diverse Menu Selection – Offers a wide variety of dishes, including appetizers, desserts, hotpot, main courses, and more.

- 🍹 Beverages & Snacks – Includes fresh drinks like orange juice, lemonade, coffee, and a selection of snacks for dessert.

- 🔍 Smart Search & Filtering – Customers can quickly find dishes by name or category, with advanced filtering options.

- ⭐ Dish Rating System – Customers can rate and review dishes, helping restaurant staff improve food quality.

- 🌍 Transparent Food Origins – Ingredients are sourced from reputable suppliers worldwide, ensuring 100% authentic flavors.

✅ **User Authentication**

- 🔑 Role-Based Access Control – Supports Admin & User roles with different permissions.

- 🔐 Secure Login & Registration – Customers can sign up and log in via Local, Google, and Facebook authentication.

- 🛡️ Advanced Security Features – Integrated with NextAuth.js, Passport, Google reCAPTCHA, and Google Authenticator for maximum security.

- 🔄 Quick Password Reset – Users can reset their passwords effortlessly.

- 📝 Profile Management – Customers can update their personal information securely.

- 📊 Order & Reservation Tracking – Users can view their total orders and completed reservations.

- 🎁 Loyalty Program & Discounts – A reward system offering discounts to encourage frequent orders.

- 📞 24/7 Customer Support – Dedicated support to assist users anytime.

✅ **Dashboard & Report**

- 📊 Comprehensive Sales Insights – View monthly and yearly revenue, total orders and reservations, and customer requests.

- 🍽️ Menu & Event Management – Admins can add new dishes, create discount events, and manage restaurant promotions.

- 💰 Custom Discounts – Easily apply discounts to orders and reservations to boost customer engagement.

- 📢 Announcements & Updates – Post important restaurant news and promotions directly on the website for customers.

- 📈 Data-Driven Decision Making – A user-friendly dashboard provides an overview of key restaurant metrics for better business insights.

## **Tech Stack 🛠️**

🔹 **Frontend**:

- ⚡ Next.js – React framework for SSR & SSG.
- 🎨 HeroUI, ShadCN/UI – Modern and customizable UI components.

🔹 **Backend**:

- 🚀 NestJS – Scalable Node.js framework.
- 🛢️ MySQL – Relational database for structured data.

🔹 **Authentication & Security**:

- 🔑 NextAuth.js, Google Authenticator, Passport – Secure and flexible authentication.
- 🛡️ Google reCaptcha – Prevents bot interactions.

🔹 **Payments & Integrations**:

- 💳 Stripe – Seamless online payments.
- 🔔 Webhook – Real-time event-driven communication.
- 📧 Nodemailer – Email notifications & alerts.

## **Project Structure 📂**

**Frontend (Next.js)**

```bash
  /client
│── .husky/
│── .next/
│── public/
│── src/
│   ├── api/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── mocks/
│   ├── resources/
│   ├── store/
│   ├── utils/
│   ├── middlewares.ts
│── .dockerignore
│── Dockerfile.dev
│── Dockerfile.prod
│── .env.example
│── components.json
│── next.config.mjs
│── package.json
│── tailwind.config.ts
```

**Backend (NestJS)**

```bash
  /server
│── .husky/
│── src/
│   ├── modules/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│── test
│── nest-cli.json
│── package-lock.json
│── package.json
│── tsconfig.build.json
│── tsconfig.json
```

## **Packages & Dependencies 📦**

**Frontend (Next.js)**

```bash
    "dependencies": {
      "@emotion/react": "^11.13.5",
      "@emotion/styled": "^11.13.5",
      "@heroui/react": "^2.6.14",
      "@heroui/system": "2.4.7",
      "@heroui/theme": "2.4.6",
      "@hookform/resolvers": "^3.9.0",
      "@internationalized/date": "^3.5.5",
      "@js-temporal/polyfill": "^0.4.4",
      "@mui/base": "^5.0.0-beta.62",
      "@mui/icons-material": "^6.4.0",
      "@mui/material": "^6.4.0",
      "@mui/system": "^6.1.8",
      "@radix-ui/react-accordion": "^1.2.1",
      "@radix-ui/react-alert-dialog": "^1.1.2",
      "@radix-ui/react-context-menu": "^2.2.6",
      "@radix-ui/react-dialog": "^1.1.2",
      "@radix-ui/react-icons": "^1.3.2",
      "@radix-ui/react-label": "^2.1.0",
      "@radix-ui/react-popover": "^1.1.2",
      "@radix-ui/react-scroll-area": "^1.2.1",
      "@radix-ui/react-select": "^2.1.2",
      "@radix-ui/react-separator": "^1.1.0",
      "@radix-ui/react-slot": "^1.1.0",
      "@radix-ui/react-tabs": "^1.1.1",
      "@radix-ui/react-toast": "^1.2.4",
      "@stripe/react-stripe-js": "^3.0.0",
      "@stripe/stripe-js": "^5.2.0",
      "@svgr/webpack": "^8.1.0",
      "@tanstack/react-query": "^5.53.2",
      "antd": "^5.20.0",
      "axios": "^1.3.1",
      "class-variance-authority": "^0.7.1",
      "clsx": "^2.1.1",
      "cookie-signature": "^1.2.2",
      "date-fns": "^3.6.0",
      "embla-carousel-autoplay": "^8.1.8",
      "embla-carousel-react": "^8.1.8",
      "framer-motion": "^11.17.0",
      "js-cookie": "^3.0.5",
      "jwt-decode": "^4.0.0",
      "lodash": "^4.17.21",
      "lucide-react": "^0.400.0",
      "luxon": "^3.5.0",
      "next": "15.1.4",
      "next-auth": "^4.24.11",
      "next-images": "^1.8.5",
      "next-themes": "^0.3.0",
      "npm": "^10.8.2",
      "qrcode": "^1.5.4",
      "react": "19.0.0",
      "react-countup": "^6.5.3",
      "react-day-picker": "^8.10.1",
      "react-dom": "19.0.0",
      "react-google-recaptcha-v3": "^1.10.1",
      "react-hook-form": "^7.52.1",
      "react-icons": "^5.2.1",
      "react-simple-typewriter": "^5.0.1",
      "react-toastify": "^10.0.5",
      "sass": "^1.77.6",
      "sharp": "^0.33.4",
      "sheet": "^0.2.0",
      "socket.io-client": "^4.8.1",
      "swiper": "^11.1.5",
      "tailwind-merge": "^2.6.0",
      "tailwindcss-animate": "^1.0.7",
      "uuid": "^11.0.5",
      "zod": "^3.23.8",
      "zustand": "^5.0.3"
   },
   "devDependencies": {
      "@types/cookie-signature": "^1.1.2",
      "@types/jest": "^29.5.12",
      "@types/js-cookie": "^3.0.6",
      "@types/jwt-decode": "^2.2.1",
      "@types/luxon": "^3.4.2",
      "@types/node": "^20",
      "@types/react": "19.0.7",
      "@types/react-dom": "19.0.3",
      "@types/sequelize": "^4.28.20",
      "@types/socket.io-client": "^1.4.36",
      "eslint": "^8",
      "eslint-config-next": "15.1.4",
      "husky": "^9.1.7",
      "postcss": "^8",
      "sequelize": "^6.37.5",
      "sequelize-cli": "^6.6.2",
      "tailwindcss": "^3.4.1",
      "ts-node": "^10.9.2",
      "typescript": "^5.6.3"
   }
```

**Backend (NestJS)**

```bash
 "dependencies": {
    "@aws-sdk/client-s3": "^3.696.0",
    "@nestjs/cache-manager": "^2.2.2",
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/platform-socket.io": "^11.0.5",
    "@nestjs/serve-static": "^4.0.2",
    "@nestjs/throttler": "^6.2.1",
    "@nestjs/typeorm": "^10.0.2",
    "@nestjs/websockets": "^11.0.5",
    "@nestlab/google-recaptcha": "^3.9.0",
    "ajv": "^8.17.1",
    "axios": "^1.7.9",
    "bcrypt": "^5.1.1",
    "cache-manager": "^5.7.6",
    "cache-manager-redis-store": "^2.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "cloudinary": "^1.41.3",
    "connect-redis": "^8.0.1",
    "cookie-parser": "^1.4.6",
    "cookie-signature": "^1.2.2",
    "dotenv": "^16.4.5",
    "express-session": "^1.18.0",
    "helmet": "^7.1.0",
    "ioredis": "^5.4.2",
    "minimist": "^1.2.8",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0",
    "mysql2": "^3.11.4",
    "nodemailer": "^6.9.15",
    "passport": "^0.7.0",
    "passport-facebook": "^3.0.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "qrcode": "^1.5.4",
    "raw-body": "^3.0.0",
    "redis": "^4.7.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1",
    "socket.io": "^4.8.1",
    "speakeasy": "^2.0.0",
    "stripe": "^17.4.0",
    "tslib": "^2.7.0",
    "typeorm": "^0.3.20",
    "typeorm-extension": "^3.6.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@faker-js/faker": "^9.5.0",
    "@nestjs/cli": "^10.0.0",
    "@nestjs/mapped-types": "^2.0.5",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/bcrypt": "^5.0.2",
    "@types/cache-manager-redis-store": "^2.0.4",
    "@types/cookie-parser": "^1.4.8",
    "@types/cookie-signature": "^1.1.2",
    "@types/express": "^4.17.17",
    "@types/express-session": "^1.18.0",
    "@types/ioredis": "^4.28.10",
    "@types/jest": "^29.5.2",
    "@types/multer": "^1.4.12",
    "@types/node": "^20.3.1",
    "@types/nodemailer": "^6.4.16",
    "@types/passport-facebook": "^3.0.3",
    "@types/passport-google-oauth20": "^2.0.16",
    "@types/passport-jwt": "^4.0.1",
    "@types/passport-local": "^1.0.38",
    "@types/qrcode": "^1.5.5",
    "@types/raw-body": "^2.1.4",
    "@types/socket.io": "^3.0.1",
    "@types/speakeasy": "^2.0.10",
    "@types/stripe": "^8.0.416",
    "@types/supertest": "^6.0.0",
    "@types/uuid": "^10.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "husky": "^9.1.7",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.5.4"
  }
```

## **Installation ⚙️**

**Prerequisites**:
Make sure you have the following installed before proceeding:

- Node.js (v18+)
- MySQL (for database)

_Setup Instructions:_

**Production Deployment 🌍**

- The application is live! You can access it at: https://ember-restaurant.vercel.app/

**Local Setup (For Development & Testing) 🛠️**

1. Clone the repository

```bash
  git clone https://github.com/lengocanh2005it/ember-restaurant.git
```

2. Install dependencies

```bash
   # Install backend dependencies
   cd server
   npm install --legacy-peer-deps

   # Navigate to frontend and install dependencies
   cd client
   npm install --legacy-peer-deps
```

3. Configure environment variables

Copy the example environment file and update values as needed:

```bash
  cp .env.example .env
```

4. Run the backend server

```bash
  cd server
  npm run start:dev
```

5. Run the frontend

```bash
  cd client
  npm run dev
```

6. Open in browser and test frontend domain with port at http://localhost:<your_port_setup_here>

## **Usage 🍔**

**For Customers 🧑‍🍳**

- Browse the Menu 🍽️ – Explore a wide range of dishes, including appetizers, main courses, and desserts.
- Place an Order 🛒 – Add dishes to your cart, customize your order, and proceed to checkout.
- Make a Reservation 📅 – Choose your preferred dining area and table type, including VIP and standard tables.
- Payment Options 💳 – Secure payments via Stripe or cash.
- Track Your Orders 📦 – Check order status and receive free home delivery.
- Leave Feedback 📝 – Share your experience with the restaurant through the order feedback form.
- Earn Discounts & Rewards 🎁 – Get loyalty points and discounts on future orders.

**For Admin 🏢**

- Dashboard Overview 📊 – Track total revenue, monthly orders, and reservations.
- Menu Management 🍕 – Add, edit, or remove menu items, set availability, and manage pricing.
- Order & Reservation Reports 📑 – View insights on customer behavior and order trends.
- Discount & Event Management 🎉 – Create promotions, seasonal discounts, and special events.
- User Management 👥 – Approve new staff accounts, assign roles, and ensure security.
- Security & Authentication 🔒 – Manage user permissions, enable Google Authenticator, and secure the system with NextAuth.js, Passport, and Google reCAPTCHA.

## **Contributing 🤝**

- This is a personal project, and contributions are currently not open. However, feel free to fork the repository and modify it for your own use.

## **Contact 📩**

If you have any questions or feedback, feel free to reach out:

- 📧 Email: lengocanhpyne363@gmail.com
- 🐙 GitHub: https://github.com/lengocanh2005it
- 🔗 Facebook: https://www.facebook.com/lengocanhdeptrai2k5
- 📞 Phone: 0393873630 (Viet Nam)
