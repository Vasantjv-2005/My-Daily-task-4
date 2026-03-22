const router = require("express").Router();
const Product = require("../models/Product");

// CREATE PRODUCT
router.post("/", async (req, res) => {
  try {
    const { title, description, price, image, category } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await Product.create({
      title,
      description,
      price,
      image,
      category,
    });

    res.status(201).json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating product" });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

module.exports = router;