# ShopHub - E-Commerce Platform

A full-stack e-commerce application built with Next.js, Express.js, and MongoDB.

## 🚀 Features

### User Authentication
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Session management

### Product Management
- ✅ Add new products
- ✅ View product catalog
- ✅ Product images with preview
- ✅ Product categories

### Shopping Cart
- ✅ Add items to cart
- ✅ View cart contents
- ✅ Remove items from cart
- ✅ Calculate totals with tax

### Order Management
- ✅ Place orders
- ✅ View order history
- ✅ Order status tracking
- ✅ Cart clearance after checkout

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
E-commerce Backend/
├── E-commerce-Frontend/          # Next.js frontend
│   ├── app/                     # App router pages
│   │   ├── add-product/          # Product creation page
│   │   ├── auth/               # Authentication pages
│   │   ├── cart/               # Shopping cart page
│   │   ├── orders/              # Order history page
│   │   └── page.tsx            # Homepage
│   ├── components/               # Reusable components
│   │   ├── Header.tsx
│   │   └── ProductCard.tsx
│   ├── context/                 # React context
│   │   └── AuthContext.tsx
│   └── lib/                    # Utility functions
│       └── api.ts
├── models/                     # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/                     # Express routes
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
├── middleware/                  # Custom middleware
│   └── authMiddleware.js
├── .env                        # Environment variables
├── server.js                   # Express server
└── package.json               # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vasantjv-2005/My-Daily-task-4.git
   cd E-commerce-Backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd E-commerce-Frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   
   # Or connect to MongoDB Atlas
   # Update MONGO_URI in .env
   ```

2. **Start the backend server**
   ```bash
   cd E-commerce-Backend
   npm start
   ```
   Server will run on `http://localhost:5000`

3. **Start the frontend development server**
   ```bash
   cd E-commerce-Frontend
   npm run dev
   ```
   Application will be available at `http://localhost:3000`

## 📊 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login

### Products
- `GET /products` - Get all products
- `POST /products` - Create new product
- `GET /products/:id` - Get single product

### Cart
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `DELETE /cart/:productId` - Remove item from cart

### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Place new order

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Login/Signup** returns JWT token
2. **Token Storage** in localStorage
3. **Protected Routes** require valid token
4. **Token Validation** via middleware

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  cart: [{
    productId: ObjectId (ref: 'Product'),
    quantity: Number
  }]
}
```

### Product Model
```javascript
{
  title: String (required),
  description: String (required),
  price: Number (required),
  image: String,
  category: String
}
```

### Order Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  items: [{
    productId: ObjectId (ref: 'Product'),
    quantity: Number
  }],
  totalAmount: Number,
  status: String (default: 'Pending')
}
```

## 🎯 Usage Guide

### For Users
1. **Create Account** - Sign up with email and password
2. **Browse Products** - View available items
3. **Add to Cart** - Select items for purchase
4. **Checkout** - Place order and clear cart
5. **View Orders** - Track order history

### For Admins
1. **Add Products** - Create new product listings
2. **Manage Inventory** - Update product details
3. **View Orders** - Monitor customer orders

## 🔧 Development

### Environment Variables
```bash
PORT=5000                          # Backend port
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce  # MongoDB connection
JWT_SECRET=your_secret_key_here           # JWT signing secret
```

### Available Scripts
```bash
# Backend
npm start                           # Start production server
npm run dev                          # Start development server

# Frontend
npm run dev                          # Start Next.js dev server
npm run build                        # Build for production
npm start                           # Start production server
```

## 🐛 Troubleshooting

### Common Issues

1. **"Login Failed" Error**
   - Check backend server is running
   - Verify JWT_SECRET in .env
   - Check MongoDB connection

2. **"Cart Not Working" Error**
   - Ensure user is authenticated
   - Check Authorization headers
   - Verify cart items are not null

3. **"Failed to Fetch" Error**
   - Restart backend server after code changes
   - Check CORS configuration
   - Verify API endpoints

4. **Database Connection Issues**
   - Check MongoDB is running
   - Verify MONGO_URI in .env
   - Check network connectivity

## 📝️ Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using modern web technologies**
