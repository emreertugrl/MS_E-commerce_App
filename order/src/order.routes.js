const express = require("express");
const OrderController = require("./order.controller");
const { admin, authenticate } = require("./order.middleware");
const router = express.Router();

router.post("/", authenticate, OrderController.createOrder);

router.get("/:orderId", authenticate, OrderController.getOrder);

router.get("/user/:username", authenticate, OrderController.getUserOrders);

router.patch("/:orderId/status", authenticate, admin, OrderController.updateOrderStatus);

module.exports = router;
