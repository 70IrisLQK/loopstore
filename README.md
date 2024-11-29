# eCommerce Website Backend and Admin Panel

This project provides a full-stack eCommerce solution with a robust backend, admin panel, and user interface using **Express.js**, **Node.js**, **MongoDB**, and **React.js**. It includes a seamless shopping experience, role-based authorization, product and order management, and integration with external services like payment gateways.

---

## Key Features

### **User Authentication and Authorization**

- **Sign Up/Login**: Secure user authentication using **JWT (JSON Web Tokens)**.
- **Role-Based Authorization**: Different access levels for:
  - **Admins**: Manage products, view and manage all orders, and perform administrative tasks.
  - **Users**: Sign up, log in, browse products, and place orders.

### **Product Management**

- **Product Listing**:
  - Browse products by categories, price, and filters such as search and sorting.
- **Product Detail**:
  - Each product features detailed pages with images, descriptions, pricing, and customer reviews.
- **Admin Panel**:
  - Create, update, and delete products from an intuitive React-based admin interface.

### **Shopping Cart**

- **Add to Cart**: Users can easily add items to their shopping cart.
- **Cart Management**: Update quantities or remove items from the cart.

### **Order Management**

- **Checkout Process**:
  - Streamlined checkout with shipping details and payment processing.
- **Payment Integration**:
  - Secure payments through gateways like **PayPal**, **Stripe**, etc.
- **Order History**:
  - Users can view their past orders, while admins can manage orders, including changing order statuses and viewing order details.

### **Reviews and Ratings**

- Users can leave reviews and ratings for products they've purchased, helping others make informed buying decisions.

### **Search and Filtering**

- Full-text search functionality with extensive filtering options:
  - Filter by category, price range, brand, and more.

---

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Payment Integration**: PayPal, Stripe
- **Cloud Services**: Cloudinary for image storage

---

## Project Setup

### Backend (Server)

1. Clone the repository.
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the `server` directory with the following keys:
   ```env
   PORT=your_port_number
   CLIENT_BASE_URL=your_client_base_url
   ADMIN_BASE_URL=your_admin_base_url
   CONNECTION_STRING=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   TOKEN_SECRET_KEY=your_secret_key
   ```
5. Start the server:
   ```bash
   npm start
   ```

### Client (User Interface)

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory with the following keys:
   ```env
   REACT_APP_API_URL=your_api_url
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   ```
4. Start the client application:
   ```bash
   npm start
   ```

### Admin Panel

1. Navigate to the `admin` directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `admin` directory with the following keys:
   ```env
   REACT_APP_BASE_URL=your_api_url
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   ```
4. Start the admin panel:
   ```bash
   npm start
   ```

---

## Additional Notes

- **MongoDB** must be running locally or a cloud-hosted connection string should be used in `.env`.
- **Cloudinary** credentials are required for image uploads.
- **Payment Gateway** credentials are necessary for order processing.

---

## Contributions

Contributions are welcome! Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss your ideas.

---

## License
