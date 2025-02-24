const express = require("express");
const ProductController = require("./product.controller");

const router = express.Router();

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProduct);

router.post("/", ProductController.createProduct);

router.put("/:id", ProductController.updateProduct);
router.put("/:id/stock", ProductController.updateStock);

router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
