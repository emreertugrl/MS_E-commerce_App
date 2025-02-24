const express = require("express");
const ProductController = require("./product.controller");
const { authenticate, admin } = require("./product.middleware");
const router = express.Router();

router.get("/", authenticate, ProductController.getAllProducts);
router.get("/:id", authenticate, ProductController.getProduct);
router.post("/", authenticate, admin, ProductController.createProduct);
router.put("/:id", authenticate, admin, ProductController.updateProduct);
router.put("/:id/stock", authenticate, admin, ProductController.updateStock);
router.delete("/:id", authenticate, admin, ProductController.deleteProduct);

module.exports = router;
