const express = require("express");
const OrderController = require("./order.controller");

const router = express.Router();

router.post("/", OrderController.createOrder);

router.get("/:orderId", OrderController.getOrder);

router.get("/user/:username", OrderController.getUserOrders);

router.patch("/:orderId/status", OrderController.updateOrderStatus);

module.exports = router;
