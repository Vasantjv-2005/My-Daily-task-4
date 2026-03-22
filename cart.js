const router = require("express").Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ======================
// ADD TO CART
// ======================
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart) {
      user.cart = [];
    }

    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();

    res.json({
      message: "Added to cart",
      cart: user.cart
    });

  } catch (err) {
    console.error("CART ERROR:", err);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// ======================
// GET CART
// ======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out any items where productId is null (deleted products)
    const validCartItems = (user.cart || []).filter(item => item.productId !== null);
    
    res.json(validCartItems);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// ======================
// REMOVE FROM CART
// ======================
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await user.save();

    res.json({
      message: "Removed from cart",
      cart: user.cart
    });

  } catch (err) {
    res.status(500).json({ message: "Error removing item" });
  }
});

module.exports = router;