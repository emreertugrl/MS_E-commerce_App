const express = require("express");
const httpProxy = require("http-proxy");
// dotenv configuration
require("dotenv").config();

const app = express();

// Proxy setup
const proxy = httpProxy.createProxyServer();

// Routelar tanımlanır.
app.use("/api/auth", (req, res) => {
  proxy.web(req, res, { target: process.env.AUTH_SERVICE_URL });
});
app.use("/api/products", (req, res) => {
  proxy.web(req, res, { target: process.env.PRODUCT_SERVICE_URL });
});
app.use("/api/orders", (req, res) => {
  proxy.web(req, res, { target: process.env.ORDER_SERVICE_URL });
});

// Server'ın başlatılması
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway ${PORT} portunda başlatıldı`));
