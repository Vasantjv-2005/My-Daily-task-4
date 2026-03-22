const router = require("express").Router();
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ======================
// CREATE ORDER (Checkout)
// ======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("cart.productId");

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Filter out items with null productId (deleted products)
    const validCartItems = user.cart.filter(item => item.productId !== null);
    
    if (validCartItems.length === 0) {
      return res.status(400).json({ message: "Cart contains invalid items" });
    }

    // Calculate total
    let total = 0;
    validCartItems.forEach(item => {
      total += item.productId.price * item.quantity;
    });

    const order = await Order.create({
      userId,
      items: validCartItems,
      totalAmount: total
    });

    // Clear cart after order
    user.cart = [];
    await user.save();

    res.json({
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Error placing order" });
  }
});

// ======================
// GET USER ORDERS
// ======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ userId }).populate("items.productId");
    res.json(orders);
  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;